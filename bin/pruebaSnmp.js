var Snmp = require('../lib/snmp.js');
var snmp = new Snmp();
var split = require('split');

var serverOptions = {

	port: 8124,
	host: 'localhost'

};

var snmpOptions = 	{

		port: 161,
		retries: 1,
		timeout: 5000,
		transport: "udp4",
		trapPort: 162,
		version: snmp.Version2c

};

//SERVER LISTENING
var server = require('net').createServer(function(connection) {

	connection.on('data', function(chunk) {

		var varBind = JSON.parse(chunk);
		console.log('------------------');		
		console.log(varBind);
		console.log('------------------');		
//		console.log(varBind.taskId);
//		console.log(varBind.oid);
//		console.log(varBind.value);

	});

}).listen(serverOptions.port, function() {

  console.log('------------');
  console.log('Server bound');
  console.log('------------');

  var taskRemoteIp = '10.42.8.40';
  var oids = ['1.3.6.1.2.1.1.5.0', '1.3.6.1.2.1.1.1.0', '1.3.6.1.2.1.1.3.0', '1.3.6.1.2.1.1.7.0'];

  for (var n = 0; n < oids.length; n++) {

	  var taskId = new Date().getTime()+'-'+taskRemoteIp+'-'+oids[n];
	  snmp.snmpGet(taskRemoteIp, oids[n], 'S0p0A1w', snmpOptions, getVarBinds, taskId);
	  console.log(taskId+' Launched');

  };

});

server.on('error', function (err) {

	if (err.code == 'EADDRINUSE') {

		console.log('-----------------------------');
		console.error('Address in use, retrying...');
		console.log('-----------------------------');		
		setTimeout(function () {

			server.close();
			server.listen(serverOptions.port, serverOptions.host);

		}, 1000);

	};

});

process.on('SIGINT', function() {

	server.close();
	console.log('------------------');
	console.log('Closing server....');
	console.log('------------------');

});


//CALLBACK FUNCTION TO SEND VARIABLES TO SERVER
var getVarBinds = function(varBind) {

	var client = require('net').connect( { port: serverOptions.port }, function() {

		client.write(JSON.stringify(varBind), function() {

			client.end();

		});

	});

	client.on('data', function(data) {
	
		client.end();
	
	});
	
	client.on('error', function(err) {

		console.error('Client Error: taskId: '+varBind.taskId+' '+err.toString());

	});

	client.on('end', function() {
	
		console.log('Client disconnected: taskId: '+varBind.taskId);
	
	});

};
