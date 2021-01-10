# Discord Bot - Naut Drop

A node.js discord bot with the functionality of the [awesomenauts drafter website](https://github.com/JeffSallans/awesomenauts-drafter).

Based on the SitePoint  article: [https://www.sitepoint.com/discord-bot-node-js/](https://www.sitepoint.com/discord-bot-node-js/)

## Tech Stack

- [Node.js](http://nodejs.org/)
- [TypeScript]() See tsconfig.json
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord.js]() See npm dependencies
- [Lodash]() See npm dependencies
- [Docker]() See Dockerfile
- [Github Actions]() See .github folder

## Deployment

1. Clone repo
2. Set DISCORD_BOT_TOKEN (via GitHub Settings > Secrets)
2. Pull dependencies with run `npm install` (via GitHub Action)
3. Compile typescript with run `npm build` (via GitHub Action)
3. Build container with run `` (via GitHub Action)
4. Publish container with run `` (via GitHub Action)
5. Deploy Container (via AWS Elastic Beanstalk)

## Local Development

1. Clone repo
2. Run `npm install`
3. Add TOKEN to the `.env` file, this is the discord bot token
```
TOKEN=Nzk2MjA2NzAxMTI3NjYzNjE2.X_UjRg.XXXXXXXXXXXXXXXXXXX
```
3. Start VSCode debugger or run `npm run build` then `npm start`
4. Add the discord bot to your server with the following URL
`https://discord.com/oauth2/authorize?client_id=796206701127663616&scope=bot`
Replace the client ID with your discord developer portal app client id.
5. Interact with your Discord bot via your web browser

