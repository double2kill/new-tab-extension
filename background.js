chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({color: '#3aa757'}, function () {
    console.log('The color is green.')
  })
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }])
  })
})
chrome.runtime.onMessage.addListener(
  function (options, sender, onSuccess) {
    const {type, url} = options
    if (type === 'fetch') {
      fetch(url)
        .then(response => response.json())
        .then(response => onSuccess(response))
    }
    return true // Will respond asynchronously.
  }
)