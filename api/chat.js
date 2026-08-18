// ============================================================
// EGO PHYSICAL AI ANNOTATION ASSISTANT
// Current SOP: 2026/08/17
//
// IMPORTANT:
// This file contains the current Approved and Forbidden Verb
// Lists directly from the EGO SOP.
//
// Local deterministic checks take priority over AI responses.
// ============================================================


// ============================================================
// CURRENT EGO SOP
// ============================================================

const EGO_SYSTEM_PROMPT = `
You are the EGO / Physical AI Video Annotation Assistant and Quality Reviewer.

SOURCE OF TRUTH:
The EGO Physical AI Video Annotation & Labeling SOP supplied below is the current and authoritative specification.

Do not invent rules.
Do not use older EGO rules when they conflict with this SOP.
Do not override the Approved or Forbidden Verb Lists.
If the SOP does not provide enough information, say that the information is insufficient.

CURRENT SOP RULES:

1. CLIP EXPORT
- Maximum duration: 300 seconds.
- Tasks longer than 300 seconds must be split into logical segments.
- Clip Export must align with the first and last Sub-goals.

2. SUB-GOAL
- Minimum duration: 1.00 second.
- Maximum duration: 9.99 seconds.
- Must strictly be under 10 seconds.
- Normally use one verb per Sub-goal.

3. BOUNDARIES
- Start where the body or hand begins moving toward the target object/action.
- End when physical contact is broken.
- Bounding within 5 frames of exact contact/release is acceptable.
- Pouring starts when the container begins tilting.
- Pouring ends when liquid stops flowing and the container returns upright.

4. MERGING
Up to 3 micro-actions may be combined only when:
- The resulting Sub-goal would otherwise be less than 1 second, OR
- The actions are dependent on one another.

Do not combine unrelated actions simply because they occur close together.

5. PICK AND PLACE
When an object is picked up and set down consecutively:
"Pick up [Object] and put [Object] on [Destination]"

6. IDLE
- Idle is its own Sub-goal.
- Caption strictly as "Idle".
- Never merge Idle with active manipulation.
- Idle periods longer than 5 seconds should be split into multiple short Idle Sub-goals.

7. TIMELINE
- No unintended gaps.
- No unintended overlaps.
- If Sub-goal A ends at frame 22, Sub-goal B starts at frame 22 or 23.
- First Sub-goal starts with Clip Export.
- Last Sub-goal ends with Clip Export.

8. CAPTIONS
- Use imperative mood.
- Sub-goal captions normally contain one verb.
- "and" is only permitted for approved grouped actions.
- "while" is not allowed.
- Adverbs cannot be used to differentiate repeated captions.

9. IDENTICAL SUB-GOALS
The same Sub-goal description cannot be used more than 3 consecutive times.
The fourth must contain a meaningful distinction visible in the scene.

10. OBJECT NAMING
- 1 object: plain object name.
- 2–3 similar objects: minimum distinguishing feature.
- 4+ identical objects: use an indefinite descriptor when appropriate.
- Use generic names instead of brand names.

11. SPATIAL REFERENCES
- Left/right/top/bottom use the camera wearer's perspective.
- Object-centric directions are used only for small handled objects or garments with named features.

12. CLIP EXPORT CAPTIONS
- 1–2 sentences maximum.
- Mention the physical location or surface.
- Do not include hand specifications.

IMPORTANT:
Collector Issue annotation was REMOVED in the 2026/08/17 update.
Do NOT instruct annotators to create Collector Issue annotations.

When reviewing a verb, use the exact Approved and Forbidden Verb Lists below.
`;


// ============================================================
// CURRENT APPROVED VERB LIST
// SOURCE: USER-PROVIDED SOP 2026/08/17
// ============================================================

const APPROVED_VERBS = new Set([
  "adjust",
  "agitate",
  "align",
  "apply",
  "arrange",
  "assemble",
  "attach",
  "bend",
  "bind",
  "blow",
  "break",
  "breakdown",
  "brush",
  "buckle",
  "button",
  "cap",
  "carve",
  "change",
  "clean",
  "clip",
  "close",
  "coat",
  "coil",
  "comb",
  "combine",
  "compress",
  "condition",
  "connect",
  "cook",
  "count",
  "crack",
  "crease",
  "crimp",
  "crochet",
  "crumple",
  "crush",
  "cut",
  "dab",
  "deal",
  "disassemble",
  "dispense",
  "divide",
  "drag",
  "drain",
  "draw",
  "drip",
  "drop",
  "dump",
  "embroider",
  "erase",
  "exchange",
  "expand",
  "fasten",
  "fetch",
  "fill",
  "find",
  "fix",
  "flat",
  "flatten",
  "flick",
  "flip",
  "fluff",
  "fold",
  "form",
  "fry",
  "gather",
  "get",
  "glue",
  "grab",
  "grasp",
  "grip",
  "guide",
  "hammer",
  "hand off",
  "hang",
  "hold",
  "hook",
  "hover",
  "idle",
  "immerse",
  "inflate",
  "insert",
  "inspect",
  "install",
  "iron",
  "knead",
  "knit",
  "label",
  "lace",
  "lay",
  "level",
  "lift",
  "light",
  "link",
  "load",
  "loose",
  "make",
  "measure",
  "merge",
  "mix",
  "model",
  "modify",
  "mold",
  "mop",
  "move",
  "navigate",
  "off",
  "open",
  "organize",
  "paint",
  "paste",
  "peel",
  "pick up",
  "pin",
  "pinch",
  "place",
  "plug",
  "poke",
  "position",
  "pour",
  "prepare",
  "press",
  "pry",
  "pull",
  "pump",
  "punch",
  "push",
  "reach",
  "regrasp",
  "reinstall",
  "remove",
  "repair",
  "reposition",
  "retrieve",
  "return",
  "reverse",
  "rinse",
  "roll",
  "rotate",
  "rub",
  "rummage",
  "saw",
  "scatter",
  "scramble",
  "scrape",
  "scratch",
  "screw",
  "scrub",
  "sculpt",
  "search",
  "seal",
  "seat",
  "secure",
  "separate",
  "set",
  "sew",
  "shake",
  "shape",
  "sharpen",
  "shift",
  "shook",
  "shred",
  "shuffle",
  "slice",
  "slide",
  "slip",
  "smash",
  "smear",
  "smooth",
  "snap",
  "soak",
  "sort",
  "split",
  "spray",
  "spread",
  "squeeze",
  "stack",
  "steady",
  "stick",
  "stir",
  "stitch",
  "straighten",
  "stretch",
  "string",
  "strip",
  "sweep",
  "swing",
  "swivel",
  "take",
  "tap",
  "tape",
  "tear",
  "test",
  "thread",
  "throw",
  "tie",
  "tighten",
  "tilt",
  "touch",
  "trace",
  "transfer",
  "tuck",
  "turn off",
  "turn on",
  "turn",
  "twist",
  "unbutton",
  "unclamp",
  "unclip",
  "unclog",
  "uncoil",
  "uncrumple",
  "unfold",
  "unhang",
  "unlink",
  "unlock",
  "unplug",
  "unroll",
  "unscrew",
  "unseal",
  "unstack",
  "unstick",
  "untangle",
  "untie",
  "unwrap",
  "unzip",
  "vacuum",
  "walk",
  "wash",
  "wedge",
  "wet",
  "wipe",
  "wring",
  "write",
  "zip"
]);


// ============================================================
// CURRENT FORBIDDEN VERB LIST
// SOURCE: USER-PROVIDED SOP 2026/08/17
// ============================================================

const FORBIDDEN_VERBS = new Set([
  "analyze",
  "assess",
  "browse",
  "check",
  "choose",
  "compare",
  "confirm",
  "detail",
  "disengage",
  "ensure",
  "examine",
  "fine tune",
  "finesse",
  "group",
  "look",
  "match",
  "observe",
  "portion",
  "reach for",
  "refine",
  "review",
  "select",
  "survey",
  "tune",
  "verify",
  "view",
  "weigh",
  "begin",
  "complete",
  "continue",
  "finalize",
  "finish",
  "first",
  "initiate",
  "maintain",
  "rearrange",
  "start",
  "handle",
  "manipulate",
  "pace",
  "perform",
  "section",
  "work",
  "additional",
  "again",
  "another",
  "current",
  "extra",
  "final",
  "further",
  "more",
  "new",
  "old",
  "other",
  "remaining",
  "specific"
]);


// ============================================================
// VERB NORMALIZATION
// ============================================================

function normalizeVerb(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:"'`]/g, "")
    .replace(/\s+/g, " ");
}


// ============================================================
// CHECK A SINGLE VERB
// ============================================================

function checkVerb(verb) {
  const normalized = normalizeVerb(verb);

  if (!normalized) {
    return {
      status: "unknown",
      verb: "",
      message: "No verb was provided."
    };
  }

  if (APPROVED_VERBS.has(normalized)) {
    return {
      status: "approved",
      verb: normalized,
      message: `**${verb}** is an **APPROVED** EGO verb.`
    };
  }

  if (FORBIDDEN_VERBS.has(normalized)) {
    return {
      status: "forbidden",
      verb: normalized,
      message: `**${verb}** is a **FORBIDDEN** EGO verb.`
    };
  }

  return {
    status: "unknown",
    verb: normalized,
    message:
      `**${verb}** is **not found in the current Approved or Forbidden Verb List**. ` +
      `Do not assume it is approved.`
  };
}


// ============================================================
// FIND WHETHER USER IS ASKING ABOUT A VERB
// ============================================================

function extractVerbFromQuestion(question) {
  const text = String(question || "").trim();

  const patterns = [
    /is\s+["'`]?([^"'`?]+?)["'`]?\s+(?:an\s+)?approved\s+verb/i,
    /is\s+["'`]?([^"'`?]+?)["'`]?\s+(?:a\s+)?forbidden\s+verb/i,
    /["'`]([^"'`]+)["'`]\s+(?:an\s+)?approved\s+verb/i,
    /["'`]([^"'`]+)["'`]\s+(?:a\s+)?forbidden\s+verb/i,
    /(?:approved|forbidden)\s+verb\s*[:\-]?\s*["'`]?([^"'`?]+)["'`]?$/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}


// ============================================================
// LOCAL VERB RESPONSE
// ============================================================

function localVerbAnswer(question) {
  const verb = extractVerbFromQuestion(question);

  if (!verb) {
    return null;
  }

  const result = checkVerb(verb);

  if (result.status === "approved") {
    return {
      text:
        `### Verdict: Approved ✅\n\n` +
        `**${verb}** is explicitly listed in the current EGO **Approved Verb List**.\n\n` +
        `Use it when the physical action shown in the video matches the verb.`,
      provider: "local-ego-verb-checker"
    };
  }

  if (result.status === "forbidden") {
    return {
      text:
        `### Verdict: Forbidden ❌\n\n` +
        `**${verb}** is explicitly listed in the current EGO **Forbidden Verb List**.\n\n` +
        `Use an appropriate approved verb that accurately describes the visible physical action.`,
      provider: "local-ego-verb-checker"
    };
  }

  return {
    text:
      `### Verdict: Not specified ⚠️\n\n` +
      `**${verb}** does not appear in the current Approved or Forbidden Verb List provided in the EGO SOP.\n\n` +
      `Do not assume that it is approved. The caption should be reviewed against the current SOP.`,
    provider: "local-ego-verb-checker"
  };
}


// ============================================================
// LOCAL BASIC EGO RULES
// ============================================================

function localEgoAnswer(question) {
  const q = String(question || "").toLowerCase().trim();

  // Do not use this for verb questions.
  if (extractVerbFromQuestion(question)) {
    return null;
  }

  if (
    q.includes("sub-goal duration") ||
    q.includes("subgoal duration") ||
    q.includes("sub-goal maximum") ||
    q.includes("subgoal maximum") ||
    q.includes("how long can a sub-goal") ||
    q.includes("how long can a subgoal")
  ) {
    return {
      text:
        `**Answer:** A Sub-goal must be **1.00–9.99 seconds**.\n\n` +
        `It must be at least 1.00 second and strictly under 10.00 seconds.`,
      provider: "local-ego-rules"
    };
  }

  if (
    q.includes("clip export") &&
    (
      q.includes("maximum") ||
      q.includes("max") ||
      q.includes("duration") ||
      q.includes("how long")
    )
  ) {
    return {
      text:
        `**Answer:** A Clip Export has a maximum duration of **300 seconds**.\n\n` +
        `Tasks longer than 300 seconds must be split into logical segments aligned with Sub-goals.`,
      provider: "local-ego-rules"
    };
  }

  if (
    q.includes("collector issue") ||
    q.includes("collector quality issue")
  ) {
    return {
      text:
        `### Current SOP Update\n\n` +
        `**Collector Issue annotation was removed in the 2026/08/17 SOP update.**\n\n` +
        `Do not create a Collector Issue annotation under the current SOP.`,
      provider: "local-ego-rules"
    };
  }

  if (
    q.includes("idle") &&
    (
      q.includes("caption") ||
      q.includes("label") ||
      q.includes("how should") ||
      q.includes("how do")
    )
  ) {
    return {
      text:
        `**Answer:** Idle must be its own Sub-goal.\n\n` +
        `**Caption:** \`Idle\`\n\n` +
        `Never merge Idle into an active manipulation Sub-goal.`,
      provider: "local-ego-rules"
    };
  }

  if (
    q.includes("timeline continuity") ||
    q.includes("timeline gap") ||
    q.includes("timeline overlap")
  ) {
    return {
      text:
        `**Answer:** Sub-goals must have no unintended gaps or overlaps.\n\n` +
        `If Sub-goal A ends at frame 22, Sub-goal B can start at frame 22 or frame 23.`,
      provider: "local-ego-rules"
    };
  }

  if (
    q.includes("adverb") &&
    (
      q.includes("caption") ||
      q.includes("different") ||
      q.includes("differentiate")
    )
  ) {
    return {
      text:
        `**Answer:** Adverbs cannot be used to differentiate consecutive identical Sub-goal captions.\n\n` +
        `The distinction must describe an actual visible difference in the action or scene.`,
      provider: "local-ego-rules"
    };
  }

  if (
    q.includes("same sub-goal") ||
    q.includes("same subgoal") ||
    q.includes("identical sub-goal") ||
    q.includes("identical subgoal")
  ) {
    return {
      text:
        `**Answer:** The same Sub-goal description cannot be used more than **3 consecutive times**.\n\n` +
        `The fourth must contain a meaningful distinction based on what is actually visible.`,
      provider: "local-ego-rules"
    };
  }

  if (
    q.includes("same frame") &&
    (
      q.includes("sub-goal") ||
      q.includes("subgoal")
    )
  ) {
    return {
      text:
        `**Answer:** Yes. The next Sub-goal can start at the **same frame or +1 frame**.\n\n` +
        `For example, if Sub-goal A ends at frame 22, Sub-goal B can start at frame 22 or 23.`,
      provider: "local-ego-rules"
    };
  }

  if (
    q.includes("collector") &&
    q.includes("2026/08/17")
  ) {
    return {
      text:
        `**Answer:** The 2026/08/17 update removed the need to annotate Collector Issues.`,
      provider: "local-ego-rules"
    };
  }

  return null;
}


// ============================================================
// IMAGE DETECTION
// ============================================================

function containsImage(messages) {
  return messages.some((message) => {

    if (!Array.isArray(message?.content)) {
      return false;
    }

    return message.content.some((part) => {

      return (
        part?.type === "image_url" ||
        part?.type === "input_image"
      );
    });
  });
}


// ============================================================
// NORMALIZE MESSAGES FOR OPENROUTER
// ============================================================

function normalizeMessages(messages) {

  return messages.map((message) => {

    if (!Array.isArray(message.content)) {
      return {
        role: message.role,
        content: message.content
      };
    }

    const content = message.content.map((part) => {

      if (part.type === "image_url") {
        return {
          type: "image_url",
          image_url: part.image_url
        };
      }

      if (part.type === "input_image") {
        return {
          type: "image_url",
          image_url: {
            url:
              part.image_url ||
              part.url
          }
        };
      }

      if (
        part.type === "text" ||
        part.type === "input_text"
      ) {
        return {
          type: "text",
          text: part.text || ""
        };
      }

      return part;
    });

    return {
      role: message.role,
      content
    };
  });
}


// ============================================================
// OPENROUTER
// ============================================================

async function callOpenRouter(messages) {

  const apiKey =
    process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured."
    );
  }

  const normalizedMessages =
    normalizeMessages(messages);

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",

        "HTTP-Referer":
          process.env.SITE_URL ||
          "https://ego-chatbot-1.vercel.app",

        "X-Title":
          "EGO Physical AI Annotation Assistant"
      },

      body: JSON.stringify({

        model: "openrouter/free",

        messages: [
          {
            role: "system",
            content: EGO_SYSTEM_PROMPT
          },
          ...normalizedMessages
        ],

        temperature: 0.1,

        max_tokens: 1500
      })
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      `OpenRouter request failed (${response.status})`
    );
  }

  const text =
    data?.choices?.[0]?.message?.content ||
    "";

  if (!text) {
    throw new Error(
      "OpenRouter returned an empty response."
    );
  }

  return text;
}


// ============================================================
// GEMINI FALLBACK
// ============================================================

async function callGemini(messages) {

  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured."
    );
  }

  const contents =
    messages.map((message) => {

      const parts = [];

      if (Array.isArray(message.content)) {

        for (
          const part of message.content
        ) {

          if (
            part.type === "text" ||
            part.type === "input_text"
          ) {
            parts.push({
              text: part.text || ""
            });
          }

          if (
            part.type === "image_url" ||
            part.type === "input_image"
          ) {

            const imageUrl =
              part.image_url?.url ||
              part.image_url ||
              part.url ||
              "";

            const match =
              imageUrl.match(
                /^data:(image\/[^;]+);base64,(.+)$/
              );

            if (match) {

              parts.push({
                inline_data: {
                  mime_type: match[1],
                  data: match[2]
                }
              });
            }
          }
        }

      } else if (
        typeof message.content === "string"
      ) {

        parts.push({
          text: message.content
        });
      }

      return {
        role:
          message.role === "assistant"
            ? "model"
            : "user",

        parts
      };
    });

  const response =
    await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" +
        encodeURIComponent(apiKey),
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          systemInstruction: {
            parts: [
              {
                text:
                  EGO_SYSTEM_PROMPT
              }
            ]
          },

          contents,

          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1500
          }
        })
      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data?.error?.message ||
      `Gemini request failed (${response.status})`
    );
  }

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map(
        (part) =>
          part.text || ""
      )
      .join("") || "";

  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return text;
}


// ============================================================
// EXTRACT LATEST USER TEXT
// ============================================================

function getLatestUserText(messages) {

  const latest =
    [...messages]
      .reverse()
      .find(
        (message) =>
          message.role === "user"
      );

  if (!latest) {
    return "";
  }

  if (
    typeof latest.content === "string"
  ) {
    return latest.content;
  }

  if (
    Array.isArray(latest.content)
  ) {

    return latest.content
      .filter(
        (part) =>
          part.type === "text" ||
          part.type === "input_text"
      )
      .map(
        (part) =>
          part.text || ""
      )
      .join(" ");
  }

  return "";
}


// ============================================================
// MAIN API HANDLER
// ============================================================

export default async function handler(
  req,
  res
) {

  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const body =
      req.body || {};

    const messages =
      Array.isArray(body.messages)
        ? body.messages
        : [];

    if (!messages.length) {

      return res.status(400).json({
        error:
          "No messages provided."
      });
    }

    const question =
      getLatestUserText(messages);

    const hasImage =
      containsImage(messages);


    // ========================================================
    // PRIORITY 1:
    // EXACT LOCAL VERB CHECK
    // ========================================================

    if (!hasImage) {

      const verbAnswer =
        localVerbAnswer(question);

      if (verbAnswer) {

        return res.status(200).json(
          verbAnswer
        );
      }
    }


    // ========================================================
    // PRIORITY 2:
    // LOCAL SOP RULES
    // ========================================================

    if (!hasImage) {

      const localAnswer =
        localEgoAnswer(question);

      if (localAnswer) {

        return res.status(200).json(
          localAnswer
        );
      }
    }


    // ========================================================
    // PRIORITY 3:
    // OPENROUTER
    // ========================================================

    if (
      process.env.OPENROUTER_API_KEY
    ) {

      try {

        const answer =
          await callOpenRouter(
            messages
          );

        return res.status(200).json({

          text: answer,

          provider:
            "openrouter"
        });

      } catch (error) {

        console.error(
          "OpenRouter error:",
          error?.message ||
          error
        );
      }
    }


    // ========================================================
    // PRIORITY 4:
    // GEMINI FALLBACK
    // ========================================================

    if (
      process.env.GEMINI_API_KEY
    ) {

      try {

        const answer =
          await callGemini(
            messages
          );

        return res.status(200).json({

          text: answer,

          provider:
            "gemini-fallback"
        });

      } catch (error) {

        console.error(
          "Gemini fallback error:",
          error?.message ||
          error
        );
      }
    }


    // ========================================================
    // FRIENDLY FALLBACK
    // ========================================================

    return res.status(200).json({

      text:
        `### AI analysis is temporarily unavailable.\n\n` +
        `The AI provider is currently unavailable or has reached its usage limit.\n\n` +
        `Basic EGO SOP checks are still available.`,

      provider:
        "fallback"
    });

  } catch (error) {

    console.error(
      "EGO API error:",
      error?.stack ||
      error?.message ||
      error
    );

    return res.status(500).json({

      error:
        "Unable to contact the EGO assistant right now. Please try again."
    });
  }
}
