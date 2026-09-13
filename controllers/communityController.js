const path = require("path");
const fs = require("fs/promises");

const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const User=require("../models/User");
const JourneyPost = require("../models/JourneyPost");
const PostReaction=require("../models/PostReaction");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");
const Comment=require("../models/Comment");
/**
 * Process uploaded file: attempts Cloudinary upload first;
 * falls back to serving local stored file if Cloudinary fails or credentials are invalid.
 */
const processUploadedImage = async (file, req) => {
  let imageUrl = "";
  let imagePublicId = "";

  try {
    const result = await uploadToCloudinary(file.path);
    if (result && result.secure_url) {
      imageUrl = result.secure_url;
      imagePublicId = result.public_id || "";
      // Successfully uploaded to Cloudinary, clean up local file
      await fs.unlink(file.path).catch(() => {});
    }
  } catch (err) {
    console.warn(
      "Cloudinary upload failed or missing credentials, falling back to local file upload:",
      err.message
    );
    const host = req.get("host");
    const protocol = req.protocol;
    imageUrl = `${protocol}://${host}/uploads/${file.filename}`;
  }

  return { imageUrl, imagePublicId };
};

const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !title.trim()) {
    throw new AppError("Title is required", 400);
  }

  if (!content || !content.trim()) {
    throw new AppError("Content is required", 400);
  }

  let formattedTags = [];

  if (Array.isArray(tags)) {
    formattedTags = tags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  } else if (typeof tags === "string" && tags.trim()) {
    formattedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  let imageUrl = "";
  let imagePublicId = "";

  if (req.file) {
    const processed = await processUploadedImage(req.file, req);
    imageUrl = processed.imageUrl;
    imagePublicId = processed.imagePublicId;
  }

  const post = await JourneyPost.create({
    user: req.user.id,
    title: title.trim(),
    content: content.trim(),
    image: imageUrl,
    imagePublicId,
    tags: formattedTags,
  });

  const populatedPost = await JourneyPost.findById(post._id).populate(
    "user",
    "name fullName email"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedPost,
        "Journey post created successfully"
      )
    );
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { tag, search } = req.query;

const filter = {};

if (tag && tag.trim()) {
  filter.tags = tag.trim();
}

if (search && search.trim()) {
  const searchTerm = search.trim();

  filter.$or = [
    {
      title: {
        $regex: searchTerm,
        $options: "i",
      },
    },
    {
      content: {
        $regex: searchTerm,
        $options: "i",
      },
    },
    {
      tags: {
        $regex: searchTerm,
        $options: "i",
      },
    },
  ];
}
const page = Math.max(Number(req.query.page) || 1, 1);
const limit = Math.min(Number(req.query.limit) || 10, 20);

const skip = (page - 1) * limit;
const totalPosts = await JourneyPost.countDocuments(filter);
const totalPages = Math.ceil(totalPosts / limit);

const posts = await JourneyPost.find(filter)
  .populate("user", "fullName")
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

  const postsWithReactions = await Promise.all(
    posts.map(async (post) => {
      let reacted = false;

      if (req.user) {
        const existingReaction = await PostReaction.findOne({
          post: post._id,
          user: req.user.id,
        });
        reacted = !!existingReaction;
      }

      const reactionCount = await PostReaction.countDocuments({
        post: post._id,
      });
     const commentCount = await Comment.countDocuments({
           post: post._id,
        });
      return {
        ...post.toObject(),
        reactionCount,
        reacted,
        commentCount,
      };
    })
  );

 return res.status(200).json(
  new ApiResponse(
    200,
    {
      posts: postsWithReactions,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
    "Fetched community posts successfully"
  )
);
});

const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await JourneyPost.find({
    user: req.user.id,
  })
    .sort({ createdAt: -1 })
    .populate("user", "name fullName email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        posts,
        "Fetched user journey posts successfully"
      )
    );
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await JourneyPost.findById(req.params.id).populate(
    "user",
    "name fullName email"
  );

  if (!post) {
    throw new AppError("Journey post not found", 404);
  }

  const reactionCount = await PostReaction.countDocuments({
    post: post._id,
  });
  const commentCount = await Comment.countDocuments({
    post: post._id,
 });
  let reacted = false;
  if (req.user) {
    const existingReaction = await PostReaction.findOne({
      post: post._id,
      user: req.user.id,
    });
    reacted = !!existingReaction;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { post, reactionCount, reacted , commentCount},
        "Fetched post details successfully"
      )
    );
});
/**
 * Safely extract a string ID from string, ObjectId, or nested user object.
 */
const getCleanId = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (val._id) return getCleanId(val._id);
  if (val.id) return getCleanId(val.id);
  if (typeof val.toString === "function") {
    const str = val.toString();
    if (str !== "[object Object]") return str.trim();
  }
  return "";
};

const updatePost = asyncHandler(async (req, res) => {
  const post = await JourneyPost.findById(req.params.id);

  if (!post) {
    throw new AppError("Journey post not found", 404);
  }

  const currentUserId = getCleanId(req.user);
  const postAuthorId = getCleanId(post.user);
  const isAdmin = req.user?.role === "admin";

  if (
    post.user &&
    postAuthorId &&
    currentUserId &&
    postAuthorId !== currentUserId &&
    !isAdmin
  ) {
    throw new AppError(
      "You are not authorized to update this post",
      403
    );
  }

  if (!post.user && currentUserId) {
    post.user = currentUserId;
  }

  const { title, content, tags, image, removeImage } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      throw new AppError("Title cannot be empty", 400);
    }

    post.title = title.trim();
  }

  if (content !== undefined) {
    if (!content.trim()) {
      throw new AppError("Content cannot be empty", 400);
    }

    post.content = content.trim();
  }

  if (tags !== undefined) {
    if (Array.isArray(tags)) {
      post.tags = tags
        .map((tag) => String(tag).trim())
        .filter(Boolean);
    } else if (typeof tags === "string") {
      post.tags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    } else {
      post.tags = [];
    }
  }

  if (req.file) {
    const { imageUrl, imagePublicId } = await processUploadedImage(
      req.file,
      req
    );

    if (post.imagePublicId && cloudinary?.uploader) {
      await cloudinary.uploader
        .destroy(post.imagePublicId)
        .catch((error) => {
          console.error("Failed to delete old Cloudinary image:", error);
        });
    }

    post.image = imageUrl;
    post.imagePublicId = imagePublicId;
  } else if (removeImage === "true" || image === "") {
    if (post.imagePublicId && cloudinary?.uploader) {
      await cloudinary.uploader
        .destroy(post.imagePublicId)
        .catch((error) => {
          console.error("Failed to delete Cloudinary image:", error);
        });
    }
    post.image = "";
    post.imagePublicId = "";
  } else if (typeof image === "string" && image.trim()) {
    post.image = image.trim();
  }

  await post.save();

  const updatedPost = await JourneyPost.findById(
    post._id
  ).populate("user", "name fullName email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPost,
        "Journey post updated successfully"
      )
    );
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await JourneyPost.findById(req.params.id);

  if (!post) {
    throw new AppError("Journey post not found", 404);
  }

  const currentUserId = getCleanId(req.user);
  const postAuthorId = getCleanId(post.user);
  const isAdmin = req.user?.role === "admin";

  if (
    post.user &&
    postAuthorId &&
    currentUserId &&
    postAuthorId !== currentUserId &&
    !isAdmin
  ) {
    throw new AppError(
      "You are not authorized to delete this post",
      403
    );
  }

  if (post.imagePublicId && cloudinary?.uploader) {
    await cloudinary.uploader
      .destroy(post.imagePublicId)
      .catch((error) => {
        console.error("Failed to delete Cloudinary image:", error);
      });
  }

  if (post.image && post.image.includes("/uploads/")) {
    try {
      const filename = post.image.split("/uploads/").pop();
      if (filename) {
        const filePath = path.join(__dirname, "../uploads", filename);
        await fs.unlink(filePath).catch(() => {});
      }
    } catch (e) {}
  }

  await JourneyPost.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Journey post deleted successfully"
      )
    );
});
const toggleReaction = asyncHandler(async (req, res) => {
    const post = req.params.id;
    const user = req.user.id;
    
    const existingPost = await JourneyPost.findById(post);
   if (!existingPost) throw new AppError("post not found", 404);
 
  
    const reaction = await PostReaction.findOne({ post, user });
    let reacted;

    if (reaction) {
      await reaction.deleteOne();
      reacted = false;
    } else {
      await PostReaction.create({ post, user });
      reacted = true;
    }

    const count = await PostReaction.countDocuments({ post });

   return res.json({
      reacted,
      count,
    });
});
const createComment = asyncHandler(async (req, res) => {
  const user = req.user.id;
  const post = req.params.id;
  const content = req.body.content;
  if (!content || !content.trim()) {
   throw new AppError("comment is not proper", 400); 
}
  const existingPost = await JourneyPost.findById(post);

if (!existingPost) {
  throw new AppError("post not found", 404);
}
  const comment = await Comment.create({
  user,
  post,
  content,
});
 return res.status(201).json(
  new ApiResponse(
    201,
    comment,
    "Comment created successfully"
  )
);
});
const getComments = asyncHandler(async (req, res) => {
  const post = req.params.id;
const existingPost = await JourneyPost.findById(post);

if (!existingPost) {
  throw new AppError("post not found", 404);
}
  const comments = await Comment.find({ post })
  .populate("user", "fullName")
  .sort({ createdAt: -1 });
return res.status(200).json(
  new ApiResponse(
    200,
    comments,
    "Comment fetched succesfully"
  )
)
});
const updateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;
  const content = req.body.content;


 const comment = await Comment.findById(commentId);

if (!comment) {
  throw new AppError("Comment not found", 404);
}

if (comment.user.toString() !== userId.toString()) {
  throw new AppError("You are not allowed to edit this comment", 403);
}

    if (!content || !content.trim()) {
  throw new AppError("Comment cannot be empty", 400);
}
comment.content = content.trim();

await comment.save();
return res.status(200).json(
  new ApiResponse(
    200,
    comment,
    "Comment updated successfully"
  )
);
});
const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;

 const comment = await Comment.findById(commentId);
if (!comment) {
  throw new AppError("Comment not found", 404);
}
  if (comment.user.toString() !== userId.toString()) {
  throw new AppError(
    "You are not allowed to delete this comment",
    403
  );
}
await comment.deleteOne();
  return res.status(200).json(
  new ApiResponse(
    200,
    null,
    "Comment deleted successfully"
  )
);
});
module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleReaction,
  createComment,
  getComments,
  updateComment,
  deleteComment
};