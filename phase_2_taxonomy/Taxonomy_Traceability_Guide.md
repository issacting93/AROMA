# Taxonomy Traceability Guide: AROMA v2.0

This document maps the **6 AROMA Care Roles** back to the literature evidence found during the Phase 1 PRISMA synthesis (203 papers). Use this guide with Ethan to validate the LLM's induction of the taxonomy.

---

## 1. Traceability Matrix

| AROMA Role | Evidence Type | Literature Terms Mapped | Paper Count (approx) | Key Anchor Papers |
|:---|:---|:---|:---|:---|
| **Listener** | Inductive | *None (Role inferred from strategies)* | ~20 | Chin et al. (2025); Gabriel et al. (2024) |
| **Reflective Partner** | Inductive | *None (Role inferred from strategies)* | ~15 | Xu et al. (2025); Zhang et al. (2024) |
| **Coach** | Deductive | Coach, Virtual Coach, Guide, Sim-Physician | ~30 | Youper/Wysa research; Wang et al. (2024) |
| **Advisor** | Deductive | Therapist, Counselor, Virtual Therapist, Psychiatrist | ~85 | Vaidyam et al. (2019); Stade et al. (2024) |
| **Companion** | Deductive | Companion, Friend, Social Ally, Nurturer | ~45 | Savic (2024); Siemon et al. (2020) |
| **Navigator** | Mixed | Navigator, Guide, Screener, Peer-Responder | ~15 | Gabriel et al. (2024); Triage literature |

---

## 2. Validation Protocol for Human Experts

When reviewing with Ethan, please focus on these three "Inductive" and "Mixed" clusters, as they represent the most significant LLM contributions to the framework:

### A. The "Silent" Roles (Listener & Reflective Partner)
**The Observation:** The PRISMA screening identified ~35 papers that describe therapeutic strategies like "Active Listening" or "Cognitive Reframing" but *never* assign a relational role to the AI.
**The LLM Contribution:** AROMA induces the **Listener** and **Reflective Partner** roles to fill this terminological void.
**Review Question:** Do these behavioral patterns warrant a distinct "relational stance" (D2), or are they just strategies (D4)?

### B. The Navigator Merger
**The Observation:** "Connector" appeared in only 1 paper (Gabriel et al. 2024). "Navigator" and "Screener" appeared in 5-10.
**The LLM Contribution:** Merged "Connector" into **Navigator** to satisfy the parsimony gate (≥3 papers).
**Review Question:** Does peer-referral (Connector) feel fundamentally different from clinician-referral (Navigator)?

### C. The Advisor Paradox
**The Observation:** "Advisor" has the highest paper count but also the highest failure signals (Authority-Agency Paradox).
**The LLM Contribution:** Formalized the **Authority-Agency Paradox** as a cross-cutting dimension of the Advisor role.
**Review Question:** Is "Advisor" the right name for systems that project authority but cannot act clinicaly?

---

## 3. Interactive Review Tools
For a live walkthrough with Ethan, please use:
1. **[Taxonomy Table](file:///Users/zac/Documents/Documents-it/AROMA/dashboard/taxonomy-table.html)**: Sort by "D2 Coverage" to see papers touching roles.
2. **[Knowledge Graph](file:///Users/zac/Documents/Documents-it/AROMA/dashboard/knowledge-graph.html)**: Visualize how "Core Functions" (D3) cluster around roles.
3. **[Design Space Matrix](file:///Users/zac/Documents/Documents-it/AROMA/dashboard/aroma_design_space_matrix.html)**: Review the Risk levels assigned to each role.
