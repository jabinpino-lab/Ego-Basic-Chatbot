const EGO_SYSTEM_PROMPT = `
You are the EGO / Physical AI Annotation Assistant and Quality Reviewer.

IMPORTANT:
The latest EGO Physical AI Video Annotation & Labeling SOP provided by the user is the single source of truth.

Never invent EGO rules.
If the SOP does not provide enough information, say that the information is insufficient.

PROJECT GOAL:
Ensure every video is correctly clipped, correctly captioned, properly segmented, complete, and free of unintended gaps, overlaps, and Red Linter Errors.

SUB-GOAL RULES:
- Minimum duration: 1.00 second.
- Maximum duration: 9.99 seconds.
- Normally use one verb per Sub-goal.
- Never create a Sub-goal of 10.00 seconds or longer.
- Multiple actions are allowed only under approved SOP exceptions.

CLIP EXPORT:
- Maximum duration: 300 seconds / 5 minutes / 4:59.
- Longer tasks must be split logically.
- First Sub-goal aligns with the beginning of the Clip Export.
- Final Sub-goal aligns with the end of the Clip Export.

SUB-GOAL BOUNDARIES:
- Start when the body or hand begins moving toward the target object/action.
- End when physical contact is broken between hand/object or object/object.
- A boundary within 5 frames of the exact contact/release point is acceptable.

POURING:
- Start when the container begins tilting to initiate the pour.
- End when liquid stops flowing and the container returns upright.

TIMELINE:
- No unintended gaps.
- No unintended overlaps.
- If one Sub-goal ends at frame 22, the next starts at frame 22 or 23.

IDLE:
- Idle must be its own Sub-goal.
- Caption exactly: Idle.
- Do not merge Idle with active manipulation.
- Idle periods longer than 5 seconds should be split into multiple valid Sub-goals.

CAPTIONING:
Use imperative/action-oriented wording.

Examples:
- Pick up the mug.
- Wipe the counter.
- Put the plate on the table.

Normally use one verb per Sub-goal.

Use "and" only for actions permitted to be combined by the SOP.

PICK-AND-PLACE:
When permitted:
Pick up [Object] and put [Object] on [Destination].

OBJECT NAMING:
Use the minimum necessary distinguishing information.
Prefer generic object names instead of brand names.

SPATIAL REFERENCES:
Left/right/top/bottom refer to the camera wearer's perspective.
Use object-centric references only when appropriate for handled objects or garments.

COLLECTOR ISSUE:
Use:
Collector Quality Issue: Inactive Time

CONSECUTIVE IDENTICAL SUB-GOALS:
Do not use the exact same Sub-goal description more than 3 consecutive times.
The fourth must contain a meaningful distinction that is actually visible.

QUALITY REVIEW:
Check:
1. Action match
2. Object match
3. Boundary match
4. Duration
5. Verb count
6. Approved/forbidden verb compliance
7. Object naming
8. Spatial references
9. Timeline continuity
10. Linter errors

RESPONSE FORMAT:
Give the direct answer first.

When reviewing an annotation:

Verdict: Correct / Incorrect / Needs Adjustment

Reason:
[Explain the applicable EGO rule.]

Correction:
[Give the corrected caption or boundary when necessary.]

IMAGE / SCREENSHOT ANALYSIS:
When an image is provided:
- Identify the physical action actually visible.
- Recommend an EGO-compliant caption.
- Check the verb.
- Check the object name.
- Explain uncertainty if the image is ambiguous.
- Never invent an action that cannot be supported by the image.
- A screenshot cannot reliably establish exact start/end frames.
- A screenshot cannot reliably establish exact duration.

APPROVED AND FORBIDDEN VERBS:
Use ONLY the latest approved/forbidden verb lists supplied by the current EGO SOP.
Do not assume a verb is approved simply because it sounds natural.

When a user asks whether a verb is approved or forbidden, clearly state the result and explain the applicable SOP rule.

Be concise, practical, and strict.
`;


// ---------------------------------------------------------
// LOCAL EGO RULES
// These answers do not consume an AI request.
// ---------------------------------------------------------

function localEgoAnswer(question) {
  const q = String(question || "").toLowerCase().trim();

  if (
    q.includes("sub-goal duration") ||
    q.includes("subgoal duration") ||
    q.includes("sub-goal maximum") ||
    q.includes("subgoal maximum") ||
    q.includes("how long can a sub-goal")
  ) {
    return `**Answer:** A Sub-goal must be **1.00–9.99 seconds**.

A Sub-goal must never be 10.00 seconds or longer.`;
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
    return `**Answer:** A Clip Export has a maximum duration of **300 seconds (5 minutes / 4:59)**.

If the task is longer than 300 seconds, it must be split into logical segments.`;
  }

  if (
    q.includes("collector issue") ||
    q.includes("collector quality issue")
  ) {
    return `**Answer:** Use:

**Collector Quality Issue: Inactive Time**

This applies to non-contributing time such as camera adjustment, resting, or inactive recording periods.`;
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
    return `**Answer:** Idle must be its own Sub-goal.

**Caption:** \`Idle\`

Do not merge Idle with an active manipulation Sub-goal.`;
  }

  if (
    q.includes("timeline continuity") ||
    q.includes("timeline gap") ||
    q.includes("timeline overlap")
  ) {
    return `**Answer:** Sub-goals should have no unintended gaps or overlaps.

If Sub-goal A ends at frame 22, Sub-goal B should start at frame 22 or frame 23.`;
  }

  if (
    q.includes("screenshot") &&
    (
      q.includes("duration") ||
      q.includes("frame") ||
      q.includes("boundary")
    )
  ) {
    return `**Answer:** A screenshot can help identify the visible action, but it cannot reliably establish exact Sub-goal start/end frames or duration.

Use the video timeline for exact boundary and duration checks.`;
  }

  return null;
}


// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

function extractText(data) {
  return (
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    ""
  );
}


function containsImage(messages) {
  return messages.some((message) => {
    if (!Array.isArray(message?.content)) return false;

    return message.content.some((part) => {
      return (
        part?.type === "image_url" ||
        part?.type === "input_image"
      );
    });
  });
}


function normalizeMessages(messages) {
  return messages.map((message) => {
    if (!Array.isArray(message.content)) {
      return {
        role: message.role,
        content: message.content,
      };
    }

    const content = message.content.map((part) => {

      // Standard OpenAI/OpenRouter image format
      if (part.type === "image_url") {
        return {
          type: "image_url",
          image_url: part.image_url,
        };
      }

      // Convert input_image to image_url
      if (part.type === "input_image") {
        return {
          type: "image_url",
          image_url: {
            url: part.image_url || part.url,
          },
        };
      }

      if (
        part.type === "text" ||
        part.type === "input_text"
      ) {
        return {
          type: "text",
          text: part.text || "",
        };
      }

      return part;
    });

    return {
      role: message.role,
      content,
    };
  });
}


// ---------------------------------------------------------
// OPENROUTER
// ---------------------------------------------------------

async function callOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const normalizedMessages = normalizeMessages(messages);

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",

        "HTTP-Referer":
          process.env.SITE_URL ||
          "https://ego-chatbot-1.vercel.app",

        "X-Title":
          "EGO Physical AI Annotation Assistant",
      },

      body: JSON.stringify({
        model: "openrouter/free",

        messages: [
          {
            role: "system",
            content: EGO_SYSTEM_PROMPT,
          },
          ...normalizedMessages,
        ],

        temperature: 0.2,

        max_tokens: 1500,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      `OpenRouter request failed (${response.status})`
    );
  }

  const text = extractText(data);

  if (!text) {
    throw new Error(
      "OpenRouter returned an empty response."
    );
  }

  return text;
}


// ---------------------------------------------------------
// GEMINI FALLBACK
// ---------------------------------------------------------

async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured."
    );
  }

  const contents = messages.map((message) => {
    const parts = [];

    if (Array.isArray(message.content)) {

      for (const part of message.content) {

        if (
          part.type === "text" ||
          part.type === "input_text"
        ) {
          parts.push({
            text: part.text || "",
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

          const match = imageUrl.match(
            /^data:(image\/[^;]+);base64,(.+)$/
          );

          if (match) {
            parts.push({
              inline_data: {
                mime_type: match[1],
                data: match[2],
              },
            });
          }
        }
      }

    } else if (
      typeof message.content === "string"
    ) {

      parts.push({
        text: message.content,
      });
    }

    return {
      role:
        message.role === "assistant"
          ? "model"
          : "user",

      parts,
    };
  });

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" +
      encodeURIComponent(apiKey),

    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: EGO_SYSTEM_PROMPT,
            },
          ],
        },

        contents,

        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1500,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      `Gemini request failed (${response.status})`
    );
  }

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("") || "";

  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return text;
}


// ---------------------------------------------------------
// MAIN API HANDLER
// ---------------------------------------------------------

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {

    const body = req.body || {};

    const messages =
      Array.isArray(body.messages)
        ? body.messages
        : [];

    if (!messages.length) {
      return res.status(400).json({
        error: "No messages provided.",
      });
    }


    // Find latest user message
    const latestUserMessage =
      [...messages]
        .reverse()
        .find(
          (message) =>
            message.role === "user"
        );


    let question = "";

    if (latestUserMessage) {

      if (
        typeof latestUserMessage.content ===
        "string"
      ) {
        question =
          latestUserMessage.content;
      }

      if (
        Array.isArray(
          latestUserMessage.content
        )
      ) {
        question =
          latestUserMessage.content
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
    }


    const hasImage =
      containsImage(messages);


    // -----------------------------------------------------
    // FIRST: LOCAL RULE ENGINE
    // -----------------------------------------------------

    if (!hasImage) {

      const localAnswer =
        localEgoAnswer(question);

      if (localAnswer) {

        return res.status(200).json({
          text: localAnswer,
          provider: "local-ego-rules",
        });
      }
    }


    // -----------------------------------------------------
    // SECOND: OPENROUTER
    // -----------------------------------------------------

    let openRouterError = null;

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
          provider: "openrouter",
        });

      } catch (error) {

        openRouterError =
          error;

        console.error(
          "OpenRouter error:",
          error?.message ||
          error
        );
      }
    }


    // -----------------------------------------------------
    // THIRD: GEMINI FALLBACK
    // -----------------------------------------------------

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
          provider: "gemini-fallback",
        });

      } catch (error) {

        console.error(
          "Gemini fallback error:",
          error?.message ||
          error
        );
      }
    }


    // -----------------------------------------------------
    // FRIENDLY FALLBACK
    // -----------------------------------------------------

    return res.status(200).json({

      text:
        `**AI analysis is temporarily unavailable.**

The available AI provider has reached its current usage limit or is unavailable.

You can still ask basic EGO questions such as:

- Sub-goal duration
- Clip Export duration
- Idle rules
- Collector Issue rules
- Timeline continuity

Please try AI/screenshot analysis again later.`,

      provider: "fallback",
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
        "Unable to contact the EGO assistant right now. Please try again.",

    });
  }
}
