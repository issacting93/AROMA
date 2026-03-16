# Phase 0 — Theoretical Framework (now → 3 weeks)

This is the work you've already mostly done. The goal of this phase is to lock it down into a citable, stable document before touching any data, because every downstream decision depends on it.

## 0.1 Finalize the 5-dimension framework

Write a 2–3 page internal spec document defining each dimension with:
- A formal definition (one sentence, precise enough to code against)
- What it is *not* (negative definition — the hardest part)
- 2–3 worked examples
- The theoretical lineage (which prior paper anchors it)

The definition of D2 (Care Role) is the most critical because everything else is relative to it. Lock this before writing a single codebook entry. A working definition: *A care role is a stable relational stance that an AI agent adopts toward a user in distress, characterized by a distinctive core function, a dominant support type, and a characteristic set of linguistic strategies — and that invites a complementary human role in return.*

## 0.2 Derive the human-role compatibility matrix

You've sketched this already (help-seeker, witness-seeker, client, patient, peer-seeker, caregiver, advocate, self-manager). Write it up formally as a 2-column table: Care Role → Invited Human Role → Compatibility prediction → Failure mode when mismatched. This becomes Figure 1 or the theoretical framework figure in the paper.

## 0.3 Write the theoretical argument

Draft the argument that motivates the taxonomy — approximately 800 words:
- The field conflates D1 (support type) and D2 (care role)
- Existing taxonomies are either empirically ungrounded, system-level rather than interactional, or user-constructed but unformalized
- The Parsonian sick role shows why role matters: each care role presupposes different things from the provider, and AI can only viably instantiate some of them
- Therefore a multi-dimensional role ontology is needed that separates support type, care role, core function, support strategy, and modality

This draft becomes your Related Work and Introduction sections later. Writing it now forces you to identify any gaps in the theoretical structure before you commit to a data collection design.

**Deliverable:** A locked internal framework spec. If you can't write the codebook from it, the framework isn't stable enough yet.
