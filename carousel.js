/**
 * Carousel building logic for Slack Block Kit
 * Based on the tutorial from https://stateful.com/blog/slack-interactive-image-carousel
 */

// The collection of items to display in the carousel
const ITEMS = [
  {
    "title": "Lilly Awaiting her Snoot Boops",
    "thumbnailLink": "https://i.imgur.com/ypH7AsV.jpeg",
  },
  {
    "title": "My deaf good boy",
    "thumbnailLink": "https://imgur.com/PtJfPvT"
  },
  {
    "title": "Lloyd & Harry",
    "thumbnailLink": "https://i.imgur.com/SgS1fLo.jpeg",
  },
  {
    "title": "My best pup friend",
    "thumbnailLink": "https://i.imgur.com/hULDSE5.jpeg",
  }
];

/**
 * Builds an image carousel using Slack block kit elements.
 * @param {object} currentItem - The current item to display
 * @param {number} currentPage - The currently displayed page (0-based)
 * @param {number} prevPage - The previous page number
 * @param {number} nextPage - The next page number
 * @returns {object} A carousel component built with block kit elements
 */
const buildCarousel = (currentItem, currentPage, prevPage, nextPage) => {
  return {
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Page ${currentPage + 1} of ${ITEMS.length}`
        },
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*${currentItem.title}*`
        },
        "accessory": {
          "type": "image",
          "image_url": currentItem.thumbnailLink,
          "alt_text": currentItem.title
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "<<"
            },
            "value": `${prevPage}`,
            "action_id": "carousel_prev"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": ">>"
            },
            "value": `${nextPage}`,
            "action_id": "carousel_next"
          }
        ]
      }
    ]
  };
};

/**
 * Calculates the next page number with wraparound
 * @param {number} currentPage - Current page (0-based)
 * @returns {number} Next page number
 */
const getNextPage = (currentPage) => {
  return (currentPage + 1) % ITEMS.length;
};

/**
 * Calculates the previous page number with wraparound
 * @param {number} currentPage - Current page (0-based)
 * @returns {number} Previous page number
 */
const getPrevPage = (currentPage) => {
  return currentPage === 0 ? ITEMS.length - 1 : currentPage - 1;
};

/**
 * Gets the initial carousel for the first page
 * @returns {object} Initial carousel block kit
 */
const getInitialCarousel = () => {
  const currentPage = 0;
  const prevPage = getPrevPage(currentPage);
  const nextPage = getNextPage(currentPage);
  
  return buildCarousel(ITEMS[currentPage], currentPage, prevPage, nextPage);
};

/**
 * Gets a carousel for a specific page
 * @param {number} page - Page number (0-based)
 * @returns {object} Carousel block kit for the specified page
 */
const getCarouselForPage = (page) => {
  const currentPage = page;
  const prevPage = getPrevPage(currentPage);
  const nextPage = getNextPage(currentPage);
  
  return buildCarousel(ITEMS[currentPage], currentPage, prevPage, nextPage);
};

module.exports = {
  ITEMS,
  buildCarousel,
  getNextPage,
  getPrevPage,
  getInitialCarousel,
  getCarouselForPage
};
