class BookPageParser {
    constructor() {
    // Initialize any parser-specific configuration
    }

    /**
     * Extract book-specific information
     * @returns {Object|null} - Book info object or null
     */
    extractBookInfo() {
        // More reliable book page detection
        const isBookPage = this.isBookPage();

        if (!isBookPage) {
            return null;
        }

        console.log('PageParser: Detected book page');

        // Extract book title
        const bookTitle = this.findBookTitle();
        console.log('PageParser: Found book title:', bookTitle);

        // Extract publisher information
        const publisher = this.findPublisher();
        console.log('PageParser: Found publisher:', publisher);

        if (bookTitle) {
            return {
            type: 'book',
            title: bookTitle,
            publisher: publisher
            };
        }

        return null;
    }

    /**
     * Determine if current page is a book page
     * @returns {boolean} - True if book page
     */
    isBookPage() {
        // Check URL first
        if (window.location.pathname.includes('/dp/') || window.location.pathname.includes('/gp/product/')) {
            // Check breadcrumbs
            const breadcrumbs = document.querySelector('#wayfinding-breadcrumbs_feature_div');
            if (breadcrumbs && breadcrumbs.textContent.toLowerCase().includes('books')) {
            return true;
            }
            
            // Check navigation
            const nav = document.querySelector('#nav-subnav');
            if (nav && nav.textContent.toLowerCase().includes('books')) {
            return true;
            }
            
            // Check if we're in the books section
            const booksNav = document.querySelector('.nav-category-button[data-csa-c-content-id="nav_cs_books"]');
            if (booksNav) {
            return true;
            }
            
            // Check page content for book-specific elements
            const hasISBN = document.querySelector('tr td:contains("ISBN"), tr th:contains("ISBN")') || 
                            document.body.textContent.includes('ISBN-10') || 
                            document.body.textContent.includes('ISBN-13');
            
            const hasPublisher = document.querySelector('tr td:contains("Publisher"), tr th:contains("Publisher")') ||
                                document.body.textContent.includes('Publisher');
            
            if (hasISBN || hasPublisher) {
            return true;
            }
        }

        return false;
    }

    /**
     * Find publisher information for books
     * @returns {string|null} - Publisher name or null
     */
    findPublisher() {
        console.log('PageParser: Looking for publisher...');

        // Method 1: Look for publisher in table rows
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes('publisher')) {
            console.log('PageParser: Found publisher row:', row.textContent);
            const cells = row.querySelectorAll('td, th');
            for (let i = 0; i < cells.length; i++) {
                const cellText = cells[i].textContent.toLowerCase().trim();
                if (cellText === 'publisher' || cellText === 'publisher:') {
                // Get the next cell
                if (cells[i + 1]) {
                    const publisherText = cells[i + 1].textContent.trim();
                    console.log('PageParser: Found publisher in next cell:', publisherText);
                    return publisherText;
                }
                } else if (cellText.includes('publisher:')) {
                // Publisher info in same cell
                const match = cells[i].textContent.match(/publisher:?\s*(.+)/i);
                if (match) {
                    console.log('PageParser: Found publisher in same cell:', match[1]);
                    return match[1].trim();
                }
                }
            }
            }
        }

        // Method 2: Look for publisher in plain text format
        console.log('PageParser: Searching for publisher in plain text format...');

        // Find sections that might contain product details
        const detailsSections = [
            '#productDetails_detailBullets_sections1',
            '#productDetails_feature_div',
            '#detail-bullets',
            '.a-section.a-spacing-small',
            // Look for any element containing "Product details"
            ...Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && el.textContent.toLowerCase().includes('product details')
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
            console.log('PageParser: Checking section for publisher:', section.className || section.id);
            const sectionText = section.textContent;
            
            // Look for "Publisher :" pattern in the text
            const publisherMatch = sectionText.match(/Publisher\s*:\s*([^\n\r]+)/i);
            if (publisherMatch) {
                const publisher = publisherMatch[1].trim();
                console.log('PageParser: Found publisher in plain text:', publisher);
                return publisher;
            }
            }
        }

        // Method 3: Search entire page text as fallback
        console.log('PageParser: Searching entire page text for publisher...');
        const pageText = document.body.textContent;
        const publisherMatch = pageText.match(/Publisher\s*:\s*([^\n\r]+)/i);
        if (publisherMatch) {
            const publisher = publisherMatch[1].trim();
            console.log('PageParser: Found publisher in page text:', publisher);
            return publisher;
        }

        // Method 4: Try structured selectors
        const publisherSelectors = [
            '.po-publisher .po-break-word',
            '[data-feature-name="publisher"] .a-offscreen'
        ];

        for (const selector of publisherSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
            console.log('PageParser: Found publisher with selector:', selector, element.textContent.trim());
            return element.textContent.trim();
            }
        }

        console.log('PageParser: Publisher not found with any method');
        return null;
    }

    /**
     * Find book title on the page
     * @returns {string|null} - Book title or null
     */
    findBookTitle() {
        const titleSelectors = [
            '#productTitle',
            '.product-title',
            'h1[data-automation-id="title"]',
            'h1.a-size-large'
        ];

        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
            return element.textContent.trim();
            }
        }

        return null;
    }
    
}

// Export for use in other modules
window.PageParser = BookPageParser;