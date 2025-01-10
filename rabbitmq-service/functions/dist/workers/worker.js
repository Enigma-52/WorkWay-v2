import amqp from 'amqplib';
import firebaseConfig from '../config/firebaseConfig.js';
const { db, setDoc, doc, } = firebaseConfig;
export async function consumeActivity() {
    console.log('Starting consumeActivity function...');
    try {
        console.log('Attempting to connect to RabbitMQ...');
        const connection = await amqp.connect('amqp://guest:guest@34.56.144.184');
        console.log('Successfully connected to RabbitMQ');
        console.log('Creating channel...');
        const channel = await connection.createChannel();
        console.log('Channel created successfully');
        console.log('Asserting queue...');
        await channel.assertQueue('activity_queue', { durable: true });
        console.log('Queue asserted successfully');
        channel.consume('activity_queue', async (msg) => {
            console.log('Message received from queue');
            if (msg) {
                try {
                    console.log('Raw message content:', msg.content.toString());
                    const activity = JSON.parse(msg.content.toString());
                    console.log('Parsed activity:', activity);
                    const activityId = activity.id || Date.now().toString();
                    console.log('Generated activityId:', activityId);
                    console.log('Creating document reference...');
                    const activityRef = doc(db, 'activities', activityId);
                    console.log('Attempting to save to Firestore...');
                    await setDoc(activityRef, activity);
                    console.log('Successfully saved to Firestore');
                    console.log('Acknowledging message...');
                    channel.ack(msg);
                    console.log('Message acknowledged');
                }
                catch (err) {
                    console.error('Error details:', {
                        message: err
                    });
                    // Log specific error types
                    if (err === 'SyntaxError') {
                        console.error('Failed to parse JSON message');
                    }
                    else if (err === 'PERMISSION_DENIED') {
                        console.error('Firestore permission denied');
                    }
                }
            }
            else {
                console.log('Received null message');
            }
        });
        console.log('Worker setup complete and listening for activity...');
    }
    catch (error) {
        console.error('Connection error details:', {
            message: error
        });
    }
}
console.log('Starting worker...');
consumeActivity().catch(err => {
    console.error('Fatal error in consumeActivity:', err);
});
