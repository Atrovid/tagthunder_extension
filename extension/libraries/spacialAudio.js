
/**
 * This is a class to create spacialized sound. The listener position follow the mouse position over the page.
*/
class SpacialAudio {

    #audioCtx;
    #voiceSynth;
    #soundLoop = undefined;

	constructor() {
        this.#audioCtx = new AudioContext();
        this.#voiceSynth = new TagThunderVoiceSynthesizer();

        /**
         * Track the position of the mouse over the page and store values as listener position of the AudioContext
         */
        window.addEventListener('mousemove', (event) => {
            const posX = event.clientX
            const posY = event.clientY
    
            if(!this.#audioCtx) {
                return;
            }
            
            var listener = this.#audioCtx.listener
            if (listener.positionX) {
                // Standard way
                listener.positionX.value = posX;
                listener.positionY.value = posY;
                listener.positionZ.value = 300 - 5;
            } else {
                // Deprecated way; still needed (July 2022)
                listener.setPosition(posX, posY, 300 - 5);
            }
        });
    }
    
    /**
     * Create a new spacialized sound source at given position
     * @param {float} xPos the x position of the sound source
     * @param {float} yPos the y position of the sound source
     * @param {string} text the text on which the synth will based the generation
     */
    async createAudioSource(xPos,yPos,text) {
        var audioElement = await this.#voiceSynth.synthesize(text)
        audioElement.classList.add("tadthunder-sound")
        this.#initialize_sound_source(xPos, yPos,audioElement)
    }

    /**
     * play the sound loop
     */
    playSound() {
        if (this.#audioCtx.state === "suspended") {
            this.#audioCtx.resume();
        }

        function _delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }

        async function _play() {
            for(var sound of document.getElementsByClassName("tadthunder-sound"))  {
                sound.play()
                await _delay(200)
            }
        }
        
        if(this.#soundLoop == undefined) {
            this.#soundLoop  = setInterval(_play, 1000);   
            _play()
        }
    }
    
    /**
     * pause the sound loop
     */
    pauseSound() {
        clearInterval(this.#soundLoop)
        this.#soundLoop = undefined
    }


    /**
     * create the sound spacialization pipeline for one sound source
     * @param {string} posX the x position of the sound source
     * @param {string} posY the y position of the sound source
     * @param {HTMLAudioElement} audioElement the sound source
     */
    #initialize_sound_source(posX,posY, audioElement) {
        const posZ = 300;
        var listener = this.#audioCtx.listener
        
        if (listener.forwardX) {
            // Standard way
            listener.forwardX.value = 0;
            listener.forwardY.value = 0;
            listener.forwardZ.value = -1;
            listener.upX.value = 0;
            listener.upY.value = 1;
            listener.upZ.value = 0;
        } else {
            // Deprecated way; still needed (July 2022)
            listener.setOrientation(0, 0, -1, 0, 1, 0);
        }
        
        
        // Define the boombox panner
        const panner = new PannerNode(this.#audioCtx, {
            distanceModel: "exponential",
            positionX: posX,
            positionY: posY,
            positionZ: posZ,
            orientationX: 0.0,
            orientationY: 0.0,
            orientationZ: -1.0,
            refDistance: window.screen.width/20,
            rolloffFactor: 1,
        });
        
        const track = new MediaElementAudioSourceNode(this.#audioCtx, {
            mediaElement: audioElement,
        });
        
       track
       .connect(panner)
       .connect(this.#audioCtx.destination);  
    }
}
