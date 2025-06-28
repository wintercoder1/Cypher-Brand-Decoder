document.addEventListener('DOMContentLoaded', async () => {
  const layoutToggle = document.getElementById('layoutToggle');
  const previewText = document.getElementById('previewText');
  const status = document.getElementById('status');
  
  // Load current setting
  const result = await chrome.storage.sync.get(['layoutMode']);
  // Handle states were the default layout mode gets intertreted as 'undefined'.
  const layoutModeStr = result.layoutMode ? result.layoutMode.trim() : 'undefined';
  const isProductDetails = (layoutModeStr  === 'product-details' || layoutModeStr === 'undefined' || layoutModeStr === null);
  // Set initial toggle state
  updateToggleState(isProductDetails);
  
  // Toggle click handler
  layoutToggle.addEventListener('click', async () => {
    const newMode = layoutToggle.classList.contains('active') ? 'buybox' : 'product-details';
    
    // Save to storage
    await chrome.storage.sync.set({ layoutMode: newMode });
    
    // Update UI
    updateToggleState(newMode === 'product-details');
    
    // Show success message
    showStatus('Settings saved successfully!');
    
    // Refresh current Amazon tab if it exists
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && tab.url.includes('amazon.')) {
        chrome.tabs.reload(tab.id);
      }
    } catch (error) {
      console.log('Could not refresh tab:', error);
    }
  });
  
  function updateToggleState(isProductDetails) {
    if (isProductDetails) {
      layoutToggle.classList.add('active');
      previewText.textContent = 'Brand info will appear in the product details area (left side)';
    } else {
      layoutToggle.classList.remove('active');
      previewText.textContent = 'Brand info will appear in the buy box (right side)';
    }
  }
  
  function showStatus(message) {
    status.textContent = message;
    status.style.display = 'block';
    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  }
});