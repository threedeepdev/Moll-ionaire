// Edit these to make the game your own. There should be 15 questions,
// roughly increasing in difficulty. `correct` is the index (0-3) into `answers`.
const QUESTIONS = [
  {
    question: "What does 'HTML' stand for?",
    answers: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyper Trainer Marking Language",
    ],
    correct: 0,
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
  },
  {
    question: "How many continents are there on Earth?",
    answers: ["5", "6", "7", "8"],
    correct: 2,
  },
  {
    question: "Which of these is NOT a primary color of light?",
    answers: ["Red", "Green", "Blue", "Yellow"],
    correct: 3,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    correct: 1,
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
  },
  {
    question: "In which year did the Titanic sink?",
    answers: ["1898", "1908", "1912", "1920"],
    correct: 2,
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3,
  },
  {
    question: "Which artist painted the Sistine Chapel ceiling?",
    answers: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
    correct: 2,
  },
  {
    question: "What is the smallest country in the world?",
    answers: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correct: 1,
  },
  {
    question: "Which element has the atomic number 1?",
    answers: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
    correct: 1,
  },
  {
    question: "Who developed the theory of general relativity?",
    answers: ["Isaac Newton", "Niels Bohr", "Albert Einstein", "Galileo Galilei"],
    correct: 2,
  },
  {
    question: "What is the longest river in the world?",
    answers: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correct: 1,
  },
  {
    question: "Which Roman emperor was assassinated on the Ides of March?",
    answers: ["Augustus", "Nero", "Julius Caesar", "Caligula"],
    correct: 2,
  },
  {
    question: "What is the speed of light in a vacuum (approximate)?",
    answers: [
      "150,000 km/s",
      "300,000 km/s",
      "500,000 km/s",
      "1,000,000 km/s",
    ],
    correct: 1,
  },
];

const PRIZE_LADDER = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000,
];

// Safety net "guaranteed" tiers — if you get one of these right and lose later,
// you walk away with that amount. Indexes into PRIZE_LADDER.
const MILESTONES = [4, 9]; // $1,000 and $32,000
