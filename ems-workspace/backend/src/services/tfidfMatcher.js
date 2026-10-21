/**
 * Node.js Native TF-IDF & Cosine Similarity Profile Matching Engine
 * Computes exact Term Frequency - Inverse Document Frequency (TF-IDF) vectors
 * and Cosine Similarity scores for user profiles & startup listings.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when', 'where',
  'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
]);

/**
 * Extract text from profile object
 */
function extractProfileText(profile) {
  if (!profile || typeof profile !== 'object') return '';

  const parts = [];

  if (profile.title) parts.push(String(profile.title));
  if (profile.role) parts.push(String(profile.role));
  if (profile.name) parts.push(String(profile.name));
  if (profile.bio) parts.push(String(profile.bio));
  if (profile.about) parts.push(String(profile.about));
  if (profile.category) parts.push(String(profile.category));
  if (profile.industry) parts.push(String(profile.industry));
  if (profile.preferredIndustry) parts.push(String(profile.preferredIndustry));
  if (profile.stage) parts.push(String(profile.stage));
  if (profile.preferredStage) parts.push(String(profile.preferredStage));
  if (profile.goals) parts.push(String(profile.goals));
  if (profile.location) parts.push(String(profile.location));
  if (profile.problemSolved) parts.push(String(profile.problemSolved));
  if (profile.targetUsers) parts.push(String(profile.targetUsers));
  if (profile.investmentRange) parts.push(String(profile.investmentRange));
  if (profile.fundingRequired) parts.push(String(profile.fundingRequired));

  if (Array.isArray(profile.skills)) parts.push(...profile.skills);
  else if (profile.skills) parts.push(String(profile.skills));

  if (Array.isArray(profile.expertise)) parts.push(...profile.expertise);
  else if (profile.expertise) parts.push(String(profile.expertise));

  return parts.join(' ').toLowerCase();
}

/**
 * Tokenize text into normalized unigrams and bigrams
 */
function tokenize(text) {
  const cleaned = text.replace(/[^a-z0-9\s]/g, ' ');
  const words = cleaned.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
  
  const tokens = [...words];
  for (let i = 0; i < words.length - 1; i++) {
    tokens.push(`${words[i]} ${words[i + 1]}`);
  }
  return tokens;
}

/**
 * Compute TF-IDF & Cosine Similarity score for a pair of profiles
 */
function calculateTfidfCosineSimilarity(profileA, profileB) {
  const textA = extractProfileText(profileA);
  const textB = extractProfileText(profileB);

  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 65.0;

  // Build vocabulary
  const vocab = new Set([...tokensA, ...tokensB]);
  const N = 2; // two documents in single comparison

  // Document Frequency
  const df = {};
  vocab.forEach(term => {
    let count = 0;
    if (tokensA.includes(term)) count++;
    if (tokensB.includes(term)) count++;
    df[term] = count;
  });

  // Term Frequency
  const tfA = {};
  const tfB = {};
  tokensA.forEach(t => { tfA[t] = (tfA[t] || 0) + 1; });
  tokensB.forEach(t => { tfB[t] = (tfB[t] || 0) + 1; });

  // Calculate TF-IDF vectors
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  vocab.forEach(term => {
    const idf = Math.log((1 + N) / (1 + df[term])) + 1;
    const vA = ((tfA[term] || 0) / tokensA.length) * idf;
    const vB = ((tfB[term] || 0) / tokensB.length) * idf;

    dotProduct += vA * vB;
    normA += vA * vA;
    normB += vB * vB;
  });

  if (normA === 0 || normB === 0) return 60.0;

  const cosSim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  const score = Math.round(60 + cosSim * 39);
  return Math.min(99, Math.max(55, score));
}

/**
 * Batch rank candidates using TF-IDF & Cosine Similarity
 */
function rankCandidatesWithTfidf(userProfile, candidates) {
  if (!candidates || candidates.length === 0) return [];

  const allProfiles = [userProfile, ...candidates];
  const corpusTokens = allProfiles.map(p => tokenize(extractProfileText(p)));
  const N = allProfiles.length;

  // Build Vocabulary
  const vocabSet = new Set();
  corpusTokens.forEach(docTokens => {
    docTokens.forEach(t => vocabSet.add(t));
  });
  const vocab = Array.from(vocabSet);

  // Document frequencies
  const df = {};
  vocab.forEach(term => {
    df[term] = corpusTokens.filter(doc => doc.includes(term)).length;
  });

  // Calculate TF-IDF Matrix
  const tfidfMatrix = corpusTokens.map(docTokens => {
    const docLen = docTokens.length || 1;
    const tf = {};
    docTokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });

    const vec = {};
    vocab.forEach(term => {
      const termFreq = (tf[term] || 0) / docLen;
      const idf = Math.log((1 + N) / (1 + (df[term] || 0))) + 1;
      vec[term] = termFreq * idf;
    });
    return vec;
  });

  const userVec = tfidfMatrix[0];
  const userNorm = Math.sqrt(Object.values(userVec).reduce((sum, v) => sum + v * v, 0)) || 1;

  const rankedResults = candidates.map((cand, idx) => {
    const candVec = tfidfMatrix[idx + 1];
    const candNorm = Math.sqrt(Object.values(candVec).reduce((sum, v) => sum + v * v, 0)) || 1;

    let dot = 0;
    const sharedTerms = [];

    vocab.forEach(term => {
      const prod = (userVec[term] || 0) * (candVec[term] || 0);
      if (prod > 0) {
        dot += prod;
        sharedTerms.push({ term, weight: prod });
      }
    });

    const cosSim = dot / (userNorm * candNorm);
    sharedTerms.sort((a, b) => b.weight - a.weight);
    const matchedKeywords = sharedTerms.slice(0, 5).map(s => s.term);

    // Compute final match score (scaled to 60%-99%)
    const score = Math.min(99, Math.max(55, Math.round(60 + cosSim * 39)));

    return {
      ...cand,
      score: score,
      matchScore: score,
      matchDetails: {
        algorithm: 'TFIDF-Cosine-Similarity',
        rawSimilarity: Math.round(cosSim * 10000) / 10000,
        matchedKeywords: matchedKeywords.length > 0 ? matchedKeywords : (cand.skills || []).slice(0, 3)
      }
    };
  });

  rankedResults.sort((a, b) => b.score - a.score);
  return rankedResults;
}

module.exports = {
  extractProfileText,
  calculateTfidfCosineSimilarity,
  rankCandidatesWithTfidf
};
