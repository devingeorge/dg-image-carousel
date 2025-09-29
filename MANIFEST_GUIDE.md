# Slack App Manifest Usage

## How to Use This Manifest

### Option 1: Create App from Manifest (Recommended)

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From an app manifest"
4. Select your workspace
5. Copy and paste the contents of `slack-app-manifest.json`
6. Click "Create"
7. The app will be created with all the necessary settings!

### Option 2: Import Existing App

If you already have a Slack app:

1. Go to your app settings at [api.slack.com/apps](https://api.slack.com/apps)
2. Select your app
3. Go to "App Manifest" in the left sidebar
4. Click "Update" or "Create Manifest"
5. Copy and paste the contents of `slack-app-manifest.json`
6. Click "Save Changes"

## Important: Update URLs

**Before using the manifest, you MUST update these URLs:**

1. **Interactive Request URL**: Replace `https://your-domain.com/slack/interactive` with your actual server URL
2. **Event Subscriptions URL**: Replace `https://your-domain.com/slack/events` with your actual server URL

### For Local Development:

Use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start your server
npm start

# In another terminal, expose port 3000
ngrok http 3000
```

Then update the manifest with your ngrok URL:
- `https://abc123.ngrok.io/slack/interactive`
- `https://abc123.ngrok.io/slack/events`

### For Production:

Use your actual domain:
- `https://yourdomain.com/slack/interactive`
- `https://yourdomain.com/slack/events`

## What This Manifest Includes

✅ **Bot User**: Configured with proper display name  
✅ **OAuth Scopes**: All required permissions for the carousel  
✅ **Slash Command**: `/carousel` command for easy access  
✅ **Interactivity**: Enabled for button interactions  
✅ **Event Subscriptions**: Ready for future enhancements  

## After Creating the App

1. **Install to Workspace**: Click "Install to Workspace" in the OAuth & Permissions section
2. **Get Credentials**: Copy the Bot User OAuth Token and Signing Secret
3. **Update Environment**: Add these to your `.env` file
4. **Test**: Invite the bot to a channel and try `/carousel`

## Troubleshooting

- **"Invalid URL" error**: Make sure your server is running and accessible
- **"Missing scope" error**: The manifest includes all required scopes
- **"Command not found" error**: Make sure the slash command is properly configured

The manifest approach is much faster than manual configuration and ensures you don't miss any required settings!
