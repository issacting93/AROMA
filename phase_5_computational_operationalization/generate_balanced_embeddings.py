import os
import sys
import multiprocessing

# Set start method before any other imports
try:
    multiprocessing.set_start_method('spawn', force=True)
except RuntimeError:
    pass

os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import json
import numpy as np
import torch
torch.set_num_threads(1)
from sentence_transformers import SentenceTransformer

def encode_chunk(texts, output_queue):
    # This runs in a fresh process
    model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
    embeddings = model.encode(texts, show_progress_bar=False, batch_size=len(texts))
    output_queue.put(embeddings)

def main():
    print("Generating embeddings for balanced dataset (SPAWN ISOLATION)...")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, "esconv_gold_balanced.json")
    npy_path = os.path.join(base_dir, "embeddings_balanced.npy")

    with open(json_path) as f:
        dataset = json.load(f)
        
    texts = [item["input_text"] for item in dataset]
    print(f"Loaded {len(texts)} turns. Encoding in chunks of 50...")

    all_embeddings = []
    chunk_size = 50
    
    for i in range(0, len(texts), chunk_size):
        chunk = texts[i:i+chunk_size]
        print(f"  Encoding chunk {i//chunk_size + 1}...", end=" ", flush=True)
        
        q = multiprocessing.Queue()
        p = multiprocessing.Process(target=encode_chunk, args=(chunk, q))
        p.start()
        
        # Wait for result with timeout
        try:
            res = q.get(timeout=60)
            all_embeddings.append(res)
            print("OK")
        except Exception as e:
            print(f"FAILED: {e}")
            p.terminate()
        p.join()

    if not all_embeddings:
        print("ERROR: No embeddings generated.")
        return

    final_embs = np.concatenate(all_embeddings, axis=0)
    np.save(npy_path, final_embs)
    print(f"SUCCESS: Saved {final_embs.shape[0]} embeddings to {npy_path}")

if __name__ == "__main__":
    main()
