function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function gradeFromScore(score) {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function evaluateAnswer({ questionText, answerText }) {
  const answer = String(answerText || "").trim();
  const words = answer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const lengthScore = clamp(Math.round((wordCount / 90) * 100), 10, 100);
  const structureScore = /because|therefore|for example|in summary|first|second|finally/i.test(answer) ? 85 : 55;
  const clarityScore = /[^a-zA-Z0-9\s.,!?'-]/.test(answer) ? 55 : 78;
  const technicalHintScore = /api|database|system|performance|scalable|algorithm|security|design|testing/i.test(answer)
    ? 82
    : 58;

  const score = clamp(Math.round((lengthScore * 0.35) + (structureScore * 0.25) + (clarityScore * 0.15) + (technicalHintScore * 0.25)), 0, 100);
  const feedback = score >= 75
    ? "Strong answer. Good structure and relevant technical depth."
    : score >= 55
      ? "Decent answer. Add clearer structure and one concrete example."
      : "Answer is too brief or generic. Include key points and practical examples.";

  return {
    score,
    feedback,
    wordCount,
    question: questionText
  };
}

export function buildResultAnalytics(answers) {
  const safeAnswers = Array.isArray(answers) ? answers : [];
  const overallScore = safeAnswers.length
    ? Math.round(safeAnswers.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / safeAnswers.length)
    : 0;

  const confidenceScore = clamp(overallScore + 4, 0, 100);
  const communicationScore = clamp(overallScore + 2, 0, 100);
  const technicalScore = clamp(overallScore + 6, 0, 100);
  const problemSolvingScore = clamp(overallScore - 2, 0, 100);
  const passFail = overallScore >= 55;
  const grade = gradeFromScore(overallScore);

  const strengths = overallScore >= 70
    ? "Good technical explanation, clear communication, and confident approach."
    : "You attempted all questions and showed commitment to problem solving.";
  const weaknesses = overallScore >= 70
    ? "Add more real-world production examples to stand out."
    : "Answers need better depth, clearer structure, and stronger technical examples.";
  const improvements = "Use STAR framework, include one practical example per answer, and summarize key takeaway at the end.";

  return {
    overallScore,
    confidenceScore,
    communicationScore,
    technicalScore,
    problemSolvingScore,
    passFail,
    grade,
    strengths,
    weaknesses,
    improvements,
    summary: passFail
      ? "You performed well with consistent answers across the interview."
      : "You are improving. Focus on structure and technical depth for better scores."
  };
}
