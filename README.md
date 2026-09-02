# Ego-Basic-Chatbot

Remotasks CB's could ask inquiry about the Ego Basic Project.

EGO Annotation Assistant is grounded in the **latest EGO Physical AI Video Annotation & Labeling SOP** and uses the Gemini API free-tier backend with OpenRouter fallback.

## Current Specification

The authoritative SOP is stored at `docs/EGO_Physical_AI_Annotation_SOP.md` and is loaded by `api/chat.js` as the chatbot's source of truth.

**Latest SOP update:** 2026/09/01

Important current changes include:
- Hands are required in Sub-goal captions.
- The maximum is 5 consecutive identical Sub-goal descriptions; after the third occurrence, introduce a meaningful distinction.
- `Carry` is an approved verb.
- Collector Issue annotation is removed.
- Sub-goals must be 1.00–9.99 seconds.
- Clip Exports must be under 4:59 minutes according to the quality checklist.
- Sub-goal captions use imperative mood, approved verbs, no special characters, and the specified capitalization rule.

The latest supplied SOP overrides older EGO instructions. Do not invent unsupported annotation rules.