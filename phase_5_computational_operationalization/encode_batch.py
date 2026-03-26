import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
import sys
import json
import numpy as np
import torch
torch.set_num_threads(1)
from sentence_transformers import SentenceTransformer

def main():
    if len(sys.argv) < 3:
        print("Usage: encode_batch.py <input_json> <output_npy>")
        return

    input_json = sys.argv[1]
    output_npy = sys.argv[2]

    with open(input_json) as f:
        texts = json.load(f)

    # Load model FRESH in this process
    model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
    
    # Encode with NO parallelism
    embeddings = model.encode(texts, show_progress_bar=False, batch_size=len(texts))
    
    np.save(output_npy, embeddings)
    print(f"DONE: {len(texts)} embeddings saved to {output_npy}")

if __name__ == "__main__":
    main()
