# Phase 0 — Top-Down Theoretical Foundation

**AROMA foundation theories:** Cutrona & Suhr (1992) + Biddle (1986) + Feng IMA (2009) as the three-pillar anchor.

## Purpose

Establish a cross-validated, defensible theoretical base that CHI reviewers will recognise. 
## Steps

### 0.1 Lock the Three Anchor Sources

| Anchor | What it provides | AROMA dimension |
|--------|-----------------|-----------------|
| Cutrona & Suhr (1992) SSBC | 5 support types: Emotional, Informational, Esteem, Network, Tangible | **D1 — Support Type** (direct inheritance) |
| Biddle (1986) Role Theory | Theoretical warrant for distinguishing roles from functions — static vs. dynamic, enacted vs. expected | **D2 — Care Role** (conceptual foundation) |
| Feng (2009) IMA | Sequential communicative moves as empirical precedent for coding utterance-level strategy | **D4 — Support Strategy** (methodological precedent) |
| Parsons (1951) | Mutual obligation / Structural Binding | **Authority-Agency Paradox** (cross-cutting lens) |

**Deliverable:** A 1-page "Theoretical Anchors" document mapping each anchor to its AROMA dimension, citing the specific constructs inherited.

### 0.2 Finalize the 5-Dimension Framework

Write a 2–3 page internal spec defining each dimension with:
- A **formal definition** (one sentence, precise enough to code against)
- A **negative definition** (what it is *not*)
- 2–3 worked examples
- The **theoretical lineage** (which anchor paper justifies it)

> The definition of D2 (Care Role) is the most critical — everything downstream depends on it.
> Working definition: *A care role is a stable relational stance that an AI agent adopts toward a user in distress, characterised by a distinctive core function, a dominant support type, and a characteristic set of linguistic strategies — and that invites a complementary human role in return.*

### 0.3 Derive the Human-Role Compatibility Matrix

Write up the complementary human roles (help-seeker, witness-seeker, client, patient, peer-seeker, caregiver, advocate, self-manager) as:

| Care Role | Invited Human Role | Compatibility | Failure mode when mismatched |
|-----------|-------------------|---------------|------------------------------|
| Listener  | Witness-seeker    | High          | User seeking guidance gets validation only → frustration |
| Coach     | Client            | High          | User seeking empathy gets action plans → invalidation |
| ...       | ...               | ...           | ... |

This becomes Figure 1 in the paper.

### 0.4 Write the Theoretical Argument (~800 words)

Draft the argument that motivates the taxonomy:
1. The field conflates D1 (support type) and D2 (care role)
2. Existing taxonomies are either empirically ungrounded, system-level rather than interactional, or user-constructed but unformalised
3. The Parsonian sick role shows why role matters: each care role presupposes an **obligation structure** (mutual binding) between provider and patient
4. Therefore a multi-dimensional role ontology is needed
5. The **Authority-Agency Paradox**: the structural condition in which AI interactions dissolve these mutual obligations—creating an **obligation gap** where authority is claimed without accountability.

This draft becomes Introduction + Related Work sections later.

### 0.5 Cross-Reference Audit

Use the [Taxonomy Cross-Reference Map](../taxonomy-table.html) to verify that:
- Every ENTRIES row has a documented `relationship_to_aroma` (ancestor, prior_taxonomy, motivation, comparator)
- The `argument_chain_layer` field forms a coherent chain: `support_vocabulary` → `matching_logic` → `obligation_structure` → `prior_taxonomy` → `paradox_motivation`
- Coverage gaps in D2–D5 are explicitly identified as the empirical contribution AROMA makes

---

## Gate Criteria

- [ ] Framework spec signed off by Vedant
- [ ] Theoretical argument draft readable as a standalone document
- [ ] Cross-reference map shows clear gap narrative: D1 well-covered → D2-D5 undertheorised
