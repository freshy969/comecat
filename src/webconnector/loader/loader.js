(function () {

    function isMob() {
        return /Android|iPhone|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // settings 
    var baseURL = "http://localhost:8080/c/";
    //var baseURL = "https://dev.come.cat/c/";

    var iconDef = baseURL + "l/initial-icon.svg";
    var iconClose = baseURL + "l/close.svg";
    var iconLoading = baseURL + "l/loading.gif";

    var iframe = document.createElement("IFRAME");

    var img2 = new Image(50, 50); // width, height values are optional params 
    img2.src = iconLoading;

    var img = new Image(50, 50); // width, height values are optional params 
    img.src = iconDef;

    img.style.position = "fixed";
    img.style.zIndex = 99999;
    img.style.cursor = "pointer";
    img.style.borderRadius = "5px";

    if (isMob()) {
        img.style.bottom = "5px";
        img.style.right = "5px";
    } else {
        img.style.bottom = "50px";
        img.style.right = "50px";
    }

    var loaded = false;

    // get code
    var dom = document.getElementById('comecat');
    var chunk = dom.src.split('?code=');
    if (chunk.length < 1)
        return;

    var code = chunk[chunk.length - 1];

    img.onclick = function () {

        if (img.src == iconDef && loaded === false) {

            if (isMob()) {
                window.open(baseURL + "?c=" + code);
                return;
            }

            loaded = true;

            img.src = iconLoading;
            img.style.opacity = 0.7;

            setTimeout(function () {

                img.src = iconClose;

                if (isMob()) {
                    img.style.bottom = "auto";
                    img.style.top = "10px";
                    img.style.right = "10px";
                } else {

                }

                img.style.zIndex = 100001;

            }, 2000);


            iframe.src = baseURL + "?c=" + code;

            iframe.style.transition = "all 1.0s ease";
            iframe.style.position = "fixed";

            if (isMob()) {
                iframe.style.width = "90vw";
                iframe.style.left = "50px";
                iframe.style.top = "0px";
                iframe.style.height = "100vh";
            } else {
                iframe.style.width = "500px";
                iframe.style.right = "50px";
                iframe.style.bottom = "110px";
                iframe.style.height = "60vh";
            }

            iframe.style.zIndex = 100000;
            iframe.style.border = "2px solid #999";
            iframe.style.backgroundColor = "transparent";
            iframe.style.borderRadius = "5px";

            document.body.appendChild(iframe);

        }

        else if (img.src == iconDef && loaded == true) {
            img.src = iconClose;
            iframe.style.display = 'block';

        }

        else if (img.src == iconClose) {
            img.src = iconDef;
            iframe.style.display = 'none';
        }

    };

    document.body.appendChild(img);

})();
