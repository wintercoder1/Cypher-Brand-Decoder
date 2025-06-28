// Page Parser for the typical generic Amazon Product Page.

class TypicalProductPageParser {
  constructor() {
    // Initialize any parser-specific configuration
    this.bookParser = new BookPageParser()
  }

  /**
   * Main method to extract brand or book information from the page
   * @returns {Object|string|null} - Brand info object, brand name string, or null
   */
  extractBrandInfo() {
    console.log('PageParser: Starting brand/book info extraction...');
    
    // First check if this is a book page
    const bookInfo = this.bookParser.extractBookInfo();
    if (bookInfo) {
      return bookInfo;
    }

    

    // Try to find brand information for non-book products
    const brand = this.findBrandWithContains();
    if (brand) return brand.trim();

    // Try alternative selectors
    const brandSelectors = [
      '[data-feature-name="brand"] .a-offscreen',
      '.po-brand .po-break-word',
      '#productDetails_detailBullets_sections1 .a-offscreen'
    ];

    for (const selector of brandSelectors) {
      try {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
          console.log('PageParser: Found brand with selector:', selector);
          return element.textContent.trim();
        }
      } catch (e) {
        console.log('PageParser: Selector failed:', selector, e);
      }
    }

    console.log('PageParser: No brand or book info found');
    return null;
  }

 

  /**
   * Extract manufacturer information when available
   * @returns {Object|null} - Manufacturer info object or null
   */
  extractManufacturerInfo() {
    console.log('PageParser: Looking for manufacturer information...');
    
    const manufacturer = this.findManufacturer();
    const brandName = this.findBrandWithContains();
    
    if (manufacturer) {
      console.log('PageParser: Found manufacturer:', manufacturer);
      return {
        type: 'product_with_manufacturer',
        brand: brandName || 'Unknown Brand',
        manufacturer: manufacturer
      };
    }
    
    return null;
  }

  /**
   * Find manufacturer information for products
   * @returns {string|null} - Manufacturer name or null
   */
  findManufacturer() {
    console.log('PageParser: Looking for manufacturer...');
    
    // Method 1: Look for manufacturer in table rows
    const rows = document.querySelectorAll('tr');
    for (const row of rows) {
      const rowText = row.textContent.toLowerCase();
      if (rowText.includes('manufacturer')) {
        console.log('PageParser: Found manufacturer row:', row.textContent);
        const cells = row.querySelectorAll('td, th');
        for (let i = 0; i < cells.length; i++) {
          const cellText = cells[i].textContent.toLowerCase().trim();
          if (cellText === 'manufacturer' || cellText === 'manufacturer:') {
            // Get the next cell
            if (cells[i + 1]) {
              const manufacturerText = cells[i + 1].textContent.trim();
              console.log('PageParser: Found manufacturer in next cell:', manufacturerText);
              return manufacturerText;
            }
          } else if (cellText.includes('manufacturer:')) {
            // Manufacturer info in same cell
            const match = cells[i].textContent.match(/manufacturer:?\s*(.+)/i);
            if (match) {
              console.log('PageParser: Found manufacturer in same cell:', match[1]);
              return match[1].trim();
            }
          }
        }
      }
    }

    // Method 2: Look for manufacturer in plain text format (like the product details section)
    console.log('PageParser: Searching for manufacturer in plain text format...');
    
    // Find sections that might contain product details
    const detailsSections = [
      '#productDetails_detailBullets_sections1',
      '#productDetails_feature_div',
      '#detail-bullets',
      '.a-section.a-spacing-small',
      // Look for any element containing "Product information" or "Item details"
      ...Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && (
          el.textContent.toLowerCase().includes('product information') ||
          el.textContent.toLowerCase().includes('item details')
        )
      )
    ];

    for (const sectionSelector of detailsSections) {
      let section;
      if (typeof sectionSelector === 'string') {
        section = document.querySelector(sectionSelector);
      } else {
        section = sectionSelector; // Already an element
      }
      
      if (section) {
        console.log('PageParser: Checking section for manufacturer:', section.className || section.id);
        const sectionText = section.textContent;
        
        // Look for "Manufacturer" pattern in the text
        const manufacturerMatch = sectionText.match(/Manufacturer\s*:?\s*([^\n\r]+)/i);
        if (manufacturerMatch) {
          const manufacturer = manufacturerMatch[1].trim();
          console.log('PageParser: Found manufacturer in plain text:', manufacturer);
          return manufacturer;
        }
      }
    }

    // Method 3: Search entire page text as fallback
    console.log('PageParser: Searching entire page text for manufacturer...');
    const pageText = document.body.textContent;
    const manufacturerMatch = pageText.match(/Manufacturer\s*:?\s*([^\n\r]+)/i);
    if (manufacturerMatch) {
      const manufacturer = manufacturerMatch[1].trim();
      console.log('PageParser: Found manufacturer in page text:', manufacturer);
      return manufacturer;
    }

    // Method 4: Try structured selectors
    const manufacturerSelectors = [
      '.po-manufacturer .po-break-word',
      '[data-feature-name="manufacturer"] .a-offscreen'
    ];

    for (const selector of manufacturerSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        console.log('PageParser: Found manufacturer with selector:', selector, element.textContent.trim());
        return element.textContent.trim();
      }
    }

    console.log('PageParser: Manufacturer not found with any method');
    return null;
  }

  /**
   * Find brand information for non-book products
   * @returns {string|null} - Brand name or null
   */
  findBrandWithContains() {
    console.log('PageParser: Looking for brand...');
    
    // Look for "Brand" in table rows
    const rows = document.querySelectorAll('tr');
    for (const row of rows) {
      const rowText = row.textContent.toLowerCase();
      if (rowText.includes('brand')) {
        console.log('PageParser: Found brand row:', row.textContent);
        const cells = row.querySelectorAll('td, th');
        for (let i = 0; i < cells.length; i++) {
          const cellText = cells[i].textContent.toLowerCase().trim();
          if (cellText === 'brand' || cellText === 'brand:') {
            // Get the next cell
            if (cells[i + 1]) {
              const brandText = cells[i + 1].textContent.trim();
              console.log('PageParser: Found brand in next cell:', brandText);
              return brandText;
            }
          } else if (cellText.includes('brand:')) {
            // Brand info in same cell
            const match = cells[i].textContent.match(/brand:?\s*(.+)/i);
            if (match) {
              console.log('PageParser: Found brand in same cell:', match[1]);
              return match[1].trim();
            }
          }
        }
      }
    }

    // Look in feature bullets
    const bullets = document.querySelectorAll('#feature-bullets li, .feature li');
    for (const bullet of bullets) {
      const text = bullet.textContent;
      if (text.toLowerCase().includes('brand:')) {
        const brandMatch = text.match(/brand:?\s*(.+)/i);
        if (brandMatch) {
          console.log('PageParser: Found brand in bullets:', brandMatch[1]);
          return brandMatch[1].trim();
        }
      }
    }

    console.log('PageParser: Brand not found');
    return null;
  }
}

// Export for use in other modules
window.PageParser = TypicalProductPageParser;