require('dotenv').config();
const DMX = require('dmx')
const tmi = require('tmi.js');

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
  if (animation !== undefined) {
    animation.stop();    
  }
}

// DMX_ENDS _______

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

let dmxController = new DMXController();
var animation;

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!blu') {
    stopAnimation(animation);
    dmxController.setColor(1, 0, 0, 255);
    client.say(target, `Hai impostato il colore blu.`);
    console.log(`* Executed ${commandName} command`);
  } 
  else if (commandName === '!rosso') {
    stopAnimation(animation);
    dmxController.setColor(1, 255, 0, 0);
    client.say(target, `Hai impostato il colore rosso.`);
    console.log(`* Executed ${commandName} command`);
  } 
  else if (commandName === '!verde') {
    stopAnimation(animation);
    dmxController.setColor(1, 0, 255, 0);
    client.say(target, `Hai impostato il colore verde.`);
    console.log(`* Executed ${commandName} command`);
  } 
  else if (commandName === '!scoteca') {
    stopAnimation(animation);
    animation = animateThreeColors100ms();
    client.say(target, `E che cos'è la scoteca????.`);
    console.log(`* Executed ${commandName} command`);
  } 
  if (commandName === '!reset') {
    stopAnimation(animation);
    dmxController.setColor(1, 0, 0, 0);
    client.say(target, `Hai resettato il colore.`);
    console.log(`* Executed ${commandName} command`);
  } 
  else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}