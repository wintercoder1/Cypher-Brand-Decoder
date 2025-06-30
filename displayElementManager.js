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
        } else if (brandInfo && brandInfo.type === 'product_with_manufacturer' && brandInfo.manufacturer !== 'information...') {
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
        } else if (brandInfo && brandInfo.type === 'product_with_manufacturer' && brandInfo.manufacturer !== 'information...') {
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
        
        // Fallback to original logic
        if (this.layoutMode === 'product-details') {
            // First try to insert under price (works for most product pages)
            if (this.insertUnderPrice(element)) {
                this.displayElement = element;
                return;
            }
            this.insertInProductDetailsArea(element);
        } else {
            this.insertInBuyBox(element);
        }
        this.displayElement = element;
    }

    insertUnderPrice(element) {
        console.log('Attempting to insert element under price...');
        
        // Strategy 1: Target the apex_desktop structure specifically (layout 1)
        const apexDesktop = document.querySelector('#apex_desktop');
        if (apexDesktop) {
            console.log('Found apex_desktop container');
            
            // Create a wrapper with proper Amazon styling
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            // Insert after the apex_desktop container
            if (apexDesktop.nextSibling) {
                apexDesktop.parentNode.insertBefore(wrapper, apexDesktop.nextSibling);
            } else {
                apexDesktop.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element after apex_desktop');
            return true;
        }
        
        // Strategy 1b: Target the desktop_unifiedPrice structure (layout 2)
        const unifiedPrice = document.querySelector('#desktop_unifiedPrice');
        if (unifiedPrice) {
            console.log('Found desktop_unifiedPrice container');
            
            // Create a wrapper with proper Amazon styling
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            // Insert after the desktop_unifiedPrice container
            if (unifiedPrice.nextSibling) {
                unifiedPrice.parentNode.insertBefore(wrapper, unifiedPrice.nextSibling);
            } else {
                unifiedPrice.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element after desktop_unifiedPrice');
            return true;
        }
        
        // Strategy 1c: Target the buyingOptionNostosBolderBadge (specific to layout 2)
        const buyingBadge = document.querySelector('#buyingOptionNostosBolderBadge_feature_div');
        if (buyingBadge) {
            console.log('Found buyingOptionNostosBolderBadge container');
            
            // Create a wrapper with proper Amazon styling
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            // Insert after the buying badge container
            if (buyingBadge.nextSibling) {
                buyingBadge.parentNode.insertBefore(wrapper, buyingBadge.nextSibling);
            } else {
                buyingBadge.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element after buyingOptionNostosBolderBadge');
            return true;
        }
        
        // Strategy 1d: Look for any feature div that contains price-related content
        const priceFeatureDivs = document.querySelectorAll('[id*="Price"], [id*="price"], [data-feature-name*="price"], [data-feature-name*="Price"]');
        for (const priceDiv of priceFeatureDivs) {
            if (priceDiv && priceDiv.id !== 'desktop_unifiedPrice') { // Skip the one we already tried
                console.log('Found price-related feature div:', priceDiv.id);
                
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (priceDiv.nextSibling) {
                    priceDiv.parentNode.insertBefore(wrapper, priceDiv.nextSibling);
                } else {
                    priceDiv.parentNode.appendChild(wrapper);
                }
                
                console.log('Successfully inserted element after price feature div');
                return true;
            }
        }
        
        // Strategy 2: Look for the main price element and its container
        const priceSelectors = [
            '.a-price.a-text-price.a-size-medium.apexPriceToPay', // Main price class
            '.a-price-whole', // Price number part
            '.a-price.a-text-price', // General price class
            '[data-a-color="price"]', // Price with data attribute
            '.a-price.apexPriceToPay', // Apex price
            '.a-section.a-spacing-none.aok-align-center .a-price' // Price in spacing section
        ];
        
        let priceElement = null;
        for (const selector of priceSelectors) {
            priceElement = document.querySelector(selector);
            if (priceElement) {
                console.log('Found price element with selector:', selector);
                break;
            }
        }
        
        if (priceElement) {
            // Find the appropriate container to insert after
            let insertionContainer = priceElement;
            
            // Look for the price container section
            const priceContainer = priceElement.closest('.a-section, .a-spacing-none, .a-spacing-small, .a-spacing-base');
            if (priceContainer) {
                insertionContainer = priceContainer;
                console.log('Found price container:', priceContainer.className);
            }
            
            // Create a wrapper with proper Amazon styling
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            // Insert after the price container
            if (insertionContainer.nextSibling) {
                insertionContainer.parentNode.insertBefore(wrapper, insertionContainer.nextSibling);
            } else {
                insertionContainer.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element under price');
            return true;
        }
        
        // Strategy 3: Look for SNAP EBT eligible text (common on grocery items)
        const snapElements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && el.textContent.includes('SNAP EBT eligible')
        );
        
        if (snapElements.length > 0) {
            const snapElement = snapElements[0];
            console.log('Found SNAP EBT element, inserting after it');
            const snapContainer = snapElement.closest('.a-section, div');
            if (snapContainer) {
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (snapContainer.nextSibling) {
                    snapContainer.parentNode.insertBefore(wrapper, snapContainer.nextSibling);
                } else {
                    snapContainer.parentNode.appendChild(wrapper);
                }
                console.log('Successfully inserted element after SNAP EBT section');
                return true;
            }
        }
        
        // Strategy 4: Look for the size/variant selection area
        const sizeElements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && (el.textContent.includes('Size:') || el.textContent.includes('Pack of'))
        );
        
        if (sizeElements.length > 0) {
            const sizeElement = sizeElements[0];
            const sizeContainer = sizeElement.closest('.a-section, div');
            if (sizeContainer) {
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (sizeContainer.nextSibling) {
                    sizeContainer.parentNode.insertBefore(wrapper, sizeContainer.nextSibling);
                } else {
                    sizeContainer.parentNode.appendChild(wrapper);
                }
                console.log('Successfully inserted element after size selection');
                return true;
            }
        }
        
        // Strategy 5: Look for accordion row elements (common in new Amazon layouts)
        const accordionSelectors = [
            '#apex_desktop_newAccordionRow',
            '[id*="AccordionRow"]',
            '[data-feature-name*="accordion"]'
        ];
        
        for (const selector of accordionSelectors) {
            const accordionElement = document.querySelector(selector);
            if (accordionElement) {
                console.log('Found accordion element with selector:', selector);
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (accordionElement.nextSibling) {
                    accordionElement.parentNode.insertBefore(wrapper, accordionElement.nextSibling);
                } else {
                    accordionElement.parentNode.appendChild(wrapper);
                }
                console.log('Successfully inserted element after accordion');
                return true;
            }
        }
        
        console.log('Could not find suitable price-related insertion point');
        return false;
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
        console.log('Attempting to insert in buy box...');
        
        // Strategy 1: Try to insert after the Prime upsell container if it exists
        const primeContainer = document.querySelector('#primeDPUpsellStaticContainer');
        if (primeContainer) {
            console.log('Found Prime upsell container, inserting after it');
            
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            if (primeContainer.nextSibling) {
                primeContainer.parentNode.insertBefore(wrapper, primeContainer.nextSibling);
            } else {
                primeContainer.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element after Prime container');
            return;
        }
        
        // Strategy 2: Look for the desktop_buybox specifically
        const desktopBuybox = document.querySelector('#desktop_buybox');
        if (desktopBuybox) {
            console.log('Found desktop_buybox container');
            
            // Try to find a good insertion point within the buybox
            const buyboxSections = desktopBuybox.querySelectorAll('.a-section, [data-feature-name], [id*="_feature_div"]');
            
            // Look for a section after Prime content but before the end
            for (const section of buyboxSections) {
                if (section.id && (section.id.includes('prime') || section.id.includes('Prime'))) {
                    // Found a Prime-related section, insert after it
                    const wrapper = document.createElement('div');
                    wrapper.className = 'a-section a-spacing-small';
                    wrapper.appendChild(element);
                    
                    if (section.nextSibling) {
                        section.parentNode.insertBefore(wrapper, section.nextSibling);
                    } else {
                        section.parentNode.appendChild(wrapper);
                    }
                    
                    console.log('Inserted element after Prime section in buybox');
                    return;
                }
            }
            
            // If no Prime section found, just append to buybox
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            desktopBuybox.appendChild(wrapper);
            
            console.log('Inserted element at end of desktop_buybox');
            return;
        }
        
        // Strategy 3: Original buy box selectors
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
            // Check if there's a Prime container inside this buybox
            const primeInBuybox = buyBox.querySelector('#primeDPUpsellStaticContainer, [id*="prime"], [id*="Prime"]');
            if (primeInBuybox) {
                console.log('Found Prime content in buybox, inserting after it');
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (primeInBuybox.nextSibling) {
                    primeInBuybox.parentNode.insertBefore(wrapper, primeInBuybox.nextSibling);
                } else {
                    primeInBuybox.parentNode.appendChild(wrapper);
                }
                
                console.log('Inserted element after Prime content in buybox');
                return;
            }
            
            // Original logic if no Prime content
            const firstChild = buyBox.firstElementChild;
            if (firstChild) {
                buyBox.insertBefore(element, firstChild);
            } else {
                buyBox.appendChild(element);
            }
            console.log('Inserted element into buy box (original logic)');
        } else {
            // Fallback logic
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

    // This does not work.
    // TODO: Make this work!
    insertAboveComparisonTable(element) {
        console.log('Attempting to insert element above comparison table...');
        
        // Strategy 1: Target the comparison table directly (highest priority)
        const comparisonTable = document.querySelector('table[role="table"]');
        if (comparisonTable) {
            console.log('Found comparison table, inserting before it');
            comparisonTable.parentNode.insertBefore(element, comparisonTable);
            return;
        }
        
        // Strategy 2: Look for any table with comparison characteristics
        const tables = document.querySelectorAll('#centerCol table, #dpx-center table');
        for (const table of tables) {
            const tableText = table.textContent.toLowerCase();
            // Check if this looks like a product comparison table
            if ((tableText.includes('customer reviews') && tableText.includes('price')) ||
                (tableText.includes('fabric') && tableText.includes('waistband')) ||
                table.querySelectorAll('tr').length > 4) {
                console.log('Found product comparison table');
                table.parentNode.insertBefore(element, table);
                return;
            }
        }
        
        // Strategy 3: Target the brand/manufacturer info section
        const brandInfo = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent && el.textContent.includes('The brand') && el.textContent.includes('is manufactured by')
        );
        if (brandInfo) {
            console.log('Found brand info section, inserting before it');
            brandInfo.parentNode.insertBefore(element, brandInfo);
            return;
        }
        
        // Strategy 4: Look for "Customer Reviews" header and insert before its parent section
        const reviewsHeader = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent && el.textContent.trim() === 'Customer Reviews'
        );
        if (reviewsHeader) {
            const reviewsSection = reviewsHeader.closest('table, .a-section, [data-feature-name]');
            if (reviewsSection) {
                console.log('Found reviews section, inserting before it');
                reviewsSection.parentNode.insertBefore(element, reviewsSection);
                return;
            }
        }
        
        // Strategy 5: Target the main content area and insert before product information
        const productInfoSection = document.querySelector('#productDetails_feature_div, [data-feature-name="productDetails"]');
        if (productInfoSection) {
            console.log('Found product details section, inserting before it');
            productInfoSection.parentNode.insertBefore(element, productInfoSection);
            return;
        }
        
        // Strategy 6: Look for the center column and find a good insertion point
        const centerCol = document.querySelector('#centerCol, #dpx-center');
        if (centerCol) {
            // Find the first major section that's not too high up
            const sections = centerCol.querySelectorAll('.a-section, [data-feature-name]');
            for (const section of sections) {
                const sectionText = section.textContent.toLowerCase();
                // Skip sections that are too high up (like product title area)
                if (!sectionText.includes('product title') && 
                    !sectionText.includes('add to cart') &&
                    section.offsetTop > 100) {
                    console.log('Found suitable section in center column');
                    section.parentNode.insertBefore(element, section);
                    return;
                }
            }
        }
        
        // Fallback: Insert after product title if nothing else works
        const titleElement = document.querySelector('#productTitle, .product-title, h1');
        if (titleElement) {
            // Find a good container after the title
            const titleContainer = titleElement.closest('.a-section, [data-feature-name]');
            if (titleContainer && titleContainer.nextElementSibling) {
                titleContainer.parentNode.insertBefore(element, titleContainer.nextElementSibling);
                console.log('Inserted element after title container');
            } else {
                titleElement.parentNode.insertBefore(element, titleElement.nextSibling);
                console.log('Inserted element after title');
            }
        } else {
            document.body.appendChild(element);
            console.log('Inserted element into body as fallback');
        }
    }

}

// Export for use in other modules
window.DisplayElement = DisplayElementManager;

// class DisplayElementManager {
    
//     constructor(layoutMode) {
//         // Initialize any parser-specific configuration
//         this.displayElement = null;
//         this.layoutMode = layoutMode
//     }

//     createDisplayElement(brandInfo, ownerInfo = null, isLoading = false) {
//         const element = document.createElement('div');
//         element.className = 'brand-owner-info';
        
//         let message = '';
//         let icon = '🔍';
        
//         if (isLoading) {
//         if (brandInfo && brandInfo.type === 'book') {
//             message = 'Loading publisher information...';
//             icon = '📚';
//         } else if (brandInfo && brandInfo.type === 'product_with_manufacturer') {
//             message = 'Loading manufacturer information...';
//             icon = '🔍';
//         } else if (brandInfo === 'no-info-found') {
//             message = 'Looking for brand or publisher information...';
//             icon = '🔍';
//         } else {
//             message = 'Loading brand owning company...';
//             icon = '⏳';
//         }
//         } else if (brandInfo === 'no-info-found') {
//         message = 'No brand or publisher information found on this page';
//         icon = '❓';
//         } else if (brandInfo && brandInfo.type === 'book') {
//         if (brandInfo.publisher) {
//             message = `${brandInfo.title} is published by ${brandInfo.publisher}`;
//         } else {
//             message = `${brandInfo.title} - publisher information not found`;
//         }
//         icon = '📚';
//         } else if (brandInfo && brandInfo.type === 'product_with_manufacturer') {
//         message = `The brand ${brandInfo.brand} is manufactured by ${brandInfo.manufacturer}`;
//         icon = '🔍';
//         } else if (ownerInfo && ownerInfo.owning_company_name && ownerInfo.owning_company_name !== brandInfo) {
//         message = `The brand ${brandInfo} is owned by ${ownerInfo.owning_company_name}`;
//         } else if (brandInfo) {
//         message = `${brandInfo} is its own company`;
//         } else {
//         message = 'Unable to determine brand or publisher information';
//         icon = '❓';
//         }
//         element.innerHTML = `
//         <div class="brand-owner-content">
//             <span class="brand-owner-icon">${icon}</span>
//             <span class="brand-owner-text">${message}</span>
//         </div>
//         `;

//         return element;
//     }

//     updateDisplayElement(brandInfo, ownerInfo) {
//         if (!this.displayElement) {
//             console.log('Tried to update display elemenet, but could not find a display element to update.')
//             return;
//         }

//         let message = '';
//         let icon = '🔍';
        
//         if (brandInfo === 'no-info-found') {
//         message = 'No brand or publisher information found on this page';
//         icon = '❓';
//         } else if (brandInfo && brandInfo.type === 'book') {
//         if (brandInfo.publisher) {
//             message = `${brandInfo.title} is published by ${brandInfo.publisher}`;
//         } else {
//             message = `${brandInfo.title} - publisher information not found`;
//         }
//         icon = '📚';
//         } else if (brandInfo && brandInfo.type === 'product_with_manufacturer') {
//         message = `The brand ${brandInfo.brand} is manufactured by ${brandInfo.manufacturer}`;
//         } else if (ownerInfo && ownerInfo.owning_company_name && ownerInfo.owning_company_name !== brandInfo) {
//         message = `The brand ${brandInfo} is owned by ${ownerInfo.owning_company_name}`;
//         } else if (brandInfo) {
//         message = `${brandInfo} is its own company`;
//         } else {
//         message = 'Unable to determine brand or publisher information';
//         icon = '❓';
//         }
        
//         const iconElement = this.displayElement.querySelector('.brand-owner-icon');
//         const textElement = this.displayElement.querySelector('.brand-owner-text');
        
//         if (iconElement) iconElement.textContent = icon;
//         if (textElement) textElement.textContent = message;
        
//         this.displayElement.classList.remove('loading');
//     }

//     insertDisplayElement(element) {
//         console.log('Inserting element with layout mode:', this.layoutMode);
        
//         // Fallback to original logic
//         if (this.layoutMode === 'product-details') {
//             // First try to insert under price (works for most product pages)
//             if (this.insertUnderPrice(element)) {
//                 this.displayElement = element;
//                 return;
//             }
//             this.insertInProductDetailsArea(element);
//         } else {
//             this.insertInBuyBox(element);
//         }
//         this.displayElement = element;
//     }

//     insertUnderPrice(element) {
//         console.log('Attempting to insert element under price...');
        
//         // Strategy 1: Target the apex_desktop structure specifically (layout 1)
//         const apexDesktop = document.querySelector('#apex_desktop');
//         if (apexDesktop) {
//             console.log('Found apex_desktop container');
            
//             // Create a wrapper with proper Amazon styling
//             const wrapper = document.createElement('div');
//             wrapper.className = 'a-section a-spacing-small';
//             wrapper.appendChild(element);
            
//             // Insert after the apex_desktop container
//             if (apexDesktop.nextSibling) {
//                 apexDesktop.parentNode.insertBefore(wrapper, apexDesktop.nextSibling);
//             } else {
//                 apexDesktop.parentNode.appendChild(wrapper);
//             }
            
//             console.log('Successfully inserted element after apex_desktop');
//             return true;
//         }
        
//         // Strategy 1b: Target the desktop_unifiedPrice structure (layout 2)
//         const unifiedPrice = document.querySelector('#desktop_unifiedPrice');
//         if (unifiedPrice) {
//             console.log('Found desktop_unifiedPrice container');
            
//             // Create a wrapper with proper Amazon styling
//             const wrapper = document.createElement('div');
//             wrapper.className = 'a-section a-spacing-small';
//             wrapper.appendChild(element);
            
//             // Insert after the desktop_unifiedPrice container
//             if (unifiedPrice.nextSibling) {
//                 unifiedPrice.parentNode.insertBefore(wrapper, unifiedPrice.nextSibling);
//             } else {
//                 unifiedPrice.parentNode.appendChild(wrapper);
//             }
            
//             console.log('Successfully inserted element after desktop_unifiedPrice');
//             return true;
//         }
        
//         // Strategy 1c: Target the buyingOptionNostosBolderBadge (specific to layout 2)
//         const buyingBadge = document.querySelector('#buyingOptionNostosBolderBadge_feature_div');
//         if (buyingBadge) {
//             console.log('Found buyingOptionNostosBolderBadge container');
            
//             // Create a wrapper with proper Amazon styling
//             const wrapper = document.createElement('div');
//             wrapper.className = 'a-section a-spacing-small';
//             wrapper.appendChild(element);
            
//             // Insert after the buying badge container
//             if (buyingBadge.nextSibling) {
//                 buyingBadge.parentNode.insertBefore(wrapper, buyingBadge.nextSibling);
//             } else {
//                 buyingBadge.parentNode.appendChild(wrapper);
//             }
            
//             console.log('Successfully inserted element after buyingOptionNostosBolderBadge');
//             return true;
//         }
        
//         // Strategy 1d: Look for any feature div that contains price-related content
//         const priceFeatureDivs = document.querySelectorAll('[id*="Price"], [id*="price"], [data-feature-name*="price"], [data-feature-name*="Price"]');
//         for (const priceDiv of priceFeatureDivs) {
//             if (priceDiv && priceDiv.id !== 'desktop_unifiedPrice') { // Skip the one we already tried
//                 console.log('Found price-related feature div:', priceDiv.id);
                
//                 const wrapper = document.createElement('div');
//                 wrapper.className = 'a-section a-spacing-small';
//                 wrapper.appendChild(element);
                
//                 if (priceDiv.nextSibling) {
//                     priceDiv.parentNode.insertBefore(wrapper, priceDiv.nextSibling);
//                 } else {
//                     priceDiv.parentNode.appendChild(wrapper);
//                 }
                
//                 console.log('Successfully inserted element after price feature div');
//                 return true;
//             }
//         }
        
//         // Strategy 2: Look for the main price element and its container
//         const priceSelectors = [
//             '.a-price.a-text-price.a-size-medium.apexPriceToPay', // Main price class
//             '.a-price-whole', // Price number part
//             '.a-price.a-text-price', // General price class
//             '[data-a-color="price"]', // Price with data attribute
//             '.a-price.apexPriceToPay', // Apex price
//             '.a-section.a-spacing-none.aok-align-center .a-price' // Price in spacing section
//         ];
        
//         let priceElement = null;
//         for (const selector of priceSelectors) {
//             priceElement = document.querySelector(selector);
//             if (priceElement) {
//                 console.log('Found price element with selector:', selector);
//                 break;
//             }
//         }
        
//         if (priceElement) {
//             // Find the appropriate container to insert after
//             let insertionContainer = priceElement;
            
//             // Look for the price container section
//             const priceContainer = priceElement.closest('.a-section, .a-spacing-none, .a-spacing-small, .a-spacing-base');
//             if (priceContainer) {
//                 insertionContainer = priceContainer;
//                 console.log('Found price container:', priceContainer.className);
//             }
            
//             // Create a wrapper with proper Amazon styling
//             const wrapper = document.createElement('div');
//             wrapper.className = 'a-section a-spacing-small';
//             wrapper.appendChild(element);
            
//             // Insert after the price container
//             if (insertionContainer.nextSibling) {
//                 insertionContainer.parentNode.insertBefore(wrapper, insertionContainer.nextSibling);
//             } else {
//                 insertionContainer.parentNode.appendChild(wrapper);
//             }
            
//             console.log('Successfully inserted element under price');
//             return true;
//         }
        
//         // Strategy 3: Look for SNAP EBT eligible text (common on grocery items)
//         const snapElements = Array.from(document.querySelectorAll('*')).filter(el => 
//             el.textContent && el.textContent.includes('SNAP EBT eligible')
//         );
        
//         if (snapElements.length > 0) {
//             const snapElement = snapElements[0];
//             console.log('Found SNAP EBT element, inserting after it');
//             const snapContainer = snapElement.closest('.a-section, div');
//             if (snapContainer) {
//                 const wrapper = document.createElement('div');
//                 wrapper.className = 'a-section a-spacing-small';
//                 wrapper.appendChild(element);
                
//                 if (snapContainer.nextSibling) {
//                     snapContainer.parentNode.insertBefore(wrapper, snapContainer.nextSibling);
//                 } else {
//                     snapContainer.parentNode.appendChild(wrapper);
//                 }
//                 console.log('Successfully inserted element after SNAP EBT section');
//                 return true;
//             }
//         }
        
//         // Strategy 4: Look for the size/variant selection area
//         const sizeElements = Array.from(document.querySelectorAll('*')).filter(el => 
//             el.textContent && (el.textContent.includes('Size:') || el.textContent.includes('Pack of'))
//         );
        
//         if (sizeElements.length > 0) {
//             const sizeElement = sizeElements[0];
//             const sizeContainer = sizeElement.closest('.a-section, div');
//             if (sizeContainer) {
//                 const wrapper = document.createElement('div');
//                 wrapper.className = 'a-section a-spacing-small';
//                 wrapper.appendChild(element);
                
//                 if (sizeContainer.nextSibling) {
//                     sizeContainer.parentNode.insertBefore(wrapper, sizeContainer.nextSibling);
//                 } else {
//                     sizeContainer.parentNode.appendChild(wrapper);
//                 }
//                 console.log('Successfully inserted element after size selection');
//                 return true;
//             }
//         }
        
//         // Strategy 5: Look for accordion row elements (common in new Amazon layouts)
//         const accordionSelectors = [
//             '#apex_desktop_newAccordionRow',
//             '[id*="AccordionRow"]',
//             '[data-feature-name*="accordion"]'
//         ];
        
//         for (const selector of accordionSelectors) {
//             const accordionElement = document.querySelector(selector);
//             if (accordionElement) {
//                 console.log('Found accordion element with selector:', selector);
//                 const wrapper = document.createElement('div');
//                 wrapper.className = 'a-section a-spacing-small';
//                 wrapper.appendChild(element);
                
//                 if (accordionElement.nextSibling) {
//                     accordionElement.parentNode.insertBefore(wrapper, accordionElement.nextSibling);
//                 } else {
//                     accordionElement.parentNode.appendChild(wrapper);
//                 }
//                 console.log('Successfully inserted element after accordion');
//                 return true;
//             }
//         }
        
//         console.log('Could not find suitable price-related insertion point');
//         return false;
//     }

//     insertInProductDetailsArea(element) {
//         const productDetailsSelectors = [
//         '#feature-bullets',
//         '#feature-bullets ul',
//         '.a-unordered-list.a-vertical.a-spacing-mini',
//         '#detailBullets_feature_div',
//         '#productDetails_feature_div',
//         '.a-section.a-spacing-medium.a-spacing-top-small',
//         '#leftCol',
//         '#centerCol .a-section:first-child',
//         '.a-section.a-spacing-medium:first-child'
//         ];
        
//         let insertionPoint = null;
//         for (const selector of productDetailsSelectors) {
//             insertionPoint = document.querySelector(selector);
//             if (insertionPoint) {
//                 console.log('Found product details area with selector:', selector);
//                 break;
//             }
//         }
        
//         if (insertionPoint) {
//         const wrapper = document.createElement('div');
//         wrapper.className = 'a-section a-spacing-medium';
//         wrapper.appendChild(element);
        
//         if (insertionPoint.tagName === 'UL') {
//             insertionPoint.parentNode.insertBefore(wrapper, insertionPoint);
//         } else {
//             insertionPoint.insertBefore(wrapper, insertionPoint.firstChild);
//         }
//             console.log('Inserted element into product details area');
//         } else {
//             console.log('Product details area not found, falling back to buy box');
//             this.insertInBuyBox(element);
//         }
//     }

//     insertInBuyBox(element) {
//         const buyBoxSelectors = [
//         '#buybox',
//         '#rightCol',
//         '.buybox-container',
//         '#apex_desktop_newAccordionRow',
//         '[cel_widget_id="dpx-buybox-container"]',
//         '[data-feature-name="buybox"]',
//         '.a-box.a-spacing-none'
//         ];
        
//         let buyBox = null;
//         for (const selector of buyBoxSelectors) {
//             buyBox = document.querySelector(selector);
//             if (buyBox) {
//                 console.log('Found buy box with selector:', selector);
//                 break;
//             }
//         }
        
//         if (buyBox) {
//             const firstChild = buyBox.firstElementChild;
//             if (firstChild) {
//                 buyBox.insertBefore(element, firstChild);
//             } else {
//                 buyBox.appendChild(element);
//             }
//             console.log('Inserted element into buy box');
//             } else {
//             const titleElement = document.querySelector('#productTitle, .product-title, h1');
//             if (titleElement) {
//                 titleElement.parentNode.insertBefore(element, titleElement.nextSibling);
//                 console.log('Inserted element after title');
//             } else {
//                 document.body.appendChild(element);
//                 console.log('Inserted element into body as fallback');
//             }
//         }
//     }

//     // This does not work.
//     // TODO: Make this work!
//     insertAboveComparisonTable(element) {
//         console.log('Attempting to insert element above comparison table...');
        
//         // Strategy 1: Target the comparison table directly (highest priority)
//         const comparisonTable = document.querySelector('table[role="table"]');
//         if (comparisonTable) {
//             console.log('Found comparison table, inserting before it');
//             comparisonTable.parentNode.insertBefore(element, comparisonTable);
//             return;
//         }
        
//         // Strategy 2: Look for any table with comparison characteristics
//         const tables = document.querySelectorAll('#centerCol table, #dpx-center table');
//         for (const table of tables) {
//             const tableText = table.textContent.toLowerCase();
//             // Check if this looks like a product comparison table
//             if ((tableText.includes('customer reviews') && tableText.includes('price')) ||
//                 (tableText.includes('fabric') && tableText.includes('waistband')) ||
//                 table.querySelectorAll('tr').length > 4) {
//                 console.log('Found product comparison table');
//                 table.parentNode.insertBefore(element, table);
//                 return;
//             }
//         }
        
//         // Strategy 3: Target the brand/manufacturer info section
//         const brandInfo = Array.from(document.querySelectorAll('*')).find(el => 
//             el.textContent && el.textContent.includes('The brand') && el.textContent.includes('is manufactured by')
//         );
//         if (brandInfo) {
//             console.log('Found brand info section, inserting before it');
//             brandInfo.parentNode.insertBefore(element, brandInfo);
//             return;
//         }
        
//         // Strategy 4: Look for "Customer Reviews" header and insert before its parent section
//         const reviewsHeader = Array.from(document.querySelectorAll('*')).find(el => 
//             el.textContent && el.textContent.trim() === 'Customer Reviews'
//         );
//         if (reviewsHeader) {
//             const reviewsSection = reviewsHeader.closest('table, .a-section, [data-feature-name]');
//             if (reviewsSection) {
//                 console.log('Found reviews section, inserting before it');
//                 reviewsSection.parentNode.insertBefore(element, reviewsSection);
//                 return;
//             }
//         }
        
//         // Strategy 5: Target the main content area and insert before product information
//         const productInfoSection = document.querySelector('#productDetails_feature_div, [data-feature-name="productDetails"]');
//         if (productInfoSection) {
//             console.log('Found product details section, inserting before it');
//             productInfoSection.parentNode.insertBefore(element, productInfoSection);
//             return;
//         }
        
//         // Strategy 6: Look for the center column and find a good insertion point
//         const centerCol = document.querySelector('#centerCol, #dpx-center');
//         if (centerCol) {
//             // Find the first major section that's not too high up
//             const sections = centerCol.querySelectorAll('.a-section, [data-feature-name]');
//             for (const section of sections) {
//                 const sectionText = section.textContent.toLowerCase();
//                 // Skip sections that are too high up (like product title area)
//                 if (!sectionText.includes('product title') && 
//                     !sectionText.includes('add to cart') &&
//                     section.offsetTop > 100) {
//                     console.log('Found suitable section in center column');
//                     section.parentNode.insertBefore(element, section);
//                     return;
//                 }
//             }
//         }
        
//         // Fallback: Insert after product title if nothing else works
//         const titleElement = document.querySelector('#productTitle, .product-title, h1');
//         if (titleElement) {
//             // Find a good container after the title
//             const titleContainer = titleElement.closest('.a-section, [data-feature-name]');
//             if (titleContainer && titleContainer.nextElementSibling) {
//                 titleContainer.parentNode.insertBefore(element, titleContainer.nextElementSibling);
//                 console.log('Inserted element after title container');
//             } else {
//                 titleElement.parentNode.insertBefore(element, titleElement.nextSibling);
//                 console.log('Inserted element after title');
//             }
//         } else {
//             document.body.appendChild(element);
//             console.log('Inserted element into body as fallback');
//         }
//     }

// }

// // Export for use in other modules
// window.DisplayElement = DisplayElementManager;