var NetflowPacketHeaderV9 = function() {

	return {
	'versionNumber' : Number(),
	'count' : Number(),
	'sysUptime' : Number(),
	'unixSecs' : Number(),
	'sequenceNumber' : Number(),
	'sourceId' : Number(),
	'headerEndPosition' : Number()
	}

};

var NetflowPacketHeaderV5 = function() {

	return {
	'versionNumber' : Number(),
	'count' : Number(),
	'sysUptime' : Date(),
	'unixSecs' : Number(),
	'unixNSecs' : Number(),
	'sequenceNumber' : Number(),
	'sourceType' : Number(),
	'sourceId' : String(),
	'samplingInterval' : Number(),
	'headerEndPosition' : Number()
	}

};

var getNetflowPacketHeader = function(packet) {

	var header = null;
	var flowVersion = parseInt(packet.slice(0, 2).toString('hex'), 16);

	if (flowVersion === 5) {

		header = new NetflowPacketHeaderV5;

		header.versionNumber = flowVersion;
		header.count = parseInt(packet.slice(2, 4).toString('hex'), 16);
		header.sysUptime = parseInt(packet.slice(4, 8).toString('hex'), 16);
		header.unixSecs = parseInt(packet.slice(8, 12).toString('hex'), 16);
		header.unixNSecs = parseInt(packet.slice(12, 16).toString('hex'), 16);
		header.sequenceNumber = parseInt(packet.slice(16, 20).toString('hex'), 16);
		header.sourceType = parseInt(packet.slice(20, 21).toString('hex'), 16);
		header.sourceId = parseInt(packet.slice(21, 22).toString('hex'), 16);
		header.samplingInterval = parseInt(packet.slice(22, 24).toString('hex'), 16);
		header.headerEndPosition = 24;

	}

	if (flowVersion === 9) {
		//The Packet Header format is specified as:
		// 0				   1 				   2 				   3
		// 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
		//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ 
		//|        Version Number         |             Count             | 
		//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ 
		//|                           sysUpTime                           |
		//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
		//|                           UNIX Secs                           |
		//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
		//|                        Sequence Number                        |
		//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
		//|                           Source ID                           |
		//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+		

		header = new NetflowPacketHeaderV9;

		header.versionNumber = flowVersion;
		header.count = parseInt(packet.slice(2, 4).toString('hex'), 16);
		header.sysUptime = parseInt(packet.slice(4, 8).toString('hex'), 16);
		header.unixSecs = parseInt(packet.slice(8, 12).toString('hex'), 16);
		header.sequenceNumber = parseInt(packet.slice(12, 16).toString('hex'), 16);
		header.sourceId = parseInt(packet.slice(16, 20).toString('hex'), 16);
		header.headerEndPosition = 20;

	}

	return header;

};

var server = require('dgram').createSocket('udp4');
server.bind(9001, function() {

	console.log('Server bound');

});

server.on('listening', function() {

	console.log('UDP Server listening on '+server.address().address+' port '+server.address().port);

});

server.on('message', function(message, rinfo) {

	console.log(rinfo);
	console.log(message.toString('hex'));

	var header = getNetflowPacketHeader(message);

	console.log('flowVersion: '+header.versionNumber);
	console.log('count: ', header.count);
	console.log('sysUptime: '+header.sysUptime);
	console.log('Horas desde el último reinicio: '+(header.sysUptime/3600000));
	console.log('unixSecs: '+header.unixSecs);
	console.log('unixSecs formated: '+new Date( (header.unixSecs < 1000000000000) ? header.unixSecs*1000 : header.unixSecs));

	if (header.versionNumber === 5) console.log('unixNSecs: '+header.unixNSecs);
	console.log('sequenceNumber: '+header.sequenceNumber);
	if (header.versionNumber === 5) console.log('sourceType: '+header.sourceType);
	console.log('sourceId: '+header.sourceId);
	if (header.versionNumber === 5) console.log('samplingInterval: '+header.samplingInterval);

	getFlowSets(message.slice(header.headerEndPosition, message.length));

});

server.on('error', function (err) {

  console.log("Server error:\n" + err.stack);
  server.close();

});

process.on('SIGINT', function() {

	server.close();

});

function getFlowSets(data) {
	//FlowSetId < 256 -> reserved for special FlowSets
	// 0 -> Template FlowSet
	// 1 -> Options Template FlowSet
	// FlowSetId > 255 -> Data FlowSets

	var flowSetId = parseInt(data.slice(0, 2).toString('hex'), 16);

	if (flowSetId === 0) {
	//Template FlowSet
	// 0                   1                   2                   3
	// 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//| 		FlowSet ID = 0       |            Length              |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//|        Template ID 256       |          Field Count           |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//|          Field Type 1        |         Field Length 1         |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//|          Field Type 2        |         Field Length 2         |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//|              ...             |             ...                |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//|          Field Type N        |         Field Length N         |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//|        Template ID 257       |          Field Count           |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//|          Field Type 1        |         Field Length 1         |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//|          Field Type 2        |         Field Length 2         |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
	//|              ...             |             ...                |
	//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+


		var FieldType = {

			'fieldType' : Number(),
			'fieldLength' : Number()

		}

		var TemplateFlowSet = {
			'flowSetId' : Number(),
			'flowSetLength' : Number(),
			'templateId' : Number(),
			'fieldCount' : Number(),
			'fieldTypes' : Array()
		}

	}

	if (flowSetId === 1) {
	//Options Template FlowSet

	}

	if (flowSetId > 255) {
	//Data FlowSet

	}

}