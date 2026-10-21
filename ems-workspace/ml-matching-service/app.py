from flask import Flask, request, jsonify
from algorithms.matcher import (
    calculate_match_score,
    rank_candidates_tfidf,
    train_tfidf_model
)

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "service": "ml-matching-service",
        "algorithm": "TF-IDF & Cosine Similarity"
    })

@app.route('/match', methods=['POST'])
def match():
    data = request.get_json() or {}
    user_vector = data.get('user', {})
    target_vector = data.get('target', {})
    
    score = calculate_match_score(user_vector, target_vector)
    
    return jsonify({
        "match_score": score,
        "details": {
            "algorithm": "TFIDF-Cosine-Similarity-v2",
            "user_id": user_vector.get('id') or user_vector.get('_id'),
            "target_id": target_vector.get('id') or target_vector.get('_id')
        }
    })

@app.route('/match/batch', methods=['POST'])
@app.route('/rank', methods=['POST'])
def rank_batch():
    data = request.get_json() or {}
    user_profile = data.get('user', {})
    candidates = data.get('candidates', [])
    
    ranked_candidates = rank_candidates_tfidf(user_profile, candidates)
    
    return jsonify({
        "success": True,
        "total": len(ranked_candidates),
        "algorithm": "TF-IDF & Cosine Similarity",
        "matches": ranked_candidates
    })

@app.route('/train', methods=['POST'])
def train():
    data = request.get_json() or {}
    corpus = data.get('corpus', [])
    
    train_tfidf_model(corpus)
    
    return jsonify({
        "success": True,
        "message": f"TF-IDF Model successfully trained on {len(corpus)} profile vectors."
    })

if __name__ == '__main__':
    print("Starting TF-IDF Cosine Similarity ML Matching Service on port 8000...")
    app.run(host='0.0.0.0', port=8000, debug=False)
