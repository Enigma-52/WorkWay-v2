import amqp from 'amqplib';
import { RABBITMQ_CONFIG } from '../../config/rabbitmqConfig.js';
let connection = null;
let channel = null;
export async function connect() {
    if (connection) {
        return connection;
    }
    try {
        connection = await amqp.connect(RABBITMQ_CONFIG.url);
        console.log('Connected to RabbitMQ');
        return connection;
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
}
export async function createChannel() {
    if (!connection) {
        throw new Error('Connection not established');
    }
    if (channel) {
        return channel;
    }
    try {
        channel = await connection.createChannel();
        console.log('Channel created');
        return channel;
    }
    catch (error) {
        console.error('Failed to create channel:', error);
        throw error;
    }
}
export async function disconnect() {
    try {
        if (channel) {
            await channel.close();
            channel = null;
            console.log('Channel closed');
        }
        if (connection) {
            await connection.close();
            connection = null;
            console.log('Connection closed');
        }
    }
    catch (error) {
        console.error('Error during disconnect:', error);
        // Reset references even if cleanup fails
        channel = null;
        connection = null;
        throw error;
    }
}
export function getChannel() {
    return channel;
}
