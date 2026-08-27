const Joi = require("joi");

const createQuestionSchema = Joi.object({
  question: Joi.string().required().min(5).messages({
    "string.empty": "Question text cannot be empty",
    "string.min": "Question text must be at least 5 characters long",
  }),

  options: Joi.array()
    .items(Joi.string().required())
    .min(2)
    .required()
    .messages({
      "array.min": "At least 2 options are required",
    }),

  correctAnswer: Joi.number().integer().min(0).required().messages({
    "number.base": "Correct answer must be an option index number",
    "number.min": "Correct answer index cannot be negative",
  }),

  explanation: Joi.string().allow("").optional(),

  category: Joi.string()
    .valid(
      "Quantitative Aptitude",
      "Logical Reasoning",
      "Verbal Ability",
      "Technical Fundamentals"
    )
    .required()
    .messages({
      "any.only": "Category must be one of Quantitative Aptitude, Logical Reasoning, Verbal Ability, or Technical Fundamentals",
    }),

  topic: Joi.string().required().messages({
    "string.empty": "Topic is required",
  }),

  difficulty: Joi.string()
    .valid("easy", "medium", "hard")
    .default("easy"),

  role: Joi.string().allow("").optional(),
  company: Joi.string().allow("").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().default(true),

  companyRelevance: Joi.number().min(0).max(100).optional(),
  sourceMetadata: Joi.object({
    source: Joi.string().allow("").optional(),
    url: Joi.string().allow("").optional(),
    author: Joi.string().allow("").optional(),
  }).optional(),
  questionFrequency: Joi.number().optional(),
  questionType: Joi.string().valid("multiple_choice", "single_choice", "true_false").optional(),
  timeEstimate: Joi.number().optional(),
});

const updateQuestionSchema = Joi.object({
  question: Joi.string().min(5).optional(),
  options: Joi.array().items(Joi.string()).min(2).optional(),
  correctAnswer: Joi.number().integer().min(0).optional(),
  explanation: Joi.string().allow("").optional(),
  category: Joi.string()
    .valid(
      "Quantitative Aptitude",
      "Logical Reasoning",
      "Verbal Ability",
      "Technical Fundamentals"
    )
    .optional(),
  topic: Joi.string().optional(),
  difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
  role: Joi.string().allow("").optional(),
  company: Joi.string().allow("").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  companyRelevance: Joi.number().min(0).max(100).optional(),
  sourceMetadata: Joi.object().optional(),
  questionFrequency: Joi.number().optional(),
  questionType: Joi.string().optional(),
  timeEstimate: Joi.number().optional(),
});

const startTestSchema = Joi.object({
  category: Joi.string()
    .valid(
      "Quantitative Aptitude",
      "Logical Reasoning",
      "Verbal Ability",
      "Technical Fundamentals",
      "All"
    )
    .optional(),
  topic: Joi.string().allow("").optional(),
  difficulty: Joi.string().valid("easy", "medium", "hard", "mixed", "all").optional(),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

const submitTestSchema = Joi.object({
  attemptId: Joi.string().required().messages({
    "string.empty": "Attempt ID is required",
  }),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedOption: Joi.number().integer().min(0).allow(null).required(),
      })
    )
    .required(),
});

function validateSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }
    next();
  };
}

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
  startTestSchema,
  submitTestSchema,
  validateCreateQuestion: validateSchema(createQuestionSchema),
  validateUpdateQuestion: validateSchema(updateQuestionSchema),
  validateStartTest: validateSchema(startTestSchema),
  validateSubmitTest: validateSchema(submitTestSchema),
};
