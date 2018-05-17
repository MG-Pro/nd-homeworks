const EventEmitter = require('events');

class ChatApp extends EventEmitter {
  /**
   * @param {String} title
   */
  constructor(title) {
    super();

    this.title = title;

    // Посылать каждую секунду сообщение
    setInterval(() => {
      this.emit('message', `${this.title}: ping-pong`);
    }, 1000);
  }

  close() {
    this.emit('close');
  }
}

let webinarChat = new ChatApp('webinar');
let facebookChat = new ChatApp('=========facebook');
let vkChat = new ChatApp('---------vk');

let chatOnMessage = (message) => {
  console.log(message);
};

const prepResponse = () => {
  console.log('Готовлюсь к ответу');
};
const closeHandler = () => {
  console.log('Чат вконтакте закрылся :(');
};

webinarChat.on('message', prepResponse);

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
  vkChat.removeListener('message', chatOnMessage);
}, 10000);


// Закрыть фейсбук
setTimeout(() => {
  console.log('Закрываю фейсбук, все внимание — вебинару!');
  facebookChat.removeListener('message', chatOnMessage);
}, 15000);
