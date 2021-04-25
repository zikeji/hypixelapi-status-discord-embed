# hypixelapi-status-discord-embed

This simple script will check Hypixel's endpoints and create/update an embed with their status.

### Usage

* Clone this repo. `git clone https://github.com/zikeji/hypixelapi-status-discord-embed`

* Install dependencies. `npm ci`

* Copy `config.example.json` to `config.json` and update values.

  * `HYPIXEL_API_KEY` - Your Hypixel API key.
  * `DISCORD_WEBHOOK` - The Discord webhook URL you want to use.
  * `DISCORD_MESSAGEID` - The ID of the message you want to update - you can run this script without it, then copy the ID of that message and then add it to the config so that message updates instead of creating a new one.
  * `HEALTHCHECK_URL` - If you want to setup alerts using [Healthchecks](https://healthchecks.io/) you can put your unique URL here. This is optional.

* Run `index.js` to ensure you've configured it correctly. `node index.js`

* Create a cronjob for this script (`crontab -e` on most distros)

**Example:**

```
*/5 * * * * node /root/hypixelapi-status-discord-embed/index.js >> /root/hypixelapi-status-discord-embed/cron.log 2>&1
```
