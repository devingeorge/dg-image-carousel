/**
 * Slack utilities for handling authentication and verification
 */

const crypto = require('crypto');

/**
 * Verifies that a request came from Slack
 * @param {string} signingSecret - Your app's signing secret
 * @param {string} timestamp - The timestamp header
 * @param {string} body - The raw request body
 * @param {string} signature - The signature header
 * @returns {boolean} True if the request is valid
 */
const verifySlackRequest = (signingSecret, timestamp, body, signature) => {
  // Create the signature base string
  const sigBaseString = `v0:${timestamp}:${body}`;
  
  // Create the expected signature
  const expectedSignature = 'v0=' + crypto
    .createHmac('sha256', signingSecret)
    .update(sigBaseString)
    .digest('hex');
  
  // Compare signatures
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

/**
 * Extracts the channel ID from a Slack payload
 * @param {object} payload - The parsed Slack payload
 * @returns {string} The channel ID
 */
const getChannelId = (payload) => {
  return payload.channel?.id || payload.channel_id;
};

/**
 * Extracts the user ID from a Slack payload
 * @param {object} payload - The parsed Slack payload
 * @returns {string} The user ID
 */
const getUserId = (payload) => {
  return payload.user?.id || payload.user_id;
};

/**
 * Checks if the request timestamp is recent (within 5 minutes)
 * @param {string} timestamp - The timestamp from the request
 * @returns {boolean} True if the timestamp is recent
 */
const isRecentRequest = (timestamp) => {
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - (60 * 5);
  return parseInt(timestamp) > fiveMinutesAgo;
};

module.exports = {
  verifySlackRequest,
  getChannelId,
  getUserId,
  isRecentRequest
};
