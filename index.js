// Load environment variables from .env file
require('dotenv').config();

const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');

// Access the environment variables
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

// URL to the page you want to scrape
const url = 'https://www.snusdirect.eu/zyn';

// List of products you want to monitor
const productsToCheck = [
  'ZYN Black Cherry 3mg',
  'ZYN Slim Violet Licorice Extra Strong',
];

// Store the stock status of each product (true = out of stock, false = in stock)
let outOfStockProducts = {};

// Function to send a message to a Telegram channel
const sendTelegramMessage = (message) => {
  const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  axios
    .post(telegramUrl, {
      chat_id: telegramChatId,
      text: message,
      parse_mode: 'Markdown',
    })
    .then((response) => {
      console.log('Message sent to Telegram channel:', response.data);
    })
    .catch((error) => {
      console.error('Error sending message to Telegram:', error);
    });
};

// Function to check if a product is out of stock
const checkStock = async () => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    productsToCheck.forEach((product) => {
      const productElement = $(`li:contains('${product}')`);
      if (productElement.length > 0) {
        const outOfStock =
          productElement.find('h6:contains("Temporarily out of stock")')
            .length > 0;
        const productUrl = productElement.find('a.product-image').attr('href');
        const fullProductUrl = `https://www.snusdirect.eu${productUrl}`;

        if (outOfStock) {
          console.log(`${product} is temporarily out of stock.`);
          outOfStockProducts[product] = true;
        } else {
          if (outOfStockProducts[product]) {
            const message = `\`${product}\` is back in stock!\n${fullProductUrl}`;
            console.log(message);
            sendTelegramMessage(message);
          }
          outOfStockProducts[product] = false;
        }
      } else {
        console.log(`${product} not found on the page.`);
      }
    });
  } catch (error) {
    console.error('Error fetching the product page:', error);
  }
};

// Test alert function to trigger a message manually
const testAlert = () => {
  const testProduct = 'ZYN Black Cherry 3mg';
  const testUrl = 'https://www.snusdirect.eu/zyn/zyn-black-cherry-3mg';
  const message = `\`${testProduct}\` is back in stock!\n${testUrl}`;

  console.log('Sending test alert...');
  sendTelegramMessage(message);
};

// Schedule the stock check to run every 30 minutes
cron.schedule('*/30 * * * *', () => {
  console.log('Running scheduled stock check...');
  checkStock();
});

// Manual trigger: Run the stock check immediately if the script is executed directly
if (process.argv.includes('--manual')) {
  console.log('Running manual stock check...');
  checkStock();
}

// Test alert: Trigger an alert for testing purposes
if (process.argv.includes('--test')) {
  testAlert();
}
