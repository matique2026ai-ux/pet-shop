const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1');
      envConfig[key] = val;
    }
  });
}
const apiKey = envConfig.GEMINI_API_KEY || envConfig.GEMINI_KEY || envConfig.GOOGLE_API_KEY;
async function test() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const response = await fetch(url);
  const json = await response.json();
  console.log(json.models ? json.models.map(m => m.name).filter(n => n.includes("gemini")) : json);
}
test();
