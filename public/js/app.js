document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const analysisForm = document.getElementById('analysis-form');
  const resultsSection = document.getElementById('results-section');
  const resultsContent = document.getElementById('results-content');
  const newsList = document.getElementById('news-list');
  const loadingOverlay = document.getElementById('loading-overlay');
  const downloadBtn = document.getElementById('download-btn');
  
  // Event Listeners
  analysisForm.addEventListener('submit', handleFormSubmit);
  downloadBtn.addEventListener('click', handleDownload);
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Show loading overlay
    loadingOverlay.style.display = 'flex';
    
    // Get form data
    const formData = new FormData(analysisForm);
    const analysisData = {
      query: formData.get('query'),
      industry: formData.get('industry'),
      company: formData.get('company'),
      timeframe: formData.get('timeframe'),
      region: formData.get('region'),
      additionalContext: formData.get('additionalContext')
    };
    
    try {
      console.log('Sending analysis request:', analysisData);
      
      // Send request to API
      const response = await fetch('http://localhost:3000/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analysisData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(`Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Received analysis response:', data);
      
      // Display results
      displayResults(data);
      
      // Hide loading overlay
      loadingOverlay.style.display = 'none';
      
      // Show results section
      resultsSection.style.display = 'block';
      
      // Scroll to results
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error generating analysis:', error);
      
      // Display error message to user
      resultsSection.style.display = 'block';
      resultsContent.innerHTML = `
        <div class="error-message">
          <h3>Error Generating Analysis</h3>
          <p>${error.message}</p>
          <p>Please try again or contact support if the problem persists.</p>
        </div>
      `;
      
      // Hide loading overlay
      loadingOverlay.style.display = 'none';
    }
  }
  
  /**
   * Display analysis results
   * @param {Object} data - Analysis data from API
   */
  function displayResults(data) {
    // Format the analysis content with proper HTML
    const formattedAnalysis = formatAnalysisContent(data.analysis);
    
    // Update results content
    resultsContent.innerHTML = formattedAnalysis;
    
    // Update news list
    displayNews(data.news);
  }
  
  /**
   * Format analysis content with proper HTML
   * @param {string} content - Raw analysis content
   * @returns {string} Formatted HTML content
   */
  function formatAnalysisContent(content) {
    // Check if content is already HTML formatted
    if (content.includes('<h1>') || content.includes('<p>')) {
      return content;
    }
    
    // Split content by newlines
    const lines = content.split('\n');
    let html = '';
    
    // Process lines to create HTML structure
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        // Empty line, add paragraph break
        html += '<br>';
      } else if (trimmedLine.startsWith('# ')) {
        // Main heading
        html += `<h1>${trimmedLine.substring(2)}</h1>`;
      } else if (trimmedLine.startsWith('## ')) {
        // Sub heading
        html += `<h2>${trimmedLine.substring(3)}</h2>`;
      } else if (trimmedLine.startsWith('### ')) {
        // Sub-sub heading
        html += `<h3>${trimmedLine.substring(4)}</h3>`;
      } else if (trimmedLine.startsWith('- ')) {
        // List item
        html += `<li>${trimmedLine.substring(2)}</li>`;
      } else if (/^\d+\.\s/.test(trimmedLine)) {
        // Numbered list item
        html += `<li>${trimmedLine.substring(trimmedLine.indexOf(' ') + 1)}</li>`;
      } else {
        // Regular paragraph
        html += `<p>${trimmedLine}</p>`;
      }
    });
    
    // Clean up list items
    html = html.replace(/<li>.*?<\/li>/g, match => {
      if (!html.includes('<ul>') && !html.includes('<ol>')) {
        return `<ul>${match}</ul>`;
      }
      return match;
    });
    
    return html;
  }
  
  /**
   * Display news items
   * @param {Array} news - Array of news items
   */
  function displayNews(news) {
    if (!news || news.length === 0) {
      newsList.innerHTML = '<p>No related news found.</p>';
      return;
    }
    
    let html = '';
    
    news.forEach(item => {
      html += `
        <div class="news-item">
          <div class="news-title">
            <a href="${item.url}" target="_blank">${item.title}</a>
          </div>
          <div class="news-source">${item.source}</div>
          <div class="news-date">${formatDate(item.date)}</div>
        </div>
      `;
    });
    
    newsList.innerHTML = html;
  }
  
  /**
   * Format date to a more readable format
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  /**
   * Handle download button click
   */
  function handleDownload() {
    const analysisTitle = document.querySelector('#results-content h1')?.textContent || 'Analysis Results';
    const analysisContent = resultsContent.innerText;
    
    // Create a text file
    const blob = new Blob([analysisContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysisTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}); 
