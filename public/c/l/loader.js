(function () {

    // settings 
    var baseURLSrc = "http://localhost:8080";

    function isMob() {
        return /Android|iPhone|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function close() {
        img.src = iconDef;
        iframe.style.display = 'none';
        img.style.top = "auto";
        img.style.bottom = "50px";
        img.style.right = "50px";
    }

    var baseURLAsset = baseURLSrc + "/c";

    var iconDef = baseURLAsset + "/l/initial-icon.svg";
    var iconClose = baseURLAsset + "/l/close.svg";
    var iconLoading = baseURLAsset + "/l/loading.gif";

    var iframe = document.createElement("IFRAME");

    var img2 = new Image(50, 50); // width, height values are optional params 
    img2.src = iconLoading;

    var img = new Image(50, 50); // width, height values are optional params 
    img.src = iconDef;

    img.style.position = "fixed";
    img.style.zIndex = 99999;
    img.style.cursor = "pointer";
    img.style.borderRadius = "5px";
    img.style.bottom = "50px";
    img.style.right = "50px";

    var loaded = false;

    // get code
    var dom = document.getElementById('comecat');
    var chunk = dom.src.split('?code=');
    if (chunk.length < 1)
        return;

    var code = chunk[chunk.length - 1];

    img.onclick = function () {


        if (isMob()) {
            window.open(baseURLSrc + "?c=" + code);
            return;
        }

        if (img.src == iconDef && loaded === false) {

            loaded = true;

            img.src = iconLoading;
            img.style.opacity = 0.7;

            iframe.src = baseURLSrc + "?c=" + code;
            iframe.style.transition = "all 1.0s ease";
            iframe.style.position = "fixed";

            iframe.style.width = "500px";
            iframe.style.right = "50px";
            iframe.style.bottom = "5vh";
            iframe.style.height = "90vh";

            iframe.style.zIndex = 100000;
            iframe.style.border = "none";
            iframe.style.backgroundColor = "transparent";
            iframe.style.borderRadius = "5px";
            iframe.style.border = "2px solid #9990";

            iframe.onload = function () {

                iframe.style.border = "2px solid #999";
                img.src = iconClose;
                img.style.bottom = "auto";
                img.style.top = "10px";
                img.style.right = "10px";

                img.style.zIndex = 100001;

            };

            document.body.appendChild(iframe);

        }

        else if (img.src == iconDef && loaded == true) {

            img.src = iconClose;
            iframe.style.display = 'block';

            img.style.bottom = "auto";
            img.style.top = "10px";
            img.style.right = "10px";

        }

        else if (img.src == iconClose) {

            close();

        }

    };

    document.body.appendChild(img);

    window.comecatClose = close;

})();
