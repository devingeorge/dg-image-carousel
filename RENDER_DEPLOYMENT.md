# Render Deployment Guide

This guide covers deploying your Slack Image Carousel to Render's free tier.

## Prerequisites

- GitHub account
- Render account (free)
- Slack app credentials

## Step-by-Step Deployment

### 1. Prepare Your Code

1. **Push to GitHub**: Upload all your files to a GitHub repository
2. **Important**: Don't commit your `.env` file - we'll use Render's environment variables

### 2. Create Render Service

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

### 3. Configure Environment Variables

In your Render service dashboard:

1. Go to "Environment" tab
2. Add these environment variables:
   - `SLACK_BOT_TOKEN`: Your bot token (starts with `xoxb-`)
   - `SLACK_SIGNING_SECRET`: Your signing secret
   - `PORT`: `3000` (Render will override this, but good to have)
3. Click "Save Changes"

### 4. Deploy and Test

1. **Deploy**: Render will automatically build and deploy your app
2. **Wait**: Initial deployment takes 2-3 minutes
3. **Get URL**: Render will provide a URL like `https://your-app-name.onrender.com`
4. **Test**: Visit your URL to ensure it's running

## Render Free Tier Considerations

### Limitations:
- **Sleep Mode**: Apps sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes ~30 seconds
- **Resource Limits**: 512MB RAM, 0.1 CPU
- **Build Time**: 90 minutes per month

### Tips for Free Tier:
- **Keep Alive**: Use UptimeRobot to ping your app every 14 minutes
- **Optimize Images**: Use compressed images to reduce memory usage
- **Monitor Usage**: Check Render dashboard for resource usage

## Troubleshooting Render Issues

### Common Problems:

1. **Build Failures**:
   - Check Render logs for dependency issues
   - Ensure `package.json` has correct dependencies
   - Verify build command: `npm install`

2. **Start Failures**:
   - Check that `npm start` works locally
   - Verify start command in Render settings
   - Check server logs for errors

3. **Environment Variables**:
   - Make sure they're set in Render dashboard
   - Don't use `.env` files in production
   - Check variable names match exactly

4. **Sleep Mode Issues**:
   - First request after sleep will be slow (~30 seconds)
   - Use keep-alive service to prevent sleep
   - Consider upgrading to paid tier for production

### Render-Specific Commands:

```bash
# Check if your app is running
curl https://your-app-name.onrender.com/health

# Test carousel endpoint
curl -X POST https://your-app-name.onrender.com/slack/carousel \
  -H "Content-Type: application/json" \
  -d '{"channel": "CHANNEL_ID"}'
```

## Upgrading from Free Tier

If you need more resources:

1. **Paid Plans**: Start at $7/month for always-on service
2. **Benefits**: No sleep mode, more resources, better performance
3. **Upgrade**: Go to your service settings → "Instance Type" → Choose paid plan

## Security Best Practices

- Use Render's environment variables (not `.env` files)
- Keep your Slack credentials secure
- Monitor your service for unusual activity
- Use HTTPS (provided automatically by Render)
- Validate all incoming Slack requests

## Monitoring Your App

- **Logs**: Check Render dashboard for real-time logs
- **Metrics**: Monitor CPU and memory usage
- **Uptime**: Use external services to monitor availability
- **Alerts**: Set up notifications for failures
