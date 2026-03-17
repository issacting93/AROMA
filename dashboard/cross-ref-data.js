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
  "ENTRIES": [
    {
      "id": "cutrona",
      "label": "Cutrona & Suhr\n1992 SSBC",
      "type": "theory",
      "section": "THEORY · SUPPORT",
      "group": "left",
      "has_taxonomy": true,
      "yr": 1992,
      "desc": "5 types: Emotional, Informational, Esteem, Network, Tangible",
      "venue": "Journal of Social and Clinical Psychology",
      "source": "Cutrona & Suhr",
      "argument_chain_layer": "support_vocabulary",
      "relationship_to_aroma": "ancestor",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "symmetric",
      "contribution": "Direct ancestor of D1. The five support types (emotional, informational, esteem, tangible, network) are inherited wholesale as AROMA's categorical vocabulary for classifying what care interactions offer.",
      "gap": "Collapses role, function, and strategy into a single support-type tier. No relational stance, no activation or boundary logic, no enactment layer.",
      "notes": {
        "D1": "SSBC is the direct ancestor of D1.",
        "D2": "Support categories, not relational roles.",
        "D3": "Implicit in category definitions but never named as core functions.",
        "D4": "No behavioural or conversational strategy layer.",
        "D5": "Built for face-to-face dyadic communication; modality not theorised."
      }
    },
    {
      "id": "house",
      "label": "House 1981\nWork Stress",
      "type": "theory",
      "section": "THEORY · SUPPORT",
      "group": "left",
      "has_taxonomy": true,
      "yr": 1981,
      "desc": "4 types: Emotional, Appraisal, Informational, Instrumental",
      "venue": "Work Stress and Social Support (Addison-Wesley)",
      "source": "House",
      "argument_chain_layer": "support_vocabulary",
      "relationship_to_aroma": "ancestor",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Adds appraisal support to the support-type vocabulary.",
      "gap": "Source-of-support is not equivalent to care role; D2-D4 entirely unaddressed.",
      "notes": {
        "D1": "D1 precursor; appraisal support useful for AI contexts.",
        "D2": "Support functions only; no role layer.",
        "D3": "Functional content described but not operationalised.",
        "D4": "",
        "D5": ""
      }
    },
    {
      "id": "cohen",
      "label": "Cohen & Wills\n1985 Buffering",
      "type": "theory",
      "section": "THEORY · MATCHING",
      "group": "left",
      "has_taxonomy": true,
      "yr": 1985,
      "desc": "Stress-buffering hypothesis: support effectiveness depends on match to stressor type",
      "venue": "Psychological Bulletin",
      "source": "Cohen & Wills",
      "argument_chain_layer": "matching_logic",
      "relationship_to_aroma": "ancestor",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "partial",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "symmetric",
      "contribution": "Buffering hypothesis establishes that support is only beneficial when matched to stressor characteristics.",
      "gap": "Provides matching logic but no mechanism for operationalising dynamic adaptation.",
      "notes": {
        "D1": "Support type matching logic is foundational.",
        "D2": "Activation conditions partially implied.",
        "D3": "Matching principle implies functional differentiation.",
        "D4": "",
        "D5": ""
      }
    },
    {
      "id": "cutrona_russell",
      "label": "Cutrona & Russell\n1990 OMM",
      "type": "theory",
      "section": "THEORY · MATCHING",
      "group": "left",
      "has_taxonomy": false,
      "yr": 1990,
      "desc": "Optimal Matching Model: support effectiveness as fit between support type, stressor controllability, and recipient coping resources",
      "venue": "Social Support: An Interactional View (Wiley)",
      "source": "Cutrona & Russell",
      "argument_chain_layer": "matching_logic",
      "relationship_to_aroma": "ancestor",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "full",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "symmetric",
      "contribution": "Operationalises matching logic into a predictive model.",
      "gap": "Model operates at relationship level, not within a single AI interaction session.",
      "notes": {
        "D1": "Support types inherited from SSBC; OMM specifies when each is appropriate.",
        "D2": "Activation conditions fully theorised.",
        "D3": "Matching implies functional differentiation but never formalises.",
        "D4": "",
        "D5": ""
      }
    },
    {
      "id": "weiss",
      "label": "Weiss 1974\nRelational Provisions",
      "type": "theory",
      "section": "THEORY · SUPPORT",
      "group": "left",
      "has_taxonomy": true,
      "yr": 1974,
      "desc": "6 provisions: Attachment, Integration, Worth, Alliance, Guidance, Nurturance",
      "venue": "Loneliness (MIT Press)",
      "source": "Weiss",
      "argument_chain_layer": "support_vocabulary",
      "relationship_to_aroma": "ancestor",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "variable",
      "contribution": "Guidance and Nurturance provisions are closest prior art to role-like distinctions.",
      "gap": "Provisions tied to long-term relationship categories, not operationalisable in AI.",
      "notes": {
        "D1": "Provisions map loosely onto support types.",
        "D2": "Guidance and nurturance suggest role-like distinctions.",
        "D3": "Each provision implies a function.",
        "D4": "",
        "D5": ""
      }
    },
    {
      "id": "parsons",
      "label": "Parsons 1951\nSick Role",
      "type": "theory",
      "section": "THEORY · OBLIGATION",
      "group": "left",
      "has_taxonomy": false,
      "yr": 1951,
      "desc": "Mutual obligations and rights in care relationships",
      "venue": "The Social System (Free Press)",
      "source": "Parsons",
      "argument_chain_layer": "obligation_structure",
      "relationship_to_aroma": "ancestor",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "full"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Provides boundary conditions for D2: care roles carry legitimate authority only within institutionally sanctioned bounds.",
      "gap": "Developed for human-institutional care; never applied to AI agents.",
      "notes": {
        "D1": "Not a support typology.",
        "D2": "Sick role theory fully specifies role identity and boundary conditions.",
        "D3": "Caregiver obligation partially implies a core function.",
        "D4": "No strategy layer.",
        "D5": "Pre-conversational theory."
      }
    },
    {
      "id": "biddle",
      "label": "Biddle 1986\nRole Theory",
      "type": "theory",
      "section": "THEORY · OBLIGATION",
      "group": "left",
      "has_taxonomy": false,
      "yr": 1986,
      "desc": "Synthesises functional, structural, cognitive, and organisational role paradigms",
      "venue": "Social Psychology Quarterly",
      "source": "Biddle",
      "argument_chain_layer": "obligation_structure",
      "relationship_to_aroma": "ancestor",
      "cover": {
        "D1": "na",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "partial",
          "boundary_conditions": "partial"
        },
        "D3": "partial",
        "D4": "partial",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Provides the theoretical vocabulary for D2.",
      "gap": "Role theory operates at societal level, not within individual interaction sessions.",
      "notes": {
        "D1": "Not a support typology.",
        "D2": "Static/dynamic role distinction directly underpins D2.",
        "D3": "Role behaviour includes function but at societal level.",
        "D4": "Role sending maps onto D4 conceptually.",
        "D5": ""
      }
    },
    {
      "id": "rogers",
      "label": "Rogers 1957\nTherapeutic Conditions",
      "type": "theory",
      "section": "THEORY · OBLIGATION",
      "group": "left",
      "has_taxonomy": false,
      "yr": 1957,
      "desc": "Empathy, Unconditional Positive Regard, Congruence as necessary and sufficient conditions",
      "venue": "Journal of Consulting Psychology",
      "source": "Rogers",
      "argument_chain_layer": "obligation_structure",
      "relationship_to_aroma": "ancestor",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "full",
        "D4": "partial",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Core therapeutic conditions are closest prior art to D3.",
      "gap": "Defines universal conditions for a single role; cannot account for multi-role landscape.",
      "notes": {
        "D1": "Not organised by support type.",
        "D2": "Implicitly defines relational stance for therapist role.",
        "D3": "Core therapeutic conditions are closest prior art to D3.",
        "D4": "Empathy and UPR imply strategies but not operationalised.",
        "D5": ""
      }
    },
    {
      "id": "feeney",
      "label": "Feeney & Collins\n2015 Thriving",
      "type": "peer",
      "section": "PEER SUPPORT · THEORY",
      "group": "left",
      "has_taxonomy": true,
      "yr": 2015,
      "desc": "SOS (stress-buffering) vs. RC (relational capitalisation) support",
      "venue": "Psychological Bulletin",
      "source": "Feeney & Collins",
      "argument_chain_layer": "matching_logic",
      "relationship_to_aroma": "ancestor",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "partial",
          "boundary_conditions": "absent"
        },
        "D3": "full",
        "D4": "partial",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "symmetric",
      "contribution": "SOS vs. RC distinction is one of the strongest D3 precursors.",
      "gap": "Two-function model never extended to multiple care roles or applied to AI.",
      "notes": {
        "D1": "Distinguishes negative-event vs. positive-growth support.",
        "D2": "Two-function model implies care should adapt to need state.",
        "D3": "SOS vs. RC is essentially a two-function typology.",
        "D4": "Responsiveness loosely resembles D4.",
        "D5": ""
      }
    },
    {
      "id": "sharma",
      "label": "Sharma et al.\n2020 Empathy",
      "type": "peer",
      "section": "PEER SUPPORT · AI",
      "group": "right",
      "has_taxonomy": true,
      "yr": 2020,
      "desc": "3 empathy mechanisms: Emotional Reaction, Interpretation, Exploration",
      "venue": "EMNLP 2020",
      "source": "Sharma et al.",
      "argument_chain_layer": "prior_taxonomy",
      "relationship_to_aroma": "prior_taxonomy",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "full",
        "D5": "na"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Empathy mechanisms are the strongest prior operationalisation of D4.",
      "gap": "Framed as NLP classification targets, not design-guiding care strategies.",
      "notes": {
        "D1": "No support type categorisation.",
        "D2": "Implicitly differentiates listener, reflective partner, and explorer roles.",
        "D3": "Mechanisms map onto core functions but not labelled as such.",
        "D4": "Most directly relevant to D4.",
        "D5": "Text-based peer support only."
      }
    },
    {
      "id": "vaidyam",
      "label": "Vaidyam et al.\n2019 Psychiatric",
      "type": "ai",
      "section": "AI · MENTAL HEALTH",
      "group": "right",
      "has_taxonomy": true,
      "yr": 2019,
      "desc": "4 clinical roles: Screener, Therapist-Adjunct, Companion, Coach",
      "venue": "Harvard Review of Psychiatry",
      "source": "Vaidyam et al.",
      "argument_chain_layer": "prior_taxonomy",
      "relationship_to_aroma": "prior_taxonomy",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Only prior work in clinical AI literature with explicitly named care roles.",
      "gap": "Roles defined by clinical purpose at system level, not relational dynamic at interaction level.",
      "notes": {
        "D1": "Each clinical role implies a dominant support type but not explicit.",
        "D2": "Closest existing taxonomy to D2.",
        "D3": "Clinical function implied per role but not formalised.",
        "D4": "No strategy layer within each role.",
        "D5": "No modality distinction."
      }
    },
    {
      "id": "gaffney",
      "label": "Gaffney et al.\n2019 CA Review",
      "type": "ai",
      "section": "AI · MENTAL HEALTH",
      "group": "right",
      "has_taxonomy": true,
      "yr": 2019,
      "desc": "4 functional types: Informational, Screening, Therapeutic, Relational",
      "venue": "JMIR Mental Health",
      "source": "Gaffney et al.",
      "argument_chain_layer": "prior_taxonomy",
      "relationship_to_aroma": "prior_taxonomy",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Empirically demonstrates the field's failure to separate support type from care role.",
      "gap": "Functional types collapse D1 and D2.",
      "notes": {
        "D1": "Functional types map closely onto D1 support types.",
        "D2": "Relational and therapeutic suggest roles but underdifferentiated.",
        "D3": "Function implicit in label.",
        "D4": "",
        "D5": ""
      }
    },
    {
      "id": "laranjo",
      "label": "Laranjo et al.\n2018 CA Healthcare",
      "type": "ai",
      "section": "AI · MENTAL HEALTH",
      "group": "right",
      "has_taxonomy": true,
      "yr": 2018,
      "desc": "Roles: Information provision, Behaviour change coaching, Symptom checking",
      "venue": "JAMIA",
      "source": "Laranjo et al.",
      "argument_chain_layer": "prior_taxonomy",
      "relationship_to_aroma": "prior_taxonomy",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Establishes behaviour change coaching as a named AI role in healthcare contexts.",
      "gap": "Health domain focus excludes emotional and relational support.",
      "notes": {
        "D1": "Informational support well-covered.",
        "D2": "Coach role named but not differentiated.",
        "D3": "Behaviour change implies a function.",
        "D4": "",
        "D5": "Voice vs. text noted but not theorised."
      }
    },
    {
      "id": "stade",
      "label": "Stade et al.\n2024 LLMs",
      "type": "ai",
      "section": "AI · MENTAL HEALTH",
      "group": "right",
      "has_taxonomy": true,
      "yr": 2024,
      "desc": "4 LLM roles: Assessor, Intervener, Coach, Companion",
      "venue": "NPJ Mental Health Research",
      "source": "Stade et al.",
      "argument_chain_layer": "prior_taxonomy",
      "relationship_to_aroma": "prior_taxonomy",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Most current named-role taxonomy for LLMs in behavioural health.",
      "gap": "Roles clinician-assigned at design time, not empirically derived.",
      "notes": {
        "D1": "Each role implies a support type but no explicit mapping.",
        "D2": "Most current named-role taxonomy for LLMs.",
        "D3": "Role labels imply distinct functions.",
        "D4": "No within-role strategy differentiation.",
        "D5": ""
      }
    },
    {
      "id": "song",
      "label": "Song & Pendse\n2025 Typing Cure",
      "type": "ai",
      "section": "AI · MENTAL HEALTH",
      "group": "right",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "User-constructed roles: listener, cognitive load offloader, rehearsal partner",
      "venue": "CHI 2025",
      "source": "Song & Pendse",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "partial",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "partial",
        "D5": "partial"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Strongest empirical motivation for AROMA.",
      "gap": "User-constructed roles identified but not systematised.",
      "notes": {
        "D1": "User-expressed support needs implicitly map onto support types.",
        "D2": "User-constructed roles are the empirical basis AROMA formalises.",
        "D3": "Therapeutic alignment concept implies functional goals.",
        "D4": "Interaction practices described qualitatively.",
        "D5": "Text-only LLM chatbots."
      }
    },
    {
      "id": "khawaja",
      "label": "Khawaja et al.\n2023 Robot Therapist",
      "type": "ai",
      "section": "AI · MENTAL HEALTH",
      "group": "right",
      "has_taxonomy": false,
      "yr": 2023,
      "desc": "Therapeutic misconception framework; role confusion as ethical problem",
      "venue": "Science and Engineering Ethics",
      "source": "Khawaja & Bélisle-Pipon",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Names role confusion as an ethical harm in AI care contexts.",
      "gap": "Normative paper only; no taxonomy offered.",
      "notes": {
        "D1": "",
        "D2": "Argues that role ambiguity is harmful — motivates D2's precision.",
        "D3": "",
        "D4": "",
        "D5": ""
      }
    },
    {
      "id": "jo",
      "label": "Jo et al.\n2023 CareCall",
      "type": "ai",
      "section": "AI · MENTAL HEALTH",
      "group": "right",
      "has_taxonomy": false,
      "yr": 2023,
      "desc": "Role ambiguity across users, teleoperators, and developers",
      "venue": "CHI 2023",
      "source": "Jo et al.",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "partial"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Empirically demonstrates role ambiguity as a multi-stakeholder deployment problem.",
      "gap": "Demonstrates the problem but offers no taxonomic solution.",
      "notes": {
        "D1": "Emotional check-in and companionship support types present.",
        "D2": "Stakeholder role expectations diverge.",
        "D3": "",
        "D4": "",
        "D5": "Voice-based phone call modality is distinctive."
      }
    },
    {
      "id": "lindgren2024",
      "label": "Lindgren et al.\n2024 Emerging Roles",
      "type": "hci",
      "section": "FRAMEWORKS & TAXONOMIES",
      "group": "context",
      "has_taxonomy": true,
      "yr": 2024,
      "desc": "Socio-technical relationship framework for AI social roles",
      "venue": "Int. J. Human-Computer Interaction",
      "source": "Lindgren et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "partial",
          "boundary_conditions": "partial"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Broad socio-technical role taxonomy situating AROMA's care roles within wider HAI landscape.",
      "gap": "Conceptual only; general AI systems scope."
    },
    {
      "id": "taylor2025",
      "label": "Taylor et al.\n2025 Terminology",
      "type": "hci",
      "section": "FRAMEWORKS & TAXONOMIES",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Scoping review of 658 papers mapping terminological evolution",
      "venue": "Int. J. Human-Computer Interaction",
      "source": "Taylor & Francis",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Documents terminological instability in HAI relationships.",
      "gap": "Terminology-focused; does not assess actual interaction dynamics."
    },
    {
      "id": "dellermann2019",
      "label": "Dellermann et al.\n2019 Hybrid Intelligence",
      "type": "hci",
      "section": "FRAMEWORKS & TAXONOMIES",
      "group": "context",
      "has_taxonomy": true,
      "yr": 2019,
      "desc": "Taxonomy of design knowledge for hybrid intelligence",
      "venue": "HICSS",
      "source": "Dellermann et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "partial",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Demonstrates multi-dimensional taxonomies for HAI are feasible.",
      "gap": "Business-focused; no care or support context."
    },
    {
      "id": "gomez2024",
      "label": "Gomez et al.\n2024 Interaction Patterns",
      "type": "hci",
      "section": "FRAMEWORKS & TAXONOMIES",
      "group": "context",
      "has_taxonomy": true,
      "yr": 2024,
      "desc": "Systematic review of interaction patterns in AI-assisted decision making",
      "venue": "Frontiers in Computer Science",
      "source": "Gomez et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Evidence that most HAI collaboration remains unidirectional and fixed-role.",
      "gap": "Decision support framing; no care analysis."
    },
    {
      "id": "frontiers2025creative",
      "label": "Frontiers 2025\nAI Creative Partner",
      "type": "hci",
      "section": "FRAMEWORKS & TAXONOMIES",
      "group": "context",
      "has_taxonomy": true,
      "yr": 2025,
      "desc": "PRISMA review identifying 5 AI roles in supporting creativity",
      "venue": "Frontiers in Education",
      "source": "Frontiers",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "variable",
      "contribution": "Shows role-based frameworks are useful across AI domains.",
      "gap": "Education/creativity focus; roles fixed."
    },
    {
      "id": "knight2025autonomy",
      "label": "Knight Institute 2025\nLevels of Autonomy",
      "type": "hci",
      "section": "FRAMEWORKS & TAXONOMIES",
      "group": "context",
      "has_taxonomy": true,
      "yr": 2025,
      "desc": "5-level AI agent autonomy framework",
      "venue": "Knight First Amendment Institute / Columbia",
      "source": "Knight Institute",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Autonomy-level framing useful for understanding the Authority-Agency Paradox.",
      "gap": "No empirical validation; doesn't address user perception."
    },
    {
      "id": "khadpe2020",
      "label": "Khadpe et al.\n2020 Metaphors",
      "type": "hci",
      "section": "METAPHOR & ROLE PERCEPTION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2020,
      "desc": "Conceptual metaphors shape expectations and adoption",
      "venue": "CSCW 2020",
      "source": "Khadpe et al.",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "variable",
      "contribution": "Empirically demonstrates that role metaphors have measurable consequences.",
      "gap": "Metaphors set externally; no user agency."
    },
    {
      "id": "zhang2023tools",
      "label": "Zhang & Rau\n2023 Tools or Peers",
      "type": "hci",
      "section": "METAPHOR & ROLE PERCEPTION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2023,
      "desc": "2x2 experiment: anthropomorphism × social role on emotional attachment",
      "venue": "Computers in Human Behavior",
      "source": "Zhang & Rau",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Social role assignment has measurable effects on emotional attachment.",
      "gap": "Smart home context; single session."
    },
    {
      "id": "elsevier2025friend",
      "label": "Elsevier 2025\nAssistant or Friend",
      "type": "hci",
      "section": "METAPHOR & ROLE PERCEPTION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Assistant vs. friend parasocial types affect perceived competence and warmth",
      "venue": "Computers in Human Behavior",
      "source": "Elsevier",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Parasocial role framing produces distinct perceptions.",
      "gap": "Marketing framing; parasocial only."
    },
    {
      "id": "arxiv2025walkthrough",
      "label": "arXiv 2025\nAnthropomorphic Walkthrough",
      "type": "hci",
      "section": "METAPHOR & ROLE PERCEPTION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Catalogues anthropomorphic expressions in LLM chatbots",
      "venue": "arXiv",
      "source": "arXiv",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Documents emergent anthropomorphic role behaviour across four major LLMs.",
      "gap": "Researcher-driven prompts; no user study."
    },
    {
      "id": "pnas2025dangers",
      "label": "PNAS 2025\nAnthropomorphic Dangers",
      "type": "hci",
      "section": "METAPHOR & ROLE PERCEPTION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "LLMs as anthropomorphic agents",
      "venue": "PNAS",
      "source": "PNAS",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Theoretical grounding for the Authority-Agency Paradox mechanism.",
      "gap": "No empirical data; no design mitigations."
    },
    {
      "id": "lawton2023",
      "label": "Lawton et al.\n2023 Tool vs Agent",
      "type": "hci",
      "section": "METAPHOR & ROLE PERCEPTION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2023,
      "desc": "When users perceive AI as tool vs. having agency",
      "venue": "DIS 2023",
      "source": "Lawton et al., ACM",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Tool vs. agent perception shifts dynamically mid-interaction.",
      "gap": "Drawing-specific; no care context."
    },
    {
      "id": "arxiv2025multiagent",
      "label": "arXiv 2025\nMulti-Agent Mental Models",
      "type": "hci",
      "section": "METAPHOR & ROLE PERCEPTION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Metaphors early adopters use for multi-agent AI",
      "venue": "arXiv",
      "source": "arXiv",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "partial",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Users spontaneously construct role metaphors for AI agents.",
      "gap": "Small sample of technical early adopters."
    },
    {
      "id": "zhang2025dark",
      "label": "Zhang et al.\nCHI 2025 Dark Side",
      "type": "ai",
      "section": "COMPANIONSHIP & SOCIAL-EMOTIONAL",
      "group": "context",
      "has_taxonomy": true,
      "yr": 2025,
      "desc": "Taxonomy of AI companion harms from 35K Replika excerpts",
      "venue": "CHI 2025",
      "source": "Zhang, Li, Meng et al.",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Large-scale empirical evidence of harms when AI companion roles are undefined.",
      "gap": "Reddit data; Replika-specific."
    },
    {
      "id": "nature2025socioaffective",
      "label": "Nature 2025\nSocioaffective Alignment",
      "type": "ai",
      "section": "COMPANIONSHIP & SOCIAL-EMOTIONAL",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Argues for socioaffective alignment in AI user ecosystem",
      "venue": "Nature Humanities & Social Sciences Comms",
      "source": "Nature",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Supports AROMA's argument that care role design must be responsive.",
      "gap": "No empirical data; no operational mechanism."
    },
    {
      "id": "hwang2025",
      "label": "Hwang et al.\n2025 Companionship Dev",
      "type": "ai",
      "section": "COMPANIONSHIP & SOCIAL-EMOTIONAL",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Longitudinal study mapping pathway to parasocial experiences",
      "venue": "arXiv",
      "source": "Hwang et al.",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Longitudinal evidence that parasocial attachment develops within weeks.",
      "gap": "3-week timeframe; generic chatbot."
    },
    {
      "id": "pmc2025emulate",
      "label": "PMC 2025\nEmulate Human Connection",
      "type": "ai",
      "section": "COMPANIONSHIP & SOCIAL-EMOTIONAL",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Whether AI chatbots provide experiences analogous to human companionship",
      "venue": "PMC / Psychological Science",
      "source": "PMC",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "AI cannot genuinely reciprocate in companionship relationships.",
      "gap": "No original empirical data; Replika-focused."
    },
    {
      "id": "nature2025fastfood",
      "label": "Nature 2025\nEmotional Fast Food",
      "type": "ai",
      "section": "COMPANIONSHIP & SOCIAL-EMOTIONAL",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "AI chatbots as emotional fast food",
      "venue": "Nature Humanities & Social Sciences Comms",
      "source": "Nature",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Frames AI care as structurally asymmetric.",
      "gap": "No empirical data; speculative."
    },
    {
      "id": "springer2025sel",
      "label": "Springer 2025\nAI Companions SEL",
      "type": "ai",
      "section": "COMPANIONSHIP & SOCIAL-EMOTIONAL",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Survey of 1,006 learners on AI companion support",
      "venue": "AI & Society (Springer)",
      "source": "Springer",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Large-scale evidence of positive socio-emotional outcomes.",
      "gap": "Retrospective self-report; no control group."
    },
    {
      "id": "aaai2024code",
      "label": "AAAI 2024\nCode That Binds Us",
      "type": "ai",
      "section": "COMPANIONSHIP & SOCIAL-EMOTIONAL",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "Ethical boundaries of human-AI assistant relationships",
      "venue": "AAAI/ACM AIES 2024",
      "source": "AAAI/ACM",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "full"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Bioethics framework complements AROMA's D2 boundary conditions.",
      "gap": "No empirical data; Western bioethics framing."
    },
    {
      "id": "schmutz2024",
      "label": "Schmutz et al.\n2024 AI-Teaming",
      "type": "hci",
      "section": "TEAMING, DELEGATION & AUTONOMY",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "HACO framework for role-supportive system development",
      "venue": "Current Opinion in Psychology",
      "source": "Schmutz et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "HACO framework demonstrates role evolution is a designable property.",
      "gap": "Primarily conceptual; workplace context."
    },
    {
      "id": "zhang2021ideal",
      "label": "Zhang et al.\n2021 Ideal Teammate",
      "type": "hci",
      "section": "TEAMING, DELEGATION & AUTONOMY",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2021,
      "desc": "People expect AI teammates to mirror idealised human qualities",
      "venue": "CSCW 2021",
      "source": "Zhang, McNeese, Freeman & Musick",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "static",
      "power_asymmetry": "symmetric",
      "contribution": "Users project idealised human role expectations onto AI.",
      "gap": "Expectation-focused; teaming not care context."
    },
    {
      "id": "kim2024hri",
      "label": "Kim et al.\nHRI 2024 Autonomy",
      "type": "hci",
      "section": "CROSS-AGENT COMPARISONS",
      "group": "context",
      "has_taxonomy": true,
      "yr": 2024,
      "desc": "Taxonomy of robot autonomy levels for HRI",
      "venue": "HRI 2024",
      "source": "Kim, Anthis & Sebo, ACM/IEEE",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Robot autonomy taxonomy demonstrates multi-level role frameworks are practical.",
      "gap": "Robot-specific; not validated for conversational AI."
    },
    {
      "id": "adam2024delegation",
      "label": "Adam et al.\n2024 Delegation",
      "type": "hci",
      "section": "TEAMING, DELEGATION & AUTONOMY",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "User acceptance of user-invoked vs. IS-invoked task delegation to AI",
      "venue": "Decision Support Systems",
      "source": "Adam et al., Elsevier",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Self-threat and perceived control findings loosely relevant to AROMA.",
      "gap": "Task delegation not care relationship context."
    },
    {
      "id": "ma2025deliberation",
      "label": "Ma et al.\nCHI 2025 Deliberation",
      "type": "hci",
      "section": "TEAMING, DELEGATION & AUTONOMY",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Deliberative AI enabling dimension-level opinion exchange",
      "venue": "CHI 2025",
      "source": "Ma et al., ACM",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "partial",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "symmetric",
      "contribution": "Structured dialogue design supports AROMA's D4/D5 distinction.",
      "gap": "Decision-making not care context."
    },
    {
      "id": "lai2022conditional",
      "label": "Lai et al.\nCHI 2022 Conditional",
      "type": "hci",
      "section": "TEAMING, DELEGATION & AUTONOMY",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2022,
      "desc": "Conditional delegation framework for AI",
      "venue": "CHI 2022",
      "source": "Lai et al., ACM",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "partial",
          "boundary_conditions": "partial"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Conditional delegation is a structural analogue to AROMA's role-switching.",
      "gap": "Content moderation not care context."
    },
    {
      "id": "zheng2023competent",
      "label": "Zheng et al.\nCHI 2023 Rigid",
      "type": "hci",
      "section": "TEAMING, DELEGATION & AUTONOMY",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2023,
      "desc": "AI competence but inflexibility limits equal participation",
      "venue": "CHI 2023",
      "source": "Zheng et al., ACM",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Static AI role behaviour limits collaborative quality.",
      "gap": "Group decision-making not care context."
    },
    {
      "id": "acm2025ideabalance",
      "label": "ACM CHI EA 2025\nIdea Balance",
      "type": "hci",
      "section": "TEAMING, DELEGATION & AUTONOMY",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Balancing human control and AI autonomy",
      "venue": "CHI EA 2025",
      "source": "ACM",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Agency-autonomy balance distantly relevant.",
      "gap": "Extended abstract; ideation-specific."
    },
    {
      "id": "biermann2022",
      "label": "Biermann et al.\nDIS 2022 Companion",
      "type": "hci",
      "section": "CREATIVE & WRITING COLLABORATION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2022,
      "desc": "Design workbook study with 20 writers",
      "venue": "DIS 2022",
      "source": "Biermann, Ma & Yoon",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "User desire to control role boundaries supports AROMA's argument.",
      "gap": "Hypothetical designs; creative writing not care context."
    },
    {
      "id": "arxiv2025prompt",
      "label": "arXiv 2025\nFrom Pen to Prompt",
      "type": "hci",
      "section": "CREATIVE & WRITING COLLABORATION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Interviews with 18 creative writers integrating LLMs",
      "venue": "arXiv",
      "source": "arXiv",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "partial",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Users assign different roles across workflow phases.",
      "gap": "Creative writing not care context."
    },
    {
      "id": "chi2024teams",
      "label": "CHI 2024\nTeams Embrace AI",
      "type": "hci",
      "section": "CREATIVE & WRITING COLLABORATION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "Pairs of designers use GenAI for stage design",
      "venue": "CHI 2024",
      "source": "ACM",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "partial",
        "D5": "absent"
      },
      "who_defines_role": "emergent",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Role perception emerges during interaction regardless of design intent.",
      "gap": "Creative design not care context."
    },
    {
      "id": "elsevier2025student",
      "label": "Elsevier 2025\nStudent-AI Agency",
      "type": "hci",
      "section": "CREATIVE & WRITING COLLABORATION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Human agency before/during AI collaboration improves outcomes",
      "venue": "Computers & Education",
      "source": "Elsevier",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Human agency preservation improves outcomes.",
      "gap": "Educational creativity; no care relevance."
    },
    {
      "id": "frontiers2025haicdp",
      "label": "Frontiers 2025\nHAI-CDP Model",
      "type": "hci",
      "section": "CREATIVE & WRITING COLLABORATION",
      "group": "context",
      "has_taxonomy": true,
      "yr": 2025,
      "desc": "HAI-CDP model: novices vs experts benefit from different AI roles",
      "venue": "Frontiers in Computer Science",
      "source": "Frontiers",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "full",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Strongest prior operationalisation of D2 activation conditions outside AROMA.",
      "gap": "Single design task; creative design not care context."
    },
    {
      "id": "wieland2022brainstorm",
      "label": "Wieland et al.\n2022 Brainstorming",
      "type": "hci",
      "section": "CREATIVE & WRITING COLLABORATION",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2022,
      "desc": "More diverse ideas when brainstorming with chatbot",
      "venue": "Frontiers in AI",
      "source": "Wieland et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "system-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "symmetric",
      "contribution": "Role framing produces measurably different outcomes.",
      "gap": "Single session; brainstorming not care context."
    },
    {
      "id": "frontiers2024coaching",
      "label": "Frontiers 2024\nAI vs Human Coach",
      "type": "ai",
      "section": "COACH, TUTOR & THERAPEUTIC",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "RCT comparing AI coach avatar vs. human coach",
      "venue": "Frontiers in Psychology",
      "source": "Frontiers",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "partial",
        "D4": "partial",
        "D5": "absent"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Working Alliance Inventory provides validated instrument for care relationships.",
      "gap": "Single session; coach role only."
    },
    {
      "id": "dang2025kai",
      "label": "Dang et al.\n2025 MR Learning",
      "type": "ai",
      "section": "COACH, TUTOR & THERAPEUTIC",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "KAI system in mixed reality using Socratic teaching",
      "venue": "British J. of Educational Technology",
      "source": "Dang, Nguyen & Järvelä",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "full",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Socratic dialogue as D4 strategy shows strategy design affects outcomes.",
      "gap": "MR-specific; education not mental health."
    },
    {
      "id": "chatterji2025",
      "label": "Chatterji et al.\n2025 ChatGPT Usage",
      "type": "ai",
      "section": "CONVERSATION CORPORA",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Large-scale ChatGPT usage pattern analysis",
      "venue": "NBER Working Paper",
      "source": "Chatterji et al., NBER/OpenAI",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Large-scale usage data contextualises AROMA's focus.",
      "gap": "Task-based taxonomy not role-based."
    },
    {
      "id": "arxiv2024intent",
      "label": "arXiv 2024\nIntent Recognition",
      "type": "ai",
      "section": "CONVERSATION CORPORA",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "Fine-grained user intent taxonomy",
      "venue": "arXiv",
      "source": "arXiv",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "partial",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "partial",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "User intent as a proxy for activation conditions.",
      "gap": "Intent-focused not role-focused."
    },
    {
      "id": "zheng2024lmsys",
      "label": "Zheng et al.\nICLR 2024 LMSYS",
      "type": "ai",
      "section": "CONVERSATION CORPORA",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "1M real-world conversations with 25 LLMs",
      "venue": "ICLR 2024",
      "source": "Zheng et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Large-scale conversation dataset.",
      "gap": "No role or relationship annotation."
    },
    {
      "id": "zhao2024wildchat",
      "label": "Zhao et al.\n2024 WildChat",
      "type": "ai",
      "section": "CONVERSATION CORPORA",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "1M+ ChatGPT conversations with demographic metadata",
      "venue": "arXiv / NeurIPS",
      "source": "Zhao et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Demographically annotated multilingual corpus.",
      "gap": "No role annotations."
    },
    {
      "id": "yan2026sharechat",
      "label": "Yan & Nguyen\n2026 ShareChat",
      "type": "ai",
      "section": "CONVERSATION CORPORA",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2026,
      "desc": "Multi-platform dataset with extended conversations",
      "venue": "arXiv",
      "source": "Yan & Nguyen",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "absent"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "asymmetric",
      "contribution": "Multi-platform corpus.",
      "gap": "No role/relationship annotations."
    },
    {
      "id": "frontiers2025robots",
      "label": "Frontiers 2025\nRobots to Chatbots",
      "type": "hci",
      "section": "CROSS-AGENT COMPARISONS",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Review of robots, avatars, and chatbots influencing social processes",
      "venue": "Frontiers in Psychology",
      "source": "Frontiers",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "absent",
        "D2": {
          "role_identity": "full",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "variable",
      "contribution": "Cross-agent review provides context for AROMA's verbal scope.",
      "gap": "Neuroscience findings mostly from robots."
    },
    {
      "id": "savic2024companions",
      "label": "Savic 2024\nArtificial Companions",
      "type": "hci",
      "section": "PARADOX · PSEUDO-INTIMACY",
      "group": "paradox",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "Ethics of Care analysis of Replika: AI companions as commodified pseudo-intimacy",
      "venue": "M/C Journal",
      "source": "Savic",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Applies Ethics of Care to AI companions, naming 'Artificial Companion' as a distinct care role with pseudo-intimate affordances. Motivates the boundary condition problem in AROMA D2.",
      "gap": "No taxonomy of roles or functions; Ethics of Care framing doesn't distinguish activation/boundary conditions. Replika-specific, not generalisable.",
      "notes": {
        "D1": "Emotional support implicit; no structured support-type vocabulary.",
        "D2": "Names 'companion' but doesn't distinguish from friend, therapist, or screener.",
        "D3": "No core function layer—companionship is end-state not function.",
        "D4": "No strategy layer; relational stance is design-default not deliberate.",
        "D5": "Text chat assumed; modality is not theorized."
      }
    },
    {
      "id": "xu2025dta",
      "label": "Xu et al. 2025\nDigital Therapeutic Alliance",
      "type": "empirical",
      "section": "PARADOX · ROLE-ALIGNMENT",
      "group": "paradox",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "4-week diary study on bond formation with Woebot/Wysa; 6 themes mediate DTA",
      "venue": "JMIR Mental Health",
      "source": "Xu et al.",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "full",
          "boundary_conditions": "partial"
        },
        "D3": "partial",
        "D4": "partial",
        "D5": "partial"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "dynamic",
      "power_asymmetry": "variable",
      "contribution": "Empirically identifies that users who want 'to be led' fail to bond when the chatbot is passive — a direct empirical instance of the Authority-Agency Paradox. The six DTA themes (desire to lead/be led, alignment, expectations, perceived effectiveness, colloquial communication, privacy) map cleanly to D2 activation conditions.",
      "gap": "Does not propose a role taxonomy. Chatbot role (Nurturer vs. Coach vs. Guide) is conflated. No boundary condition framework.",
      "notes": {
        "D1": "Emotional and relational support studied, not formally categorised.",
        "D2": "Identifies 'to be led' preference but doesn't name the role that 'leads'.",
        "D3": "Alliance formation as outcome—not as named function.",
        "D4": "Strategy implied (colloquial, context-aware) but not theorised.",
        "D5": "Woebot/Wysa text chatbots; modality treated as background."
      }
    },
    {
      "id": "babu2025pseudointimacy",
      "label": "Babu et al. 2025\nPseudo-Intimacy",
      "type": "theory",
      "section": "PARADOX · PSEUDO-INTIMACY",
      "group": "paradox",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Coins 'Pseudo-Intimacy' & 'Emotional Solipsism' as failure modes of Emotional AI; 3-risk framework",
      "venue": "Frontiers in Psychology",
      "source": "Jobi Babu et al.",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "full"
        },
        "D3": "absent",
        "D4": "absent",
        "D5": "partial"
      },
      "who_defines_role": "researcher-assigned",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Provides the conceptual vocabulary for AROMA's paradox: pseudo-intimacy (simulated reciprocity) and emotional solipsism (closed feedback loop without rupture-repair). The 3-risk framework (psychological, structural, ethical) maps directly to AROMA's boundary condition logic for D2.",
      "gap": "No role taxonomy; no function or strategy layer. The AI is treated as a monolithic 'companion' without distinguishing sub-roles. Boundary conditions proposed but not operationalized.",
      "notes": {
        "D1": "Emotional support assumed; no differentiation among support types.",
        "D2": "Identifies 'companion' and 'pseudo-intimate partner' but lacks taxonomy.",
        "D3": "No function layer—care is relational stance, not operationalized function.",
        "D4": "Critiques 'algorithmic affection' strategy but doesn't name alternatives.",
        "D5": "Chat-based platforms (Replika, Xiaoice) assumed; not theorised."
      }
    },
    {
      "id": "gabriel2024canairelate",
      "label": "Gabriel et al. 2024\nCan AI Relate",
      "type": "empirical",
      "section": "PARADOX · RELIABILITY",
      "group": "paradox",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "Evaluates GPT-4 as mental health responder against trained peer counselors; finds demographic bias",
      "venue": "EMNLP 2024",
      "source": "Gabriel et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "full",
        "D4": "full",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Strongest empirical evidence for the Reliability Paradox: LLMs match human peer-responders on empathy metrics but fail on equity (Black posters receive 2-13% lower empathy). Demonstrates that D3 function (crisis response) and D4 strategy (Motivational Interviewing) can be coded and measured. Proposes safety guidelines for deployment.",
      "gap": "Evaluates a single role (peer responder) without a role taxonomy. The role is assumed, not derived. Doesn't address activation/boundary conditions for when the AI should escalate.",
      "notes": {
        "D1": "Crisis support studied; emotional/safety support conflated.",
        "D2": "Peer-responder role assumed; no formal role framework.",
        "D3": "Crisis triage as core function—strongest D3 evidence in corpus.",
        "D4": "MI adherence measured—strongest D4 grounding in corpus.",
        "D5": "GPT-4 text; modality not varied."
      }
    },
    {
      "id": "chin2025empathetic",
      "label": "Chin et al. 2025\nChatbot Empathy",
      "type": "empirical",
      "section": "STRATEGY · D4",
      "group": "strategy",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Qualitative analysis of 8 commercial chatbots responding to depression queries; codes empathy & active listening",
      "venue": "JMIR Formative Research",
      "source": "Chin et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "full",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Provides empirical grounding for D4 (strategy layer): codes chatbot responses into 8 therapeutic communication styles including empathy, active listening, and open-ended questioning. Baseline comparison: Replika 75%+ empathetic; Alexa/Siri primarily informational. Directly evidences D4/D1 gap (strategy types vs support types).",
      "gap": "No role taxonomy — all 8 chatbots are implicitly compared as if they have the same role. Coding scheme is strategy-only; no care-role or function layer.",
      "notes": {
        "D1": "Help-seeking query types coded (support type from user side).",
        "D2": "Role not differentiated across 8 chatbots — key gap.",
        "D3": "No function layer; chatbot responses not mapped to goals.",
        "D4": "8-category strategy coding scheme is strongest D4 empirical grounding in corpus.",
        "D5": "Voice vs text chatbot comparison is partial D5 evidence."
      }
    },
    {
      "id": "karveetal2025mi",
      "label": "Karve et al. 2025\nAI Motivational Interviewing",
      "type": "review",
      "section": "STRATEGY · D4",
      "group": "strategy",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Scoping review of 15 AI systems delivering MI; 60% rule-based, 27% LLM; limited behavioral outcomes",
      "venue": "JMIR",
      "source": "Karve et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "full",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Systematic evidence that AI can deliver MI with moderate fidelity (40% studies assessed fidelity; moderate-high alignment). Establishes that D4 (MI specifically) is technically feasible but undersupported in terms of role clarity — users perceive AI as 'judgment free' but 'lacking empathy'. Gaps in safety, equity, and emotional nuance directly motivate AROMA.",
      "gap": "Treats the AI agent's role as an undifferentiated 'counselor'. No role taxonomy; no consideration of which role type is executing MI. No activation/boundary framework.",
      "notes": {
        "D1": "Health behavior change as support type — peripheral to mental health core.",
        "D2": "Role is implicit 'MI practitioner' — not theorised or named.",
        "D3": "Behavior change as outcome; no intermediate function layer.",
        "D4": "MI implementation is primary focus — richest D4 evidence in review literature.",
        "D5": "Rule-based vs LLM vs mobile agent — partial D5 evidence."
      }
    },
    {
      "id": "babu2025dependency",
      "label": "Babu & Joseph 2025\nDigital Dependency",
      "type": "empirical",
      "section": "PARADOX · DEPENDENCY",
      "group": "paradox",
      "has_taxonomy": false,
      "yr": 2025,
      "desc": "Critical review of mental health apps: gamification fosters dependency over genuine therapeutic benefit",
      "venue": "Frontiers in Psychiatry",
      "source": "Babu & Joseph",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "full"
        },
        "D3": "partial",
        "D4": "absent",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Demonstrates that engagement-optimization (streaks, gamification) creates structural dependency rather than therapeutic progress — a specific mechanism of the Authority-Agency Paradox where the AI's design agency overrides its therapeutic authority. Boundary condition evidence: stepped-care and hybrid models mitigate this.",
      "gap": "Focus on app design harms, not role taxonomy. No D2 framework; care roles are undifferentiated. Oversight/escalation referenced but no formal model.",
      "notes": {
        "D1": "Emotional/anxiety support implicit; over-reliance highlighted.",
        "D2": "Roles conflated: Woebot and Calm treated as equivalent 'chatbots'.",
        "D3": "Referral/escalation mentioned as solution but not operationalized.",
        "D4": "CBT strategies critiqued as reductionist; no taxonomy.",
        "D5": "Mobile apps focus; modality constraints on therapeutic depth noted."
      }
    },
    {
      "id": "wang2024pst",
      "label": "Wang et al. 2024\nLLM-PST Caregivers",
      "type": "empirical",
      "section": "STRATEGY · D4",
      "group": "strategy",
      "has_taxonomy": false,
      "yr": 2024,
      "desc": "LLM delivering Problem-Solving Therapy with Few-Shot/RAG for family caregivers; evaluates empathy and therapeutic alliance",
      "venue": "AMIA 2024",
      "source": "Wang et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "partial",
        "D2": {
          "role_identity": "partial",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "partial",
        "D4": "full",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Shows that PST + MI + BCA as a combined D4 strategy cluster can be delivered by LLMs with Few-Shot prompting. Clinician-curated RAG examples improve therapeutic alliance ratings. Demonstrates that structured D4 multi-strategy delivery is technically feasible but remains role-agnostic.",
      "gap": "No role framework — the AI is an undifferentiated 'LLM-powered conversational agent'. D3 (function) not named. Strategy-role disconnect is pronounced.",
      "notes": {
        "D1": "Caregiver mental health support (emotional + practical).",
        "D2": "Role not specified — 'LLM agent' conflates Coach, Therapist, and Nurturer.",
        "D3": "PST delivery as core function — implicit D3 evidence.",
        "D4": "PST+MI+BCA trifecta is strongest multi-strategy D4 study in corpus.",
        "D5": "Text LLM; no modality variation studied."
      }
    },
    {
      "id": "chin2023cultures",
      "label": "Chin et al. 2023\nChatbots Cultures",
      "type": "empirical",
      "section": "MODALITY · D5",
      "group": "context",
      "has_taxonomy": false,
      "yr": 2023,
      "desc": "152k utterances across 8 countries; cross-cultural differences in how users disclose depression to chatbots",
      "venue": "JMIR",
      "source": "Chin et al.",
      "argument_chain_layer": "empirical_context",
      "relationship_to_aroma": "comparator",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "absent"
        },
        "D3": "absent",
        "D4": "partial",
        "D5": "partial"
      },
      "who_defines_role": "user-driven",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Largest real-world dataset in corpus (152k utterances). Demonstrates that D1 support type varies by culture (Eastern users express stronger negative emotion; Western users disclose more sensitive topics). Users treat chatbots as a distinct disclosure venue compared to social media — 49.8% vs 7.5% emotional vulnerability. Motivates D5 (modality affordances) analysis.",
      "gap": "Chatbot role undifferentiated (SimSimi as social chatbot acts as proxy for all mental health chatbots). No role taxonomy; no function or strategy coding.",
      "notes": {
        "D1": "Support type studied as help-seeking motivation — richest D1 real-world evidence.",
        "D2": "ChatBot role not named or differentiated across the corpus.",
        "D3": "Active listening as implicit function — not operationalized.",
        "D4": "Active listening, open-ended questions labeled but not tied to roles.",
        "D5": "Text chat (SimSimi); cultural contrast provides partial D5 context."
      }
    },
    {
      "id": "kaur2026chatbots",
      "label": "Kaur et al. 2026\nToo Good to Be True",
      "type": "review",
      "section": "PARADOX · RELIABILITY",
      "group": "paradox",
      "has_taxonomy": false,
      "yr": 2026,
      "desc": "Clinical review of AI chatbots for depression/anxiety: short-term gains, long-term evidence gap, crisis safety concerns",
      "venue": "Baylor University Medical Center Proceedings",
      "source": "Kaur et al.",
      "argument_chain_layer": "paradox_motivation",
      "relationship_to_aroma": "motivation",
      "cover": {
        "D1": "full",
        "D2": {
          "role_identity": "absent",
          "activation_conditions": "absent",
          "boundary_conditions": "partial"
        },
        "D3": "partial",
        "D4": "partial",
        "D5": "partial"
      },
      "who_defines_role": "system-designed",
      "static_or_dynamic": "static",
      "power_asymmetry": "asymmetric",
      "contribution": "Clinical meta-analytic framing: AI chatbots show short-term RCT gains (anxiety/depression) but fail on crisis interpretation, long-term evidence, and 'genuine empathy'. Directly states that chatbots 'cannot replace professional care'. Boundary condition articulation: crisis escalation as the key D3 function where AI authority fails.",
      "gap": "Treats all chatbots as equivalent; no role taxonomy. Boundary conditions (crisis, long-term) identified but not operationally defined. Strategy-role-function layers not differentiated.",
      "notes": {
        "D1": "Depression and anxiety support as primary D1 focus.",
        "D2": "No role taxonomy — all chatbots treated as 'AI chatbot' class.",
        "D3": "Crisis interpretation failure = key D3 boundary — strongest clinical articulation.",
        "D4": "CBT, mood tracking, check-ins mentioned as strategies but not linked to roles.",
        "D5": "Woebot, Wysa, Tess; modality is text; not theorised."
      }
    }
  ]
};
