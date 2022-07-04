chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const img = document.getElementsByTagName("img");
    var imgSrc = [];
    var i;
    for(i = 0; i < img.length; ++i) {
      if(!img[i].src.includes("chrome-extension") && img[i].src != "") {
        imgSrc.push(img[i].src);
      }
    }
    sendResponse({image_sources: imgSrc, tabTitle: document.title});
});