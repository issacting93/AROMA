import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
import json
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

torch.set_num_threads(1)

class AROMADataset(Dataset):
    def __init__(self, X, y_d1, y_d2, y_d3):
        self.X = torch.FloatTensor(X)
        self.y_d1 = torch.LongTensor(y_d1)
        self.y_d2 = torch.LongTensor(y_d2)
        self.y_d3 = torch.LongTensor(y_d3)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y_d1[idx], self.y_d2[idx], self.y_d3[idx]

class MultiTaskAROMAModel(nn.Module):
    def __init__(self, input_dim, d1_classes, d2_classes, d3_classes):
        super().__init__()
        # Shared Representation Layer
        self.shared = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        
        # Independent Classification Heads
        self.head_d1 = nn.Linear(128, d1_classes)
        self.head_d2 = nn.Linear(128, d2_classes)
        self.head_d3 = nn.Linear(128, d3_classes)

    def forward(self, x):
        shared_rep = self.shared(x)
        out_d1 = self.head_d1(shared_rep)
        out_d2 = self.head_d2(shared_rep)
        out_d3 = self.head_d3(shared_rep)
        return out_d1, out_d2, out_d3

def main():
    print("Loading Ground Truth Dataset and ONNX Embeddings...")
    with open("esconv_gold_400.json", "r") as f:
        data = json.load(f)
        
    X_embeddings = np.load("embeddings_384.npy")
    
    if len(data) != X_embeddings.shape[0]:
        raise ValueError(f"Mismatch: JSON has {len(data)} items but Numpy array has {X_embeddings.shape[0]} rows!")
        
    y_d1_raw = [item["d1"] for item in data]
    y_d2_raw = [item["d2"] for item in data]
    y_d3_raw = [item["d3"] for item in data]

    # Encode labels
    le_d1 = LabelEncoder().fit(y_d1_raw)
    le_d2 = LabelEncoder().fit(y_d2_raw)
    le_d3 = LabelEncoder().fit(y_d3_raw)
    
    y_d1 = le_d1.transform(y_d1_raw)
    y_d2 = le_d2.transform(y_d2_raw)
    y_d3 = le_d3.transform(y_d3_raw)

    print(f"Tracking Class Dimensions -> D1: {len(le_d1.classes_)}, D2: {len(le_d2.classes_)}, D3: {len(le_d3.classes_)}")

    # 80/20 train-test split (stratification disabled due to rarity of single-classes like 'Tangible')
    X_train, X_test, y_d1_tr, y_d1_te, y_d2_tr, y_d2_te, y_d3_tr, y_d3_te = train_test_split(
        X_embeddings, y_d1, y_d2, y_d3, test_size=0.2, random_state=42
    )

    train_data = AROMADataset(X_train, y_d1_tr, y_d2_tr, y_d3_tr)
    test_data = AROMADataset(X_test, y_d1_te, y_d2_te, y_d3_te)
    
    train_loader = DataLoader(train_data, batch_size=32, shuffle=True)
    test_loader = DataLoader(test_data, batch_size=32, shuffle=False)

    # Compute Class Weights to handle the massive dataset imbalance
    cw_d1 = compute_class_weight('balanced', classes=np.unique(y_d1_tr), y=y_d1_tr)
    cw_d2 = compute_class_weight('balanced', classes=np.unique(y_d2_tr), y=y_d2_tr)
    cw_d3 = compute_class_weight('balanced', classes=np.unique(y_d3_tr), y=y_d3_tr)

    loss_fn_d1 = nn.CrossEntropyLoss(weight=torch.FloatTensor(cw_d1))
    loss_fn_d2 = nn.CrossEntropyLoss(weight=torch.FloatTensor(cw_d2))
    loss_fn_d3 = nn.CrossEntropyLoss(weight=torch.FloatTensor(cw_d3))

    model = MultiTaskAROMAModel(384, len(le_d1.classes_), len(le_d2.classes_), len(le_d3.classes_))
    optimizer = torch.optim.AdamW(model.parameters(), lr=2e-3, weight_decay=1e-4)

    epochs = 150
    print(f"Executing PyTorch Multi-Task Training Loop for {epochs} Epochs...")
    
    losses = []
    for epoch in range(epochs):
        model.train()
        epoch_loss = 0
        for batch_x, batch_d1, batch_d2, batch_d3 in train_loader:
            optimizer.zero_grad()
            out_d1, out_d2, out_d3 = model(batch_x)
            
            loss = loss_fn_d1(out_d1, batch_d1) + loss_fn_d2(out_d2, batch_d2) + loss_fn_d3(out_d3, batch_d3)
            
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
            
        losses.append(epoch_loss / len(train_loader))
        if (epoch + 1) % 50 == 0:
            print(f"  Epoch [{epoch+1}/{epochs}] Multi-Task Batch Loss: {losses[-1]:.4f}")

    # Plot Loss Curve
    plt.figure(figsize=(10, 6))
    plt.plot(losses, label='Multi-Task Loss')
    plt.title('Training Loss over Epochs')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.savefig('multitask_loss.png')
    plt.close()

    print("\nEvaluating Multi-Task Model on Test Set...")
    model.eval()
    all_preds_d1, all_preds_d2, all_preds_d3 = [], [], []
    all_true_d1, all_true_d2, all_true_d3 = [], [], []
    
    with torch.no_grad():
        for batch_x, batch_d1, batch_d2, batch_d3 in test_loader:
            out_d1, out_d2, out_d3 = model(batch_x)
            
            all_preds_d1.extend(torch.argmax(out_d1, dim=1).numpy())
            all_preds_d2.extend(torch.argmax(out_d2, dim=1).numpy())
            all_preds_d3.extend(torch.argmax(out_d3, dim=1).numpy())
            
            all_true_d1.extend(batch_d1.numpy())
            all_true_d2.extend(batch_d2.numpy())
            all_true_d3.extend(batch_d3.numpy())

    print("\n=== D1 SUPPORT TYPE RESULTS ===")
    print(classification_report(all_true_d1, all_preds_d1, target_names=le_d1.classes_, zero_division=0, labels=range(len(le_d1.classes_))))
    
    print("\n=== D2 CARE ROLE RESULTS ===")
    print(classification_report(all_true_d2, all_preds_d2, target_names=le_d2.classes_, zero_division=0, labels=range(len(le_d2.classes_))))

    print("\n=== D3 STRATEGY RESULTS ===")
    print(classification_report(all_true_d3, all_preds_d3, target_names=le_d3.classes_, zero_division=0, labels=range(len(le_d3.classes_))))

    # Helper function for plotting confusion matrix
    def plot_cm(y_true, y_pred, classes, title, filename):
        cm = confusion_matrix(y_true, y_pred, labels=range(len(classes)))
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=classes, yticklabels=classes)
        plt.title(title)
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        plt.savefig(filename)
        plt.close()

    print("\nGenerating Confusion Matrices...")
    plot_cm(all_true_d1, all_preds_d1, le_d1.classes_, 'D1 Support Type Confusion Matrix', 'cm_d1.png')
    plot_cm(all_true_d2, all_preds_d2, le_d2.classes_, 'D2 Care Role Confusion Matrix', 'cm_d2.png')
    plot_cm(all_true_d3, all_preds_d3, le_d3.classes_, 'D3 Strategy Confusion Matrix', 'cm_d3.png')
    print("SUCCESS: Graphs saved (multitask_loss.png, cm_d1.png, cm_d2.png, cm_d3.png)")

if __name__ == "__main__":
    main()
