function SnmpPoller() {	

	//APs MIBS
	const cdpCacheDeviceIdMib = '1.3.6.1.4.1.9.9.23.1.2.1.1.6';
	const cdpCacheDevicePortMib = '1.3.6.1.4.1.9.9.23.1.2.1.1.7';
	const cdpCachePlatformMib = '1.3.6.1.4.1.9.9.23.1.2.1.1.8';
	const cdpApFilter = 'cisco AIR';//IOS of APs contains this string pattern 
		
	const cd11IfAssignedStaMib = '.1.3.6.1.4.1.9.9.272.1.1.1.8.1.2.1'; //MACs of associated devices to AP
	const cDot11ClientAidMib = '1.3.6.1.4.1.9.9.273.1.2.1.1.10'; //Association Id. Use this value to relate the information of dot11-if and dot11-association mib
	const cDot11ClientNameMib = '1.3.6.1.4.1.9.9.273.1.2.1.1.13'; //Client Name associated to AP
	const cDot11ClientIpAddressMib = '1.3.6.1.4.1.9.9.273.1.2.1.1.16'; //Client associated ip address in hex format
	const cDot11ClientVlanIdMib = '1.3.6.1.4.1.9.9.273.1.2.1.1.17'; //Vlan number	
	const cDot11ClientBytesSentMib = '1.3.6.1.4.1.9.9.273.1.3.1.1.9'; ////Bytes sent by client
	const cDot11ClientBytesReceivedMib = '1.3.6.1.4.1.9.9.273.1.3.1.1.7'; //Bytes received by client
 	const cDot11ClientUpTimeMib = '1.3.6.1.4.1.9.9.273.1.3.1.1.2'; //Client connection time in seconds
 	
	const cdot11SecAuxSsidMib = '1.3.6.1.4.1.9.9.413.1.1.1.1.6'; //SSID id to match with cDot11ClientVlanIdMib
	const cdot11SecAuxSsidVlanNameMib = '1.3.6.1.4.1.9.9.413.1.1.1.1.19'; //SSID name to match with cdot11SecAuxSsidMib
	
	//Switchs MIBS
	const dot1dTpFdbStatusMib = '1.3.6.1.2.1.17.4.3.1.3';
	const dot1dTpFdbAddressMib = '1.3.6.1.2.1.17.4.3.1.1';
	const dot1dTpFdbPortMib = '1.3.6.1.2.1.17.4.3.1.2';
	
	const dot1dBasePortIfIndexMib = '1.3.6.1.2.1.17.1.4.1.2';
	const ifNameMib = '.1.3.6.1.2.1.31.1.1.1.1';
	const ifPhysAddressMib = '1.3.6.1.2.1.2.2.1.6';
	
	//Main Router MIBS
	const ipNetToMediaPhysAddressMib = '1.3.6.1.2.1.4.22.1.2';
 	const ipNetToMediaNetAddressMib = '1.3.6.1.2.1.4.22.1.3';
	const ifDescrMib = '1.3.6.1.2.1.2.2.1.2';

};

module.exports = SnmpPoller;