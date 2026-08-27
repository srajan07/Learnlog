const APTITUDE_QUESTIONS = [
  // QUANTITATIVE (10)
  {
    id: "q1",
    question: "A product is sold for $480 at a profit of 20%. What was the cost price of the product?",
    options: ["$380", "$400", "$420", "$440"],
    correctAnswer: "$400",
    explanation: "Selling Price = Cost Price × (1 + Profit%). $480 = CP × 1.20 => CP = 480 / 1.20 = $400.",
    category: "Quantitative"
  },
  {
    id: "q2",
    question: "A and B can complete a work in 12 days and 16 days respectively. Working together, how many days will they take?",
    options: ["6.85 days", "7.14 days", "8 days", "9.2 days"],
    correctAnswer: "6.85 days",
    explanation: "1 day work = (1/12 + 1/16) = (4 + 3)/48 = 7/48. Total days = 48 / 7 ≈ 6.85 days.",
    category: "Quantitative"
  },
  {
    id: "q3",
    question: "A train 150 meters long passes a telegraph pole in 9 seconds. What is the speed of the train in km/h?",
    options: ["50 km/h", "60 km/h", "65 km/h", "70 km/h"],
    correctAnswer: "60 km/h",
    explanation: "Speed = Distance / Time = 150m / 9s = 50/3 m/s. Convert to km/h: (50/3) × (18/5) = 60 km/h.",
    category: "Quantitative"
  },
  {
    id: "q4",
    question: "The average age of 5 employees is 28 years. If a new employee aged 34 joins, what is the new average age?",
    options: ["29 years", "29.5 years", "30 years", "31 years"],
    correctAnswer: "29 years",
    explanation: "Total age of 5 = 5 × 28 = 140. New total age = 140 + 34 = 174. New average = 174 / 6 = 29 years.",
    category: "Quantitative"
  },
  {
    id: "q5",
    question: "The ratio of two numbers is 3:5 and their HCF is 8. What is their LCM?",
    options: ["96", "120", "144", "160"],
    correctAnswer: "120",
    explanation: "Numbers are 3 × 8 = 24 and 5 × 8 = 40. Product = HCF × LCM => 24 × 40 = 8 × LCM => LCM = 960 / 8 = 120.",
    category: "Quantitative"
  },
  {
    id: "q6",
    question: "If 15% of a number is equal to 45, what is 40% of that same number?",
    options: ["100", "120", "150", "180"],
    correctAnswer: "120",
    explanation: "0.15 × N = 45 => N = 300. 40% of 300 = 0.40 × 300 = 120.",
    category: "Quantitative"
  },
  {
    id: "q7",
    question: "Two cards are drawn at random from a standard deck of 52 cards. What is the probability that both are Aces?",
    options: ["1/221", "1/169", "4/663", "1/13"],
    correctAnswer: "1/221",
    explanation: "P(1st Ace) = 4/52 = 1/13. P(2nd Ace) = 3/51 = 1/17. Combined = (1/13) × (1/17) = 1/221.",
    category: "Quantitative"
  },
  {
    id: "q8",
    question: "A sum of money doubles itself at simple interest in 8 years. What is the annual interest rate?",
    options: ["10%", "12.5%", "15%", "16.6%"],
    correctAnswer: "12.5%",
    explanation: "Interest = Principal => P = (P × R × 8)/100 => 8R = 100 => R = 12.5%.",
    category: "Quantitative"
  },
  {
    id: "q9",
    question: "A pipe can fill a tank in 6 hours and a leak can empty it in 10 hours. How long will it take to fill the tank if both are open?",
    options: ["12 hours", "15 hours", "18 hours", "20 hours"],
    correctAnswer: "15 hours",
    explanation: "Net filling rate per hour = (1/6 - 1/10) = (5 - 3)/30 = 2/30 = 1/15. Time required = 15 hours.",
    category: "Quantitative"
  },
  {
    id: "q10",
    question: "The price of petrol increases by 25%. By how much percent must a driver reduce consumption so expenditure remains unchanged?",
    options: ["20%", "25%", "30%", "15%"],
    correctAnswer: "20%",
    explanation: "Reduction% = [R / (100 + R)] × 100 = [25 / 125] × 100 = 20%.",
    category: "Quantitative"
  },

  // LOGICAL (10)
  {
    id: "q11",
    question: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
    options: ["95", "115", "127", "131"],
    correctAnswer: "127",
    explanation: "Each number is multiplied by 2 and added by 1: (3×2)+1=7, (7×2)+1=15, (15×2)+1=31, (31×2)+1=63, (63×2)+1=127.",
    category: "Logical"
  },
  {
    id: "q12",
    question: "If 'PENCIL' is coded as 'QFO DJM', how is 'PAPER' coded in that same rule?",
    options: ["QBQFS", "QBQES", "QCPFS", "PAQFS"],
    correctAnswer: "QBQFS",
    explanation: "Each character is shifted forward by +1 letter: P->Q, A->B, P->Q, E->F, R->S = QBQFS.",
    category: "Logical"
  },
  {
    id: "q13",
    question: "Pointing to a photograph, Rahul said, 'She is the daughter of my grandfather's only son.' How is the girl related to Rahul?",
    options: ["Mother", "Sister", "Cousin", "Aunt"],
    correctAnswer: "Sister",
    explanation: "Rahul's grandfather's only son is Rahul's father. The daughter of Rahul's father is Rahul's sister.",
    category: "Logical"
  },
  {
    id: "q14",
    question: "Statements: All cars are vehicles. Some vehicles are electric. Conclusion I: Some cars are electric. Conclusion II: All electric items are vehicles.",
    options: ["Only I follows", "Only II follows", "Neither follows", "Both follow"],
    correctAnswer: "Neither follows",
    explanation: "Cars and electric overlap with vehicles, but no direct relation between cars and electric is established. Neither conclusion logically follows.",
    category: "Logical"
  },
  {
    id: "q15",
    question: "A person walks 10m North, turns right and walks 15m, then turns right again and walks 10m. How far is he from his starting point?",
    options: ["10 meters", "15 meters", "20 meters", "25 meters"],
    correctAnswer: "15 meters",
    explanation: "The North movement (10m) and South movement (10m) cancel out. He is 15 meters East of his starting point.",
    category: "Logical"
  },
  {
    id: "q16",
    question: "Find the odd one out: 27, 64, 125, 144, 216",
    options: ["27", "64", "144", "216"],
    correctAnswer: "144",
    explanation: "27 (3³), 64 (4³), 125 (5³), and 216 (6³) are perfect cubes. 144 is a square (12²), not a cube.",
    category: "Logical"
  },
  {
    id: "q17",
    question: "If A is taller than B, B is taller than C, and D is taller than A, who is the shortest?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "C",
    explanation: "Ordering from tallest to shortest: D > A > B > C. Therefore, C is the shortest.",
    category: "Logical"
  },
  {
    id: "q18",
    question: "Complete the pattern: AB, DE, GH, JK, ?",
    options: ["MN", "LM", "NO", "KL"],
    correctAnswer: "MN",
    explanation: "Skip 1 letter after each pair: AB (c) DE (f) GH (i) JK (l) MN.",
    category: "Logical"
  },
  {
    id: "q19",
    question: "Which number replaces the question mark? 4, 9, 19, 39, 79, ?",
    options: ["139", "149", "159", "169"],
    correctAnswer: "159",
    explanation: "Pattern is (x × 2) + 1. (4×2)+1=9, (9×2)+1=19, (19×2)+1=39, (39×2)+1=79, (79×2)+1=159.",
    category: "Logical"
  },
  {
    id: "q20",
    question: "Five students A, B, C, D, E sit in a row facing North. C is sitting in the middle. A is at an extreme end and B is next to C. Who is sitting to the immediate right of C?",
    options: ["A", "B", "D", "E"],
    correctAnswer: "B",
    explanation: "C is in position 3. B is next to C. If B is to the immediate right, B occupies position 4.",
    category: "Logical"
  },

  // VERBAL (10)
  {
    id: "q21",
    question: "Choose the word most nearly OPPOSITE in meaning to 'OPTIMISTIC':",
    options: ["Cheerful", "Pessimistic", "Confident", "Hopeful"],
    correctAnswer: "Pessimistic",
    explanation: "Optimistic means hopeful/positive about the future. Pessimistic is the direct antonym.",
    category: "Verbal"
  },
  {
    id: "q22",
    question: "Identify the grammatically correct sentence:",
    options: [
      "Neither of the boys were present.",
      "Neither of the boys was present.",
      "Neither of the boys are present.",
      "Neither of the boy were present."
    ],
    correctAnswer: "Neither of the boys was present.",
    explanation: "'Neither' is a singular pronoun and takes a singular verb 'was'.",
    category: "Verbal"
  },
  {
    id: "q23",
    question: "Select the word closest in meaning to 'METICULOUS':",
    options: ["Careless", "Thorough & Precise", "Hasty", "Indifferent"],
    correctAnswer: "Thorough & Precise",
    explanation: "Meticulous means showing great attention to detail; very careful and precise.",
    category: "Verbal"
  },
  {
    id: "q24",
    question: "Fill in the blank: The manager insisted _______ receiving a written report before Friday.",
    options: ["on", "at", "with", "for"],
    correctAnswer: "on",
    explanation: "The verb 'insist' is followed by the preposition 'on' (or 'upon').",
    category: "Verbal"
  },
  {
    id: "q25",
    question: "Choose the correct idiom meaning for 'Spill the beans':",
    options: ["To cook dinner", "To reveal a secret", "To waste food", "To make a mistake"],
    correctAnswer: "To reveal a secret",
    explanation: "'Spill the beans' is a common idiom meaning to disclose secret information prematurely.",
    category: "Verbal"
  },
  {
    id: "q26",
    question: "Choose the correctly spelled word:",
    options: ["Accomodate", "Accommodate", "Acommodate", "Accomodait"],
    correctAnswer: "Accommodate",
    explanation: "'Accommodate' has double 'c' and double 'm'.",
    category: "Verbal"
  },
  {
    id: "q27",
    question: "Substitute one word for: 'A person who looks at the bright side of things'",
    options: ["Pessimist", "Optimist", "Altruist", "Egoist"],
    correctAnswer: "Optimist",
    explanation: "An optimist is a person who tends to be hopeful and confident about the future.",
    category: "Verbal"
  },
  {
    id: "q28",
    question: "Choose the correct option: She has been living in Paris _____ 2018.",
    options: ["for", "since", "from", "during"],
    correctAnswer: "since",
    explanation: "'Since' is used for a specific starting point in time in the past.",
    category: "Verbal"
  },
  {
    id: "q29",
    question: "Select the passive form: 'The engineer fixed the bug.'",
    options: [
      "The bug is fixed by the engineer.",
      "The bug was fixed by the engineer.",
      "The bug had been fixed by engineer.",
      "The engineer was fixing the bug."
    ],
    correctAnswer: "The bug was fixed by the engineer.",
    explanation: "Simple past active ('fixed') becomes simple past passive ('was fixed').",
    category: "Verbal"
  },
  {
    id: "q30",
    question: "Choose the word that best completes the analogy: Doctor : Hospital :: Teacher : ?",
    options: ["Office", "School", "Library", "University"],
    correctAnswer: "School",
    explanation: "A doctor works in a hospital; similarly, a teacher works in a school.",
    category: "Verbal"
  }
];

module.exports = APTITUDE_QUESTIONS;
