const amqp = require('amqplib/callback_api');
const async = require('async');

module.exports = (queueName, message) => {
		async.waterfall([
			createConnection.bind(this),
			createChannel.bind(this),
			createQueue.bind(this, queueName),
			sendMessageToQueue.bind(this, queueName, message)
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

//sendMessageToQueue 
function sendMessageToQueue(queueName, message, channel, callback) {
	channel.sendToQueue(queueName, new Buffer(message));
	console.log(" [x] Sent", message);
	callback(null);
}