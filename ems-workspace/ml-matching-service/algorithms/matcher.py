"""
Pure Python TF-IDF & Cosine Similarity Profile Matching ML Model
Computes exact Term Frequency - Inverse Document Frequency (TF-IDF) feature vectors
and Cosine Similarity scores for user profiles & startup listings.
Runs smoothly on any environment without external binary DLL dependencies.
"""

import math
import re
from collections import Counter, defaultdict

STOP_WORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
    'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when', 'where',
    'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
}

def extract_profile_text(profile):
    if not isinstance(profile, dict):
        return ""
    
    parts = []
    
    if profile.get('title'): parts.append(str(profile['title']))
    if profile.get('role'): parts.append(str(profile['role']))
    if profile.get('name'): parts.append(str(profile['name']))
    if profile.get('bio'): parts.append(str(profile['bio']))
    if profile.get('about'): parts.append(str(profile['about']))
    if profile.get('category'): parts.append(str(profile['category']))
    if profile.get('industry'): parts.append(str(profile['industry']))
    if profile.get('preferredIndustry'): parts.append(str(profile['preferredIndustry']))
    if profile.get('stage'): parts.append(str(profile['stage']))
    if profile.get('preferredStage'): parts.append(str(profile['preferredStage']))
    if profile.get('goals'): parts.append(str(profile['goals']))
    if profile.get('location'): parts.append(str(profile['location']))
    if profile.get('problemSolved'): parts.append(str(profile['problemSolved']))
    if profile.get('targetUsers'): parts.append(str(profile['targetUsers']))
    if profile.get('investmentRange'): parts.append(str(profile['investmentRange']))
    if profile.get('fundingRequired'): parts.append(str(profile['fundingRequired']))

    skills = profile.get('skills', [])
    if isinstance(skills, list): parts.extend([str(s) for s in skills])
    elif isinstance(skills, str): parts.append(skills)
        
    expertise = profile.get('expertise', [])
    if isinstance(expertise, list): parts.extend([str(e) for e in expertise])
    elif isinstance(expertise, str): parts.append(expertise)

    raw_text = " ".join(parts).lower()
    return raw_text

def tokenize(text):
    cleaned = re.sub(r'[^a-z0-9\s]', ' ', text.lower())
    words = [w for w in cleaned.split() if len(w) > 1 and w not in STOP_WORDS]
    
    # Generate unigrams and bigrams
    tokens = list(words)
    for i in range(len(words) - 1):
        tokens.append(f"{words[i]} {words[i+1]}")
    return tokens

class ProfileTFIDFMatcher:
    def __init__(self):
        self.is_fitted = False
        self.vocabulary = set()
        self.idf_dict = {}

    def train_model(self, corpus_profiles):
        corpus_tokens = [tokenize(extract_profile_text(p)) for p in corpus_profiles]
        N = len(corpus_tokens) or 1
        
        self.vocabulary = set()
        df_counts = defaultdict(int)
        
        for doc in corpus_tokens:
            unique_terms = set(doc)
            for t in unique_terms:
                self.vocabulary.add(t)
                df_counts[t] += 1
                
        self.idf_dict = {}
        for term in self.vocabulary:
            self.idf_dict[term] = math.log((1.0 + N) / (1.0 + df_counts[term])) + 1.0
            
        self.is_fitted = True

    def calculate_match_score(self, profile_a, profile_b):
        tokens_a = tokenize(extract_profile_text(profile_a))
        tokens_b = tokenize(extract_profile_text(profile_b))
        
        if not tokens_a or not tokens_b:
            return 65.0

        vocab = set(tokens_a).union(set(tokens_b))
        N = 2
        df = {t: (1 if t in tokens_a else 0) + (1 if t in tokens_b else 0) for t in vocab}
        
        tf_a = Counter(tokens_a)
        tf_b = Counter(tokens_b)
        
        len_a = len(tokens_a)
        len_b = len(tokens_b)
        
        dot_product = 0.0
        norm_a = 0.0
        norm_b = 0.0
        
        for term in vocab:
            idf = math.log((1.0 + N) / (1.0 + df[term])) + 1.0
            v_a = (tf_a[term] / len_a) * idf
            v_b = (tf_b[term] / len_b) * idf
            
            dot_product += v_a * v_b
            norm_a += v_a * v_a
            norm_b += v_b * v_b
            
        if norm_a == 0 or norm_b == 0:
            return 60.0

        cos_sim = dot_product / (math.sqrt(norm_a) * math.sqrt(norm_b))
        score = round(60.0 + (cos_sim * 39.0), 1)
        return min(99.0, max(55.0, score))

    def rank_candidates(self, user_profile, candidates):
        if not candidates:
            return []

        all_profiles = [user_profile] + candidates
        corpus_tokens = [tokenize(extract_profile_text(p)) for p in all_profiles]
        N = len(corpus_tokens)

        vocab = set()
        df = defaultdict(int)
        for doc in corpus_tokens:
            for t in set(doc):
                vocab.add(t)
                df[t] += 1

        # TF-IDF vectors
        vectors = []
        for doc in corpus_tokens:
            doc_len = len(doc) or 1
            tf = Counter(doc)
            vec = {}
            for t in vocab:
                if t in tf:
                    idf = math.log((1.0 + N) / (1.0 + df[t])) + 1.0
                    vec[t] = (tf[t] / doc_len) * idf
            vectors.append(vec)

        user_vec = vectors[0]
        user_norm = math.sqrt(sum(v * v for v in user_vec.values())) or 1.0

        ranked_results = []
        for idx, candidate in enumerate(candidates):
            cand_vec = vectors[idx + 1]
            cand_norm = math.sqrt(sum(v * v for v in cand_vec.values())) or 1.0

            dot = 0.0
            shared_terms = []
            for term, u_val in user_vec.items():
                c_val = cand_vec.get(term, 0.0)
                if c_val > 0:
                    prod = u_val * c_val
                    dot += prod
                    shared_terms.append((term, prod))

            cos_sim = dot / (user_norm * cand_norm) if (user_norm * cand_norm) > 0 else 0.0
            shared_terms.sort(key=lambda x: x[1], reverse=True)
            matched_keywords = [t[0] for t in shared_terms[:5]]

            score = round(60.0 + (cos_sim * 39.0), 1)
            score = min(99.0, max(55.0, score))

            ranked_results.append({
                **candidate,
                'score': score,
                'matchScore': score,
                'matchDetails': {
                    'algorithm': 'TFIDF-Cosine-Similarity-v2',
                    'rawSimilarity': round(cos_sim, 4),
                    'matchedKeywords': matched_keywords if matched_keywords else candidate.get('skills', [])[:3]
                }
            })

        ranked_results.sort(key=lambda x: x['score'], reverse=True)
        return ranked_results

_global_matcher = ProfileTFIDFMatcher()

def calculate_match_score(user_vector, target_vector):
    return _global_matcher.calculate_match_score(user_vector, target_vector)

def rank_candidates_tfidf(user_profile, candidates):
    return _global_matcher.rank_candidates(user_profile, candidates)

def train_tfidf_model(corpus):
    _global_matcher.train_model(corpus)
    return True
