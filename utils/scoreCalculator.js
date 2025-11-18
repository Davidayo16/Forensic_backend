export function calculateScores(answers) {
  const components = ['governance', 'people', 'processes', 'technology', 'data', 'compliance'];
  const scores = {};

  // Initialize scores for each component
  components.forEach(component => {
    scores[component] = {
      score: 0,
      maxScore: 0,
      percentage: 0
    };
  });

  // Calculate scores for each component
  answers.forEach(answer => {
    const component = answer.component;
    if (components.includes(component)) {
      scores[component].score += answer.answer;
      scores[component].maxScore += 5; // Max score per question is 5
    }
  });

  // Calculate percentages
  components.forEach(component => {
    if (scores[component].maxScore > 0) {
      scores[component].percentage = Math.round(
        (scores[component].score / scores[component].maxScore) * 100
      );
    }
  });

  // Calculate overall score
  let totalScore = 0;
  let totalMaxScore = 0;
  
  components.forEach(component => {
    totalScore += scores[component].score;
    totalMaxScore += scores[component].maxScore;
  });

  scores.overall = {
    score: totalScore,
    maxScore: totalMaxScore,
    percentage: totalMaxScore > 0 
      ? Math.round((totalScore / totalMaxScore) * 100) 
      : 0
  };

  return scores;
}

