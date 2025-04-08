const trendsService = require('../services/trendsService');

/**
 * Get keyword trends
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getKeywordTrends = async (req, res) => {
  try {
    const { keyword } = req.params;
    const trends = await trendsService.getKeywordTrends(keyword);
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error getting keyword trends:', error);
    res.status(500).json({ message: 'Error fetching keyword trends', error: error.message });
  }
};

/**
 * Get industry trends
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getIndustryTrends = async (req, res) => {
  try {
    const { industry } = req.params;
    const trends = await trendsService.getIndustryTrends(industry);
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error getting industry trends:', error);
    res.status(500).json({ message: 'Error fetching industry trends', error: error.message });
  }
};

/**
 * Get market trends
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMarketTrends = async (req, res) => {
  try {
    const { marketType } = req.params;
    const trends = await trendsService.getMarketTrends(marketType);
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error getting market trends:', error);
    res.status(500).json({ message: 'Error fetching market trends', error: error.message });
  }
};

module.exports = {
  getKeywordTrends,
  getIndustryTrends,
  getMarketTrends
}; 