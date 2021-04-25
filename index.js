const fetch = require('node-fetch');
require('dotenv').config();

const api_key = process.env.HYPIXEL_API_KEY;
const webhook = process.env.DISCORD_WEBHOOK;
const messageId = process.env.DISCORD_MESSAGEID;
const healthcheckUrl = process.env.HEALTHCHECK_URL;

const check = async (url) => {
  url = `https://api.hypixel.net/${url}`;
  url += url.includes('?') ? `&key=${api_key}` : `?key=${api_key}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    return response.status;
  }
  try {
    const data = await response.json();
    return data.success;
  } catch (e) {
    return false;
  }
};

(async () => {
  const auctions = await check('skyblock/auctions');
  const bazaar = await check('skyblock/bazaar');
  const profiles = await check('skyblock/profile?profile=a1ff418432c34d968d14e4999021dcb7');
  const player = await check('player?uuid=ec1811e6822b4843bcd4fef82f75deb7');
  const guild = await check('guild?name=SkyBlockZ');
  const allOnline = auctions === true && bazaar === true && profiles === true && player === true && guild === true;

  const embeds = [
    {
      "title": "Hypixel API Endpoint Status",
      "color": allOnline ? 3127627 : 12136239,
      "fields": [
        {
          "name": "Player",
          "value": player === true ? "✅" : `❌${player !== false ? ` [${player}]` : ''}`,
          "inline": true
        },
        {
          "name": "Guild",
          "value": guild === true ? "✅" : `❌${guild !== false ? ` [${guild}]` : ''}`,
          "inline": true
        },
        {
          "name": "SkyBlock Auctions",
          "value": auctions === true ? "✅" : `❌${auctions !== false ? ` [${auctions}]` : ''}`,
          "inline": true
        },
        {
          "name": "SkyBlock Bazaar",
          "value": bazaar === true ? "✅" : `❌${bazaar !== false ? ` [${bazaar}]` : ''}`,
          "inline": true
        },
        {
          "name": "SkyBlock Profiles",
          "value": profiles === true ? "✅" : `❌${profiles !== false ? ` [${profiles}]` : ''}`,
          "inline": true
        }
      ],
      "timestamp": new Date().toISOString(),
      "footer": {
        "text": "Last Checked"
      }
    }
  ];

  const response = await fetch(`${webhook}${messageId ? `/messages/${messageId}` : ''}`, {
      method: messageId ? "patch" : "post",
      body: JSON.stringify({embeds}),
      headers: {
          'Content-Type': 'application/json'
      }
  });
  console.log(`Completed check at ${new Date().toUTCString()}, ${allOnline ? 'all endpoints online' : 'some endpoints unavailable'}`);
  if (response.status >= 300) {
      console.error(`Warning! Webhook updated failed with status ${response.status}`);
      console.error(await response.text());
      process.exit(-1);
  }
  if (healthcheckUrl) {
    if (allOnline) {
      await fetch(healthcheckUrl);
    } else {
      await fetch(`${healthcheckUrl}/fail`, {
        method: 'POST',
        body: `Player: ${player}\nGuild: ${guild}\nSkyBlock Auctions: ${auctions}\nSkyBlock Bazaar: ${bazaar}\n SkyBlock Profiles: ${profiles}`
      });
    }
  }
  process.exit(0);
})();
