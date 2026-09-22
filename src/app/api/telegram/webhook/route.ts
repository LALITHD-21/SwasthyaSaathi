import { NextRequest, NextResponse } from 'next/server';
import { triageSymptoms } from '@/lib/gemini';
import { checkEmergency } from '@/lib/redflags';
import { SPECIALIST_LABELS, SPECIALIST_ICONS, SpecialistType } from '@/types';
import { createClient } from '@/lib/supabase/server';

// Default persistent reply keyboard for Telegram users (always valid across all devices)
const DEFAULT_KEYBOARD = {
  keyboard: [
    [{ text: '🩺 Check Symptoms' }, { text: '🚨 Emergency (108)' }],
    [{ text: 'ℹ️ Help / मदद' }]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};

// Helper to send message via Telegram Bot API with detailed error logging
async function sendTelegramMessage(
  botToken: string,
  chatId: number | string,
  text: string,
  replyMarkup: any = DEFAULT_KEYBOARD
) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error('❌ Telegram sendMessage error:', JSON.stringify(data));
    } else {
      console.log('✅ Telegram message sent successfully to chat:', chatId);
    }
    return data;
  } catch (err) {
    console.error('❌ Failed to fetch Telegram sendMessage:', err);
    return null;
  }
}

// GET /api/telegram/webhook - Diagnostic Health Check
export async function GET(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'Swasthya2bot';

  return NextResponse.json({
    status: 'online',
    service: 'SwasthyaSaathi Telegram Bot Integration',
    botUsername,
    isBotTokenConfigured: Boolean(botToken && botToken.length > 10),
  });
}

// POST /api/telegram/webhook - Webhook Event Handler
export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not configured' }, { status: 500 });
  }

  try {
    const update = await req.json();
    const message = update.message;
    if (!message || !message.chat) {
      return NextResponse.json({ ok: true, note: 'No message in update' });
    }

    const chatId = message.chat.id;
    const incomingText = (message.text || message.caption || '').trim();
    const senderName = message.from?.first_name || 'Friend';
    const rawUserLang = message.from?.language_code || 'en';

    console.log(`📩 Webhook processing message from ${senderName} (Chat: ${chatId}): "${incomingText}"`);

    // 1. Check for Greetings, /start, /help
    const isGreeting = /^(hello|hi|hey|hola|namaste|नमस्ते|नमस्कार|ಹಲೋ|ನಮಸ್ಕಾರ|\/start|\/help|ℹ️ Help \/ मदद)/i.test(incomingText);
    if (isGreeting || !incomingText) {
      const welcomeHtml = `
<b>🙏 Namaste ${senderName}! Welcome to SwasthyaSaathi</b>
<i>(स्वास्थ्य साथी / ಸ್ವಾಸ್ಥ್ಯ ಸಾಥಿ)</i>

Your AI Health Companion for rural & Tier-2 India.

<b>🩺 How to check symptoms:</b>
Simply reply with what you are experiencing in <b>Hindi, Kannada, or English</b>.
<i>Examples:</i>
• "3 days fever, shivering, and headache"
• "2 दिन से बहुत तेज़ सिरदर्द और उल्टी आ रही है"
• "ಮೂರು ದಿನಗಳಿಂದ ತೀವ್ರ ಜ್ವರ ಮತ್ತು ತಲೆನೋವು"

<b>⚡ What I will do:</b>
1. Check urgency (🟢 Mild, 🟡 Moderate, 🔴 Urgent)
2. Recommend the right doctor to see
3. Suggest Government PHC & PM-JAY Ayushman facilities

🚨 <b>Emergency?</b> If you have chest pain or heavy bleeding, call <b>108</b> immediately!
      `.trim();

      const sendResult = await sendTelegramMessage(botToken, chatId, welcomeHtml);
      return NextResponse.json({ ok: true, handled: 'welcome', telegramResult: sendResult });
    }

    // 2. Check for Emergency commands
    const isEmergencyCommand = /^(\/emergency|\/108|108|🚨 Emergency \(108\)|emergency)$/i.test(incomingText);
    if (isEmergencyCommand) {
      const emergencyHtml = `
🚨 <b>IMMEDIATE MEDICAL EMERGENCY PROTOCOL</b> 🚨

If you or someone nearby is experiencing critical symptoms:
📞 <b>Call 108 immediately</b> (Free 24x7 Ambulance service across India).
🏥 <b>Visit the nearest Government Hospital or Emergency Ward right away.</b>
      `.trim();

      const sendResult = await sendTelegramMessage(botToken, chatId, emergencyHtml);
      return NextResponse.json({ ok: true, handled: 'emergency', telegramResult: sendResult });
    }

    // 3. Check for "Check Symptoms" prompt
    if (incomingText === '🩺 Check Symptoms') {
      const promptHtml = `
<b>🩺 Tell me your symptoms:</b>

Type or voice-message how you are feeling. For example:
• <i>"Fever for 2 days with body ache and sore throat"</i>
• <i>"मुझे 3 दिन से पेट में दर्द और दस्त है"</i>
• <i>"ಕಳೆದ 2 ದಿನಗಳಿಂದ ಕೆಮ್ಮು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆ"</i>
• <i>"Red itchy rash on my arm for 1 week"</i>

Our AI will analyze your urgency and recommend the right specialist.
      `.trim();

      const sendResult = await sendTelegramMessage(botToken, chatId, promptHtml);
      return NextResponse.json({ ok: true, handled: 'symptom_prompt', telegramResult: sendResult });
    }

    // 4. Check for Immediate Red Flag Symptoms
    const isEmergency = checkEmergency(incomingText);
    if (isEmergency) {
      const redFlagHtml = `
🚨 <b>EMERGENCY WARNING DETECTED</b> 🚨

Your symptoms indicate a potentially life-threatening emergency:
<b>"${incomingText}"</b>

⚠️ <b>Action Required:</b>
• <b>Call 108 immediately</b> for free ambulance support.
• Seek emergency medical care at the nearest hospital without delay.
      `.trim();

      const sendResult = await sendTelegramMessage(botToken, chatId, redFlagHtml);
      return NextResponse.json({ ok: true, handled: 'red_flag', telegramResult: sendResult });
    }

    // 5. Detect Language: Devanagari (hi), Kannada (kn), or English (en)
    let detectedLang: 'en' | 'hi' | 'kn' = 'en';
    if (/[\u0900-\u097F]/.test(incomingText) || rawUserLang.startsWith('hi')) {
      detectedLang = 'hi';
    } else if (/[\u0C80-\u0CFF]/.test(incomingText) || rawUserLang.startsWith('kn')) {
      detectedLang = 'kn';
    }

    // 6. Perform AI Triage using Gemini 3.6 Flash
    const triageResult = await triageSymptoms(incomingText, detectedLang);

    // Map Urgency Badge with emojis
    const urgencyMap = {
      mild: '🟢 Mild (हल्का / ಸೌಮ್ಯ)',
      moderate: '🟡 Moderate (मध्यम / ಮಧ್ಯಮ)',
      urgent: '🔴 Urgent (गंभीर / ತುರ್ತು)',
    };
    const urgencyDisplay = urgencyMap[triageResult.urgency_level] || triageResult.urgency_level;

    // Specialist Info
    const specKey = triageResult.recommended_specialist as SpecialistType;
    const specialistName = SPECIALIST_LABELS[specKey] || specKey;
    const specialistIcon = SPECIALIST_ICONS[specKey] || '👨‍⚕️';

    // Build Response HTML for Telegram
    const symptomsList = triageResult.detected_symptoms.map((s) => `• ${s}`).join('\n');
    const durationDisplay = triageResult.duration ? `\n⏱ <b>Duration:</b> ${triageResult.duration}` : '';

    const replyHtml = `
${specialistIcon} <b>SwasthyaSaathi AI Health Assessment</b>

📊 <b>Urgency:</b> ${urgencyDisplay}
👨‍⚕️ <b>Recommended Doctor:</b> ${specialistName}${durationDisplay}

📋 <b>Identified Symptoms:</b>
${symptomsList}

💡 <b>Guidance & Why:</b>
${triageResult.reasoning}

🏥 <b>Recommended Action:</b>
Consult a qualified doctor. You can visit your local Government Primary Health Centre (PHC) or Ayushman Bharat PM-JAY empanelled hospital for free or subsidized care.

⚠️ <i>${triageResult.disclaimer}</i>
    `.trim();

    // Send reply to Telegram
    const sendResult = await sendTelegramMessage(botToken, chatId, replyHtml);

    // Log to Supabase database (async non-blocking)
    try {
      const supabase = createClient();
      await supabase.from('symptom_checks').insert({
        transcript: incomingText,
        language: detectedLang,
        detected_symptoms: triageResult.detected_symptoms,
        duration: triageResult.duration,
        urgency_level: triageResult.urgency_level,
        recommended_specialist: triageResult.recommended_specialist,
        ai_reasoning: triageResult.reasoning,
        red_flag_triggered: triageResult.red_flag_triggered,
        created_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('Supabase Telegram logging notice:', dbErr);
    }

    return NextResponse.json({
      ok: true,
      handled: 'triage',
      telegramResult: sendResult,
      triage: triageResult,
    });
  } catch (error: any) {
    console.error('Telegram webhook handler error:', error);
    return NextResponse.json(
      { ok: false, error: error?.message || 'Webhook internal error' },
      { status: 500 }
    );
  }
}
