const analysisService = require('../services/analysisService');

/**
 * Generate custom analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateCustomAnalysis = async (req, res) => {
  try {
    const analysisData = req.body;
    
    if (!analysisData || !analysisData.query) {
      return res.status(400).json({ message: 'Analysis query is required' });
    }
    
    console.log('Received analysis request:', JSON.stringify(analysisData));
    
    const analysis = await analysisService.generateCustomAnalysis(analysisData);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error generating custom analysis:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    // Send a more detailed error response
    res.status(500).json({ 
      message: 'Error generating custom analysis', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Generate market report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateMarketReport = async (req, res) => {
  try {
    const { industry, timeframe, region } = req.body;
    
    if (!industry) {
      return res.status(400).json({ message: 'Industry is required' });
    }
    
    const report = await analysisService.generateMarketReport(industry, timeframe, region);
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating market report:', error);
    res.status(500).json({ message: 'Error generating market report', error: error.message });
  }
};

/**
 * Generate SWOT analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateSwotAnalysis = async (req, res) => {
  try {
    const { companyName } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ message: 'Company name is required' });
    }
    
    const swotAnalysis = await analysisService.generateSwotAnalysis(companyName);
    res.status(200).json(swotAnalysis);
  } catch (error) {
    console.error('Error generating SWOT analysis:', error);
    res.status(500).json({ message: 'Error generating SWOT analysis', error: error.message });
  }
};

module.exports = {
  generateCustomAnalysis,
  generateMarketReport,
  generateSwotAnalysis
}; 