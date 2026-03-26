import os
import sys

# CRITICAL: These must be set before ANY ML imports
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import json
import numpy as np
import torch
torch.set_num_threads(1)

# Now we can import the model
from sentence_transformers import SentenceTransformer

def main():
    if len(sys.argv) < 3:
        return

    input_json = sys.argv[1]
    output_npy = sys.argv[2]

    with open(input_json) as f:
        texts = json.load(f)

    # Use CPU explicitly to avoid any MPS/GPU related locks
    model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
    
    # Encode with absolute zero parallelism
    embeddings = model.encode(texts, show_progress_bar=False, batch_size=len(texts))
    
    np.save(output_npy, embeddings)

if __name__ == "__main__":
    main()
