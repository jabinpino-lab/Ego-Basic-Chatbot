const fs = require('fs');
const path = require('path');

const SOP_PATH = path.join(process.cwd(), 'docs', 'EGO_Physical_AI_Annotation_SOP.md');

let EGO_SOP = '';
try {
  EGO_SOP = fs.readFileSync(SOP_PATH, 'utf8');
} catch (error) {
  console.error('Could not load authoritative EGO SOP:', error?.message);
}

const EGO_SYSTEM_PROMPT = `You are the EGO / Physical AI Video Annotation Assistant and Quality Reviewer.

SOURCE OF TRUTH — MANDATORY:
The user's latest supplied EGO Physical AI Video Annotation & Labeling SOP is the SINGLE SOURCE OF TRUTH. The complete SOP is provided below. Follow it exactly. Newer rules in the supplied SOP override older EGO instructions. Do not invent rules, exceptions, verbs, captions, annotation practices, or requirements. If the SOP does not provide enough information, explicitly say the information is insufficient rather than guessing.

CRITICAL CURRENT RULES:
- Computer-generated 3D hand pose keypoints (point_3d) are not edited by annotators.
- Clip Export: maximum 300 seconds; the quality checklist says under 4:59 minutes.
- Sub-goal: minimum 1.00 second and maximum 9.99 seconds.
- Sub-goal starts when body/hand begins moving toward the target; ends when physical contact is broken, with the pouring exception in the SOP.
- Up to 3 micro-actions may be merged only under the specified under-1-second or dependent-action exceptions.
- Idle is a separate Sub-goal; never merge Idle into active manipulation.
- Clip Export and Sub-goal timelines must maintain continuity; the next Sub-goal may start at the same frame or +1 frame.
- Clip Export captions: 1–2 sentences, mention physical location/surface, and contain NO hand specifications.
- Sub-goal captions: imperative mood, normally one verb, approved verb required, hands identified, only letters/spaces, and only the first letter of the first word capitalized.
- The latest supplied SOP restores hands in Sub-goal captions.
- The latest supplied SOP allows up to 5 consecutive identical Sub-goal descriptions, but after the third occurrence a meaningful distinction should be introduced. Never use adverbs merely to differentiate.
- Object naming, generic terminology, and spatial references must follow the supplied SOP.
- Collector Issue annotation was removed on 2026/08/17 and must not be resurrected.
- Use “and” only for grouped actions; “while” is not allowed.
- Quality reviews must distinguish visible evidence from SOP requirements and must not guess exact frames/durations without enough information.

RESPONSE BEHAVIOR:
When reviewing an annotation, give a direct verdict (Correct, Incorrect, Needs correction, or Insufficient information), state the applicable SOP rule, explain the issue, and provide a correction only when supported.
When fixing a caption, provide the corrected caption and a brief SOP-based reason.
When selecting a verb, use only the Approved Verb List and only when the visible action supports it.
When reviewing merging, splitting, idle, boundaries, repetition, or continuity, apply the exact SOP rules below.

COMPLETE AUTHORITATIVE SOP:
${EGO_SOP}
`;

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function normalizeMessages(messages) {
  return (Array.isArray(messages) ? messages : []).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || ''),
    image: typeof m.image === 'string' && m.image.startsWith('data:image/') ? m.image : null
  }));
}

async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');

  const contents = messages.map((m) => {
    const parts = [];
    if (m.content) parts.push({ text: m.content });
    if (m.image) {
      const match = m.image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (match) parts.push({ inline_data: { mime_type: match[1], data: match[2] } });
    }
    return { role: m.role === 'assistant' ? 'model' : 'user', parts: parts.length ? parts : [{ text: '' }] };
  });

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + encodeURIComponent(apiKey),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: EGO_SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.15, maxOutputTokens: 1200 }
      })
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Gemini request failed.');
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim();
  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
}

async function callOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured.');

  const payload = messages.map((m) => ({
    role: m.role,
    content: m.image
      ? [
          { type: 'text', text: m.content },
          { type: 'image_url', image_url: { url: m.image } }
        ]
      : m.content
  }));

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.SITE_URL || 'https://ego-chatbot-1.vercel.app',
      'X-Title': 'EGO Physical AI Annotation Assistant'
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: [{ role: 'system', content: EGO_SYSTEM_PROMPT }, ...payload],
      temperature: 0.15,
      max_tokens: 1200
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'OpenRouter request failed.');
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenRouter returned an empty response.');
  return typeof text === 'string' ? text : JSON.stringify(text);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });

  try {
    const messages = normalizeMessages(req.body?.messages);
    if (!messages.length) return json(res, 400, { error: 'No messages supplied.' });

    let text;
    let provider = 'gemini';
    try {
      text = await callGemini(messages);
    } catch (geminiError) {
      console.error('Gemini failed:', geminiError?.message);
      if (!process.env.OPENROUTER_API_KEY) throw geminiError;
      provider = 'openrouter';
      text = await callOpenRouter(messages);
    }

    return json(res, 200, { text, provider });
  } catch (error) {
    console.error('EGO assistant error:', error);
    return json(res, 500, { error: error?.message || 'Assistant request failed.' });
  }
};
