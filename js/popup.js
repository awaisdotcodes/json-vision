document.addEventListener('DOMContentLoaded', () => {
  const jsonInput = document.getElementById('json-input');
  const formatBtn = document.getElementById('format-btn');
  const clearBtn = document.getElementById('clear-btn');
  const errorMessage = document.getElementById('error-message');

  // Auto-focus the textarea
  jsonInput.focus();

  // Load any previously saved JSON
  chrome.storage.local.get(['savedJson'], (result) => {
    if (result.savedJson) {
      jsonInput.value = result.savedJson;
    }
  });

  // Save JSON as user types
  jsonInput.addEventListener('input', () => {
    chrome.storage.local.set({ savedJson: jsonInput.value });
    hideError();
  });

  // Clear button handler
  clearBtn.addEventListener('click', () => {
    jsonInput.value = '';
    chrome.storage.local.remove(['savedJson']);
    hideError();
    jsonInput.focus();
  });

  // Format button handler
  formatBtn.addEventListener('click', () => {
    const inputValue = jsonInput.value.trim();

    if (!inputValue) {
      showError('Please enter some JSON to format.');
      return;
    }

    try {
      // Validate JSON by parsing it
      const parsed = JSON.parse(inputValue);
      
      // Store the parsed JSON and open viewer
      chrome.storage.local.set({ jsonToFormat: inputValue }, () => {
        // Clear the input after successful formatting
        jsonInput.value = '';
        chrome.storage.local.remove(['savedJson']);
        
        // Open the viewer in a new tab
        chrome.tabs.create({
          url: chrome.runtime.getURL('html/viewer.html')
        });
        window.close();
      });
    } catch (e) {
      showError(`Invalid JSON: ${e.message}`);
    }
  });

  // Handle keyboard shortcuts
  jsonInput.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to format
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      formatBtn.click();
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
  }

  function hideError() {
    errorMessage.classList.remove('show');
  }
});
