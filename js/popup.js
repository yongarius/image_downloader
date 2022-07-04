const loadImageMsgId = document.getElementById("load-image");
var imgNum = 0;
var loadedImgNum = 0;
var tabTitle;

if(loadImageMsgId) {
    loadImageMsgId.onclick = function() {
        chrome.tabs.query( {active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    tabId: tabs[0].id
                },
                function(response) {
                    imgNum = response.image_sources.length;
                    loadedImgNum = 0;
                    tabTitle = response.tabTitle;
                        
                    // delete existing images
                    const parent = document.getElementById("image-container");
                    const oldImg = document.getElementsByTagName("img");

                    var i;
                    for(i = oldImg.length; i--; ) {
                        parent.removeChild(oldImg[i]);
                    }



                    // display image
                    for(i = 0; i < response.image_sources.length; ++i) {
                        var img = document.createElement('img');
                        img.onload = function() {
                            ++loadedImgNum;
                            var wMin, wMax, hMin, hMax;
                            wMin = document.getElementById("width-min").value;
                            wMax = document.getElementById("width-max").value;
                            hMin = document.getElementById("height-min").value;
                            hMax = document.getElementById("height-max").value;

                            if(this.naturalWidth < wMin || this.naturalWidth > wMax) { /* || this.naturalHeight < hMin || this.naturalHeight > hMax) { */
                                this.className = "img-hide";
                            }

                            if(loadedImgNum == imgNum) {
                                ConcatImages();
                            }
                        }
                        img.onerror = function() {
                            ++loadedImgNum;
                            this.className = "img-hide";
                            if(loadedImgNum == imgNum) {
                                ConcatImages();
                            }
                        }
                        img.src = response.image_sources[i];
                        const container = document.getElementById("image-container");
                        container.appendChild(img);
                    }
                }
            )
        });
    };
}

const canvasMaxHeight = 65535;

function ConcatImages() {
    // delete existing canvas
    var oldCanvas = document.getElementsByTagName("canvas");
    var i;
    for(i = oldCanvas.length; i--;) {
        oldCanvas[i].parentNode.removeChild(oldCanvas[i]);
    }

    var newCanvas = [];

    var cvHeight = 0;
    var cvWidth = 0;
    var cvHeights = [];

    // get images size
    var imgs = document.getElementsByTagName("img");
    for(i = 0; i < imgs.length; ++i) {
        if(!imgs[i].classList.contains("img-hide")) {
            cvHeight += imgs[i].naturalHeight;
            if(cvHeight > canvasMaxHeight) {
                cvHeights[cvHeights.length] = cvHeight - imgs[i].naturalHeight;
                cvHeight = imgs[i].naturalHeight;
            }
            cvWidth = Math.max(cvWidth, imgs[i].naturalWidth);
        }
    }
    cvHeights[cvHeights.length] = cvHeight;
    cvHeight = 0;

    // create new canvas
    var numCanvas = cvHeights.length;
    var body = document.getElementsByTagName("body");
    for(i = 0; i < numCanvas; ++i) {
        newCanvas[i] = document.createElement("canvas");
        body[0].appendChild(newCanvas[i]);
        newCanvas[i].style.width = newCanvas[i].width = cvWidth;        
        newCanvas[i].style.height = newCanvas[i].height = cvHeights[i];
        newCanvas[i].style.display = "none";
    }

    // draw image in canvas
    var canvasIdx = 0;
    for(i = 0; i < imgs.length; ++i) {
        if(!imgs[i].classList.contains("img-hide")) {
            if(cvHeight + imgs[i].naturalHeight > canvasMaxHeight) {
                ++canvasIdx;
                newCanvas[canvasIdx].getContext("2d").drawImage(imgs[i], 0, 0, imgs[i].naturalWidth, imgs[i].naturalHeight, 0, 0, imgs[i].naturalWidth, imgs[i].naturalHeight);
                cvHeight = imgs[i].naturalHeight;
            }
            else {
                newCanvas[canvasIdx].getContext("2d").drawImage(imgs[i], 0, 0, imgs[i].naturalWidth, imgs[i].naturalHeight, 0, cvHeight, imgs[i].naturalWidth, imgs[i].naturalHeight);
                cvHeight += imgs[i].naturalHeight;
            }
        }
    }
}

/* const inputWidthMin = document.getElementById("width-min");
if(inputWidthMin) {
    inputWidthMin.addEventListener("change", function() {
        alert(this.value);
    });
    inputWidthMin.onchange = function() {
        alert(this.value);
    };

} */


/* Downolad Image */
var imgs = [];
var curImgIdx = 0;

function DownloadImages() {
    const a = document.getElementById("for-download");
    var i;
    if(document.getElementById("one-file").checked) {
        var canvas = document.getElementsByTagName("canvas");

        for(i = 0; i < canvas.length; ++i) {
            a.href = canvas[i].toDataURL("iamge/png").replace("image/png", "image/octet-stream");
            a.download = "./" + tabTitle + `_${i}.png`;
            a.click();
        }
    }
    else {
        if(i >= imgs.length)
            return;

        if(!imgs[i].classList.contains("img-hide")) {
            a.href = imgs[i].src;
            a.download = dir + "/test.png";
            a.click();
            ++i;
            setTimeout(() => {DownloadImages()}, 100);
        }
        else {
            i++;
            DownloadImages();
        }
    }
}

const dl = document.getElementById("download");
if(dl) {
    dl.onclick = function() {
        imgs = document.getElementsByTagName("img");
        i = 0;
        DownloadImages();
    };
}