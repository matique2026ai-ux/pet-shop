const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1'); // strip quotes if any
      envConfig[key] = val;
    }
  });
}

const token = envConfig.VERCEL_OIDC_TOKEN;
if (!token) {
  console.error("Missing VERCEL_OIDC_TOKEN in .env.local");
  process.exit(1);
}

async function run() {
  try {
    // Project name is 'pet-shop'
    const res = await fetch('https://api.vercel.com/v6/deployments?projectId=prj_ea71mxnFdbsoGTOw5ugn1GHXazJB&limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      console.error(`Vercel API error: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error(text);
      return;
    }
    
    const data = await res.json();
    console.log("Deployments:");
    data.deployments.forEach(d => {
      console.log(`- ID: ${d.uid}, State: ${d.state}, Created: ${new Date(d.createdAt).toISOString()}, Commit: ${d.meta?.githubCommitMessage || 'N/A'}`);
    });
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}

run();
