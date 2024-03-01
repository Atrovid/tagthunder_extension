
/**
 * This class can create HTMLAudioElement based on a text using Voice Synthesizer called MeSpeak
 * 
 * MESPEAK DOCUMENTATION: https://www.masswerk.at/mespeak/#:~:text=js
 */
class TagThunderVoiceSynthesizer {

	#audioBlobs = []

	constructor() {
		meSpeak.loadConfig("https://cdn.jsdelivr.net/gh/btopro/mespeak/mespeak_config.json");
		meSpeak.loadVoice('https://cdn.jsdelivr.net/gh/btopro/mespeak/voices/fr.json');
	}
	
	
	/**
	 * create an HTMLAudioElement based on a provided text using MeSpeak synthesizer
	 * @param {string} topic the text used to synthesize
	 * @returns {HTMLAudioElement} the synthesize element
	 */
	async synthesize(topic) {
		var options = {
			rawdata: 'array'
		};
		
		var audioData = await  meSpeak.speak(topic, options);

		const audioBlob = new Blob([new Uint8Array(audioData)], { type: 'audio/wav' });
		const audioUrl = URL.createObjectURL(audioBlob);
		const audioElement = document.createElement('audio');
		audioElement.src = audioUrl;
		
		document.body.appendChild(audioElement);
		this.#audioBlobs.push(audioBlob);

		return audioElement;
	}
}

