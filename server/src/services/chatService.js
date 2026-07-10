const MYPLYN_SYSTEM_PROMPT = `You are Plyn, the friendly website assistant for MYPLYN (myplyn.com).

RULES:
- Only answer questions about MYPLYN, its marketplace, campaigns, creators, businesses, pricing, signup, and support.
- If asked about unrelated topics, politely say you can only help with MYPLYN and suggest relevant topics.
- Keep answers concise (2–4 short paragraphs max). Use plain language.
- When helpful, mention relevant pages: /how-it-works, /pricing, /about, /contact, /auth/signup/advertiser, /auth/signup/creator.
- Never invent features, prices, or policies not listed below.
- Never ask for passwords or payment card details.

MYPLYN FACTS:
- MYPLYN is a marketplace connecting businesses (brands/advertisers) with social media creators.
- Businesses: create campaigns, set budgets, search creators, invite or accept creators, share materials via chat, approve posts, release secure payments.
- Creators: join free, list social pages, browse campaigns, apply, publish content, submit proof, withdraw earnings.
- Supported platforms: Instagram, TikTok, YouTube, X (Twitter), Facebook, LinkedIn.
- Pricing: Transparent. No subscriptions, no setup fees, no hidden costs.
  - Creators: Always free. Keep 100% of campaign earnings. No monthly fees.
  - Businesses: Platform fee of 10%–20% only when a campaign runs successfully. Creating campaigns and inviting creators is free.
- Payments: Funds held securely until work is approved. Stripe-powered. Cancel before go-live and unused funds return.
- Included features: AI campaign matching, secure payments, performance analytics, fraud protection, direct messaging, creator discovery, customer support.
- Contact: hello@myplyn.com, support@myplyn.com. Contact page: /contact. Reply within one business day.
- Team: Remote-first across Karachi, Dubai & London.
- In-app live chat for signed-in users: 9am–6pm.
- Sign up: Businesses → /auth/signup/advertiser | Creators → /auth/signup/creator`;

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';

function geminiUrl(apiKey, model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

export function getChatSystemPrompt() {
  return MYPLYN_SYSTEM_PROMPT;
}

function toGeminiContents(history, message) {
  const contents = history
    .slice(-20)
    .filter((m) => m?.role && m?.content)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content).slice(0, 4000) }],
    }));

  contents.push({
    role: 'user',
    parts: [{ text: String(message).slice(0, 2000) }],
  });

  return contents;
}

export function getFallbackReply(message) {
  const q = String(message).toLowerCase();

  if (/price|pricing|cost|fee|subscription|pay|₪|percent|%/.test(q)) {
    return 'MYPLYN pricing is simple and transparent:\n\n• Creators: Always free — keep 100% of earnings\n• Businesses: 10%–20% platform fee only when a campaign runs successfully\n• No subscriptions, setup fees, or hidden costs\n\nSee full details at /pricing or start at /auth/signup/advertiser.';
  }

  if (/creator|influencer|earn|join.*free|list.*page/.test(q)) {
    return 'Creators join MYPLYN for free! List your pages on Instagram, TikTok, YouTube, X, Facebook, and LinkedIn. Browse campaigns, apply, publish content, submit proof, and withdraw earnings — keeping 100% of what you earn.\n\nSign up free: /auth/signup/creator';
  }

  if (/business|brand|advertiser|campaign|launch/.test(q)) {
    return 'For businesses, MYPLYN makes it easy to launch creator campaigns:\n\n1. Create your profile\n2. Launch campaigns with your budget\n3. Invite or accept creators\n4. Approve posts and release secure payments\n\nStart free: /auth/signup/advertiser — learn more at /how-it-works.';
  }

  if (/how|work|process|step|flow|payout/.test(q)) {
    return 'MYPLYN is one transparent flow from match to payout.\n\nBusinesses create campaigns → connect with creators → approve content → pay securely.\nCreators join free → find campaigns → publish → get paid.\n\nFull walkthrough: /how-it-works';
  }

  if (/contact|email|support|help|talk|human/.test(q)) {
    return 'Reach our team at hello@myplyn.com or support@myplyn.com, or use the form at /contact. We reply within one business day.\n\nSigned-in users also have in-app chat 9am–6pm.';
  }

  if (/platform|instagram|tiktok|youtube|linkedin|facebook|social/.test(q)) {
    return 'MYPLYN supports Instagram, TikTok, YouTube, X (Twitter), Facebook, and LinkedIn. Creators list their pages and businesses search by niche, followers, and engagement.';
  }

  if (/secure|payment|stripe|escrow|fraud|cancel|refund/.test(q)) {
    return 'Payments on MYPLYN are secure — funds are held until you approve the work. Cancel before go-live and unused funds are returned. Stripe-powered payouts for creators.';
  }

  if (/sign up|signup|register|start|get started|account/.test(q)) {
    return 'Ready to join?\n\n• Business / brand → /auth/signup/advertiser\n• Creator → /auth/signup/creator\n\nBoth are free to register. No credit card required to browse.';
  }

  if (/hello|hi|hey|thanks|thank you/.test(q)) {
    return "Hi! I'm Plyn, MYPLYN's assistant. Ask me about pricing, how it works, creator signup, or business campaigns — I'm here to help!";
  }

  return "I'm Plyn, MYPLYN's assistant. I can help with pricing (/pricing), how it works (/how-it-works), joining as a creator (/auth/signup/creator), or launching campaigns (/auth/signup/advertiser). What would you like to know?";
}

async function callGemini(apiKey, model, history, message) {
  const res = await fetch(geminiUrl(apiKey, model), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: MYPLYN_SYSTEM_PROMPT }],
      },
      contents: toGeminiContents(history, message),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 500,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    const err = new Error(`Gemini ${model} failed: ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .filter(Boolean)
    .join('')
    .trim();

  if (!reply) {
    const err = new Error('Empty reply from Gemini');
    err.status = 502;
    throw err;
  }

  return reply;
}

export async function getChatReply({ message, history = [] }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const aiEnabled = process.env.CHAT_AI_ENABLED !== 'false';

  if (!aiEnabled || !apiKey) {
    if (!apiKey) console.warn('[chat] GEMINI_API_KEY missing — using keyword fallback');
    return { reply: getFallbackReply(message), source: 'fallback' };
  }

  const primaryModel = GEMINI_MODEL;
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.0-flash';
  const modelsToTry = [primaryModel];
  if (fallbackModel !== primaryModel) modelsToTry.push(fallbackModel);

  for (const model of modelsToTry) {
    try {
      const reply = await callGemini(apiKey, model, history, message);
      return { reply, source: 'gemini', model };
    } catch (err) {
      const snippet = typeof err.body === 'string' ? err.body.slice(0, 120) : err.message;
      console.warn(`[chat] Gemini ${model} failed (${err.status}):`, snippet);
    }
  }

  console.warn('[chat] All Gemini models failed — using keyword fallback');
  return { reply: getFallbackReply(message), source: 'fallback' };
}
