#!/usr/bin/env python3
"""Calculate Inter-Rater Reliability (IRR) for Seeker Stance (Phase 1).

Analyzes seeker_stance agreement (Passive, Exploratory, Active) between 
Coder A and Coder B using Cohen's Kappa.
"""

import csv
import os
import sys
from collections import Counter

OUT = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(OUT, "..", "..", "aroma_annotations_2026-03-28.csv")

CODER_A = "bf32f904-50b3-4abb-9e0a-11aa1e2fb942"
CODER_B = "41f829d6-9b5c-4fac-bfae-340a90fd8b25"

def cohens_kappa_nominal(list_a, list_b):
    """Cohen's kappa for nominal categories."""
    n = len(list_a)
    if n == 0: return 0.0
    cats = sorted(set(list_a) | set(list_b))
    agree = sum(1 for a, b in zip(list_a, list_b) if a == b)
    po = agree / n
    pe = sum((list_a.count(c) / n) * (list_b.count(c) / n) for c in cats)
    if pe == 1.0:
        return 1.0 if po == 1.0 else 0.0
    return (po - pe) / (1 - pe)

def main():
    if not os.path.exists(CSV_PATH):
        print(f"Error: CSV not found at {CSV_PATH}")
        return

    rows = []
    with open(CSV_PATH) as f:
        for r in csv.DictReader(f):
            rows.append(r)

    # Note: seeker_stance is conversation-level, but reported per sequence in our export.
    # We should deduplicate to conversation level for a "true" stance comparison,
    # OR compare per sequence if we want to see how it affects downstream.
    # The user stance is fixed once per conversation in Phase 1.
    
    paired = {}
    for r in rows:
        # Key by conversation and sequence
        key = (r["external_id"].strip(), r["sequence_id"].strip())
        paired.setdefault(key, {})[r["coder_id"].strip()] = r
    
    both = {k: v for k, v in paired.items() if len(v) == 2}
    N = len(both)

    if "seeker_stance" not in rows[0]:
        print("Warning: 'seeker_stance' column not found in CSV. Did you run the updated export?")
        # For demonstration purposes, if we were in a real run, we'd have it.
        # Here I will try to mock some data if column is missing just to show the script works
        # but in production this should fail or wait for fresh data.
        return

    stances_a = [v[CODER_A]["seeker_stance"].strip() for v in both.values()]
    stances_b = [v[CODER_B]["seeker_stance"].strip() for v in both.values()]

    kappa = cohens_kappa_nominal(stances_a, stances_b)
    agree = sum(1 for a, b in zip(stances_a, stances_b) if a == b)

    print(f"Seeker Stance (Phase 1) Agreement")
    print(f"=================================")
    print(f"Total sequences: {N}")
    print(f"Exact agreement: {agree}/{N} ({agree/N*100:.1f}%)")
    print(f"Cohen's Kappa:   {kappa:.3f}")
    
    print("\nConfusion Matrix:")
    cats = sorted(set(stances_a) | set(stances_b))
    header = " " * 12 + " ".join([f"{c:>12}" for c in cats])
    print(header)
    for c_a in cats:
        row = f"{c_a:>12} "
        for c_b in cats:
            count = sum(1 for a, b in zip(stances_a, stances_b) if a == c_a and b == c_b)
            row += f"{count:12d} "
        print(row)

if __name__ == "__main__":
    main()
