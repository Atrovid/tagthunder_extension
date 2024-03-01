

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function getXpath(domElement) {
    
}

function generateJSON() {
    var allDivs = document.querySelectorAll('div');

    xpaths = [
        "/html/body/table/tbody/tr[1]/td[1]",
        "/html/body/table/tbody/tr[1]/td[2]",
        "/html/body/table/tbody/tr[2]/td[1]",
        "/html/body/table/tbody/tr[2]/td[2]",
    ]
    
    var jsonData = {
        lang: '',
        page_metadata: {
            title: '',
            links: []
        },
        zones: []
    };

    var htmlTag = document.querySelector('html');

    jsonData.lang = htmlTag.getAttribute('lang');

    var titleTag = document.querySelector('title');
    jsonData.page_metadata.title = titleTag.innerText;

    var styleTags = document.querySelectorAll('link[rel="stylesheet"][type="text/css"]');

    styleTags.forEach(function (styleTag) {
      jsonData.page_metadata.links.push(styleTag.getAttribute('href'));
    });

    allDivs.forEach(function (div, index) {
        var text = div.querySelector('p') ? div.querySelector('p').innerText : '';
        var rect = div.getBoundingClientRect();

        var zoneData = {
            zones_id: index,
            html_parts: [
                {
                    html: "<p>" + text + "</p>",
                    x0: rect.x,
                    y0: rect.y,
                    width: rect.width,
                    height: rect.height,
                    xpath: xpaths.length == 0 ? "" : xpaths.shift()
                }
            ],
            keyterms: [
                {
                    keyterm: text,
                    score: getRandomInt(10)
                }
            ]
        };

        jsonData.zones.push(zoneData);
    });

    // Convertir l'objet JavaScript en format JSON
    var jsonString = JSON.stringify(jsonData, null, 2);
    return jsonString
}