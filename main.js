const DMX = require('dmx')

class DMXController {  

  constructor() {    
  	const dmx = new DMX();
    this.universe = dmx.addUniverse(
    	'demo',
      	'enttec-open-usb-dmx',
      	'/dev/ttyUSB0'
    );    

    this.universe.updateAll(0);
  }  

  setColor(startChannel, r, g, b) {
    this.universe.update({
      [startChannel]: r,
      [startChannel + 1]: g,
      [startChannel + 2]: b
    });
  }

}

let dmxController = new DMXController();

function animateThreeColors100ms() {
	return new DMX.Animation()
		.add({1: 255,}, 100)
		.add({1: 0,}, 100)
		.add({2: 255,}, 100)
		.add({2: 0,}, 100)
		.add({3: 255,}, 100)
		.add({3: 0,}, 100)
		.runLoop(dmxController.universe);
}

function stopAnimation(animation) {
	animation.stop();
}

var animation = animateThreeColors100ms();

setTimeout(() => {
  animation.stop(animation);
}, 5000);


