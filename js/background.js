// SourceTree JSON - Background Service Worker
// Handles URL fetching to bypass CORS

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'FETCH_URL') {
    fetchURL(request.url)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

async function fetchURL(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const text = await response.text();
  
  // Validate it's JSON
  try {
    JSON.parse(text);
  } catch (e) {
    throw new Error('Response is not valid JSON');
  }
  
  return text;
}
