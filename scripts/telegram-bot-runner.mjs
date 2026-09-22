import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually for node standalone script
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

const LOCAL_WEBHOOK_URL = 'http://localhost:3001/api/telegram/webhook';
let offset = 0;

console.log('🤖 Starting SwasthyaSaathi Telegram Bot Polling Runner...');
console.log(`🔗 Forwarding updates to: ${LOCAL_WEBHOOK_URL}`);

// Verify bot details
async function init() {
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const me = await meRes.json();
    if (!me.ok) {
      console.error('❌ Failed to connect to Telegram Bot API:', me);
      process.exit(1);
    }
    console.log(`✅ Connected as @${me.result.username} (${me.result.first_name})`);
    console.log(`📱 You can test the bot right now by messaging https://t.me/${me.result.username}`);
    poll();
  } catch (err) {
    console.error('Init error:', err);
    setTimeout(init, 5000);
  }
}

async function poll() {
  while (true) {
    try {
      const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=20`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          const sender = update.message?.from?.first_name || 'User';
          const text = update.message?.text || update.message?.caption || '[Media]';
          console.log(`\n📩 Incoming from ${sender}: "${text}"`);

          try {
            const forwardRes = await fetch(LOCAL_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update),
            });
            const result = await forwardRes.json();
            const deliveryStatus = result.telegramResult?.ok ? 'DELIVERED ✅' : JSON.stringify(result.telegramResult || result);
            console.log(`📤 Reply dispatched: ${result.handled || 'OK'} -> ${deliveryStatus}`);
          } catch (fwdErr) {
            console.error('Error forwarding update to localhost webhook:', fwdErr.message);
          }
        }
      } else {
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (err) {
      console.error('Polling error (will retry in 3s):', err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

init();
