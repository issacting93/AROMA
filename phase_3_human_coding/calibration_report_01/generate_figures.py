#!/usr/bin/env python3
"""Generate all figures for AROMA Calibration Report #1.

Uses the full Phase 1 dataset: 50 double-coded sequences across
ESConv_0–24 (25 conversations, 2 sequences each, 2 coders).
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
CSV_PATH = os.path.join(OUT, "..", "..", "aroma_annotations_2026-03-29.csv")

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

rows_a = [v[CODER_A] for v in both.values()]
rows_b = [v[CODER_B] for v in both.values()]
N = len(both)

print(f"Double-coded sequences: {N}")
print(f"Conversations: {sorted(set(r['external_id'].strip() for r in rows_a))}")

w = 0.35


# ---------- Helpers ----------
def cohens_kappa_nominal(list_a, list_b):
    """Cohen's kappa for nominal categories."""
    n = len(list_a)
    cats = sorted(set(list_a) | set(list_b))
    agree = sum(1 for a, b in zip(list_a, list_b) if a == b)
    po = agree / n
    pe = sum((list_a.count(c) / n) * (list_b.count(c) / n) for c in cats)
    if pe == 1.0:
        return 1.0 if po == 1.0 else 0.0
    return (po - pe) / (1 - pe)


# Compute kappas for the report
d1_labels_a = [v[CODER_A]["d1_support_type"].strip() for v in both.values()]
d1_labels_b = [v[CODER_B]["d1_support_type"].strip() for v in both.values()]
d2_labels_a = [v[CODER_A]["primary_d2_role"].strip() for v in both.values()]
d2_labels_b = [v[CODER_B]["primary_d2_role"].strip() for v in both.values()]

d1_kappa = cohens_kappa_nominal(d1_labels_a, d1_labels_b)
d2_kappa = cohens_kappa_nominal(d2_labels_a, d2_labels_b)
d1_agree = sum(1 for a, b in zip(d1_labels_a, d1_labels_b) if a == b)
d2_agree = sum(1 for a, b in zip(d2_labels_a, d2_labels_b) if a == b)

print(f"D1 agreement: {d1_agree}/{N} = {d1_agree/N*100:.1f}%, κ = {d1_kappa:.3f}")
print(f"D2 agreement: {d2_agree}/{N} = {d2_agree/N*100:.1f}%, κ = {d2_kappa:.3f}")

if "seeker_stance" in rows_a[0]:
    stance_labels_a = [v[CODER_A]["seeker_stance"].strip() for v in both.values()]
    stance_labels_b = [v[CODER_B]["seeker_stance"].strip() for v in both.values()]
    stance_kappa = cohens_kappa_nominal(stance_labels_a, stance_labels_b)
    stance_agree = sum(1 for a, b in zip(stance_labels_a, stance_labels_b) if a == b)
    print(f"Stance agreement: {stance_agree}/{N} = {stance_agree/N*100:.1f}%, κ = {stance_kappa:.3f}")

# ============================================================
# Fig 0 — Seeker Stance (per coder)
# ============================================================
if "seeker_stance" in rows_a[0]:
    STANCE_ORDER = ["Passive", "Exploratory", "Active"]
    st_a = Counter(r["seeker_stance"].strip() for r in rows_a)
    st_b = Counter(r["seeker_stance"].strip() for r in rows_b)
    labels0 = [l for l in STANCE_ORDER if st_a[l] + st_b[l] > 0]
    
    fig, ax = plt.subplots(figsize=(7, 4))
    x = np.arange(len(labels0))
    ax.bar(x - w/2, [st_a[l] for l in labels0], w, label="Coder A", color="#4C72B0")
    ax.bar(x + w/2, [st_b[l] for l in labels0], w, label="Coder B", color="#DD8452")
    ax.set_xticks(x)
    ax.set_xticklabels(labels0)
    ax.set_ylabel("Count")
    ax.set_title(f"Phase 1 — Seeker Stance Distribution (n={N})")
    ax.legend()
    for i, l in enumerate(labels0):
        for offset, val in [(-w/2, st_a[l]), (w/2, st_b[l])]:
            if val > 0:
                ax.text(i + offset, val + 0.2, str(val), ha="center", fontsize=9)
    plt.tight_layout()
    plt.savefig(os.path.join(OUT, "fig0_stance_distribution.png"))
    plt.close()


# ============================================================
# Fig 1 — D1 Support Type (per coder)
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
ax.set_title(f"D1 — Support Type Distribution (n={N} per coder)")
ax.legend()
for i, l in enumerate(labels):
    for offset, val in [(-w/2, d1_a[l]), (w/2, d1_b[l])]:
        if val > 0:
            ax.text(i + offset, val + 0.3, str(val), ha="center", fontsize=8)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig1_d1_distribution.png"))
plt.close()


# ============================================================
# Fig 2 — D2 Care Role (per coder)
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
ax.set_title(f"D2 — Care Role Distribution (n={N} per coder)")
ax.legend()
for i, l in enumerate(labels2):
    for offset, val in [(-w/2, d2_a[l]), (w/2, d2_b[l])]:
        if val > 0:
            ax.text(i + offset, val + 0.3, str(val), ha="center", fontsize=8)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig2_d2_distribution.png"))
plt.close()


# ============================================================
# Fig 3 — D3 Strategy frequency (per coder)
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
ax.set_title(f"D3 — Support Strategy Frequency (n={N} per coder)")
ax.legend(fontsize=9)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig3_d3_strategies.png"))
plt.close()


# ============================================================
# Fig 4 — None-role by sequence position
# ============================================================
all_dc = rows_a + rows_b
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
# Fig 5 — D2 Inter-rater confusion matrix
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

agree_d2 = sum(matrix[i, i] for i in range(n_roles))
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
    f"Exact agreement: {agree_d2}/{total_paired} = {agree_d2/max(total_paired,1)*100:.0f}%  |  κ = {d2_kappa:.3f}"
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
# Fig 5b — D1 Inter-rater confusion matrix (NEW)
# ============================================================
d1_labels_order = [l for l in D1_ORDER if l in set(d1_labels_a) | set(d1_labels_b)]
n_d1 = len(d1_labels_order)
d1_matrix = np.zeros((n_d1, n_d1), dtype=int)
for v in both.values():
    a_type = v[CODER_A]["d1_support_type"].strip()
    b_type = v[CODER_B]["d1_support_type"].strip()
    if a_type in d1_labels_order and b_type in d1_labels_order:
        d1_matrix[d1_labels_order.index(a_type), d1_labels_order.index(b_type)] += 1

agree_d1 = sum(d1_matrix[i, i] for i in range(n_d1))
total_d1 = int(d1_matrix.sum())

fig, ax = plt.subplots(figsize=(7, 6))
im = ax.imshow(d1_matrix, cmap="Oranges")
ax.set_xticks(range(n_d1))
ax.set_yticks(range(n_d1))
ax.set_xticklabels(d1_labels_order, rotation=45, ha="right", fontsize=9)
ax.set_yticklabels(d1_labels_order, fontsize=9)
ax.set_xlabel("Coder B")
ax.set_ylabel("Coder A")
ax.set_title(
    f"D1 Inter-Rater Confusion Matrix (n={total_d1})\n"
    f"Exact agreement: {agree_d1}/{total_d1} = {agree_d1/max(total_d1,1)*100:.0f}%  |  κ = {d1_kappa:.3f}"
)
for i in range(n_d1):
    for j in range(n_d1):
        if d1_matrix[i, j] > 0:
            ax.text(j, i, str(d1_matrix[i, j]), ha="center", va="center",
                    color="white" if d1_matrix[i, j] > 2 else "black", fontsize=11)
plt.colorbar(im, ax=ax, shrink=0.8)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig5b_d1_confusion_matrix.png"))
plt.close()


# ============================================================
# Fig 5c — Seeker Stance Inter-rater confusion matrix (NEW)
# ============================================================
if "seeker_stance" in rows_a[0]:
    st_labels = ["Passive", "Exploratory", "Active"]
    n_st = len(st_labels)
    st_matrix = np.zeros((n_st, n_st), dtype=int)
    for v in both.values():
        a_s = v[CODER_A]["seeker_stance"].strip()
        b_s = v[CODER_B]["seeker_stance"].strip()
        if a_s in st_labels and b_s in st_labels:
            st_matrix[st_labels.index(a_s), st_labels.index(b_s)] += 1
            
    agree_st = sum(st_matrix[i, i] for i in range(n_st))
    total_st = int(st_matrix.sum())
    
    fig, ax = plt.subplots(figsize=(6, 5))
    im = ax.imshow(st_matrix, cmap="Greens")
    ax.set_xticks(range(n_st))
    ax.set_yticks(range(n_st))
    ax.set_xticklabels(st_labels)
    ax.set_yticklabels(st_labels)
    ax.set_xlabel("Coder B")
    ax.set_ylabel("Coder A")
    ax.set_title(
        f"Phase 1 — Seeker Stance Confusion Matrix (n={total_st})\n"
        f"Exact agreement: {agree_st}/{total_st} = {agree_st/max(total_st,1)*100:.0f}%  |  κ = {stance_kappa:.3f}"
    )
    for i in range(n_st):
        for j in range(n_st):
            if st_matrix[i, j] > 0:
                ax.text(j, i, str(st_matrix[i, j]), ha="center", va="center",
                        color="white" if st_matrix[i, j] > 2 else "black", fontsize=11)
    plt.colorbar(im, ax=ax, shrink=0.8)
    plt.tight_layout()
    plt.savefig(os.path.join(OUT, "fig5c_stance_confusion_matrix.png"))
    plt.close()



# ============================================================
# Fig 6 — Stance mismatch (per coder)
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
ax.set_title(f"Stance Mismatch Distribution (n={N} per coder)")
ax.legend()
for i, s in enumerate(stance_order):
    for offset, cnt in [(-w/2, stance_a.get(s, 0)), (w/2, stance_b.get(s, 0))]:
        if cnt > 0:
            ax.text(i + offset, cnt + 0.3, str(cnt), ha="center", fontsize=8)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig6_stance_mismatch.png"))
plt.close()


# ============================================================
# Fig 7 — Confidence by sequence position
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
# Fig 8 — D3 multi-label count (per coder)
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
ax.set_title(f"D3 Multi-Label Distribution (n={N} per coder)")
ax.legend()
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig8_d3_multilabel.png"))
plt.close()


# ============================================================
# Fig 12 — Agreement by sequence position (NEW)
# ============================================================
early_pairs = {k: v for k, v in both.items() if "[2,7)" in v[CODER_A]["turn_range"]}
later_pairs = {k: v for k, v in both.items() if "[7,12)" in v[CODER_A]["turn_range"]}

metrics = {
    "[2,7) early": {
        "D1": sum(1 for v in early_pairs.values()
                  if v[CODER_A]["d1_support_type"].strip() == v[CODER_B]["d1_support_type"].strip()) / len(early_pairs) * 100,
        "D2": sum(1 for v in early_pairs.values()
                  if v[CODER_A]["primary_d2_role"].strip() == v[CODER_B]["primary_d2_role"].strip()) / len(early_pairs) * 100,
    },
    "[7,12) later": {
        "D1": sum(1 for v in later_pairs.values()
                  if v[CODER_A]["d1_support_type"].strip() == v[CODER_B]["d1_support_type"].strip()) / len(later_pairs) * 100,
        "D2": sum(1 for v in later_pairs.values()
                  if v[CODER_A]["primary_d2_role"].strip() == v[CODER_B]["primary_d2_role"].strip()) / len(later_pairs) * 100,
    },
}

fig, ax = plt.subplots(figsize=(6, 4.5))
x = np.arange(2)
d1_vals = [metrics["[2,7) early"]["D1"], metrics["[7,12) later"]["D1"]]
d2_vals = [metrics["[2,7) early"]["D2"], metrics["[7,12) later"]["D2"]]
ax.bar(x - w/2, d1_vals, w, label="D1 Support Type", color="#DD8452")
ax.bar(x + w/2, d2_vals, w, label="D2 Care Role", color="#4C72B0")
ax.set_xticks(x)
ax.set_xticklabels(["[2,7) early", "[7,12) later"])
ax.set_ylabel("Exact Agreement (%)")
ax.set_title("Inter-Rater Agreement by Sequence Position")
ax.legend()
ax.set_ylim(0, 70)
for i in range(2):
    ax.text(i - w/2, d1_vals[i] + 1.5, f"{d1_vals[i]:.0f}%", ha="center", fontsize=10, fontweight="bold")
    ax.text(i + w/2, d2_vals[i] + 1.5, f"{d2_vals[i]:.0f}%", ha="center", fontsize=10, fontweight="bold")
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig12_agreement_by_position.png"))
plt.close()


# ============================================================
# Fig 13 — Per-conversation agreement heatmap (NEW)
# ============================================================
conv_ids = sorted(set(k[0] for k in both.keys()), key=lambda x: int(x.split("_")[1]))

conv_d1_agree = []
conv_d2_agree = []
for conv in conv_ids:
    conv_pairs = {k: v for k, v in both.items() if k[0] == conv}
    d1_a_count = sum(1 for v in conv_pairs.values()
                     if v[CODER_A]["d1_support_type"].strip() == v[CODER_B]["d1_support_type"].strip())
    d2_a_count = sum(1 for v in conv_pairs.values()
                     if v[CODER_A]["primary_d2_role"].strip() == v[CODER_B]["primary_d2_role"].strip())
    n_conv = len(conv_pairs)
    conv_d1_agree.append(d1_a_count / n_conv)
    conv_d2_agree.append(d2_a_count / n_conv)

fig, ax = plt.subplots(figsize=(12, 3.5))
heatmap_data = np.array([conv_d1_agree, conv_d2_agree])
im = ax.imshow(heatmap_data, cmap="RdYlGn", vmin=0, vmax=1, aspect="auto")
ax.set_xticks(range(len(conv_ids)))
ax.set_xticklabels([c.replace("ESConv_", "#") for c in conv_ids], fontsize=8, rotation=45)
ax.set_yticks([0, 1])
ax.set_yticklabels(["D1 Support Type", "D2 Care Role"])
ax.set_title("Per-Conversation Agreement (green = agree, red = disagree)")
for i in range(2):
    for j in range(len(conv_ids)):
        val = heatmap_data[i, j]
        ax.text(j, i, f"{val:.0%}", ha="center", va="center",
                fontsize=8, color="white" if val < 0.4 else "black")
plt.colorbar(im, ax=ax, shrink=0.7, label="Agreement rate")
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig13_per_conversation_agreement.png"))
plt.close()


# ============================================================
# Fig 14 — D2 Role ↔ D3 Strategy cross-tabulation (NEW)
# ============================================================
D3_ORDER = ["Question", "Affirmation and Reassurance", "Providing Suggestions",
            "Reflection of Feelings", "Self-disclosure", "Information",
            "Restatement/Paraphrasing", "Others"]
D2_ACTIVE = ["Listener", "Reflective Partner", "Coach", "Advisor", "Navigator"]

# Aggregate both coders
role_strat_matrix = np.zeros((len(D2_ACTIVE), len(D3_ORDER)), dtype=int)
for r in rows_a + rows_b:
    role = r["primary_d2_role"].strip()
    if role not in D2_ACTIVE:
        continue
    strats = [s.strip() for s in r["d3_strategies"].split(";") if s.strip()]
    ri = D2_ACTIVE.index(role)
    for s in strats:
        if s in D3_ORDER:
            role_strat_matrix[ri, D3_ORDER.index(s)] += 1

# Normalize per role (row-wise percentages)
row_sums = role_strat_matrix.sum(axis=1, keepdims=True)
row_sums[row_sums == 0] = 1
role_strat_pct = role_strat_matrix / row_sums * 100

fig, ax = plt.subplots(figsize=(10, 5))
im = ax.imshow(role_strat_pct, cmap="YlOrRd", aspect="auto", vmin=0)
ax.set_xticks(range(len(D3_ORDER)))
ax.set_xticklabels(D3_ORDER, rotation=40, ha="right", fontsize=9)
ax.set_yticks(range(len(D2_ACTIVE)))
ax.set_yticklabels(D2_ACTIVE)
ax.set_title("D2 Care Role → D3 Strategy Profile (% of strategies per role)")
for i in range(len(D2_ACTIVE)):
    for j in range(len(D3_ORDER)):
        val = role_strat_pct[i, j]
        count = role_strat_matrix[i, j]
        if count > 0:
            ax.text(j, i, f"{val:.0f}%\n({count})", ha="center", va="center",
                    fontsize=8, color="white" if val > 40 else "black")
plt.colorbar(im, ax=ax, shrink=0.7, label="% of role's strategies")
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig14_d2_d3_crosstab.png"))
plt.close()


# ============================================================
# NEW ANALYSES — Issues from calibration report review
# ============================================================

# ---------- Issue 1: Conditional κ (D2 given Stance agreement) ----------
if "seeker_stance" in rows_a[0]:
    stance_agree_keys = [k for k, v in both.items()
                         if v[CODER_A]["seeker_stance"].strip() == v[CODER_B]["seeker_stance"].strip()]
    stance_disagree_keys = [k for k, v in both.items()
                            if v[CODER_A]["seeker_stance"].strip() != v[CODER_B]["seeker_stance"].strip()]

    n_agree = len(stance_agree_keys)
    n_disagree = len(stance_disagree_keys)

    if n_agree >= 5:
        cond_d1_a = [both[k][CODER_A]["d1_support_type"].strip() for k in stance_agree_keys]
        cond_d1_b = [both[k][CODER_B]["d1_support_type"].strip() for k in stance_agree_keys]
        cond_d2_a = [both[k][CODER_A]["primary_d2_role"].strip() for k in stance_agree_keys]
        cond_d2_b = [both[k][CODER_B]["primary_d2_role"].strip() for k in stance_agree_keys]

        cond_d1_kappa = cohens_kappa_nominal(cond_d1_a, cond_d1_b)
        cond_d2_kappa = cohens_kappa_nominal(cond_d2_a, cond_d2_b)
        cond_d1_agree = sum(1 for a, b in zip(cond_d1_a, cond_d1_b) if a == b)
        cond_d2_agree = sum(1 for a, b in zip(cond_d2_a, cond_d2_b) if a == b)

        # Also for stance-disagree subset
        dis_d2_a = [both[k][CODER_A]["primary_d2_role"].strip() for k in stance_disagree_keys]
        dis_d2_b = [both[k][CODER_B]["primary_d2_role"].strip() for k in stance_disagree_keys]
        dis_d2_agree = sum(1 for a, b in zip(dis_d2_a, dis_d2_b) if a == b)

        print(f"\n{'='*60}")
        print("ISSUE 1: Conditional κ (given Stance agreement)")
        print(f"{'='*60}")
        print(f"Stance agrees: {n_agree}/{N} sequences")
        print(f"Stance disagrees: {n_disagree}/{N} sequences")
        print(f"  D1 | Stance agrees:    {cond_d1_agree}/{n_agree} = {cond_d1_agree/n_agree*100:.1f}%, κ = {cond_d1_kappa:.3f}")
        print(f"  D2 | Stance agrees:    {cond_d2_agree}/{n_agree} = {cond_d2_agree/n_agree*100:.1f}%, κ = {cond_d2_kappa:.3f}")
        print(f"  D2 | Stance disagrees: {dis_d2_agree}/{n_disagree} = {dis_d2_agree/n_disagree*100:.1f}%")
        print(f"  D2 overall:            {d2_agree}/{N} = {d2_agree/N*100:.1f}%, κ = {d2_kappa:.3f}")


# ---------- Issue 7: Bootstrap CIs for κ ----------
import random
random.seed(42)

def bootstrap_kappa_ci(labels_a, labels_b, n_boot=2000, alpha=0.05):
    """Bootstrap 95% CI for Cohen's κ."""
    n = len(labels_a)
    kappas = []
    for _ in range(n_boot):
        idx = [random.randint(0, n - 1) for _ in range(n)]
        boot_a = [labels_a[i] for i in idx]
        boot_b = [labels_b[i] for i in idx]
        kappas.append(cohens_kappa_nominal(boot_a, boot_b))
    kappas.sort()
    lo = kappas[int(alpha / 2 * n_boot)]
    hi = kappas[int((1 - alpha / 2) * n_boot)]
    return lo, hi

d1_ci = bootstrap_kappa_ci(d1_labels_a, d1_labels_b)
d2_ci = bootstrap_kappa_ci(d2_labels_a, d2_labels_b)

print(f"\n{'='*60}")
print("ISSUE 7: Bootstrap 95% CIs for κ")
print(f"{'='*60}")
print(f"D1 κ = {d1_kappa:.3f}  [{d1_ci[0]:.3f}, {d1_ci[1]:.3f}]")
print(f"D2 κ = {d2_kappa:.3f}  [{d2_ci[0]:.3f}, {d2_ci[1]:.3f}]")

if "seeker_stance" in rows_a[0]:
    stance_ci = bootstrap_kappa_ci(stance_labels_a, stance_labels_b)
    print(f"Stance κ = {stance_kappa:.3f}  [{stance_ci[0]:.3f}, {stance_ci[1]:.3f}]")


# ---------- Issue 4: Stance Mismatch decomposition ----------
if "seeker_stance" in rows_a[0]:
    # (a) Stance agreed -> did mismatch agree?
    # (b) Stance disagreed -> mismatch was doomed
    mismatch_agree_given_stance_agree = 0
    mismatch_disagree_given_stance_agree = 0
    mismatch_agree_given_stance_disagree = 0
    mismatch_disagree_given_stance_disagree = 0

    for k, v in both.items():
        stance_same = (v[CODER_A]["seeker_stance"].strip() == v[CODER_B]["seeker_stance"].strip())
        mismatch_same = (v[CODER_A]["stance_mismatch"].strip() == v[CODER_B]["stance_mismatch"].strip())
        if stance_same and mismatch_same:
            mismatch_agree_given_stance_agree += 1
        elif stance_same and not mismatch_same:
            mismatch_disagree_given_stance_agree += 1
        elif not stance_same and mismatch_same:
            mismatch_agree_given_stance_disagree += 1
        else:
            mismatch_disagree_given_stance_disagree += 1

    print(f"\n{'='*60}")
    print("ISSUE 4: Stance Mismatch Decomposition")
    print(f"{'='*60}")
    print(f"Stance AGREED ({n_agree}):")
    print(f"  Alignment also agreed:    {mismatch_agree_given_stance_agree}")
    print(f"  Alignment disagreed:      {mismatch_disagree_given_stance_agree}  (← pure Role-level problem)")
    print(f"Stance DISAGREED ({n_disagree}):")
    print(f"  Alignment agreed anyway:  {mismatch_agree_given_stance_disagree}")
    print(f"  Alignment also disagreed: {mismatch_disagree_given_stance_disagree}  (← Phase 1 cascade)")


# ---------- Issue 8: Back-test codebook recommendations ----------
print(f"\n{'='*60}")
print("ISSUE 8: Back-test Codebook Recommendations")
print(f"{'='*60}")

# Rule 1: If >= 2 "Question" in D3 strategies → code Listener not None
# Check Listener↔None disagreements
rule1_would_resolve = 0
rule1_total = 0
for k, v in both.items():
    r_a = v[CODER_A]["primary_d2_role"].strip()
    r_b = v[CODER_B]["primary_d2_role"].strip()
    if set([r_a, r_b]) == {"Listener", "None"}:
        rule1_total += 1
        # Check if the "None" coder's D3 includes Question
        none_coder = CODER_A if r_a == "None" else CODER_B
        strats = [s.strip() for s in v[none_coder]["d3_strategies"].split(";") if s.strip()]
        question_count = strats.count("Question")
        if question_count >= 1:  # even 1 Question in a 5-turn sequence suggests engagement
            rule1_would_resolve += 1

print(f"Rule 1 (Question → Listener not None):")
print(f"  Listener↔None disagreements: {rule1_total}")
print(f"  Would resolve (None coder assigned Question in D3): {rule1_would_resolve}/{rule1_total}")

# Rule 3: Any emotional D3 strategy → code Emotional not None for D1
rule3_would_resolve = 0
rule3_total = 0
EMOTIONAL_D3 = {"Reflection of Feelings", "Affirmation and Reassurance", "Self-disclosure"}
for k, v in both.items():
    t_a = v[CODER_A]["d1_support_type"].strip()
    t_b = v[CODER_B]["d1_support_type"].strip()
    if set([t_a, t_b]) == {"Emotional", "None"}:
        rule3_total += 1
        none_coder = CODER_A if t_a == "None" else CODER_B
        strats = set(s.strip() for s in v[none_coder]["d3_strategies"].split(";") if s.strip())
        if strats & EMOTIONAL_D3:
            rule3_would_resolve += 1

print(f"\nRule 3 (Emotional D3 → Emotional not None for D1):")
print(f"  Emotional↔None disagreements: {rule3_total}")
print(f"  Would resolve (None coder assigned emotional D3): {rule3_would_resolve}/{rule3_total}")

# Rule 2: Restatement/Paraphrasing → Reflective Partner not Listener
rule2_would_resolve = 0
rule2_total = 0
for k, v in both.items():
    r_a = v[CODER_A]["primary_d2_role"].strip()
    r_b = v[CODER_B]["primary_d2_role"].strip()
    if set([r_a, r_b]) == {"Listener", "Reflective Partner"}:
        rule2_total += 1
        listener_coder = CODER_A if r_a == "Listener" else CODER_B
        strats = set(s.strip() for s in v[listener_coder]["d3_strategies"].split(";") if s.strip())
        if "Restatement/Paraphrasing" in strats or "Reflection of Feelings" in strats:
            rule2_would_resolve += 1

print(f"\nRule 2 (Restatement/Reflection → Reflective Partner not Listener):")
print(f"  Listener↔Reflective Partner disagreements: {rule2_total}")
print(f"  Would resolve (Listener coder assigned restatement/reflection D3): {rule2_would_resolve}/{rule2_total}")


# ---------- Summary ----------
print(f"\n{'='*60}")
print("ALL FIGURES + NEW ANALYSES COMPLETE")
print(f"{'='*60}")
print(f"All figures saved to: {OUT}")
