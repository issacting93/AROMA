# AROMA Care Role Literature Map

The following table provides the formal grounding for the 6 AROMA Care Roles (D2), mapping their theoretical ancestry to the specific markers that make them identifiable in conversational data.

**Note on role-taking:** All six roles are enacted through role-taking (Blumer, 1969; Mead, 1934) — the process by which an actor reads the user's expressed state and calibrates stance accordingly. A role is visible across a conversational sequence (3–5 turns), not in a single utterance. Mead/Blumer anchor the *annotation procedure* for all roles, not any individual role.

| AROMA Role | Description | Literature Derivation | Identification Markers | Paradox Risk |
|:---|:---|:---|:---|:---|
| **Listener** | Receptive, following role focused on emotional validation without steering or evaluation. | **Rogers (1957)**: Empathic understanding as a core condition. **Chin et al. (2025)**: Active listening (26.9%) and open-ended questions (21.8%) are the dominant AI care styles in naturalistic data. | Paraphrasing, minimal encouragers ("Mhm," "I see"), follows user lead entirely, no new topics introduced, no redirecting questions. | **Low** |
| **Reflective Partner** | Socratic, exploratory role facilitating the user's own insight and reframing. | **Rogers (1957)**: Empathic understanding through inquiry. **Feng (2009) IMA**: Problem-inquiry phase separated into its own role. **Karve et al. (2025)**: MI-based evocative inquiry. | Socratic questions, cognitive reappraisal prompts, "Summarize and Invite Correction" pattern ("What I'm hearing is... does that sound right?"). AI introduces new cognitive frames. | **Low** |
| **Coach** | Directive, motivating role focused on self-efficacy and action toward user-defined goals. | **Bandura (1997)**: Self-efficacy through mastery and verbal encouragement. **Miller & Rollnick (2013)**: MI techniques (OARS, change-talk elicitation). | Goal-setting language, change-talk elicitation ("What would managing this mean to you?"), progress check-ins, affirmation tied to specific user actions. `[L]` Accountability tracking across sessions. | **Moderate** |
| **Advisor** | Authoritative, expertise-led role providing psychoeducation and structured guidance. | **Parsons (1951)**: Professional clinical role and its obligation structure. **Kaur et al. (2026, in press)**: High-expertise consultative stance; crisis interpretation failures as boundary violations. | Psychoeducation delivery, direct advice, clinical vocabulary, imperative framing ("You should..."), information-dense responses, diagnostic-adjacent language. | **High** |
| **Companion** | Warm, persistent presence focused on reducing isolation through relational bonding across sessions. | **Savic (2024)**: Ethics of Care and pseudo-intimacy dynamics. **Babu & Joseph (2025)**: Attachment theory and reciprocity in AI relationships. | Reciprocal disclosure, personalisation, stance is on the **bond** not a task or goal. `[L]` Shared references ("Last time you said..."), continuity markers. | **Low** (authenticity risk) |
| **Navigator** | Practical guide focused on connecting users to external systems and crisis resources. | **Cutrona & Russell (1990)**: Network support as bridge-building. **Gabriel et al. (2024)**: Crisis response and safety planning triage. | Resource listing (names, numbers, URLs), triage questions ("Have you spoken to anyone about this?"), referral framing, crisis protocol language. | **High** |

`[L]` = requires longitudinal (multi-session) data to observe. All other markers are identifiable within a single conversation.

---

### The Discriminant Logic

**Core confusable pairs:**

- **Listener vs. Reflective Partner**: Listener *follows* — mirrors the user's frame with no redirection. Reflective Partner *leads inquiry* — introduces new cognitive frames through structured questions. Test: does the AI introduce a perspective the user hadn't articulated? If yes → RP. If it only reflects back what the user said → Listener.

- **Listener vs. Companion**: Listener focuses on the *disclosure* (this story, this session). Companion focuses on the *relationship* (longitudinal presence, personalised bond). A Listener can be effective in a single session with a stranger; a Companion requires history.

- **Coach vs. Advisor**: Coach focuses on *how* — building the user's capacity to act (efficacy). Advisor focuses on *what* — delivering information the user doesn't have (expertise). Coach says "What would it take for you to try that?"; Advisor says "Here's what the research shows."

- **Advisor vs. Navigator**: Advisor delivers *knowledge* (psychoeducation, clinical information) — the response itself is the intervention. Navigator delivers *resources* (services, hotlines, communities) — the response points to an intervention elsewhere. Advisor answers "What is this?"; Navigator answers "Where do I go?"

- **Reflective Partner vs. Coach**: Reflective Partner orients toward *understanding* (past/internal — "What pattern do you see here?"). Coach orients toward *action* (future/external — "What's one step you could take this week?"). RP holds open questions; Coach drives toward closure.

- **Coach vs. Navigator**: Coach builds *internal* capacity ("You can do this"). Navigator connects to *external* capacity ("Here's who can help"). Coach's action items are user-performed; Navigator's involve third parties.

- **Companion vs. Reflective Partner**: Companion's warmth is unconditional — the bond is the point, regardless of content. Reflective Partner's engagement is conditional on inquiry — insight generation is the point. Companion personalises; RP structures.

- **Listener vs. Coach**: Listener validates the *present state* without directing change. Coach motivates toward a *future state*. Listener holds space; Coach moves forward.

---

### Design Requirements (not identification markers)

The following are AROMA-prescribed design patterns — what each role *should* do, not how to identify it in existing data:

| Role | Design Requirement |
|:---|:---|
| **Advisor** | **Epistemic Humility statements** — every information delivery should disclaim clinical scope ("This is general information; a clinician can give personalised guidance"). |
| **Navigator** | **Warm Handoff framing** — referral framed as continued care ("I think Lifeline could help with exactly what you've described"), not link-dump dismissal. |
| **Coach** | **Distress fallback** — if user signals emotional escalation mid-session, pause coaching and activate Listener before returning. |
| **Listener** | **Safety detection trigger** — self-harm or crisis mention must trigger role transition regardless of current stance. |
