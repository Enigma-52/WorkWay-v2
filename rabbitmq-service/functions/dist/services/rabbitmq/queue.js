import { RABBITMQ_CONFIG } from '../../config/rabbitmqConfig.js';
import { getChannel } from './connection.js';
export async function assertQueue() {
    const channel = getChannel();
    if (!channel) {
        throw new Error('Channel not established');
    }
    try {
        await channel.assertQueue(RABBITMQ_CONFIG.queue, RABBITMQ_CONFIG.options);
        console.log('Queue asserted:', RABBITMQ_CONFIG.queue);
    }
    catch (error) {
        console.error('Failed to assert queue:', error);
        throw error;
    }
}
export async function ackMessage(channel, msg) {
    try {
        channel.ack(msg);
        console.log('Message acknowledged');
    }
    catch (error) {
        console.error('Failed to acknowledge message:', error);
        throw error;
    }
}
