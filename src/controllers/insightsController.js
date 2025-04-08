const insightsService = require('../services/insightsService');

/**
 * Get industry insights
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getIndustryInsights = async (req, res) => {
  try {
    const { industry } = req.params;
    const insights = await insightsService.getIndustryInsights(industry);
    res.status(200).json(insights);
  } catch (error) {
    console.error('Error getting industry insights:', error);
    res.status(500).json({ message: 'Error fetching industry insights', error: error.message });
  }
};

/**
 * Get company insights
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCompanyInsights = async (req, res) => {
  try {
    const { companyName } = req.params;
    const insights = await insightsService.getCompanyInsights(companyName);
    res.status(200).json(insights);
  } catch (error) {
    console.error('Error getting company insights:', error);
    res.status(500).json({ message: 'Error fetching company insights', error: error.message });
  }
};

/**
 * Get competitive analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCompetitiveAnalysis = async (req, res) => {
  try {
    const { companyName } = req.params;
    const analysis = await insightsService.getCompetitiveAnalysis(companyName);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error getting competitive analysis:', error);
    res.status(500).json({ message: 'Error fetching competitive analysis', error: error.message });
  }
};

module.exports = {
  getIndustryInsights,
  getCompanyInsights,
  getCompetitiveAnalysis
}; 