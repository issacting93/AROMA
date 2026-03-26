#!/usr/bin/env python3
"""Generate all figures for AROMA Calibration Report #1 (2026-03-26).

All figures use ONLY the 28 double-coded sequences (ESConv_0–13)
to ensure fair coder-to-coder comparison.
"""

import csv
import os
from collections import Counter

import matplotlib.pyplot as plt
import matplotlib
import numpy as np

matplotlib.rcParams.update({
    "font.family": "sans-serif",
    "font.size": 11,
    "axes.titlesize": 13,
    "axes.labelsize": 11,
    "figure.dpi": 200,
})

OUT = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(OUT, "..", "..", "aroma_annotations_2026-03-26.csv")

# ---------- Load data ----------
rows = []
with open(CSV_PATH) as f:
    for r in csv.DictReader(f):
        rows.append(r)

CODER_A = "bf32f904-50b3-4abb-9e0a-11aa1e2fb942"
CODER_B = "41f829d6-9b5c-4fac-bfae-340a90fd8b25"

# Build paired sequences — keep only double-coded
paired = {}
for r in rows:
    key = (r["external_id"].strip(), r["sequence_id"].strip())
    paired.setdefault(key, {})[r["coder_id"].strip()] = r
both = {k: v for k, v in paired.items() if len(v) == 2}

# Flat lists of only double-coded rows
rows_a = [v[CODER_A] for v in both.values()]
rows_b = [v[CODER_B] for v in both.values()]
N = len(both)  # 28

print(f"Double-coded sequences: {N}")
print(f"Conversations: {sorted(set(r['external_id'].strip() for r in rows_a))}")

w = 0.35  # bar width


# ============================================================
# Fig 1 — D1 Support Type (per coder, double-coded only)
# ============================================================
D1_ORDER = ["Emotional", "Informational", "Esteem", "Network", "Tangible",
            "Appraisal", "None", "Ambiguous"]

d1_a = Counter(r["d1_support_type"].strip() for r in rows_a)
d1_b = Counter(r["d1_support_type"].strip() for r in rows_b)
labels = [l for l in D1_ORDER if d1_a[l] + d1_b[l] > 0]

fig, ax = plt.subplots(figsize=(8, 4.5))
x = np.arange(len(labels))
ax.bar(x - w/2, [d1_a[l] for l in labels], w, label="Coder A", color="#4C72B0")
ax.bar(x + w/2, [d1_b[l] for l in labels], w, label="Coder B", color="#DD8452")
ax.set_xticks(x)
ax.set_xticklabels(labels, rotation=30, ha="right")
ax.set_ylabel("Count")
ax.set_title(f"D1 — Support Type Distribution (double-coded, n={N} per coder)")
ax.legend()
for i, l in enumerate(labels):
    for offset, val in [(-w/2, d1_a[l]), (w/2, d1_b[l])]:
        if val > 0:
            ax.text(i + offset, val + 0.3, str(val), ha="center", fontsize=8)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig1_d1_distribution.png"))
plt.close()


# ============================================================
# Fig 2 — D2 Care Role (per coder, double-coded only)
# ============================================================
D2_ORDER = ["Listener", "Reflective Partner", "Coach", "Advisor",
            "Navigator", "Companion", "None", "Ambiguous"]
d2_a = Counter(r["primary_d2_role"].strip() for r in rows_a)
d2_b = Counter(r["primary_d2_role"].strip() for r in rows_b)
labels2 = [l for l in D2_ORDER if d2_a[l] + d2_b[l] > 0]

fig, ax = plt.subplots(figsize=(8, 4.5))
x = np.arange(len(labels2))
ax.bar(x - w/2, [d2_a[l] for l in labels2], w, label="Coder A", color="#4C72B0")
ax.bar(x + w/2, [d2_b[l] for l in labels2], w, label="Coder B", color="#DD8452")
ax.set_xticks(x)
ax.set_xticklabels(labels2, rotation=30, ha="right")
ax.set_ylabel("Count")
ax.set_title(f"D2 — Care Role Distribution (double-coded, n={N} per coder)")
ax.legend()
for i, l in enumerate(labels2):
    for offset, val in [(-w/2, d2_a[l]), (w/2, d2_b[l])]:
        if val > 0:
            ax.text(i + offset, val + 0.3, str(val), ha="center", fontsize=8)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig2_d2_distribution.png"))
plt.close()


# ============================================================
# Fig 3 — D3 Strategy frequency (per coder, double-coded only)
# ============================================================
d3_a = Counter()
d3_b = Counter()
for r in rows_a:
    for s in [s.strip() for s in r["d3_strategies"].split(";") if s.strip()]:
        d3_a[s] += 1
for r in rows_b:
    for s in [s.strip() for s in r["d3_strategies"].split(";") if s.strip()]:
        d3_b[s] += 1

all_strats = sorted(set(list(d3_a.keys()) + list(d3_b.keys())),
                    key=lambda s: d3_a[s] + d3_b[s], reverse=True)

fig, ax = plt.subplots(figsize=(9, 5))
y = np.arange(len(all_strats))
ax.barh(y + w/2, [d3_a[s] for s in all_strats[::-1]], w,
        label="Coder A", color="#4C72B0")
ax.barh(y - w/2, [d3_b[s] for s in all_strats[::-1]], w,
        label="Coder B", color="#DD8452")
ax.set_yticks(y)
ax.set_yticklabels(all_strats[::-1], fontsize=9)
ax.set_xlabel("Frequency (multi-label)")
ax.set_title(f"D3 — Support Strategy Frequency (double-coded, n={N} per coder)")
ax.legend(fontsize=9)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig3_d3_strategies.png"))
plt.close()


# ============================================================
# Fig 4 — None-role by sequence position (double-coded only)
# ============================================================
all_dc = rows_a + rows_b  # both coders' labels on same sequences
seq1 = [r for r in all_dc if "[2,7)" in r["turn_range"]]
seq2 = [r for r in all_dc if "[7,12)" in r["turn_range"]]
none1 = sum(1 for r in seq1 if r["primary_d2_role"].strip() == "None")
none2 = sum(1 for r in seq2 if r["primary_d2_role"].strip() == "None")

fig, ax = plt.subplots(figsize=(5, 4))
positions = ["[2,7)\n(early)", "[7,12)\n(later)"]
none_pct = [none1 / len(seq1) * 100, none2 / len(seq2) * 100]
role_pct = [100 - p for p in none_pct]
ax.bar(positions, role_pct, color="#4C72B0", label="Role assigned")
ax.bar(positions, none_pct, bottom=role_pct, color="#C44E52", label="No role (None)")
ax.set_ylabel("Percentage")
ax.set_title("Role Assignability by Sequence Position")
ax.legend()
for i, (n, tot) in enumerate([(none1, len(seq1)), (none2, len(seq2))]):
    ax.text(i, 102, f"{n}/{tot}", ha="center", fontsize=10, fontweight="bold")
ax.set_ylim(0, 115)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig4_none_by_position.png"))
plt.close()


# ============================================================
# Fig 5 — Inter-rater confusion matrix (D2)
# ============================================================
role_labels = ["Listener", "Reflective Partner", "Coach", "Advisor",
               "Navigator", "None", "Ambiguous"]
n_roles = len(role_labels)
matrix = np.zeros((n_roles, n_roles), dtype=int)
for k, coders in both.items():
    a_role = coders[CODER_A]["primary_d2_role"].strip()
    b_role = coders[CODER_B]["primary_d2_role"].strip()
    if a_role in role_labels and b_role in role_labels:
        matrix[role_labels.index(a_role), role_labels.index(b_role)] += 1

agree = sum(matrix[i, i] for i in range(n_roles))
total_paired = int(matrix.sum())

fig, ax = plt.subplots(figsize=(7, 6))
im = ax.imshow(matrix, cmap="Blues")
ax.set_xticks(range(n_roles))
ax.set_yticks(range(n_roles))
ax.set_xticklabels(role_labels, rotation=45, ha="right", fontsize=9)
ax.set_yticklabels(role_labels, fontsize=9)
ax.set_xlabel("Coder B")
ax.set_ylabel("Coder A")
ax.set_title(
    f"D2 Inter-Rater Confusion Matrix (n={total_paired})\n"
    f"Exact agreement: {agree}/{total_paired} = {agree/max(total_paired,1)*100:.0f}%"
)
for i in range(n_roles):
    for j in range(n_roles):
        if matrix[i, j] > 0:
            ax.text(j, i, str(matrix[i, j]), ha="center", va="center",
                    color="white" if matrix[i, j] > 2 else "black", fontsize=11)
plt.colorbar(im, ax=ax, shrink=0.8)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig5_d2_confusion_matrix.png"))
plt.close()


# ============================================================
# Fig 6 — Stance mismatch (per coder, double-coded only)
# ============================================================
stance_a = Counter(r["stance_mismatch"].strip() for r in rows_a)
stance_b = Counter(r["stance_mismatch"].strip() for r in rows_b)
stance_order = ["aligned", "mild_misfit", "misfit", "misaligned",
                "misaligned_paradox_risk", "N/A"]
stance_labels_clean = ["Aligned", "Mild\nMisfit", "Misfit", "Misaligned",
                       "Paradox\nRisk", "N/A"]

fig, ax = plt.subplots(figsize=(8, 4.5))
x = np.arange(len(stance_order))
ax.bar(x - w/2, [stance_a.get(s, 0) for s in stance_order], w,
       label="Coder A", color="#4C72B0")
ax.bar(x + w/2, [stance_b.get(s, 0) for s in stance_order], w,
       label="Coder B", color="#DD8452")
ax.set_xticks(x)
ax.set_xticklabels(stance_labels_clean)
ax.set_ylabel("Count")
ax.set_title(f"Stance Mismatch Distribution (double-coded, n={N} per coder)")
ax.legend()
for i, s in enumerate(stance_order):
    for offset, cnt in [(-w/2, stance_a.get(s, 0)), (w/2, stance_b.get(s, 0))]:
        if cnt > 0:
            ax.text(i + offset, cnt + 0.3, str(cnt), ha="center", fontsize=8)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig6_stance_mismatch.png"))
plt.close()


# ============================================================
# Fig 7 — Confidence by sequence position (double-coded only)
# ============================================================
conf1 = [int(r["confidence"]) for r in seq1 if r["confidence"].strip()]
conf2 = [int(r["confidence"]) for r in seq2 if r["confidence"].strip()]

fig, ax = plt.subplots(figsize=(6, 4))
bins = [0.5, 1.5, 2.5, 3.5]
ax.hist([conf1, conf2], bins=bins, label=["[2,7) early", "[7,12) later"],
        color=["#4C72B0", "#DD8452"], edgecolor="white", align="mid")
ax.set_xticks([1, 2, 3])
ax.set_xticklabels(["1 (Low)", "2 (Medium)", "3 (High)"])
ax.set_xlabel("Confidence")
ax.set_ylabel("Count")
ax.set_title("Coder Confidence by Sequence Position")
ax.legend()
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig7_confidence.png"))
plt.close()


# ============================================================
# Fig 8 — D3 multi-label count (per coder, double-coded only)
# ============================================================
def get_d3_counts(rlist):
    return [len([s.strip() for s in r["d3_strategies"].split(";") if s.strip()])
            for r in rlist]

d3c_a = get_d3_counts(rows_a)
d3c_b = get_d3_counts(rows_b)

fig, ax = plt.subplots(figsize=(6, 4))
x_vals = [0, 1, 2, 3]
dist_a = Counter(d3c_a)
dist_b = Counter(d3c_b)
ax.bar([v - w/2 for v in x_vals], [dist_a.get(v, 0) for v in x_vals], w,
       label="Coder A", color="#4C72B0")
ax.bar([v + w/2 for v in x_vals], [dist_b.get(v, 0) for v in x_vals], w,
       label="Coder B", color="#DD8452")
ax.set_xticks(x_vals)
ax.set_xticklabels(["0", "1", "2", "3+"])
ax.set_xlabel("Number of D3 strategies per sequence")
ax.set_ylabel("Count")
ax.set_title(f"D3 Multi-Label Distribution (double-coded, n={N} per coder)")
ax.legend()
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig8_d3_multilabel.png"))
plt.close()


print(f"All 8 figures saved to: {OUT}")
