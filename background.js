chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "downloadImage" && message.url) {
        chrome.downloads.download({
            url: message.url,
            filename: message.filename
        });
    }
});
