const amqp = require('amqplib');

async function consumeFromQueue() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'taskQueue';

    await channel.assertQueue(queue);
    console.log('Waiting for messages...');

    channel.consume(queue, (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        console.log('Received message from queue:', content);

        // Process message (e.g., update task in the database)
        // ...

        channel.ack(message); // Acknowledge message
      }
    });
  } catch (error) {
    console.error('Error consuming message from queue:', error);
  }
}

module.exports = { consumeFromQueue };
