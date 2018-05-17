const facebookChat = require('./facebookChat');
const vkChat = require('./vkChat');
const webinarChat = require('./webinarChat');

let chatOnMessage = (message) => {
  console.log(message);
};
const prepResponse = () => {
  console.log('Готовлюсь к ответу');
};
const closeHandler = () => {
  console.log('Чат вконтакте закрылся :(');
};

vkChat.setMaxListeners(2);

vkChat.on('close', closeHandler);
vkChat.on('message', prepResponse);

webinarChat.on('message', chatOnMessage);
facebookChat.on('message', chatOnMessage);
vkChat.on('message', chatOnMessage);

// Закрыть вконтакте
setTimeout(() => {
  console.log('Закрываю вконтакте...');
  vkChat.close();
  vkChat.removeListener('message', prepResponse);
  vkChat.removeListener('message', chatOnMessage);
}, 10000);


// Закрыть фейсбук
setTimeout(() => {
  console.log('Закрываю фейсбук, все внимание — вебинару!');
  facebookChat.removeListener('message', chatOnMessage);
}, 15000);

// Close webinar
setTimeout(() => {
  console.log('Закрываю webinar');
  webinarChat.removeListener('message', prepResponse);
  webinarChat.removeListener('message', chatOnMessage);
}, 30000);
