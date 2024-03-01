
/**
 * This class allow us to show the visual segmentation by putting a big bold text and a background color based on the text
 */
class VisualSegmentation {
	constructor() {}

    /**
     * Create an overlay on the element concerned by the xpath and display the text in the center of the element as an overlay.
     * If the xpath is incorrect, nothing happen
     * @param {string} xpath the expath of the HTMLElement in the current DOM tree
     * @param {string} text the text to display in the center of the HTMLElement
     */
    createOverlayBox(xpath,text) {
        let htmlZone = VisualSegmentation.#getElementByXpath(xpath)

        if(htmlZone==null) return;

        htmlZone.classList.add("tagthunder-zone");
        htmlZone.setAttribute('topic', text);
        htmlZone.setAttribute('style', "background-color: "+VisualSegmentation.#stringToColour(text)+" !important;");
    }

    /**
     * Remove all the overlays on the current page
     */
    removeAllOverlayBoxes() {
        const htmlZones = document.querySelectorAll('.tagthunder-zone')

        //for all overlay, we remove concerned CSS classes and attributes
        htmlZones.forEach(htmlZone => {
            htmlZone.classList.remove("tagthunder-zone");
            htmlZone.removeAttribute('topic');
            htmlZone.removeAttribute('style');
        })
    }

    /**
     * Given an xpath, return the HTMLElement concerned in the current DOM tree
     * @param {*} xpath 
     * @returns an HTMLElement
     */
    static #getElementByXpath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    /**
     * Given a string, return an HEX color bases on this string with an opacity of 80 (RANGE: from 00 to FF)
     * @param {*} str the seed fort the generated color
     * @returns an HEX color
     */
    static #stringToColour(str) {
        let hash = 0;
        str.split('').forEach(char => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash)
        })
        let colour = '#'
        for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        colour += value.toString(16).padStart(2, '0')
        }
        return colour +="80"
    }
}
