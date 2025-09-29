# Slack Image Carousel

A beautiful interactive image carousel for Slack using Block Kit. This implementation allows users to navigate through a collection of images using previous/next buttons.

## Features

- Interactive navigation with << and >> buttons
- Page indicators showing current position
- Beautiful image display with titles
- Responsive design using Slack Block Kit
- Easy to customize with your own images

## Quick Setup with Render (Free Tier)

### 1. Deploy to Render

1. **Push to GitHub**: Upload your code to a GitHub repository
2. **Create Render Service**: 
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure: Node.js, Build Command: `npm install`, Start Command: `npm start`
   - Choose "Free" instance type
3. **Set Environment Variables** in Render dashboard:
   - `SLACK_BOT_TOKEN`: Your bot token (from Slack app)
   - `SLACK_SIGNING_SECRET`: Your signing secret (from Slack app)
4. **Deploy**: Render will automatically build and deploy your app

### 2. Create Slack App

**Option A: Use Manifest (Recommended)**
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From an app manifest"
3. Copy contents of `slack-app-manifest.json`
4. Update URLs to your Render URL: `https://your-app-name.onrender.com`
5. Click "Create App"

**Option B: Manual Setup**
1. Create app from scratch
2. Follow detailed instructions in `SLACK_SETUP.md`

### 3. Configure Slack App

1. **Install to Workspace**: In OAuth & Permissions, click "Install to Workspace"
2. **Copy Credentials**: Get Bot Token and Signing Secret
3. **Add to Render**: Set these as environment variables in Render dashboard
4. **Enable Interactivity**: Set Request URL to `https://your-app-name.onrender.com/slack/interactive`

### 4. Test Your Carousel

1. **Invite Bot**: `/invite @your-bot-name` in a Slack channel
2. **Test Command**: Send `/carousel` (if slash command is configured)
3. **Test API**: Use the `/slack/carousel` endpoint directly

## Local Development (Optional)

If you want to test locally:

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your credentials

# Run locally
npm start

# Use ngrok for Slack webhooks
ngrok http 3000
```

## Customization

### Adding Your Own Images

Edit the `ITEMS` array in `carousel.js`:

```javascript
const ITEMS = [
  {
    "title": "Your Image Title",
    "thumbnailLink": "https://your-image-url.com/image.jpg",
  },
  // Add more items...
];
```

### Styling

The carousel uses Slack Block Kit elements. You can customize:
- Button text (currently "<<" and ">>")
- Page indicator format
- Image layout and accessories
- Colors and formatting

## API Endpoints

- `POST /slack/interactive` - Handles button interactions
- `POST /slack/carousel` - Posts a new carousel to a channel

## Architecture

The carousel works by:
1. Building Block Kit elements with navigation buttons
2. Storing page state in button values
3. Handling interactions to update the message
4. Using Slack's `response_url` to update the original message

## Troubleshooting

- Ensure your Request URL is accessible from the internet
- Check that all required scopes are added
- Verify your bot token is correct
- Make sure images are publicly accessible URLs

## License

MIT
