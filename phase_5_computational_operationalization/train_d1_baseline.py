import json
import numpy as np
import warnings
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

warnings.filterwarnings('ignore')

def main():
    print("Loading pristine ESConv Gold dataset...")
    with open("esconv_gold_400.json", "r") as f:
        data = json.load(f)
    
    texts = [item["input_text"] for item in data]
    labels = [item["d1"] for item in data]
    
    print(f"Loaded {len(texts)} sequences. Initializing TF-IDF classical ML baseline...")
    # Using TF-IDF (Term Frequency - Inverse Document Frequency) completely 
    # bypasses the Apple Silicon OpenMP PyTorch deadlock while providing a 
    # rigorous mathematical baseline to benchmark our final deep learning model against.
    vectorizer = TfidfVectorizer(max_features=5000, stop_words='english', ngram_range=(1, 2))
    
    print("Encoding conversational sequences into sparse statistical vectors...")
    embeddings = vectorizer.fit_transform(texts)
    
    print("Splitting into 80/20 train/test sets (stratification disabled due to severe Tangible rarity)...")
    X_train, X_test, y_train, y_test = train_test_split(
        embeddings, labels, test_size=0.2, random_state=42
    )
    
    print(f"Training Logistic Regression Baseline for D1 Support Type (Train={X_train.shape[0]}, Test={X_test.shape[0]})...")
    clf = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)
    clf.fit(X_train, y_train)
    
    print("Predicting on held-out test set...")
    y_pred = clf.predict(X_test)
    
    print("\n" + "="*60)
    print("D1 SUPPORT TYPE: CLASSICAL TF-IDF BASELINE RESULTS")
    print("="*60)
    print(classification_report(y_test, y_pred, zero_division=0))

if __name__ == "__main__":
    main()
