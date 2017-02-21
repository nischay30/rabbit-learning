const amqp = require('amqplib/callback_api');
const async = require('async');

module.exports = (queueName) => {
		async.waterfall([
			createConnection.bind(this),
			createChannel.bind(this),
			createQueue.bind(this, queueName),
			waitingForMessage.bind(this, queueName)
		], (err, results) => {
				if(err) { console.log('Err:', err); return; }
				console.log('Succesfully completed');
		});
}

// Create a connection
function createConnection(callback) {
	amqp.connect('amqp://localhost', (err, connection) => {
		if(err) { callback(err); return; }
		console.log('Succesfully connected');
		callback(null, connection);
	});
}

// Create a channel
function createChannel(connection, callback) {
	connection.createChannel((err, channel) => {
		if(err) { callback(err); return; }
		console.log('Channel Created');
		callback(null, channel);
	});
}

//Declare a Queue
function createQueue(queueName, channel, callback) {
	channel.assertQueue(queueName, { durable: false}, (err, res)=> {
		if(err) { callback(err); return;}
		console.log('Queue Created Succesfully', res);
		callback(null, channel);
	});
}

//waiting For the Messafe 
function waitingForMessage(queueName, channel) {
	console.log(`Waiting for messages in ${queueName}`);
	channel.consume(queueName, (message) => {
		console.log('Received Message is ', message.content.toString());
	}, {noAck: true});
}