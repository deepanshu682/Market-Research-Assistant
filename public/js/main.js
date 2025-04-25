// Function to fetch and display market data
async function fetchMarketData() {
  try {
    const stockResponse = await fetch('http://localhost:3000/api/market/stock/overview');
    const cryptoResponse = await fetch('http://localhost:3000/api/market/crypto/overview');
    
    if (!stockResponse.ok || !cryptoResponse.ok) {
      throw new Error('Failed to fetch market data');
    }
    
    const stockData = await stockResponse.json();
    const cryptoData = await cryptoResponse.json();
    
    displayStockMarketData(stockData);
    displayCryptoMarketData(cryptoData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    document.getElementById('stockMarketData').innerHTML = '<div class="error">Failed to load stock market data</div>';
    document.getElementById('cryptoMarketData').innerHTML = '<div class="error">Failed to load cryptocurrency data</div>';
  }
}

// Function to display stock market data
function displayStockMarketData(data) {
  const stockMarketDiv = document.getElementById('stockMarketData');
  const marketStatus = data.marketStatus === 'Open' ? 'Market Open' : 'Market Closed';
  
  let html = `
    <div class="market-status ${data.marketStatus.toLowerCase()}">${marketStatus}</div>
    <div class="market-indices">
      ${data.majorIndices.map(index => `
        <div class="index">
          <span class="index-name">${index.index}</span>
          <span class="index-value">${index.value}</span>
          <span class="index-change ${index.change.startsWith('+') ? 'positive' : 'negative'}">
            ${index.change}
          </span>
        </div>
      `).join('')}
    </div>
    <div class="market-sectors">
      <h4>Top Performing Sectors</h4>
      <ul>
        ${data.sectors.map(sector => `
          <li>
            <span class="sector-name">${sector.sector}</span>
            <span class="sector-change ${sector.performance.startsWith('+') ? 'positive' : 'negative'}">
              ${sector.performance}
            </span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
  
  stockMarketDiv.innerHTML = html;
}

// Function to display cryptocurrency market data
function displayCryptoMarketData(data) {
  const cryptoMarketDiv = document.getElementById('cryptoMarketData');
  
  let html = `
    <div class="market-status ${data.marketStatus.toLowerCase()}">${data.marketStatus}</div>
    <div class="crypto-list">
      ${data.majorCryptos.map(crypto => `
        <div class="crypto-item">
          <div class="crypto-info">
            <span class="crypto-name">${crypto.crypto}</span>
          </div>
          <div class="crypto-price">${crypto.price}</div>
          <div class="crypto-change ${crypto.change.startsWith('+') ? 'positive' : 'negative'}">
            ${crypto.change}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="crypto-stats">
      <div class="stat">
        <span class="stat-label">Market Cap:</span>
        <span class="stat-value">${data.marketCap}</span>
      </div>
      <div class="stat">
        <span class="stat-label">24h Volume:</span>
        <span class="stat-value">${data.volume24h}</span>
      </div>
    </div>
  `;
  
  cryptoMarketDiv.innerHTML = html;
}

// Call fetchMarketData when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchMarketData();
  // Refresh market data every 5 minutes
  setInterval(fetchMarketData, 5 * 60 * 1000);
}); 
