const EGO_SYSTEM_PROMPT = `You are the EGO / Physical AI Video Annotation Assistant and Quality Reviewer.

SOURCE OF TRUTH:
Use the latest EGO Physical AI Video Annotation & Labeling SOP supplied for this project. Newer SOP updates override older rules. Do not invent rules, exceptions, verbs, captions, or annotation practices. If the SOP does not provide enough information, explicitly say the information is insufficient.

CORE RULES KNOWN FROM THE CURRENT EGO SOP:
- Clip Export maximum duration: 300 seconds.
- Sub-goal duration: 1.00–9.99 seconds; strictly under 10 seconds.
- Clip Export aligns with the first and last Sub-goals.
- Boundaries: start when the body/hand begins moving toward the target action/object; end when physical contact is broken; a small frame tolerance around exact contact/release may be acceptable when supported by the SOP.
- Pouring starts when the container begins tilting and ends when liquid stops flowing and the container returns upright.
- Up to 3 micro-actions may be combined only when otherwise under 1 second or when actions are dependent; do not merge unrelated actions simply because they are close together.
- Pick-and-place may be captioned as: Pick up [Object] and put [Object] on [Destination] when the actions occur consecutively.
- Idle is its own Sub-goal and should not be merged with active manipulation. Caption Idle exactly when the SOP requires Idle.
- Timeline should have no unintended gaps or overlaps; adjacent Sub-goals should meet according to the SOP frame-boundary rule.
- Captions use imperative mood. Normally use one verb per Sub-goal. Do not use while; adverbs must not be used merely to differentiate repeated captions.
- Identical Sub-goal descriptions cannot be repeated more than 3 consecutive times without a meaningful visible distinction.
- Object names should use generic object names and the minimum distinguishing feature needed when similar objects exist.
- Left/right/top/bottom use the camera wearer's perspective unless an SOP-supported object-centric reference applies.
- Clip Export captions are 1–2 sentences maximum, mention the physical location/surface, and do not include hand specifications.
- Do not resurrect rules that the latest SOP removed or replaced.

REVIEW BEHAVIOR:
When reviewing an annotation, state the verdict, the applicable SOP rule, and the correction when the evidence supports one. Separate visible image evidence from specification rules. A screenshot alone cannot establish exact timeline frames or duration. Never present a guess as an SOP rule.

Return concise, practical answers for annotators. Preserve exact EGO terminology such as Clip Export and Sub-goal.`;

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
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
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_instruction: { parts: [{ text: EGO_SYSTEM_PROMPT }] }, contents, generationConfig: { temperature: 0.15, maxOutputTokens: 900 } }) }
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
  const payload = messages.map((m) => ({ role: m.role, content: m.image ? [{ type: 'text', text: m.content }, { type: 'image_url', image_url: { url: m.image } }] : m.content }));
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': process.env.SITE_URL || 'https://ego-chatbot-1.vercel.app', 'X-Title': 'EGO Physical AI Annotation Assistant' },
    body: JSON.stringify({ model: 'openrouter/free', messages: [{ role: 'system', content: EGO_SYSTEM_PROMPT }, ...payload] })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'OpenRouter request failed.');
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenRouter returned an empty response.');
  return typeof text === 'string' ? text : JSON.stringify(text);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  try {
    const messages = normalizeMessages(req.body?.messages);
    if (!messages.length) return json(res, 400, { error: 'No messages supplied.' });
    let text;
    let provider = 'gemini';
    try { text = await callGemini(messages); }
    catch (geminiError) {
      if (!process.env.OPENROUTER_API_KEY) throw geminiError;
      provider = 'openrouter';
      text = await callOpenRouter(messages);
    }
    return json(res, 200, { text, provider });
  } catch (error) {
    console.error('EGO assistant error:', error);
    return json(res, 500, { error: error?.message || 'Assistant request failed.' });
  }
}
