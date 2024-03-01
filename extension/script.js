console.warn("TAGTHUNDER EXTENSION: injection started")


/**
 * When all the scripts are injected, we create a new instance of the extension on the page.
 * 
 * After that, we wait for the user to click on the body to trigger the creation of all the audio elements. This is mandatory because of Firefox security protection.
 */


var tagThunder = new tagThunderInjectedExtension();
browser.runtime.onMessage.addListener(function(message) {
  tagThunder.actionListener(message.tagThunder_action);
});

// flag to not initialize twice audio elements
initialized = false;

document.body.onclick = () => {
  if(initialized) return ;
  initialized = true;

  console.warn("TAGTHUNDER EXTENSION: initialization")
  tagThunder.initialize();

  
}

console.warn("TAGTHUNDER EXTENSION: injection finished")
