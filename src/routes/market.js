const express = require('express');
const router = express.Router();
const marketDataService = require('../services/marketDataService');

/**
 * @route GET /api/market/stock/overview
 * @desc Get stock market overview
 */
router.get('/stock/overview', async (req, res) => {
  try {
    const overview = await marketDataService.getStockMarketOverview();
    res.status(200).json(overview);
  } catch (error) {
    console.error('Error getting stock market overview:', error);
    res.status(500).json({ message: 'Error fetching stock market overview', error: error.message });
  }
});

/**
 * @route GET /api/market/stock/:symbol
 * @desc Get stock data for a specific company
 */
router.get('/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await marketDataService.getCompanyStockData(symbol);
    res.status(200).json(stockData);
  } catch (error) {
    console.error('Error getting stock data:', error);
    res.status(500).json({ message: 'Error fetching stock data', error: error.message });
  }
});

/**
 * @route GET /api/market/crypto/overview
 * @desc Get cryptocurrency market overview
 */
router.get('/crypto/overview', async (req, res) => {
  try {
    const overview = await marketDataService.getCryptoMarketOverview();
    res.status(200).json(overview);
  } catch (error) {
    console.error('Error getting crypto market overview:', error);
    res.status(500).json({ message: 'Error fetching crypto market overview', error: error.message });
  }
});

module.exports = router; 