document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup script loaded'); // Log for debugging

  const networkTableBody = document.querySelector('#networkTable tbody');

  // Function to render network requests in the table
  function renderNetworkRequests(requests) {
      console.log('Rendering network requests:', requests);
      if (!networkTableBody) {
          console.error('Network table body not found in the DOM');
          return;
      }
      networkTableBody.innerHTML = '';
      if (requests && requests.length > 0) {
          requests.forEach((request) => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${request.url}</td>
                  <td>${request.method}</td>
                  <td>${request.statusCode}</td>
                  <td>${request.type}</td>
                  <td>${new Date(request.timeStamp).toLocaleString()}</td>
              `;
              networkTableBody.appendChild(row);
          });
      } else {
          const emptyRow = document.createElement('tr');
          emptyRow.innerHTML = '<td colspan="5">No data available</td>';
          networkTableBody.appendChild(emptyRow);
      }
  }

  // Function to fetch network requests from background script
  function fetchNetworkRequests() {
      console.log('Fetching network requests');
      chrome.runtime.sendMessage({ action: 'getNetworkRequests' }, (response) => {
          console.log('Response received:', response); // Log for debugging
          if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
          } else {
              renderNetworkRequests(response);
          }
      });
  }

  // Fetch network requests when the popup is opened
  fetchNetworkRequests();
});
