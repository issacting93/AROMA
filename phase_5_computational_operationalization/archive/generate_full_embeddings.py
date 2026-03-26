import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
import json
import numpy as np
import torch
torch.set_num_threads(1)
from sentence_transformers import SentenceTransformer
import os

def main():
    print("Generating full embeddings for ESConv corpus...")
    
    # Check if we already have the full list
    if not os.path.exists('ESConv.json'):
        print("ERROR: ESConv.json not found in current directory.")
        return

    with open('ESConv.json') as f:
        data = json.load(f)
        
    texts = []
    metadata = []
    
    for conv_idx, conv in enumerate(data):
        dialog = conv['dialog']
        for turn_idx, turn in enumerate(dialog):
            if turn['speaker'] == 'supporter':
                # Replicate the logic from build_embedding_dataset.py
                prev_seeker = ""
                for j in range(turn_idx - 1, -1, -1):
                    if dialog[j]['speaker'] == 'seeker':
                        prev_seeker = dialog[j]['content']
                        break
                
                content = turn['content'].strip()
                # Format exactly as in esconv_gold_400.json
                input_text = f"[SEEKER] {prev_seeker.strip()} [SUPPORTER] {content}"
                texts.append(input_text)
                
                metadata.append({
                    'conv_idx': conv_idx,
                    'turn_idx': turn_idx,
                    'content': content,
                    'prev_seeker': prev_seeker,
                    'strategy': turn.get('annotation', {}).get('strategy', 'Unknown')
                })

    print(f"Extracted {len(texts)} supporter turns.")
    
    print("Loading SentenceTransformer('all-MiniLM-L6-v2')...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Encoding turns (this may take a few minutes)...")
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=64)
    
    # Save results
    np.save('embeddings_full_18376.npy', embeddings)
    with open('full_corpus_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
        
    print(f"SUCCESS: Saved embeddings to embeddings_full_18376.npy {embeddings.shape}")
    print(f"SUCCESS: Saved metadata to full_corpus_metadata.json")

if __name__ == "__main__":
    main()
