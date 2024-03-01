
/**
 * This class represent the TagThunder extension injected in the page.
 */
class tagThunderInjectedExtension {

	#visualSegmentation;
	#spacialAudio;

	#visualSegmentationState;
	#spacialAudioState;
	#extensionState;

	#jsonProps;



	constructor() {
		this.#visualSegmentation = new VisualSegmentation();
		this.#spacialAudio = new SpacialAudio();

		this.#spacialAudioState = false;
		this.#visualSegmentationState = false;
		this.#extensionState = false;

		
		var json = generateJSON();
		this.#jsonProps = JSON.parse(json);
	}

	/**
	 * Initialize all audio elements. Must be triggered after a user gesture on the page.
	 */
	async initialize() {

		for(var zone of this.#jsonProps.zones) {	
			let xPos = zone.html_parts[0].x0 + zone.html_parts[0].width/2
			let yPos = zone.html_parts[0].y0 + zone.html_parts[0].height/2

			let keyterm = zone.keyterms[0].keyterm

			await this.#spacialAudio.createAudioSource(xPos,yPos,keyterm)
		}
		
	}

	/**
	 * Set Visual Segmentation state
	 * @param {boolean} state the new state
	 */
	async setVisualSegmentationState(state) {
		if(state==true && this.#extensionState==true) {
			//console.warn("add overlay")
			for(var zone of this.#jsonProps.zones) {
				this.#visualSegmentation.createOverlayBox(zone.html_parts[0].xpath,zone.keyterms[0].keyterm)
			}
		} else {
			//console.warn("remove overlay")
			this.#visualSegmentation.removeAllOverlayBoxes();
		}
	}

	
	/**
	 * Set Spacial Audio state
	 * @param {boolean} state the new state
	 */
	async setSpacialSoundState(state) {
		if(state==true && this.#extensionState==true) {
			//console.warn("play sound")
			this.#spacialAudio.playSound()
		} else {
			//console.warn("pause sound")
			this.#spacialAudio.pauseSound()
		}
	}


	/**
	 * action manager that handle all the action the firefox extension can trigger
	 * @param {string} action 
	 */
	actionListener(action) {
		//console.error("NEW ACTION: ",action);
		switch(action) {
			case "enable-tagthunder":
				this.#extensionState = true;
			break;
			case "disable-tagthunder":
				this.#extensionState = false;
			break;
			case "enable-spacialSound":
				this.#spacialAudioState = true;
			break;
			case "disable-spacialSound":
				this.#spacialAudioState = false;
			break;
			case "enable-visualSegmentation":
				this.#visualSegmentationState = true;
			break;
			case "disable-visualSegmentation":
				this.#visualSegmentationState = false;
			break;
		}
		this.setSpacialSoundState(this.#spacialAudioState);
		this.setVisualSegmentationState(this.#visualSegmentationState);
	}


}
