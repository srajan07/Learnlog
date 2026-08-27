const AptitudeQuestion = require("../models/AptitudeQuestion");
const AptitudeAttempt = require("../models/AptitudeAttempt");
const AppError = require("../utils/AppError");

// Initial categories & topics as specified in product goal
const APTITUDE_CATEGORIES = {
  "Quantitative Aptitude": [
    "Percentage",
    "Profit and Loss",
    "Ratio and Proportion",
    "Average",
    "Time and Work",
    "Time, Speed and Distance",
    "Probability",
    "Number System",
    "Simple Interest",
    "Compound Interest",
    "Permutation and Combination",
  ],
  "Logical Reasoning": [
    "Number Series",
    "Coding-Decoding",
    "Analogy",
    "Blood Relations",
    "Direction Sense",
    "Syllogism",
    "Seating Arrangement",
    "Logical Puzzles",
  ],
  "Verbal Ability": [
    "Synonyms",
    "Antonyms",
    "Grammar",
    "Sentence Correction",
    "Vocabulary",
    "Reading Comprehension",
    "Para Jumbles",
  ],
  "Technical Fundamentals": [
    "OOP",
    "DBMS",
    "SQL",
    "Operating Systems",
    "Computer Networks",
    "Data Structures",
    "Algorithms",
    "Programming fundamentals",
  ],
};

class AptitudeService {
  /**
   * Create a single aptitude question
   */
  async createQuestion(data, userId) {
    if (data.correctAnswer >= data.options.length) {
      throw new AppError("correctAnswer index is out of options bounds", 400);
    }
    const question = await AptitudeQuestion.create({
      ...data,
      createdBy: userId,
    });
    return question;
  }

  /**
   * Bulk insert aptitude questions
   */
  async bulkCreateQuestions(questionsArray, userId) {
    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      throw new AppError("Questions array cannot be empty", 400);
    }

    const formatted = questionsArray.map((q) => {
      if (q.correctAnswer >= q.options.length) {
        throw new AppError(
          `Correct answer index out of bounds for question: "${q.question}"`,
          400
        );
      }
      return {
        ...q,
        createdBy: userId,
      };
    });

    const created = await AptitudeQuestion.insertMany(formatted);
    return created;
  }

  /**
   * List questions with filter & pagination
   */
  async getQuestions(filters = {}, pagination = {}) {
    const { category, topic, difficulty, company, search, isActive } = filters;
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const skip = (page - 1) * limit;

    const queryFilter = {};

    if (category && category !== "All") queryFilter.category = category;
    if (topic && topic !== "All") queryFilter.topic = topic;
    if (difficulty && difficulty !== "all" && difficulty !== "mixed") {
      queryFilter.difficulty = difficulty;
    }
    if (company) queryFilter.company = { $regex: company, $options: "i" };
    if (isActive !== undefined) queryFilter.isActive = isActive;
    else queryFilter.isActive = true;

    if (search) {
      queryFilter.$or = [
        { question: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const questions = await AptitudeQuestion.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalQuestions = await AptitudeQuestion.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalQuestions / limit);

    return {
      questions,
      currentPage: page,
      totalPages,
      totalQuestions,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * Get single question by ID
   */
  async getQuestionById(id) {
    const question = await AptitudeQuestion.findById(id);
    if (!question) {
      throw new AppError("Aptitude question not found", 404);
    }
    return question;
  }

  /**
   * Update question
   */
  async updateQuestion(id, data) {
    if (data.options && data.correctAnswer !== undefined) {
      if (data.correctAnswer >= data.options.length) {
        throw new AppError("correctAnswer index out of options bounds", 400);
      }
    }

    const updated = await AptitudeQuestion.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new AppError("Aptitude question not found", 404);
    }
    return updated;
  }

  /**
   * Delete question (soft delete by setting isActive to false or hard delete)
   */
  async deleteQuestion(id, hardDelete = false) {
    if (hardDelete) {
      const deleted = await AptitudeQuestion.findByIdAndDelete(id);
      if (!deleted) throw new AppError("Aptitude question not found", 404);
      return { message: "Question deleted permanently" };
    } else {
      const updated = await AptitudeQuestion.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      if (!updated) throw new AppError("Aptitude question not found", 404);
      return { message: "Question deactivated successfully" };
    }
  }

  /**
   * Start an Aptitude Test Session
   * Fetches active questions from DB matching criteria.
   * ABSOLUTELY ZERO GEMINI API CALLS.
   * DOES NOT INCLUDE correctAnswer or explanation in the returned payload.
   */
  async startTestSession(userId, criteria = {}) {
    const { category, topic, difficulty, limit = 10 } = criteria;

    const matchFilter = { isActive: true };

    if (category && category !== "All") {
      matchFilter.category = category;
    }
    if (topic && topic !== "All") {
      matchFilter.topic = topic;
    }
    if (difficulty && difficulty !== "all" && difficulty !== "mixed") {
      matchFilter.difficulty = difficulty;
    }

    // Random sample from MongoDB
    const selectedQuestions = await AptitudeQuestion.aggregate([
      { $match: matchFilter },
      { $sample: { size: Number(limit) } },
    ]);

    if (!selectedQuestions || selectedQuestions.length === 0) {
      throw new AppError(
        "No aptitude questions available matching the selected criteria",
        444 // or 404
      );
    }

    // Prepare embedded question schema for attempt (contains correctAnswer internally for server validation)
    const attemptQuestions = selectedQuestions.map((q) => ({
      questionId: q._id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
      selectedOption: null,
      isCorrect: false,
    }));

    const attempt = await AptitudeAttempt.create({
      user: userId,
      category: category || "All",
      topic: topic || "All",
      difficulty: difficulty || "mixed",
      totalQuestions: selectedQuestions.length,
      status: "ongoing",
      questions: attemptQuestions,
    });

    // Strip correctAnswer and explanation before sending to frontend during active test
    const sanitizedQuestions = selectedQuestions.map((q, index) => ({
      index,
      questionId: q._id,
      question: q.question,
      options: q.options,
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
    }));

    return {
      attemptId: attempt._id,
      category: attempt.category,
      topic: attempt.topic,
      difficulty: attempt.difficulty,
      totalQuestions: attempt.totalQuestions,
      startedAt: attempt.startedAt,
      questions: sanitizedQuestions,
    };
  }

  /**
   * Submit Aptitude Test Answers & Calculate Result
   * ABSOLUTELY ZERO GEMINI API CALLS.
   * Validates answers on backend against stored correctAnswer.
   */
  async submitTestSession(userId, attemptId, answers = []) {
    const attempt = await AptitudeAttempt.findOne({
      _id: attemptId,
      user: userId,
    }).select("+questions.correctAnswer");

    if (!attempt) {
      throw new AppError("Test attempt session not found", 404);
    }

    if (attempt.status === "completed") {
      throw new AppError("This test attempt has already been submitted", 400);
    }

    const answersMap = new Map();
    answers.forEach((ans) => {
      answersMap.set(ans.questionId.toString(), ans.selectedOption);
    });

    let correctCount = 0;

    attempt.questions.forEach((q) => {
      const qIdStr = q.questionId.toString();
      if (answersMap.has(qIdStr)) {
        const userSelected = answersMap.get(qIdStr);
        q.selectedOption = userSelected;
        if (
          userSelected !== null &&
          userSelected !== undefined &&
          Number(userSelected) === q.correctAnswer
        ) {
          q.isCorrect = true;
          correctCount++;
        } else {
          q.isCorrect = false;
        }
      } else {
        q.selectedOption = null;
        q.isCorrect = false;
      }
    });

    const score = correctCount;
    const percentage = Math.round((correctCount / attempt.totalQuestions) * 100);

    attempt.score = score;
    attempt.percentage = percentage;
    attempt.status = "completed";
    attempt.completedAt = new Date();

    await attempt.save();

    // Prepare full results with explanations and correctness for user review
    const results = attempt.questions.map((q, idx) => ({
      index: idx,
      questionId: q.questionId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      selectedOption: q.selectedOption,
      isCorrect: q.isCorrect,
      explanation: q.explanation,
    }));

    return {
      attemptId: attempt._id,
      category: attempt.category,
      topic: attempt.topic,
      difficulty: attempt.difficulty,
      totalQuestions: attempt.totalQuestions,
      score: attempt.score,
      percentage: attempt.percentage,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      questions: results,
    };
  }

  /**
   * Get user's past aptitude attempt history
   */
  async getUserAttempts(userId, query = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const attempts = await AptitudeAttempt.find({ user: userId })
      .select("-questions")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalAttempts = await AptitudeAttempt.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalAttempts / limit);

    return {
      attempts,
      currentPage: page,
      totalPages,
      totalAttempts,
    };
  }

  /**
   * Get detailed result of a specific attempt
   */
  async getAttemptDetails(userId, attemptId) {
    const attempt = await AptitudeAttempt.findOne({
      _id: attemptId,
      user: userId,
    }).select("+questions.correctAnswer");

    if (!attempt) {
      throw new AppError("Attempt not found", 404);
    }

    return attempt;
  }

  /**
   * Get categories and topics mapping
   */
  getCategoriesAndTopics() {
    return APTITUDE_CATEGORIES;
  }
}

module.exports = new AptitudeService();
