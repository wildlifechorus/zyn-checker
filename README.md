
# ZYN Checker

ZYN Checker is a simple Node.js script that monitors the stock status of ZYN nicotine products from SnusDirect. It alerts you via a Telegram message when a product that was previously out of stock comes back in stock.

## Features

- Scrapes the SnusDirect website for product availability.
- Sends a Telegram alert when a specified product is back in stock.
- Tracks the stock status to avoid duplicate alerts.
- Ability to manually trigger stock checks and test alerts.
- Scheduled stock checks using cron (every 30 minutes by default).

## Requirements

- Node.js
- NPM

## Installation

1. Clone this repository:
   ```bash
   git clone <repository_url> zyn-checker
   ```

2. Navigate to the project directory:
   ```bash
   cd zyn-checker
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file and add your Telegram Bot Token and Channel ID:
   ```bash
   TELEGRAM_BOT_TOKEN=<Your Bot Token>
   TELEGRAM_CHAT_ID=<Your Channel ID>
   ```

## Usage

### Run a stock check manually:
```bash
node script.js --manual
```

### Test alert functionality:
```bash
node script.js --test
```

### Automated stock checks

The script will automatically check the stock of your specified products every 30 minutes using `node-cron`. No further action is needed after starting the script.

## Configuration

- **Products to Check**: You can modify the products you want to monitor by editing the `productsToCheck` array in `script.js`.
  
  ```javascript
  const productsToCheck = [
      'ZYN Black Cherry 3mg',
      'ZYN Slim Violet Licorice Extra Strong'
  ];
  ```

- **Stock Alert**: Modify the `sendTelegramMessage` function if you wish to customize the message sent to your Telegram channel.

## License

This project is licensed under the MIT License.
