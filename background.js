console.log("Background script loaded");

let networkRequests = [];

chrome.webRequest.onCompleted.addListener(
  (details) => {
    // Exclude internal extension requests
    if (!details.url.startsWith("chrome-extension://")) {
      console.log("Request completed:", details);
      const { url, method, timeStamp, type, statusCode, ip, responseHeaders } =
        details;
      networkRequests.push({
        url,
        method,
        timeStamp,
        type,
        statusCode,
        ip,
        responseHeaders,
      });
      chrome.storage.local.set({ networkRequests: networkRequests }, () => {
        console.log("Network requests saved:", networkRequests);
      });
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getNetworkRequests") {
    chrome.storage.local.get("networkRequests", (data) => {
      // Filter out internal extension requests before sending
      const externalRequests = data.networkRequests.filter(
        (request) => !request.url.startsWith("chrome-extension://")
      );
      console.log("Retrieved network requests:", externalRequests);
      sendResponse(externalRequests);
    });
    return true;
  }
});
chrome.runtime.onInstalled.addListener(() => {
  // Clear storage when the extension is installed or updated
  chrome.storage.local.set({}, () => {
    if (chrome.runtime.lastError) {
      console.error("Error clearing storage:", chrome.runtime.lastError);
    } else {
      console.log("Storage cleared successfully");
    }
  });
});

function clearChromeStorage() {
  chrome.storage.local.clear(function() {
    console.log('Chrome storage cleared.');
  });
}

// Event listener for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Check if the tab has finished loading
  if (changeInfo.status === 'complete') {
    // Clear chrome storage when tab is reloaded
    clearChromeStorage();
  }
});