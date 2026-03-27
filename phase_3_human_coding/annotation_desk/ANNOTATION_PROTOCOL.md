# AROMA Annotation Protocol — v0.5

This document outlines the systematic, top-down coding protocol used for the AROMA project. The goal is to move from initial taxonomy definitions to high-reliability, large-scale annotation of conversation sequences.

## The 9-Step Protocol

1.  **Establish Initial Codes**: Define the core dimensions (D1 Support Type, D2 Care Role, D3 Strategies) in the codebook/taxonomy.
2.  **Agree on Coding Rules**: Establish fundamental constraints (e.g., single primary role per sequence, multi-select strategies, stance-first view).
3.  **Small Batch Independent Coding**: Run a "Calibration Batch" on a random sample of the data. Each sequence is coded independently by multiple annotators searching for variations and corner cases.
4.  **Measure Inter-Rater Reliability (IRR)**: Calculate agreement levels for the calibration batch to assess clarity and consistency.
5.  **Reconcile Disagreements**: Analyze sequences with divergent codes. Use a fixed rule for consensus (e.g., tie-breaking by a third coder or consensus discussion).
6.  **Revise Codebook**: Tweak definitions and add illustrative edge cases (EC-1 through EC-12) based on the reasons for disagreement.
7.  **Repeat (3–6)**: Iterate on subsets of data until IRR reaches a satisfactory level (e.g., Cohen's Kappa > 0.7 or high consensus).
8.  **Create Production Batches**: Assign non-overlapping sequences to individual annotators for full-scale coding.
9.  **Complete & Train**: Finalize all annotations. Use the high-fidelity data for training computational models and performing interactional analysis.

## Calibration Workflows

- **Calibration Batch**: A shared set of sequences coded by everyone to establish the "ground truth."
- **Production Batch**: Unique assignments per coder to cover the full corpus efficiently.

## IRR Success Metrics

For a taxonomy like AROMA to be considered "empirically grounded" and scientific, we aim for the following benchmarks:

| Metric | Target (Ideal) | Acceptable (Calibration) | Current (v0.5 Pre-Reconcile) |
|--------|----------------|--------------------------|-----------------------------|
| **Percent Agreement** | 80% – 90% | 70% | D1: 46%, D2: 36% |
| **Cohen’s Kappa** | > 0.81 (Perfect) | 0.61 – 0.80 (Substantial) | ~0.35 (Fair) |

### Interpretation of Kappa Scores
- **0.61 – 0.80**: The "Sweet Spot" for publication. This indicates that the codebook is clear and the labels are reliable beyond chance.
- **0.41 – 0.60**: Moderate agreement. This usually signals a need for minor codebook tweaks (which is where we are heading after Step 5).
- **< 0.40**: Fair/Slight agreement. Most categories need explicit "rules of thumb" to resolve ambiguity (Step 6).
