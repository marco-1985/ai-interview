const QUESTION_BANK = {
  BTECH: {
    TECHNICAL: [
      "Explain how DNS resolution works from browser to server.",
      "What are normalization and denormalization in databases?",
      "How does an operating system schedule processes?",
      "What is the difference between stack and heap memory?",
      "How would you design a URL shortener system?",
      "Explain ACID properties with a real example.",
      "How does REST differ from GraphQL in production systems?",
      "What are indexing strategies in MongoDB?"
    ],
    HR: [
      "Tell me about a project where you solved a hard technical bug.",
      "How do you prioritize tasks during deadline pressure?",
      "Describe a time you handled team conflict in a project.",
      "Why should we hire you for this engineering role?",
      "How do you keep yourself updated with new technologies?"
    ]
  },
  MTECH: {
    TECHNICAL: [
      "How would you evaluate model overfitting in an ML pipeline?",
      "Explain distributed consensus and where it matters.",
      "What trade-offs exist between consistency and availability?",
      "How do you benchmark a system for performance bottlenecks?",
      "Explain a scalable event-driven architecture you would design.",
      "How does container orchestration improve production reliability?",
      "What is your approach to secure API design at scale?",
      "How would you optimize a high-throughput data pipeline?"
    ],
    HR: [
      "How does your postgraduate work help in industry problems?",
      "Describe your research-to-product thinking process.",
      "Tell me about a time you defended a technical decision with data.",
      "How do you mentor junior developers in your team?",
      "What kind of engineering culture helps you perform best?"
    ]
  },
  MCA: {
    TECHNICAL: [
      "What is event loop in Node.js and why does it matter?",
      "How do you secure user authentication in web applications?",
      "What are React rendering optimizations you have used?",
      "How would you structure an Express API for maintainability?",
      "Explain SQL joins with practical use cases.",
      "How do you debug memory leaks in JavaScript applications?",
      "What is the role of caching in backend performance?",
      "How do you design reusable components in React?"
    ],
    HR: [
      "Tell us about your strongest full-stack project.",
      "How do you handle feedback after a poor interview/test?",
      "How do you balance code quality with delivery speed?",
      "How do you collaborate with designers and testers?",
      "What motivates you to work in software development?"
    ]
  }
};

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle(items, seedText) {
  const list = [...items];
  let seed = hashString(seedText);
  for (let index = list.length - 1; index > 0; index -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const swapIndex = seed % (index + 1);
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
}

export function generateInterviewQuestions({ course = "BTECH", level = "INTERMEDIATE", type = "TECHNICAL", count = 5, seed }) {
  const normalizedCourse = String(course).toUpperCase();
  const normalizedType = String(type).toUpperCase();
  const source =
    QUESTION_BANK[normalizedCourse]?.[normalizedType] ||
    QUESTION_BANK[normalizedCourse]?.TECHNICAL ||
    QUESTION_BANK.BTECH.TECHNICAL;

  const mixed = seededShuffle(source, `${seed}-${normalizedCourse}-${level}-${normalizedType}`);
  const limit = Math.max(1, Math.min(Number(count) || 5, 5));

  return mixed.slice(0, limit).map((questionText, index) => ({
    id: `${normalizedCourse}-${normalizedType}-${index + 1}-${hashString(`${seed}-${questionText}`)}`,
    questionText,
    course: normalizedCourse,
    level,
    type: normalizedType
  }));
}
