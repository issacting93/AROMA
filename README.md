# AROMA: Affective Role Ontology for Mental-health Agents (v0.2.2)

**AROMA** is a three-dimensional taxonomy that formalizes the role structure of AI-mediated mental health support interactions. This project provides a full-stack research suite for literature synthesis, human-in-the-loop annotation, and multitask computational classification.

---

## 🏗️ Project Architecture (Harmonized Suite)

The project is organized into modular phases, harmonized under the **Bloom Design System** aesthetic.

| Phase | Directory | Description | Status |
| :--- | :--- | :--- | :--- |
| **0** | `phase_0_theoretical_framework/` | Core theoretical anchors (Role Theory, Symbolic Interactionism). | ✅ Complete |
| **1** | `phase_1_literature_synthesis/` | Structured synthesis of 203 papers (2015–2025). | ✅ Complete |
| **2** | `phase_2_taxonomy/` | Formalization of the 6 Care Roles and 3 Dimensions. | ✅ Complete |
| **3** | `phase_3_human_coding/` | **Annotation Desk**: Seeker-First React-Supabase tool. | 🧪 Calibration |
| **4** | `phase_4_expert_validation/` | Human-expert alignment and validity checks. | 📅 Planned |
| **5** | `phase_5_operationalization/` | **Computational Pipeline**: LLM-as-Judge & Multitask Probe. | 📈 Training |
| **6/7** | `phase_6_evaluation/` | Result synthesis and **CHI '26** submission drafting. | ✍️ Writing |

---

## 🧬 Dimension Mapping (Codebook v0.2.2)

| Dimension | Question | Labels |
| :--- | :--- | :--- |
| **D1 Support Type** | *What* is given? | Emotional, Informational, Esteem, Network, Tangible, Appraisal |
| **D2 Care Role** | *Who* is the AI being? | Listener, Reflective Partner, Coach, Advisor, Companion, Navigator |
| **D3 Strategy** | *How* is it enacted? | Question, Paraphrasing, Reflection, Self-disclosure, Reassurance, etc. |

---

## 🛠️ Researcher Tools

### 1. AROMA Annotation Desk (Phase 3)
A premium React application enforcing the **Seeker-First Protocol**. Researchers must lock a global user stance before supporter turns and coding forms are revealed.
- **Location**: `/phase_3_human_coding/annotation_desk/app`
- **Stack**: Vite + React + Supabase + Lucide Icons.

### 2. Computational Pipeline (Phase 5)
A restructured pipeline for full-corpus classification on the ESConv dataset (18,376 turns).
- **`data/`**: Raw JSONs and NumPy embeddings (`embeddings_384.npy`).
- **`models/`**: Persisted PyTorch models and label encoders.
- **`figures/`**: Confusion matrices and loss curves.
- **`scripts/`**: `classify_full_corpus_async.py` (Claude 3 Haiku) and `train_multitask_model.py`.

### 3. Interactive Dashboards
- **[Taxonomy Map](dashboard/taxonomy-table.html)**: Searchable 203-paper synthesis.
- **[Findings Dashboard](Downloads/aroma_research_ui/aroma_findings_dashboard.html)**: Visual analysis of role transitions.

---

## 🚀 Getting Started

### Launch Annotation Desk
```bash
cd phase_3_human_coding/annotation_desk/app
npm run dev
```

### Run Multitask Training
```bash
cd phase_5_computational_operationalization
python3 train_multitask_model.py
```

---

*© 2026 AROMA Research Lab · CHI '26 Submission Draft · Protocol v0.2.2*
