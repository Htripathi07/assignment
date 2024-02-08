const amqp = require('amqplib');

async function sendToQueue(message) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'taskQueue';

    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    console.log(`Message sent to queue: ${JSON.stringify(message)}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error sending message to queue:', error);
    // Implement retry logic here
    // Example: Retry after 5 seconds
    setTimeout(() => {
      sendToQueue(message);
    }, 5000);
  }
}

module.exports = { sendToQueue };

