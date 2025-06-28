
class DisplayElementManager {
    
    constructor(layoutMode) {
        // Initialize any parser-specific configuration
        this.displayElement = null;
        this.layoutMode = layoutMode
    }

    createDisplayElement(brandInfo, ownerInfo = null, isLoading = false) {
        const element = document.createElement('div');
        element.className = 'brand-owner-info';
        
        let message = '';
        let icon = '🔍';
        
        if (isLoading) {
        if (brandInfo && brandInfo.type === 'book') {
            message = 'Loading publisher information...';
            icon = '📚';
        } else if (brandInfo && brandInfo.type === 'product_with_manufacturer') {
            message = 'Loading manufacturer information...';
            icon = '🔍';
        } else if (brandInfo === 'no-info-found') {
            message = 'Looking for brand or publisher information...';
            icon = '🔍';
        } else {
            message = 'Loading brand owning company...';
            icon = '⏳';
        }
        } else if (brandInfo === 'no-info-found') {
        message = 'No brand or publisher information found on this page';
        icon = '❓';
        } else if (brandInfo && brandInfo.type === 'book') {
        if (brandInfo.publisher) {
            message = `${brandInfo.title} is published by ${brandInfo.publisher}`;
        } else {
            message = `${brandInfo.title} - publisher information not found`;
        }
        icon = '📚';
        } else if (brandInfo && brandInfo.type === 'product_with_manufacturer') {
        message = `The brand ${brandInfo.brand} is manufactured by ${brandInfo.manufacturer}`;
        icon = '🔍';
        } else if (ownerInfo && ownerInfo.owning_company_name && ownerInfo.owning_company_name !== brandInfo) {
        message = `The brand ${brandInfo} is owned by ${ownerInfo.owning_company_name}`;
        } else if (brandInfo) {
        message = `${brandInfo} is its own company`;
        } else {
        message = 'Unable to determine brand or publisher information';
        icon = '❓';
        }
        element.innerHTML = `
        <div class="brand-owner-content">
            <span class="brand-owner-icon">${icon}</span>
            <span class="brand-owner-text">${message}</span>
        </div>
        `;


        // let img_icon = document.getElementById("cypher_logo");
        // img_icon.src = chrome.runtime.getURL("icons/cypher_logo_two.png");
        
        return element;
    }

    updateDisplayElement(brandInfo, ownerInfo) {
        if (!this.displayElement) {
            console.log('Tried to update display elemenet, but could not find a display element to update.')
            return;
        }

        let message = '';
        let icon = '🔍';
        
        if (brandInfo === 'no-info-found') {
        message = 'No brand or publisher information found on this page';
        icon = '❓';
        } else if (brandInfo && brandInfo.type === 'book') {
        if (brandInfo.publisher) {
            message = `${brandInfo.title} is published by ${brandInfo.publisher}`;
        } else {
            message = `${brandInfo.title} - publisher information not found`;
        }
        icon = '📚';
        } else if (brandInfo && brandInfo.type === 'product_with_manufacturer') {
        message = `The brand ${brandInfo.brand} is manufactured by ${brandInfo.manufacturer}`;
        } else if (ownerInfo && ownerInfo.owning_company_name && ownerInfo.owning_company_name !== brandInfo) {
        message = `The brand ${brandInfo} is owned by ${ownerInfo.owning_company_name}`;
        } else if (brandInfo) {
        message = `${brandInfo} is its own company`;
        } else {
        message = 'Unable to determine brand or publisher information';
        icon = '❓';
        }
        
        const iconElement = this.displayElement.querySelector('.brand-owner-icon');
        const textElement = this.displayElement.querySelector('.brand-owner-text');
        
        if (iconElement) iconElement.textContent = icon;
        if (textElement) textElement.textContent = message;
        
        this.displayElement.classList.remove('loading');
    }

    insertDisplayElement(element) {
        console.log('Inserting element with layout mode:', this.layoutMode);
        if (this.layoutMode === 'product-details') {
            this.insertInProductDetailsArea(element);
        } else {
            this.insertInBuyBox(element);
        }
        this.displayElement = element;
    }

    insertInProductDetailsArea(element) {
        const productDetailsSelectors = [
        '#feature-bullets',
        '#feature-bullets ul',
        '.a-unordered-list.a-vertical.a-spacing-mini',
        '#detailBullets_feature_div',
        '#productDetails_feature_div',
        '.a-section.a-spacing-medium.a-spacing-top-small',
        '#leftCol',
        '#centerCol .a-section:first-child',
        '.a-section.a-spacing-medium:first-child'
        ];
        
        let insertionPoint = null;
        for (const selector of productDetailsSelectors) {
            insertionPoint = document.querySelector(selector);
            if (insertionPoint) {
                console.log('Found product details area with selector:', selector);
                break;
            }
        }
        
        if (insertionPoint) {
        const wrapper = document.createElement('div');
        wrapper.className = 'a-section a-spacing-medium';
        wrapper.appendChild(element);
        
        if (insertionPoint.tagName === 'UL') {
            insertionPoint.parentNode.insertBefore(wrapper, insertionPoint);
        } else {
            insertionPoint.insertBefore(wrapper, insertionPoint.firstChild);
        }
            console.log('Inserted element into product details area');
        } else {
            console.log('Product details area not found, falling back to buy box');
            this.insertInBuyBox(element);
        }
    }

    insertInBuyBox(element) {
        const buyBoxSelectors = [
        '#buybox',
        '#rightCol',
        '.buybox-container',
        '#apex_desktop_newAccordionRow',
        '[cel_widget_id="dpx-buybox-container"]',
        '[data-feature-name="buybox"]',
        '.a-box.a-spacing-none'
        ];
        
        let buyBox = null;
        for (const selector of buyBoxSelectors) {
        buyBox = document.querySelector(selector);
        if (buyBox) {
            console.log('Found buy box with selector:', selector);
            break;
        }
        }
        
        if (buyBox) {
        const firstChild = buyBox.firstElementChild;
        if (firstChild) {
            buyBox.insertBefore(element, firstChild);
        } else {
            buyBox.appendChild(element);
        }
        console.log('Inserted element into buy box');
        } else {
        const titleElement = document.querySelector('#productTitle, .product-title, h1');
        if (titleElement) {
            titleElement.parentNode.insertBefore(element, titleElement.nextSibling);
            console.log('Inserted element after title');
        } else {
            document.body.appendChild(element);
            console.log('Inserted element into body as fallback');
        }
        }
    }
}

// Export for use in other modules
window.DisplayElement = DisplayElementManager;