// The 15 questions. `correct` is the index (0-3) into `answers`.
const QUESTIONS = [
  {
    question: "Which cat brought home a dead snake, being the last straw that led to The Headless Animal Lecture?",
    answers: ["Starpistol", "Jewels", "Strawberry", "Ella"],
    correct: 0,
  },
  {
    question: "What did Aunt Jackie wear on her face the night that she scared all the children in Ocean Beach on Halloween?",
    answers: ["Face Paint", "Fake Blood", "Mask", "Stockings"],
    correct: 3,
  },
  {
    question: "When the leatherback sea turtle washed up on the beach, you brought an alcoholic beverage with you that Rio accidentally drank and became her first sip of alcohol. What was the beverage?",
    answers: ["Bloody Mary", "Jack & Coke", "Screwdriver", "Sauvignon Blanc"],
    correct: 2,
  },
  {
    question: "In My Big Fat Greek Wedding, Aunt Voula asks Ian a famously awkward question at dinner involving what?",
    answers: ["His salary", "His hair", "His parents", "His lump"],
    correct: 3,
  },
  {
    question: "When Penny ran into a construction site and stole a sandwich from an unsuspecting worker, what type of sandwich did she steal?",
    answers: ["Turkey Sandwich", "Tuna Sandwich", "Roast Beef Sandwich", "Grilled Cheese"],
    correct: 0,
  },
  {
    question: "In Napoleon Dynamite, what campaign promise helps Pedro win the class presidency?",
    answers: [
      "“Vote for me and I will give us all longer lunch periods.”",
      "“Vote for me and we will have free pizza on Fridays.”",
      "“Vote for me and we will have better music at school dances.”",
      "“Vote for me and all of your wildest dreams will come true.”",
    ],
    correct: 3,
  },
  {
    question: "At Fish Market, what is Mama’s son’s name?",
    answers: ["Jack", "Jeff", "John", "Jake"],
    correct: 1,
  },
  {
    question: "What did Kevin have to give Jasmine legal advice on after her run-in with the cops on Fire Island?",
    answers: ["Open Container", "Weed Possession", "Public Intoxication", "Drinking on the Beach"],
    correct: 0,
  },
  {
    question: "What everyday household item is frequently used to hide secret messages in the series Turn: Washington’s Spies?",
    answers: ["Candlesticks", "Cabbages", "Laundry", "Books"],
    correct: 2,
  },
  {
    question: "Which Newport Mansion tour had Keith Emack’s guide stuck on The Talking House setting, driving him to annoy us during the entire tour?",
    answers: ["Marble House", "The Breakers", "The Elms", "Kingscote"],
    correct: 1,
  },
  {
    question: "Who found the runaway snail in the dining room?",
    answers: ["Aunt Jackie", "Dad", "Robbie Thornburg", "Diane Ponzio"],
    correct: 0,
  },
  {
    question: "Who is at fault for not watching Cole closely enough at your wedding, allowing him to drink a glass of champagne and drunkenly make a toast?",
    answers: ["Amy Ippoliti", "Molle Young", "Jenn Ippoliti", "Marion Ippoliti"],
    correct: 2,
  },
  {
    question: "What vegetable or fruit did you grow with a full-of-anticipation baby Cole only for him to cry because he hated the taste so much?",
    answers: ["Tomato", "Radish", "Cucumber", "Strawberry"],
    correct: 1,
  },
  {
    question: "When you met dad for the first time at Formally Joe’s, who was his companion?",
    answers: ["Arthur Blum", "Clay Chalem", "Dave Mulaney", "Nick Tannone"],
    correct: 2,
  },
  {
    question: "Before he was the tiny Baby Rom, what was his original name?",
    answers: ["Vladimir", "Oscar", "Dimitry", "Ivan"],
    correct: 1,
  },
];

// Prize pools — player picks ONE from each pool at Q5, Q10, and Q15.
const PRIZE_POOLS = [
  // Q5 — pick one
  [
    "Glass of wine at Cork",
    "Coffee in bed with scratchoffs and Rom walked",
    "Gluten free bakery crawl",
    "Fishmarket Gift Card",
  ],
  // Q10 — pick one
  [
    "Brooklyn teacup vintage studio",
    "Pearl & the Beast",
    "Shopping & Lunch at Printemps",
    "Movie and homecooked 3-course meal in bed",
  ],
  // Q15 — pick one
  [
    "Peking duck dinner",
    "Mystery envelope",
    "Day trip to Long Island Vanderbilt Mansion",
    "Petite Rouge show",
  ],
];

// Milestones: passing each one (answering that question correctly) awards the next prize.
const MILESTONES = [
  { questionIndex: 4, prizeIndex: 0 },   // After Q5 -> 1 prize
  { questionIndex: 9, prizeIndex: 1 },   // After Q10 -> 2 prizes
  { questionIndex: 14, prizeIndex: 2 },  // After Q15 -> 3 prizes
];

// Family members the player can call with the "Call a family member" lifeline.
// Edit this list freely.
const FAMILY_MEMBERS = [
  "Amy",
  "Aunt Jackie",
  "Cole",
  "Dick",
  "Jenn",
  "Justinos",
];
