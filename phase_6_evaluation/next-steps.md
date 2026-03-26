# AROMA: Research Roadmap & Next Steps

This document outlines the theoretical and methodological goals for the next phase of the AROMA project, focusing on the contrast between Human-Human (HH) and Human-AI (HA) interactions.

## 1. Theoretical Framework: Agency & Roles
- **Agency Flipping Hypothesis**: 
    - **Human-Human (HH)**: Characteristics of **High Agency**. We expect to see a higher density of diverse support strategies (D3).
    - **Human-AI (HA)**: Hypothesized **flipped relation** where the interaction may exhibit lower strategic agency or different role distributions.
- **Role Splitting**: Explicitly differentiate between the roles adopted by Humans vs. AI in the D2 dimension.
- **Human Demand vs. AI Role**: Operationalize the mapping between seeker needs (Human Demand) and the resulting AI response profile (AI Role). 
    - *Reference*: [arXiv:2510.06124](https://arxiv.org/abs/2510.06124)

## 2. Visualization & Empirical Evidence
- **Sankey Diagram Analysis**: 
    - Observe the transitions from Human Demand → Support Role → Strategy. 
    - **Constraint**: Requires human annotation of the Human-AI interaction subset to ensure ground truth.
- **Clustering & Personas**: 
    - **Bottom-Up Personas**: Explore clustering methods to identify if specific "Personas" emerge naturally from encoded turns. 
    - **Comparison**: Contrast cluster stability and density between HH and HA datasets.
    - **Stability**: Investigate if Roles (D2) function more as stable personas or fluid interactional stances.

## 3. Methodological Innovations
- **Granularity (Turn vs. Conversation)**: 
    - Resolve the tension between turn-level linguistic signals and conversation-level roles.
- **Sliding Window Analysis (Vedant's Suggestion)**: 
    - Implement a **sliding window (e.g., 3-5 turns)** for D2 classification.
    - *Application*: Use the window to extract role-based features from the bottom-up, providing a more stable "latent state" of the persona than single-turn classification.

## 4. Dataset Refinement
- **Data Description**: Provide a more detailed breakdown of the turns in the current ESConv subset.
- **Value Extraction**: Develop a bottom-up method for extracting core interactional values from multi-turn sequences.
- **TUNA Integration**: Build on existing optimal matching models (e.g., TUNA) to align human actions with AI responses.