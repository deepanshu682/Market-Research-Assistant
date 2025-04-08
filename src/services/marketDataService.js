const axios = require('axios');
require('dotenv').config();

// Alpha Vantage API configuration
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const ALPHA_VANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;

// Mock market data for development/testing or fallback when API key is not available
const mockMarketData = {
  stockMarketOverview: {
    marketStatus: 'Open',
    majorIndices: [
      { index: 'S&P 500', value: '4,782.13', change: '+0.45%' },
      { index: 'Dow Jones', value: '37,622.80', change: '+0.30%' },
      { index: 'NASDAQ', value: '16,354.45', change: '+0.55%' },
      { index: 'Russell 2000', value: '2,148.78', change: '-0.12%' }
    ],
    sectors: [
      { sector: 'Technology', performance: '+0.82%' },
      { sector: 'Healthcare', performance: '+0.42%' },
      { sector: 'Financials', performance: '+0.21%' },
      { sector: 'Consumer Discretionary', performance: '+0.35%' },
      { sector: 'Energy', performance: '-0.68%' }
    ],
    timestamp: new Date().toISOString()
  },
  cryptoMarketOverview: {
    marketStatus: 'Open',
    majorCryptos: [
      { crypto: 'Bitcoin', price: '$61,245.30', change: '+1.25%' },
      { crypto: 'Ethereum', price: '$3,102.45', change: '+0.87%' },
      { crypto: 'Cardano', price: '$1.12', change: '-0.35%' },
      { crypto: 'Solana', price: '$156.80', change: '+2.45%' }
    ],
    marketCap: '$2.35T',
    volume24h: '$95.8B',
    timestamp: new Date().toISOString()
  }
};

/**
 * Get stock market overview
 * @returns {Object} Stock market overview data
 */
const getStockMarketOverview = async () => {
  try {
    // If Alpha Vantage API key is available, use the real API
    if (ALPHA_VANTAGE_API_KEY && ALPHA_VANTAGE_API_KEY !== 'your_alphavantage_key_here') {
      // Get global market status
      const marketStatusResponse = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: 'SPY',  // S&P 500 ETF as reference
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });
      
      // Get sector performance
      const sectorResponse = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'SECTOR',
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });
      
      // Process responses to create overview
      if (marketStatusResponse.data && sectorResponse.data) {
        const spy = marketStatusResponse.data['Global Quote'];
        const sectors = sectorResponse.data['Rank A: Real-Time Performance'];
        
        // Create sectors array
        const sectorData = Object.entries(sectors).map(([sector, performance]) => ({
          sector,
          performance
        })).slice(0, 5);  // Get top 5 sectors
        
        return {
          marketStatus: spy && parseFloat(spy['10. change percent']) >= 0 ? 'Up' : 'Down',
          majorIndices: [
            { 
              index: 'S&P 500 (SPY)', 
              value: spy ? spy['05. price'] : 'N/A', 
              change: spy ? spy['10. change percent'] : 'N/A' 
            }
          ],
          sectors: sectorData,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Fallback to mock data if API not available or error occurs
    return mockMarketData.stockMarketOverview;
  } catch (error) {
    console.error('Error getting stock market overview:', error);
    // Return mock data in case of error
    return mockMarketData.stockMarketOverview;
  }
};

/**
 * Get company stock data
 * @param {string} symbol - Company stock symbol
 * @returns {Object} Company stock data
 */
const getCompanyStockData = async (symbol) => {
  try {
    // If Alpha Vantage API key is available, use the real API
    if (ALPHA_VANTAGE_API_KEY && ALPHA_VANTAGE_API_KEY !== 'your_alphavantage_key_here') {
      // Get company overview
      const overviewResponse = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'OVERVIEW',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });
      
      // Get current quote
      const quoteResponse = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });
      
      if (overviewResponse.data && quoteResponse.data['Global Quote']) {
        const overview = overviewResponse.data;
        const quote = quoteResponse.data['Global Quote'];
        
        return {
          symbol,
          name: overview.Name,
          exchange: overview.Exchange,
          industry: overview.Industry,
          marketCap: overview.MarketCapitalization,
          pe: overview.PERatio,
          dividend: overview.DividendYield,
          price: quote['05. price'],
          change: quote['10. change percent'],
          volume: quote['06. volume'],
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Fallback to mock data
    return {
      symbol,
      name: 'Mock Company, Inc.',
      exchange: 'NASDAQ',
      industry: 'Technology',
      marketCap: '1,250,000,000',
      pe: '25.4',
      dividend: '0.8',
      price: '158.92',
      change: '+1.2%',
      volume: '2,500,000',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error getting stock data for ${symbol}:`, error);
    // Return mock data in case of error
    return {
      symbol,
      name: 'Mock Company, Inc.',
      exchange: 'NASDAQ',
      industry: 'Technology',
      marketCap: '1,250,000,000',
      pe: '25.4',
      dividend: '0.8',
      price: '158.92',
      change: '+1.2%',
      volume: '2,500,000',
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get crypto market overview
 * @returns {Object} Crypto market overview data
 */
const getCryptoMarketOverview = async () => {
  try {
    // If Alpha Vantage API key is available, use the real API
    if (ALPHA_VANTAGE_API_KEY && ALPHA_VANTAGE_API_KEY !== 'your_alphavantage_key_here') {
      // Get Bitcoin price as reference
      const btcResponse = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: 'BTC',
          to_currency: 'USD',
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });
      
      // Get Ethereum price
      const ethResponse = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: 'ETH',
          to_currency: 'USD',
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });
      
      if (btcResponse.data && ethResponse.data) {
        const btcRate = btcResponse.data['Realtime Currency Exchange Rate'];
        const ethRate = ethResponse.data['Realtime Currency Exchange Rate'];
        
        return {
          marketStatus: 'Open', // Crypto markets are always open
          majorCryptos: [
            { 
              crypto: 'Bitcoin', 
              price: `$${parseFloat(btcRate['5. Exchange Rate']).toLocaleString()}`,
              change: 'N/A' // Alpha Vantage doesn't provide % change in this endpoint
            },
            { 
              crypto: 'Ethereum', 
              price: `$${parseFloat(ethRate['5. Exchange Rate']).toLocaleString()}`,
              change: 'N/A'
            }
          ],
          marketCap: 'N/A', // Would need additional API for this data
          volume24h: 'N/A',
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Fallback to mock data if API not available or error occurs
    return mockMarketData.cryptoMarketOverview;
  } catch (error) {
    console.error('Error getting crypto market overview:', error);
    // Return mock data in case of error
    return mockMarketData.cryptoMarketOverview;
  }
};

module.exports = {
  getStockMarketOverview,
  getCompanyStockData,
  getCryptoMarketOverview
}; 