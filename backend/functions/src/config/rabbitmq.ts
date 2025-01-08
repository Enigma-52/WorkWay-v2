import amqp from 'amqplib';

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://34.56.144.184');
  const channel = await connection.createChannel();
  await channel.assertQueue('activity_queue');
  console.log('Connected to RabbitMQ');

  return channel;
}

export default connectRabbitMQ;
