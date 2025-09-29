/**
 * Test script for the Slack Image Carousel
 * Run this to test your carousel locally
 */

const { getInitialCarousel, getCarouselForPage } = require('./carousel');

console.log('🎠 Testing Slack Image Carousel\n');

// Test initial carousel
console.log('📄 Initial Carousel:');
console.log(JSON.stringify(getInitialCarousel(), null, 2));

console.log('\n' + '='.repeat(50) + '\n');

// Test carousel for page 2
console.log('📄 Carousel for Page 2:');
console.log(JSON.stringify(getCarouselForPage(1), null, 2));

console.log('\n' + '='.repeat(50) + '\n');

// Test carousel for last page
console.log('📄 Carousel for Last Page:');
console.log(JSON.stringify(getCarouselForPage(3), null, 2));

console.log('\n✅ All tests completed!');
console.log('\nTo test with Slack:');
console.log('1. Set up your Slack app with the required scopes');
console.log('2. Configure your environment variables');
console.log('3. Start the server: npm start');
console.log('4. Use ngrok to expose your local server');
console.log('5. Update your Slack app\'s interactive endpoint URL');
console.log('6. Post a carousel using the /slack/carousel endpoint');
