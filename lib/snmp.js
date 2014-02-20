function SnmpFramework() {

	var snmp = require('net-snmp');
	var callbackFunct = null;
	var taskId = null;

	this.snmpOptions = 	{

		port: 161,
		retries: 1,
		timeout: 2000,
		transport: "udp4",
		trapPort: 162,
		version: snmp.Version2c

	};

	this.getVarBinds = function(error, varBinds) {

		if (error) { 

			console.error('ERROR: taskId: '+taskId+' '+error.toString());
			//FUNCTION TO MANAGE/NOTIFY ERROR

		} else {

			if (snmp.isVarbindError(varBinds[0])) {

	            console.error (snmp.varbindError(varBinds[0]));

	        } else {

				for (var n = 0; n < varBinds.length; n++) {

					if (varBinds[n].type === snmp.ObjectType.OctetString) {

//							console.log('snmp.ObjectType.OctetString');
//							console.log(varBinds[n].value.toString());
//							console.log('isBuffer: '+Buffer.isBuffer(varBinds[n].value));
						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' : varBinds[n].value.toString() });

					} else if(varBinds[n].type === snmp.ObjectType.Integer) {

						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' :  Number(varBinds[n].value) });

					} else if (varBinds[n].type === snmp.ObjectType.Counter) {

						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' : Number(varBinds[n].value) });
						
					} else if (varBinds[n].type === snmp.ObjectType.Gauge) {

						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' : Number(varBinds[n].value) });
						
					} else if (varBinds[n].type === snmp.ObjectType.TimeTicks) {

						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' :  Number(varBinds[n].value) });

					} else if (varBinds[n].type === snmp.ObjectType.Integer32) {

						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' : Number(varBinds[n].value) });
						
					} else if (varBinds[n].type === snmp.ObjectType.Counter32) {

						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' :  Number(varBinds[n].value) });
						
					} else if (varBinds[n].type === snmp.ObjectType.Gauge32) {

						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' : Number(varBinds[n].value) });
						
					} else if (varBinds[n].type === snmp.ObjectType.Unsigned32) {

						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' : Number(varBinds[n].value) });

					} else if (varBinds[n].type === snmp.ObjectType.Boolean) {

						callbackFunct({ 'taskId' : taskId, 'oid' : varBinds[n].oid, 'value' : Boolean(varBinds[n].value) });

					} else {

						console.error('Data type '+varBinds[n].type+' missmatch.');

					}

				}

	        }

		}

	};


	this.snmpGet = function(ip, oid, community, options, callback, localTaskId) {

		var snmpOptions = (options) ? options : this.snmpOptions;
		var session = snmp.createSession(ip, community, snmpOptions);

		callbackFunct = callback;
		taskId = localTaskId;
		session.get(new Array(oid), this.getVarBinds);

	};

	return this;

};

module.exports = SnmpFramework;