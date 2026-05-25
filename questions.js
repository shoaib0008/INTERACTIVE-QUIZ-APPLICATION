/**
 * QUESTIONS DATABASE - INTERACTIVE QUIZ APPLICATION
 * 
 * Contains a diverse list of 25 high-quality questions across 5 categories
 * (Technology, Science, Geography, History, General) and 3 difficulty levels (Easy, Medium, Hard).
 * Each question has an explanation which will be shown as instant feedback.
 * 
 * Each question structure:
 * - id: unique identifier (Number)
 * - question: the prompt text (String)
 * - options: four multiple choice choices (Array of Strings)
 * - correctAnswer: index of the correct option (Number, 0 to 3)
 * - category: grouping tag (String - 'tech', 'science', 'geography', 'history', 'general')
 * - difficulty: complexity rating (String - 'easy', 'medium', 'hard')
 * - explanation: detailed feedback explaining why the answer is correct (String)
 */

const questions = [
  // === TECHNOLOGY & CODING ===
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink Text Management Language",
      "Home Tool Markup Language"
    ],
    correctAnswer: 0,
    category: "tech",
    difficulty: "easy",
    explanation: "HTML stands for Hyper Text Markup Language. It is the standard markup language used for creating web pages and defining their structure."
  },
  {
    id: 2,
    question: "Which of the following is NOT a JavaScript data type?",
    options: [
      "String",
      "Boolean",
      "Float",
      "Undefined"
    ],
    correctAnswer: 2,
    category: "tech",
    difficulty: "easy",
    explanation: "In JavaScript, 'Float' is not a distinct data type. JavaScript represents all numbers as double-precision 64-bit binary format IEEE 754 values, simply called the 'Number' type."
  },
  {
    id: 3,
    question: "What is the primary benefit of Event Delegation in JavaScript?",
    options: [
      "It speeds up file download sizes.",
      "It allows a single event listener to manage events for multiple child elements.",
      "It prevents errors from crashing the page.",
      "It automatically runs animations in the background."
    ],
    correctAnswer: 1,
    category: "tech",
    difficulty: "medium",
    explanation: "Event Delegation uses event bubbling to listen for events at a parent level rather than attaching individual event listeners to every single child element. This significantly improves memory footprint and dynamically handles newly added elements."
  },
  {
    id: 4,
    question: "What is the output of the expression: typeof null in JavaScript?",
    options: [
      "\"null\"",
      "\"undefined\"",
      "\"object\"",
      "\"boolean\""
    ],
    correctAnswer: 2,
    category: "tech",
    difficulty: "medium",
    explanation: "In JavaScript, 'typeof null' returns 'object'. This is a historical bug in the first implementation of JavaScript, where values were represented by a type tag and a value, and the tag for objects was 0, which null also mapped to."
  },
  {
    id: 5,
    question: "Which mechanism in JavaScript determines the scope chain lookup when a variable is accessed?",
    options: [
      "Prototype chain",
      "Lexical scoping",
      "Asynchronous callback queue",
      "Strict mode binding"
    ],
    correctAnswer: 1,
    category: "tech",
    difficulty: "hard",
    explanation: "JavaScript uses lexical scoping, meaning that the scope of a variable is determined by its physical location within the source code structure. Inner scopes have access to variables declared in their outer parent scopes."
  },

  // === SCIENCE & NATURE ===
  {
    id: 6,
    question: "What is the approximate speed of light in a vacuum?",
    options: [
      "150,000 kilometers per second",
      "300,000 kilometers per second",
      "500,000 kilometers per second",
      "1,000,000 kilometers per second"
    ],
    correctAnswer: 1,
    category: "science",
    difficulty: "easy",
    explanation: "The speed of light in a vacuum is approximately 299,792 kilometers per second, which is commonly rounded to 300,000 km/s (or 186,000 miles per second)."
  },
  {
    id: 7,
    question: "What gas do plants primarily absorb from the atmosphere to perform photosynthesis?",
    options: [
      "Oxygen",
      "Carbon Dioxide",
      "Nitrogen",
      "Hydrogen"
    ],
    correctAnswer: 1,
    category: "science",
    difficulty: "easy",
    explanation: "Plants absorb Carbon Dioxide (CO2) from the air. Using sunlight and water, they convert it into glucose (sugar) for energy and release oxygen back into the atmosphere."
  },
  {
    id: 8,
    question: "Which organelle is known as the 'powerhouse of the cell'?",
    options: [
      "Nucleus",
      "Ribosome",
      "Mitochondrion",
      "Golgi Apparatus"
    ],
    correctAnswer: 2,
    category: "science",
    difficulty: "medium",
    explanation: "Mitochondria (singular: mitochondrion) are known as the powerhouses of the cell because they perform cellular respiration, converting nutrients into adenosine triphosphate (ATP), the chemical energy currency of the cell."
  },
  {
    id: 9,
    question: "What is the chemical formula for common table salt?",
    options: [
      "NaCl",
      "HCl",
      "NaOH",
      "NaHCO3"
    ],
    correctAnswer: 0,
    category: "science",
    difficulty: "medium",
    explanation: "Table salt is chemically known as Sodium Chloride, which has the chemical formula NaCl. It consists of equal parts of the elements sodium and chlorine."
  },
  {
    id: 10,
    question: "Which elementary particle is responsible for giving other particles their mass through its associated quantum field?",
    options: [
      "Gluon",
      "Higgs Boson",
      "Photon",
      "Neutrino"
    ],
    correctAnswer: 1,
    category: "science",
    difficulty: "hard",
    explanation: "The Higgs Boson is an elementary particle in the Standard Model of physics produced by the quantum excitation of the Higgs field. Particles acquire mass through their interaction with this pervasive field."
  },

  // === GEOGRAPHY ===
  {
    id: 11,
    question: "What is the capital city of France?",
    options: [
      "Rome",
      "Madrid",
      "Paris",
      "Berlin"
    ],
    correctAnswer: 2,
    category: "geography",
    difficulty: "easy",
    explanation: "Paris is the capital and most populous city of France, situated along the Seine River in the north of the country."
  },
  {
    id: 12,
    question: "Which ocean is the largest and deepest on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    correctAnswer: 3,
    category: "geography",
    difficulty: "easy",
    explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions. It extends from the Arctic Ocean in the north to the Southern Ocean in the south."
  },
  {
    id: 13,
    question: "What is the capital city of Australia?",
    options: [
      "Sydney",
      "Melbourne",
      "Canberra",
      "Brisbane"
    ],
    correctAnswer: 2,
    category: "geography",
    difficulty: "medium",
    explanation: "Canberra is the capital city of Australia. It was selected as a compromise between rival cities Sydney and Melbourne, and was founded in 1913."
  },
  {
    id: 14,
    question: "Which river is widely considered the longest in the world?",
    options: [
      "Amazon River",
      "Nile River",
      "Yangtze River",
      "Mississippi River"
    ],
    correctAnswer: 1,
    category: "geography",
    difficulty: "medium",
    explanation: "The Nile River is traditionally considered the longest river in the world, stretching approximately 6,650 kilometers (4,132 miles) through northeastern Africa, though some studies claim the Amazon is longer."
  },
  {
    id: 15,
    question: "What is the deepest known point in the Earth's oceans?",
    options: [
      "Java Trench",
      "Puerto Rico Trench",
      "Challenger Deep",
      "Sunda Trench"
    ],
    correctAnswer: 2,
    category: "geography",
    difficulty: "hard",
    explanation: "Challenger Deep is the deepest known point on Earth, located in the Mariana Trench in the western Pacific Ocean. It has a depth of nearly 11,000 meters (36,000 feet)."
  },

  // === HISTORY ===
  {
    id: 16,
    question: "Who was the first President of the United States?",
    options: [
      "Thomas Jefferson",
      "Abraham Lincoln",
      "George Washington",
      "John Adams"
    ],
    correctAnswer: 2,
    category: "history",
    difficulty: "easy",
    explanation: "George Washington served as the first President of the United States from 1789 to 1797 and is often referred to as the 'Father of His Country'."
  },
  {
    id: 17,
    question: "In which year did World War II officially end?",
    options: [
      "1918",
      "1939",
      "1945",
      "1950"
    ],
    correctAnswer: 2,
    category: "history",
    difficulty: "easy",
    explanation: "World War II officially ended on September 2, 1945, with the formal signing of the surrender documents by Japan aboard the USS Missouri."
  },
  {
    id: 18,
    question: "Which historical figure painted the famous masterpiece, the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Michelangelo",
      "Leonardo da Vinci",
      "Pablo Picasso"
    ],
    correctAnswer: 2,
    category: "history",
    difficulty: "medium",
    explanation: "The Mona Lisa was painted by the Italian Renaissance polymath Leonardo da Vinci, likely started in the early 16th century (around 1503)."
  },
  {
    id: 19,
    question: "Who was the first official Emperor of the Roman Empire, beginning in 27 BC?",
    options: [
      "Julius Caesar",
      "Augustus Caesar",
      "Nero",
      "Marcus Aurelius"
    ],
    correctAnswer: 1,
    category: "history",
    difficulty: "medium",
    explanation: "Augustus Caesar (born Octavian) became the first official Roman Emperor in 27 BC, marking the transition of Rome from a republic to an empire."
  },
  {
    id: 20,
    question: "Which English monarch signed the Magna Carta at Runnymede in 1215?",
    options: [
      "King Henry VIII",
      "King Richard the Lionheart",
      "King John",
      "King Charles I"
    ],
    correctAnswer: 2,
    category: "history",
    difficulty: "hard",
    explanation: "King John of England signed the Magna Carta (Great Charter) in June 1215 under pressure from his rebellious barons, establishing that everyone, including the king, is subject to the law."
  },

  // === GENERAL KNOWLEDGE ===
  {
    id: 21,
    question: "How many days are in a standard leap year?",
    options: [
      "365 days",
      "366 days",
      "364 days",
      "367 days"
    ],
    correctAnswer: 1,
    category: "general",
    difficulty: "easy",
    explanation: "A standard leap year has 366 days instead of 365. The extra day is added as February 29th to keep the calendar year synchronized with the astronomical year."
  },
  {
    id: 22,
    question: "Which country's currency is the Yen?",
    options: [
      "China",
      "South Korea",
      "Japan",
      "Thailand"
    ],
    correctAnswer: 2,
    category: "general",
    difficulty: "easy",
    explanation: "The Yen is the official currency of Japan. It is the third most traded currency in the foreign exchange market after the US Dollar and the Euro."
  },
  {
    id: 23,
    question: "What is the largest organ of the human body?",
    options: [
      "Liver",
      "Brain",
      "Heart",
      "Skin"
    ],
    correctAnswer: 3,
    category: "general",
    difficulty: "medium",
    explanation: "The skin is the largest organ of the human body, covering an area of about 20 square feet in adults and accounting for about 16% of total body weight."
  },
  {
    id: 24,
    question: "Which classical composer wrote the famous 'Ninth Symphony', despite being almost completely deaf by its completion?",
    options: [
      "Wolfgang Amadeus Mozart",
      "Ludwig van Beethoven",
      "Johann Sebastian Bach",
      "Frédéric Chopin"
    ],
    correctAnswer: 1,
    category: "general",
    difficulty: "medium",
    explanation: "Ludwig van Beethoven composed his monumental Ninth Symphony (including the 'Ode to Joy') between 1822 and 1824, by which time he had lost his hearing almost entirely."
  },
  {
    id: 25,
    question: "What is the national flower of Japan, celebrated during the traditional hanami festivals?",
    options: [
      "Lotus",
      "Orchid",
      "Chrysanthemum",
      "Cherry Blossom"
    ],
    correctAnswer: 3,
    category: "general",
    difficulty: "hard",
    explanation: "The Cherry Blossom (known as Sakura) is the national flower of Japan. It represents renewal and the fleeting nature of life, and is celebrated during spring hanami (flower viewing) festivals."
  }
];

// Export standard for ES6 modules (if import/export is utilized) or attach to window for ease of script integration.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { questions };
} else {
  window.quizQuestions = questions;
}
