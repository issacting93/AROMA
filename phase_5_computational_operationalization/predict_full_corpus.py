import json
import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
import numpy as np
import torch
import torch.nn as nn
import pickle
from collections import Counter

# Re-define model architecture for loading
class MultiTaskAROMAModel(nn.Module):
    def __init__(self, input_dim, d1_classes, d2_classes, d3_classes):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        self.head_d1 = nn.Linear(128, d1_classes)
        self.head_d2 = nn.Linear(128, d2_classes)
        self.head_d3 = nn.Linear(128, d3_classes)

    def forward(self, x):
        shared_rep = self.shared(x)
        return self.head_d1(shared_rep), self.head_d2(shared_rep), self.head_d3(shared_rep)

def main():
    print("Loading persisted AROMA model and encoders...")
    
    # Load Label Encoders
    try:
        with open('label_encoders.pkl', 'rb') as f:
            encoders = pickle.load(f)
        le_d1 = encoders['le_d1']
        le_d2 = encoders['le_d2']
        le_d3 = encoders['le_d3']
    except FileNotFoundError:
        print("ERROR: label_encoders.pkl not found. Run train_multitask_model.py first.")
        return

    # Load Embeddings
    try:
        X_full = np.load('embeddings_full_18376.npy')
    except FileNotFoundError:
        print("ERROR: embeddings_full_18376.npy not found. Run generate_full_embeddings.py first.")
        return

    # Load Metadata
    with open('full_corpus_metadata.json', 'r') as f:
        metadata = json.load(f)

    if len(metadata) != X_full.shape[0]:
        print(f"ERROR: Mismatch between metadata ({len(metadata)}) and embeddings ({X_full.shape[0]})")
        return

    # Initialize Model
    model = MultiTaskAROMAModel(384, len(le_d1.classes_), len(le_d2.classes_), len(le_d3.classes_))
    model.load_state_dict(torch.load('aroma_model.pth'))
    model.eval()

    print(f"Running inference on {X_full.shape[0]} turns...")
    
    X_tensor = torch.FloatTensor(X_full)
    with torch.no_grad():
        out_d1, out_d2, out_d3 = model(X_tensor)
        
        preds_d1 = torch.argmax(out_d1, dim=1).numpy()
        preds_d2 = torch.argmax(out_d2, dim=1).numpy()
        preds_d3 = torch.argmax(out_d3, dim=1).numpy()

    # Map back to human labels
    labels_d1 = le_d1.inverse_transform(preds_d1)
    labels_d2 = le_d2.inverse_transform(preds_d2)
    labels_d3 = le_d3.inverse_transform(preds_d3)

    # Combine into final dataset
    final_output = []
    for i in range(len(metadata)):
        entry = metadata[i].copy()
        entry['d1_predicted'] = labels_d1[i]
        entry['d2_predicted'] = labels_d2[i]
        entry['d3_predicted'] = labels_d3[i]
        final_output.append(entry)

    # Save
    with open('esconv_aroma_full_predictions.json', 'w') as f:
        json.dump(final_output, f, indent=2)

    print(f"SUCCESS: Predictions saved to esconv_aroma_full_predictions.json")

    # Quick Summary Report
    print("\nFull Corpus Prediction Distribution:")
    print("-" * 30)
    for dim, labels in [("D1 (Support Type)", labels_d1), ("D2 (Care Role)", labels_d2)]:
        print(f"\n{dim}:")
        counts = Counter(labels)
        for label, count in counts.most_common():
            print(f"  {label:<20}: {count:>5} ({count/len(labels)*100:>4.1f}%)")

if __name__ == "__main__":
    main()
