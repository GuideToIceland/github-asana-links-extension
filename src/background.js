var onHeadersReceived = function(details) {

  for (var i = 0; i < details.responseHeaders.length; i++) {
    if ('content-security-policy' === details.responseHeaders[i].name.toLowerCase()) {
      details.responseHeaders[i].value = '';
    }
  }

  return {
    responseHeaders: details.responseHeaders
  };
};

var filter = {
  urls: ["*://*.github.com/*"],
  types: ["main_frame", "sub_frame"]
};

chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, ["blocking", "responseHeaders"]);

const messageListener = function(request, sender, sendResponse) {
  const { queryType, taskId, accessToken } = request;
  if(queryType === "asanaTask") {
    fetch("https://app.asana.com/api/1.0/tasks/" + taskId, {
      headers: new Headers({
        'Authorization': 'Bearer ' + accessToken
      })
    })
      .then((response) => {
        if(response.status === 200)
        {
          return response.json();
        }
        throw Error(response);
      })
      .then(json => {
        const task = json.data;
        sendResponse({task: json.data});
      })
      .catch(error => {
        sendResponse({error});
      });

    return true;
  }
}
chrome.runtime.onMessage.addListener(messageListener);