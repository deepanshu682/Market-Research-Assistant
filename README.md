# Market Research Assistant

An AI-powered application that generates business insights using various APIs.

## Features

- Generate market analysis and business insights
- Competitive landscape research
- Industry trend analysis
- News and market data integration
- Real-time market data for stocks and cryptocurrencies

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your API keys:
   ```
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   ALPHAVANTAGE_API_KEY=your_alphavantage_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

- Access the web interface at `http://localhost:3000`
- Use the API endpoints for programmatic access

## API Endpoints

### Analysis
- `POST /api/analysis` - Generate custom analysis
- `POST /api/analysis/market-report` - Generate a comprehensive market report
- `POST /api/analysis/swot` - Generate a SWOT analysis

### Insights
- `GET /api/insights/industry/:industry` - Get insights for a specific industry
- `GET /api/insights/company/:company` - Get insights for a specific company
- `GET /api/insights/competitive/:company` - Get competitive analysis for a company

### Trends
- `GET /api/trends/:keyword` - Get trend analysis for a keyword
- `GET /api/trends/industry/:industry` - Get industry trends
- `GET /api/trends/market/:marketType` - Get market trends

### Market Data
- `GET /api/market/stock/overview` - Get stock market overview
- `GET /api/market/stock/:symbol` - Get stock data for a specific company
- `GET /api/market/crypto/overview` - Get cryptocurrency market overview

## Technologies Used

- Node.js
- Express.js
- Google Gemini API
- News API
- Alpha Vantage API 