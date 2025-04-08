const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

/**
 * @route POST /api/analysis
 * @desc Generate custom analysis based on provided data
 */
router.post('/', analysisController.generateCustomAnalysis);

/**
 * @route POST /api/analysis/market-report
 * @desc Generate a comprehensive market report
 */
router.post('/market-report', analysisController.generateMarketReport);

/**
 * @route POST /api/analysis/swot
 * @desc Generate a SWOT analysis
 */
router.post('/swot', analysisController.generateSwotAnalysis);

module.exports = router; 