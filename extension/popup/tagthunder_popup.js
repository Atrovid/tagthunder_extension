

/**
 * This class represent the extension TagThunder.
 * 
 * Because of the fact that when you leave the extension pop-up,
 * the extension stopped, we need to store the state of the extension
 * on the current page somewhere. We decided to put flagh on the body element of the page :
 * 
 * - tagthunder: "true" if the extension has been injected in the current page, "false" otherwise
 * - tagthunder-running: "true" if the extension is running in the current page, "false" otherwise
 * - tagthunder-spacial-sound: "true" if the spacial-sound is enable in the current page, "false" otherwise
 * - tagthunder-visual-segmentation: "true" if the visual segmentation is enable in the current page, "false" otherwise
 */
class tagThunderExtension {
		#launchingButton;
		#visualSegButton;
		#spacialSoundButton;

	constructor() {
		this.#launchingButton = document.getElementById("start-button-checkbox");
		this.#visualSegButton = document.getElementById("option__visual-segmentation");
		this.#spacialSoundButton = document.getElementById("option__spacial-sound");
	}

	/**
	 * intialize the tagthunder extension and retrieve the current page state to update the state of the extension
	 */
	async initialize() {

		//inject code into the current page
		if(!await this.#isExtensionAlreadyInjectedInCurrentPage()) {
			await this.#injectExtensionInCurrentPage()
		} else {
			console.warn("The code has already been injected in the current page")
		}

		this.#launchingButton.checked = await this.#isExtensionRunningInCurrentPage();
		this.#launchingButton.onclick = async () => {
			await this.setExtensionActivityState(this.#launchingButton.checked);
		}
		this.#spacialSoundButton.checked = await this.#isExtensionSpacialSoundRunningInCurrentPage();
		this.#spacialSoundButton.onclick = async () => {
			await this.setSpacialSoundState(this.#spacialSoundButton.checked);
		}
		this.#visualSegButton.checked = await this.#isExtensionVisualSegmentationRunningInCurrentPage();
		this.#visualSegButton.onclick = async () => {
			await this.setVisualSegmentationState(this.#visualSegButton.checked);
		}
	}

	/**
	 * ste the extension activity state
	 * @param {boolean} state 
	 */
	async setExtensionActivityState(state) {
		if(state==true) {
			await browser.tabs.executeScript({ code: `document.body.setAttribute("tagThunder-running",true);` });
			await this.sendAction("enable-tagthunder");
		} else  {
			await browser.tabs.executeScript({ code: `document.body.setAttribute("tagThunder-running",false);` });
			await this.sendAction("disable-tagthunder");
		}
		this.#launchingButton.checked = state;
	}

	/**
	 * ste the spacial sound state
	 * @param {boolean} state 
	 */
	async setSpacialSoundState(state) {
		if(state==true) {
			await browser.tabs.executeScript({ code: `document.body.setAttribute("tagThunder-spacial-sound",true);` });
			await this.sendAction("enable-spacialSound");
		} else  {
			await browser.tabs.executeScript({ code: `document.body.setAttribute("tagThunder-spacial-sound",false);` });
			await this.sendAction("disable-spacialSound");
		}
		this.#spacialSoundButton.checked = state;
	}

	/**
	 * ste the visual segmentation state
	 * @param {boolean} state 
	 */
	async setVisualSegmentationState(state) {
		if(state==true) {
			await browser.tabs.executeScript({ code: `document.body.setAttribute("tagThunder-visual-segmentation",true);` });
			await this.sendAction("enable-visualSegmentation");
		} else  {
			await browser.tabs.executeScript({ code: `document.body.setAttribute("tagThunder-visual-segmentation",false);` });
			await this.sendAction("disable-visualSegmentation");
		}
		this.#visualSegButton.checked = state;
	}

	/**
	 * send a message to the current page injected extension to apply action
	 * @param {string} action 
	 */
	async sendAction(action) {
		const tabs = await browser.tabs.query({ active: true, currentWindow: true });
		let currentTab = tabs[0];
		await browser.tabs.sendMessage(currentTab.id, { tagThunder_action: action });
	}

	/**
	 * execute a script on the current page to know its state.
	 * - if the extension is injected
	 * - if the extension is running
	 * - if the spacial sound is enable
	 * - if the visual segmentation is enable
	 */
	async #executeScriptOnCurrentPage() {
		await browser.tabs
		.executeScript({ code: `browser.storage.local.set({
			tagThunder_injected: document.body.getAttribute("tagThunder")=="true",
		});
		
		browser.storage.local.set({
			tagThunder_running: document.body.getAttribute("tagThunder-running")=="true",
		});
		
		browser.storage.local.set({
			tagThunder_spacialSound_running: document.body.getAttribute("tagThunder-spacial-sound")=="true",
		});
		
		browser.storage.local.set({
			tagThunder_visualSegmentation_running: document.body.getAttribute("tagThunder-visual-segmentation")=="true",
		});`});
	}
	

	/**
	 * retrieve the state defined by the #executeScriptOnCurrentPage() method
	 * state : is the extension is running on the current page ?
	 * @see #executeScriptOnCurrentPage
	 * @returns {boolean}
	 */
	async #isExtensionRunningInCurrentPage() {
		await this.#executeScriptOnCurrentPage();
		
		let result = await browser.storage.local.get("tagThunder_running");
		return result.tagThunder_running == true
	}

	/**
	 * retrieve the state defined by the #executeScriptOnCurrentPage() method
	 * state : is the spacial sound enable on the current page ?
	 * @see #executeScriptOnCurrentPage
	 * @returns {boolean}
	 */
	async #isExtensionSpacialSoundRunningInCurrentPage() {
		await this.#executeScriptOnCurrentPage();
		
		let result = await browser.storage.local.get("tagThunder_spacialSound_running");
		return result.tagThunder_spacialSound_running == true
	}

	/**
	 * retrieve the state defined by the #executeScriptOnCurrentPage() method
	 * state : is the visual segmentation enable on the current page ?
	 * @see #executeScriptOnCurrentPage
	 * @returns {boolean}
	 */
	async #isExtensionVisualSegmentationRunningInCurrentPage() {
		await this.#executeScriptOnCurrentPage();
		
		let result = await browser.storage.local.get("tagThunder_visualSegmentation_running");
		return result.tagThunder_visualSegmentation_running == true
	}
	
	/**
	 * retrieve the state defined by the #executeScriptOnCurrentPage() method
	 * state : is the extension injected on the current page ?
	 * @see #executeScriptOnCurrentPage
	 * @returns {boolean}
	 */
	async #isExtensionAlreadyInjectedInCurrentPage() {
		await this.#executeScriptOnCurrentPage();
		
		let result = await browser.storage.local.get("tagThunder_injected");
		return result.tagThunder_injected == true
	}
	

	/**
	 * inject the extension in the current page. You MUST check if the extension has not been already injected in the page before calling this function.
	 * @see #isExtensionAlreadyInjectedInCurrentPage
	 */
	async #injectExtensionInCurrentPage() {
		
		// LOAD LIBRARIES
		await browser.tabs
		.executeScript({ file: "/libraries/mespeak.js" })
		await browser.tabs
		.executeScript({ file: "/libraries/generateJSON.js" })
		await browser.tabs
		.executeScript({ file: "/libraries/voiceSynthesizer.js" })
		await browser.tabs
		.executeScript({ file: "/libraries/spacialAudio.js" })
		await browser.tabs
		.executeScript({ file: "/libraries/visualSegmentation.js" })
		await browser.tabs
		.executeScript({ file: "/libraries/tagThunder.js" })
		
		await browser.tabs
		.insertCSS({ file: "/libraries/visualSegmentation.css" });
		
		//LOAD SCRIPTS
		await browser.tabs
		.executeScript({ file: "/script.js" });

		//flag to say that the code has been injected
		await browser.tabs
		.executeScript({ code: `document.body.setAttribute("tagThunder",true);` });

	}
}


launchExtension();
/**
 * the extension launching function
 */
async function launchExtension() {
	tagThunder = new tagThunderExtension();
	await tagThunder.initialize();

	
}
