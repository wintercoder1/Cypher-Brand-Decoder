// Network Manager for Brand Owner API requests

class NetworkManager {
  constructor() {
    this.baseUrl = 'https://compass-ai-internal-api.com';
    this.cache = new Map(); // Simple in-memory cache
    this.requestTimeout = 10000; // 10 seconds timeout
  }

  /**
   * Fetch brand owner information from the API
   * @param {string} brandName - The brand name to lookup
   * @returns {Promise<Object|null>} - Brand owner data or null if failed
   */
  async fetchBrandOwner(brandName) {
    if (!brandName || typeof brandName !== 'string') {
      console.error('Invalid brand name provided');
      return null;
    }

    const trimmedBrand = brandName.trim();
    
    // Check cache first
    if (this.cache.has(trimmedBrand)) {
      console.log('Returning cached result for:', trimmedBrand);
      return this.cache.get(trimmedBrand);
    }

    try {
      const url = `${this.baseUrl}/getCompanyThatOwnsBrand/${encodeURIComponent(trimmedBrand)}`;
      console.log('Fetching brand owner from:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!this.isValidBrandOwnerResponse(data)) {
        throw new Error('Invalid response format from API');
      }

      // Cache the successful result
      this.cache.set(trimmedBrand, data);
      
      console.log('Successfully fetched brand owner:', data);
      return data;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out for brand:', trimmedBrand);
      } else {
        console.error('Error fetching brand owner for', trimmedBrand, ':', error);
      }
      
      // Cache null result to avoid repeated failed requests
      this.cache.set(trimmedBrand, null);
      return null;
    }
  }

  /**
   * Validate the API response format
   * @param {any} data - Response data to validate
   * @returns {boolean} - True if valid format
   */
  isValidBrandOwnerResponse(data) {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.brand_name === 'string' &&
      (typeof data.owning_company_name === 'string' || data.owning_company_name === null)
    );
  }

  /**
   * Clear the cache (useful for testing or memory management)
   */
  clearCache() {
    this.cache.clear();
    console.log('Network cache cleared');
  }

  /**
   * Get cache size for debugging
   * @returns {number} - Number of cached entries
   */
  getCacheSize() {
    return this.cache.size;
  }
}

// Export for use in other modules
window.NetworkManager = NetworkManager;

// /**
//    * Get political leaning for a topic
//    * @param {string} topic - The topic to analyze
//    * @returns {Promise<any>} - The political leaning data
//    */
//   async getPoliticalLeaning(topic) {
//     const url = `${this.baseURL}/getPoliticalLeaning/${encodeURIComponent(topic)}`;
//     return this.makeRequest(url);
//   }
// /**
//    * Get DEI friendliness score for a topic
//    * @param {string} topic - The topic to analyze
//    * @returns {Promise<any>} - The DEI score data
//    */
//   async getDEIFriendlinessScore(topic) {
//     const url = `${this.baseURL}/getDEIFriendlinessScore/${encodeURIComponent(topic)}`;
//     return this.makeRequest(url);
//   }

//   /**
//    * Get wokeness score for a topic
//    * @param {string} topic - The topic to analyze
//    * @returns {Promise<any>} - The wokeness score data
//    */
//   async getWokenessScore(topic) {
//     const url = `${this.baseURL}/getWokenessScore/${encodeURIComponent(topic)}`;
//     return this.makeRequest(url);
//   }

//   /**
//    * Get financial contributions overview for a topic
//    * @param {string} topic - The topic to analyze
//    * @returns {Promise<any>} - The financial contributions data
//    */
//   async getOrCreateFinancialContributionsOverview(topic) {
//     const url = `${this.baseURL}/getFinancialContributionsOverview/${encodeURIComponent(topic)}`;
//     console.log('Financial contributions overview URL:', url);
//     return this.makeRequest(url);
//   }

//   async getFinancialContributionsOverviewTextOnly(topic) {
//     const url = `${this.baseURL}/getFinancialContributionsOverviewTextOnly/${encodeURIComponent(topic)}`;
//     console.log('Financial contributions overview URL:', url);
//     return this.makeRequest(url);
//   }

//  /**
//      * Generic method to get data by category and topic (for WaitingPage)
//      * @param {string} category - The category name
//      * @param {string} topic - The topic to analyze
//      * @returns {Promise<any>} - The analysis data
//      */
//   async getTopicAnalysis(category, topic) {
//     const categoryMethods = {
//       'Political Leaning': () => this.getPoliticalLeaning(topic),
//       'DEI Friendliness': () => this.getDEIFriendlinessScore(topic),
//       'Wokeness': () => this.getWokenessScore(topic),
//       'Environmental Impact': () => this.getWokenessScore(topic), // Uses same endpoint
//       'Immigration': () => this.getWokenessScore(topic), // Uses same endpoint
//       'Financial Contributions': () => this.getOrCreateFinancialContributionsOverview(topic)
//     };

//     const method = categoryMethods[category];
//     if (!method) {
//       throw new Error(`Unknown category: ${category}`);
//     }

//     return method();
//   }