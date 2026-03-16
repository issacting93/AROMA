window.AROMA_DATA = 
{
  "DIMS": [
    {
      "id": "D1",
      "label": "D1 · Support Type",
      "color": "#1B3A6B",
      "x0": 0.5,
      "y0": 0.15
    },
    {
      "id": "D2",
      "label": "D2 · Care Role",
      "color": "#2D5016",
      "x0": 0.5,
      "y0": 0.35
    },
    {
      "id": "D3",
      "label": "D3 · Core Function",
      "color": "#6B2D00",
      "x0": 0.5,
      "y0": 0.55
    },
    {
      "id": "D4",
      "label": "D4 · Support Strategy",
      "color": "#5B0070",
      "x0": 0.5,
      "y0": 0.75
    },
    {
      "id": "D5",
      "label": "D5 · Interaction Modality",
      "color": "#003D4A",
      "x0": 0.5,
      "y0": 0.92
    }
  ],
  "TAXONOMIES": [
    {
      "id": "cutrona",
      "label": "Cutrona & Suhr\n1992 SSBC",
      "type": "theory",
      "group": "left",
      "yr": 1992,
      "desc": "5 types: Emotional, Informational, Esteem, Network, Tangible",
      "cover": {
        "D1": "full",
        "D2": "absent",
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "table": {
        "name": "Cutrona & Suhr (1992) SSBC",
        "cite": "5 types: Emotional, Informational, Esteem, Network, Tangible",
        "notes": {
          "D1": "SSBC is the direct ancestor of D1. AROMA's Support Type dimension explicitly extends and refines this typology for AI contexts.",
          "D2": "Support categories, not relational roles. No listener/coach/advisor distinction.",
          "D3": "Implicit in category definitions (e.g. informational = guidance function) but not named as functions.",
          "D4": "No behavioral or conversational strategy layer.",
          "D5": "Face-to-face dyadic communication; modality not theorized."
        },
        "gap": "Provides D1 vocabulary but collapses role, function, and strategy into a single tier. No relational stance or enactment layer. Built for human-human spousal communication."
      }
    },
    {
      "id": "house",
      "label": "House 1981\nWork Stress",
      "type": "theory",
      "group": "left",
      "yr": 1981,
      "desc": "4 types: Emotional, Appraisal, Informational, Instrumental",
      "cover": {
        "D1": "full",
        "D2": "absent",
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "table": {
        "name": "House (1981) Work Stress Typology",
        "cite": "4 types: Emotional, Appraisal, Informational, Instrumental",
        "notes": {
          "D1": "D1 precursor; \"appraisal\" support is a useful addition to SSBC.",
          "D2": "Support functions only; no role layer.",
          "D3": "Functional content of relationships described but not operationalized as core functions.",
          "D4": "",
          "D5": ""
        },
        "gap": "Source-of-support (supervisor vs. co-worker) is not the same as care role; D2–D4 entirely unaddressed."
      }
    },
    {
      "id": "cohen",
      "label": "Cohen & Wills\n1985 Buffering",
      "type": "theory",
      "group": "left",
      "yr": 1985,
      "desc": "Matching hypothesis: support type × stressor controllability",
      "cover": {
        "D1": "full",
        "D2": "absent",
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "table": {
        "name": "Cohen & Wills (1985) Buffering Hypothesis",
        "cite": "Matching hypothesis: support type × stressor controllability",
        "notes": {
          "D1": "Support type matching logic is foundational to AROMA's dynamic framing.",
          "D2": "",
          "D3": "Matching principle implies functional differentiation but doesn't formalize it.",
          "D4": "",
          "D5": ""
        },
        "gap": "The matching hypothesis motivates why dynamic role adaptation matters (D2–D4), but provides no mechanism for operationalizing that adaptation in AI conversation design."
      }
    },
    {
      "id": "weiss",
      "label": "Weiss 1974\nRelational Provisions",
      "type": "theory",
      "group": "left",
      "yr": 1974,
      "desc": "6 provisions: Attachment, Integration, Worth, Alliance, Guidance, Nurturance",
      "cover": {
        "D1": "partial",
        "D2": "partial",
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "table": {
        "name": "Weiss (1974) Relational Provisions",
        "cite": "6 provisions: Attachment, Integration, Worth, Alliance, Guidance, Nurturance",
        "notes": {
          "D1": "Provisions map loosely onto support types but are organized by relationship function, not support behavior.",
          "D2": "\"Guidance\" and \"nurturance\" suggest role-like distinctions but are tied to relationship category, not conversational role.",
          "D3": "Each provision implies a function (e.g. attachment = security function). Closest prior work to D3.",
          "D4": "",
          "D5": ""
        },
        "gap": "Provisions tied to long-term relationship types, not conversation-level dynamics. Cannot be applied within a single AI interaction session."
      }
    },
    {
      "id": "biddle",
      "label": "Biddle 1986\nRole Theory",
      "type": "theory",
      "group": "left",
      "yr": 1986,
      "desc": "Synthesizes functional, structural, cognitive, and organizational role paradigms",
      "cover": {
        "D1": "na",
        "D2": "full",
        "D3": "partial",
        "D4": "partial",
        "D5": "na"
      },
      "table": {
        "name": "Biddle (1986) Role Theory Review",
        "cite": "Synthesizes functional, structural, cognitive, and organizational role paradigms",
        "notes": {
          "D1": "Not a support typology; role theory meta-framework.",
          "D2": "The static/dynamic role distinction and role enactment concept directly underpin D2's framing. AROMA's key theoretical move is applying role theory to conversational AI.",
          "D3": "Role behavior includes function, but at a societal not conversational level.",
          "D4": "\"Role sending\" maps onto D4 but is never applied to support strategy.",
          "D5": ""
        },
        "gap": "Provides the theoretical vocabulary for D2 but never applied to AI, to mental health support, or to turn-level conversational dynamics. AROMA is the first application of role theory to AI care interaction."
      }
    },
    {
      "id": "rogers",
      "label": "Rogers 1957\nTherapeutic Conditions",
      "type": "theory",
      "group": "left",
      "yr": 1957,
      "desc": "Empathy, Unconditional Positive Regard, Congruence",
      "cover": {
        "D1": "absent",
        "D2": "partial",
        "D3": "full",
        "D4": "partial",
        "D5": "na"
      },
      "table": {
        "name": "Rogers (1957) Core Therapeutic Conditions",
        "cite": "Empathy, Unconditional Positive Regard, Congruence",
        "notes": {
          "D1": "Not organized by support type.",
          "D2": "Implicitly defines a relational stance for the \"therapist\" role but as universal conditions, not differentiated roles.",
          "D3": "Core therapeutic conditions are the closest prior art to D3 (Core Function). AROMA's D3 extends this beyond a single therapeutic role.",
          "D4": "Empathy and UPR imply relational strategies but are not operationalized as conversation-level behaviors.",
          "D5": ""
        },
        "gap": "Defines conditions for a single role (therapist); cannot account for the multi-role landscape AROMA maps. Not designed for AI agents."
      }
    },
    {
      "id": "sharma",
      "label": "Sharma et al.\n2020 Empathy",
      "type": "peer",
      "group": "right",
      "yr": 2020,
      "desc": "3 mechanisms: Emotional Reaction, Interpretation, Exploration",
      "cover": {
        "D1": "absent",
        "D2": "partial",
        "D3": "partial",
        "D4": "full",
        "D5": "na"
      },
      "table": {
        "name": "Sharma et al. (2020) Empathy Mechanisms",
        "cite": "3 mechanisms: Emotional Reaction, Interpretation, Exploration",
        "notes": {
          "D1": "No support type categorization.",
          "D2": "Implicitly differentiates listener (reaction), reflective partner (interpretation), and explorer (exploration) roles — but framed as empathy mechanisms not roles.",
          "D3": "Mechanisms map onto core functions (validation, meaning-making, inquiry) but not labeled as such.",
          "D4": "Most directly relevant to D4. The three mechanisms are essentially support strategies. Strongest prior art for D4's operationalization.",
          "D5": "Text-based peer support only."
        },
        "gap": "Empathy mechanisms are the closest prior art to D4, but framed as NLP classification targets, not design-guiding care strategies. No role layer, no support type, no modality. AROMA subsumes and reframes this work."
      }
    },
    {
      "id": "feeney",
      "label": "Feeney & Collins\n2015 Thriving",
      "type": "peer",
      "group": "right",
      "yr": 2015,
      "desc": "SOS support (stress-buffering) vs. RC support (relational capitalization)",
      "cover": {
        "D1": "full",
        "D2": "absent",
        "D3": "full",
        "D4": "partial",
        "D5": "na"
      },
      "table": {
        "name": "Feeney & Collins (2015) Thriving Through Relationships",
        "cite": "SOS support (stress-buffering) vs. RC support (relational capitalization)",
        "notes": {
          "D1": "Two-function model covers D1 partially; distinguishes negative-event vs. positive-growth support.",
          "D2": "",
          "D3": "SOS vs. RC is essentially a two-function typology — one of the strongest D3 precursors in the literature.",
          "D4": "Responsiveness and sensitivity discussed as support quality dimensions, loosely resembling D4.",
          "D5": ""
        },
        "gap": "Two-function model is conceptually powerful but never extended to multiple care roles or applied to AI interaction. The \"responsiveness\" concept directly motivates AROMA's dynamic role framing."
      }
    },
    {
      "id": "vaidyam",
      "label": "Vaidyam et al.\n2019 Psychiatric",
      "type": "ai",
      "group": "right",
      "yr": 2019,
      "desc": "4 clinical roles: Screener, Therapist-Adjunct, Companion, Coach",
      "cover": {
        "D1": "partial",
        "D2": "full",
        "D3": "partial",
        "D4": "absent",
        "D5": "absent"
      },
      "table": {
        "name": "Vaidyam et al. (2019) Clinical Landscape Review",
        "cite": "4 clinical roles: Screener, Therapist-Adjunct, Companion, Coach",
        "notes": {
          "D1": "Each clinical role implies a dominant support type (e.g. coach → informational/behavioral) but not explicit.",
          "D2": "Closest existing taxonomy to D2 — the only prior work in clinical AI literature with named care roles. AROMA must directly engage with this as the key prior taxonomy to supersede.",
          "D3": "Clinical function implied per role but not formalized as Core Function dimension.",
          "D4": "No behavioral/linguistic strategy layer within each role.",
          "D5": "No modality distinction."
        },
        "gap": "The most direct prior taxonomy — AROMA must cite, extend, and supersede this. Key gaps: roles are defined by clinical purpose (system-level), not relational dynamic; no strategy or modality layer; roles are static and non-overlapping; not derived empirically."
      }
    },
    {
      "id": "gaffney",
      "label": "Gaffney et al.\n2019 CA Review",
      "type": "ai",
      "group": "right",
      "yr": 2019,
      "desc": "4 functional types: Informational, Screening, Therapeutic, Relational",
      "cover": {
        "D1": "full",
        "D2": "partial",
        "D3": "partial",
        "D4": "absent",
        "D5": "absent"
      },
      "table": {
        "name": "Gaffney et al. (2019) CA Treatment Review",
        "cite": "4 functional types: Informational, Screening, Therapeutic, Relational",
        "notes": {
          "D1": "Functional types map closely onto D1 support types.",
          "D2": "\"Relational\" and \"therapeutic\" suggest roles but are underdifferentiated.",
          "D3": "Function implicit in label (e.g. screening = assessment function) but not formalized.",
          "D4": "",
          "D5": ""
        },
        "gap": "Functional types conflate D1 (support type) and D2 (role) into a single dimension. No strategy layer, no modality, no empirical derivation. Shows the field has not yet separated support type from care role — AROMA's core conceptual contribution."
      }
    },
    {
      "id": "laranjo",
      "label": "Laranjo et al.\n2018 Conversational Agents Healthcare",
      "type": "ai",
      "group": "right",
      "yr": 2018,
      "desc": "Roles: Information provision, Behavior change coaching, Symptom checking",
      "cover": {
        "D1": "full",
        "D2": "partial",
        "D3": "partial",
        "D4": "absent",
        "D5": "partial"
      },
      "table": {
        "name": "Laranjo et al. (2018) Conversational Agents Healthcare",
        "cite": "Roles: Information provision, Behavior change coaching, Symptom checking",
        "notes": {
          "D1": "Informational support is well-covered; behavioral is implied in coaching.",
          "D2": "\"Coach\" role named but not differentiated from advisor or companion.",
          "D3": "Behavior change implies a function but it's embedded in the clinical purpose label.",
          "D4": "",
          "D5": "Voice vs. text noted descriptively in some studies but not theorized as a dimension."
        },
        "gap": "Health domain focus; emotional and relational support largely absent. No affective care role (listener, companion) in the taxonomy — a significant gap AROMA fills directly."
      }
    },
    {
      "id": "stade",
      "label": "Stade et al.\n2024 LLMs",
      "type": "ai",
      "group": "right",
      "yr": 2024,
      "desc": "4 LLM roles: Assessor, Intervener, Coach, Companion",
      "cover": {
        "D1": "partial",
        "D2": "full",
        "D3": "partial",
        "D4": "absent",
        "D5": "absent"
      },
      "table": {
        "name": "Stade et al. (2024) LLMs in Behavioral Health",
        "cite": "4 LLM roles: Assessor, Intervener, Coach, Companion",
        "notes": {
          "D1": "Each role implies a support type (companion → emotional; assessor → informational) but no explicit mapping.",
          "D2": "Most current named-role taxonomy for LLMs. AROMA must differentiate from and extend this directly.",
          "D3": "Role labels imply distinct functions but no formal D3 layer.",
          "D4": "No within-role strategy differentiation.",
          "D5": ""
        },
        "gap": "Roles are clinician-assigned (not empirically derived from interaction data); no strategy or modality layer; roles treated as mutually exclusive; does not address how roles shift within a conversation."
      }
    },
    {
      "id": "song",
      "label": "Song & Pendse\n2025 Typing Cure",
      "type": "ai",
      "group": "right",
      "yr": 2025,
      "desc": "User-constructed roles: listener, cognitive load offloader, rehearsal partner",
      "cover": {
        "D1": "partial",
        "D2": "full",
        "D3": "partial",
        "D4": "partial",
        "D5": "partial"
      },
      "table": {
        "name": "Song & Pendse (2025) The Typing Cure",
        "cite": "User-constructed roles: listener, cognitive load offloader, rehearsal partner",
        "notes": {
          "D1": "User-expressed support needs implicitly map onto support types but not coded as such.",
          "D2": "User-constructed roles are the empirical basis AROMA formalizes. This is the closest experiential evidence for D2's necessity — \"users want roles but the system doesn't provide them.\"",
          "D3": "Therapeutic alignment concept implies functional goals per role but not operationalized.",
          "D4": "Interaction practices described qualitatively (e.g. \"rehearsal\") but not as formal strategies.",
          "D5": "Text-only (LLM chatbots). Modality variation not studied."
        },
        "gap": "Provides the strongest empirical motivation for AROMA but stops short of formalizing a taxonomy. User-constructed roles are identified but not systematized, validated across systems, or connected to design guidelines. AROMA is the formalization this paper calls for."
      }
    },
    {
      "id": "khawaja",
      "label": "Khawaja et al.\n2023 Robot Therapist",
      "type": "ai",
      "group": "right",
      "yr": 2023,
      "desc": "Therapeutic misconception framework; role confusion as ethical problem",
      "cover": {
        "D1": "absent",
        "D2": "partial",
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "table": {
        "name": "Khawaja & Bélisle-Pipon (2023) Robot Therapist",
        "cite": "Therapeutic misconception framework; role confusion as ethical problem",
        "notes": {
          "D1": "",
          "D2": "Argues that role ambiguity between \"therapist\" and \"tool\" is harmful — motivates the need for D2's precision without providing it.",
          "D3": "",
          "D4": "",
          "D5": ""
        },
        "gap": "Normative paper that names the problem AROMA solves. Role confusion is identified as harmful but no taxonomy is offered. Directly sets up AROMA's motivation in the introduction."
      }
    },
    {
      "id": "jo",
      "label": "Jo et al.\n2023 ",
      "type": "ai",
      "group": "right",
      "yr": 2023,
      "desc": "Role ambiguity among users, teleoperators, and developers",
      "cover": {
        "D1": "partial",
        "D2": "partial",
        "D3": "absent",
        "D4": "absent",
        "D5": "partial"
      },
      "table": {
        "name": "Jo et al. (2023) CareCall (CHI)",
        "cite": "Role ambiguity among users, teleoperators, and developers",
        "notes": {
          "D1": "Emotional check-in and companionship support types are present but not named.",
          "D2": "Stakeholder role expectations diverge — empirical evidence that D2 is necessary for multi-stakeholder deployment.",
          "D3": "",
          "D4": "",
          "D5": "Voice-based phone call modality is distinctive but not theorized as a design variable."
        },
        "gap": "Empirically demonstrates role ambiguity as a deployment problem, not just a design concern. Supports AROMA's argument that role definition must be explicit — but offers no taxonomy as solution."
      }
    }
  ]
};
