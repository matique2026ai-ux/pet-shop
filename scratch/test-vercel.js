const url = 'https://pet-cat.vercel.app/api/whatsapp/autoresponder';

async function testLatency() {
  const start = Date.now();
  console.log(`Sending POST request to ${url}...`);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: {
          ruleId: 2,
          sender: "Akrour Toufik",
          isGroup: false,
          message: "هل لديكم أكل للقطط؟",
          isTestMessage: false,
          groupParticipant: ""
        },
        appPackageName: "tkstudio.autoresponderforwa",
        messengerPackageName: "com.whatsapp.w4b"
      })
    });
    const elapsed = Date.now() - start;
    console.log(`Status: ${response.status}`);
    console.log(`Time: ${elapsed}ms`);
    const text = await response.text();
    console.log(`Response: ${text}`);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testLatency();
