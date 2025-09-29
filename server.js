/**
 * Express server for handling Slack interactive image carousel
 * Based on the tutorial from https://stateful.com/blog/slack-interactive-image-carousel
 */

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const { getInitialCarousel, getCarouselForPage } = require('./carousel');
const { verifySlackRequest, getChannelId, getUserId, isRecentRequest } = require('./slackUtils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Raw body parser for Slack signature verification
app.use('/slack/interactive', express.raw({ type: 'application/x-www-form-urlencoded' }));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Endpoint to post a new carousel to a channel
 * Usage: POST /slack/carousel with { channel: "channel-id" }
 */
app.post('/slack/carousel', async (req, res) => {
  try {
    const { channel } = req.body;
    
    if (!channel) {
      return res.status(400).json({ error: 'Channel ID is required' });
    }

    const carousel = getInitialCarousel();
    
    // Post the carousel to Slack
    const response = await superagent
      .post('https://slack.com/api/chat.postMessage')
      .set('Authorization', `Bearer ${process.env.SLACK_BOT_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({
        channel: channel,
        ...carousel
      });

    if (response.body.ok) {
      res.json({ 
        success: true, 
        message: 'Carousel posted successfully',
        ts: response.body.ts
      });
    } else {
      res.status(400).json({ 
        error: 'Failed to post carousel', 
        details: response.body.error 
      });
    }
  } catch (error) {
    console.error('Error posting carousel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Handle Slack interactive events (button clicks)
 */
app.post('/slack/interactive', async (req, res) => {
  try {
    // Verify the request came from Slack
    const timestamp = req.headers['x-slack-request-timestamp'];
    const signature = req.headers['x-slack-signature'];
    
    if (!timestamp || !signature) {
      return res.status(400).json({ error: 'Missing Slack headers' });
    }

    // Check if request is recent
    if (!isRecentRequest(timestamp)) {
      return res.status(400).json({ error: 'Request too old' });
    }

    // Verify signature
    if (!verifySlackRequest(process.env.SLACK_SIGNING_SECRET, timestamp, req.body, signature)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Parse the payload
    const payload = JSON.parse(req.body.toString());
    const { actions, response_url } = payload;

    if (!actions || actions.length === 0) {
      return res.status(400).json({ error: 'No actions found' });
    }

    // Get the button value (page number)
    const page = parseInt(actions[0].value);
    
    if (isNaN(page)) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    // Build the new carousel for the requested page
    const carousel = getCarouselForPage(page);

    // Update the original message using the response_url
    await superagent
      .post(response_url)
      .set('Content-Type', 'application/json')
      .send(carousel);

    // Acknowledge the interaction
    res.status(200).send();

  } catch (error) {
    console.error('Error handling interactive event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Slash command endpoint (optional)
 * You can create a slash command in your Slack app that calls this endpoint
 */
app.post('/slack/command', async (req, res) => {
  try {
    const { channel_id, user_id } = req.body;
    
    // Get the initial carousel
    const carousel = getInitialCarousel();
    
    // Post the carousel
    const response = await superagent
      .post('https://slack.com/api/chat.postMessage')
      .set('Authorization', `Bearer ${process.env.SLACK_BOT_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({
        channel: channel_id,
        ...carousel
      });

    if (response.body.ok) {
      res.json({ 
        response_type: 'in_channel',
        text: 'Here\'s your image carousel!',
        ...carousel
      });
    } else {
      res.status(400).json({ 
        response_type: 'ephemeral',
        text: `Error: ${response.body.error}` 
      });
    }
  } catch (error) {
    console.error('Error handling slash command:', error);
    res.status(500).json({ 
      response_type: 'ephemeral',
      text: 'Internal server error' 
    });
  }
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`🚀 Slack Image Carousel server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🎠 Post carousel: POST http://localhost:${PORT}/slack/carousel`);
  console.log(`🔗 Interactive endpoint: POST http://localhost:${PORT}/slack/interactive`);
  
  if (!process.env.SLACK_BOT_TOKEN) {
    console.warn('⚠️  SLACK_BOT_TOKEN not set in environment variables');
  }
  if (!process.env.SLACK_SIGNING_SECRET) {
    console.warn('⚠️  SLACK_SIGNING_SECRET not set in environment variables');
  }
});

module.exports = app;
