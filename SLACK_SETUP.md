# Slack App Setup Guide

This guide will walk you through setting up your Slack app and deploying it to Render (free tier).

## Step 1: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From an app manifest" (recommended)
4. Select your workspace
5. Copy and paste the contents of `slack-app-manifest.json`
6. **Update the URLs** in the manifest:
   - Replace `https://your-domain.com/slack/interactive` with your Render URL
   - Replace `https://your-domain.com/slack/events` with your Render URL
7. Click "Create App"

**Alternative: Manual Setup**
If you prefer manual setup:
1. Choose "From scratch"
2. Enter your app name (e.g., "Image Carousel Bot")
3. Select your workspace
4. Click "Create App"

## Step 2: Deploy to Render (Free Tier)

### 2.1: Prepare Your Repository

1. Push your code to GitHub (make sure to include all files)
2. Note: Don't commit your `.env` file - we'll use Render's environment variables

### 2.2: Create Render Service

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `slack-image-carousel` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (512MB RAM, 0.1 CPU)
5. Click "Create Web Service"

### 2.3: Configure Environment Variables

In your Render service dashboard:

1. Go to "Environment" tab
2. Add these environment variables:
   - `SLACK_BOT_TOKEN`: Your bot token (starts with `xoxb-`)
   - `SLACK_SIGNING_SECRET`: Your signing secret
   - `PORT`: `3000` (Render will override this, but good to have)
3. Click "Save Changes"

### 2.4: Get Your Render URL

1. Once deployed, Render will give you a URL like: `https://your-app-name.onrender.com`
2. Copy this URL - you'll need it for Slack configuration

## Step 3: Configure Slack App (If Manual Setup)

If you didn't use the manifest:

### 3.1: OAuth & Permissions

1. In your app settings, go to "OAuth & Permissions"
2. Add these Bot Token Scopes:
   - `chat:write` - Send messages as the bot
   - `channels:read` - View basic information about public channels
   - `groups:read` - View basic information about private channels
   - `im:read` - View basic information about direct messages
   - `mpim:read` - View basic information about group direct messages
3. Click "Install to Workspace"
4. Copy the "Bot User OAuth Token" (starts with `xoxb-`)
5. Add this token to your Render environment variables as `SLACK_BOT_TOKEN`

### 3.2: Get Your Signing Secret

1. Go to "Basic Information" in your app settings
2. Find "Signing Secret" section
3. Click "Show" and copy the secret
4. Add this to your Render environment variables as `SLACK_SIGNING_SECRET`

### 3.3: Enable Interactivity

1. Go to "Interactivity & Shortcuts" in your app settings
2. Turn on "Interactivity"
3. Set the Request URL to: `https://your-app-name.onrender.com/slack/interactive`

### 3.4: Create Slash Command (Optional)

1. Go to "Slash Commands" in your app settings
2. Click "Create New Command"
3. Fill in:
   - Command: `/carousel`
   - Request URL: `https://your-app-name.onrender.com/slack/command`
   - Short Description: `Show image carousel`
   - Usage Hint: `(optional)`
4. Click "Save"

## Step 4: Test Your Setup

1. **Deploy and Wait**: Render will automatically deploy your app (takes 2-3 minutes)
2. **Check Deployment**: Visit your Render URL to ensure it's running
3. **Invite Bot**: In Slack, invite your bot to a channel: `/invite @your-bot-name`
4. **Test Carousel**: Send `/carousel` command or use the API endpoint

### Testing Your Deployed Endpoints:

```bash
# Test health endpoint (replace with your Render URL)
curl https://your-app-name.onrender.com/health

# Test carousel posting (replace CHANNEL_ID with actual channel ID)
curl -X POST https://your-app-name.onrender.com/slack/carousel \
  -H "Content-Type: application/json" \
  -d '{"channel": "CHANNEL_ID"}'
```

## Render Free Tier Considerations

### Limitations:
- **Sleep Mode**: Free apps sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes ~30 seconds
- **Resource Limits**: 512MB RAM, 0.1 CPU
- **Build Time**: 90 minutes per month

### Tips for Free Tier:
- **Keep Alive**: Use a service like UptimeRobot to ping your app every 14 minutes
- **Optimize Images**: Use compressed images to reduce memory usage
- **Monitor Usage**: Check Render dashboard for resource usage

## Troubleshooting

### Common Issues:

1. **"Invalid signature" error**: Check that your `SLACK_SIGNING_SECRET` is correct in Render
2. **"Missing scope" error**: Make sure all required scopes are added to your Slack app
3. **"Channel not found" error**: Ensure your bot is invited to the channel
4. **Images not loading**: Check that image URLs are publicly accessible
5. **"Service unavailable" error**: App might be sleeping - wait 30 seconds and try again
6. **Build failures**: Check Render logs for dependency issues

### Render-Specific Issues:

- **Environment Variables**: Make sure they're set in Render dashboard, not `.env` file
- **Build Command**: Ensure `npm install` works (check `package.json` dependencies)
- **Start Command**: Verify `npm start` runs your server correctly
- **Sleep Mode**: Free apps sleep after inactivity - first request will be slow

## Security Notes

- Never commit your `.env` file to version control
- Use Render's environment variables instead of `.env` files
- Keep your signing secret secure
- Render provides HTTPS automatically
- Validate all incoming requests from Slack
- Monitor your Render service for unusual activity
