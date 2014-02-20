module.exports = {
	
	searchCode: String,				//SearchCode of user
	fullName: String,				//Full name of user
	orgName: String,				//Department
	jobTitle: String,				//Job title
	email: String,					//email
	cemexnet: Number,				//Cemexnet phone number
	location: String,				//Work place
	businessUnit: String,			//Country
	employeeNumber: Number,			//Employee number
	picture: Buffer,				//Picture of user (binary data)
	devices: [{

		mac: String,				//Mac of device
		searchCode: String,			//SearchCode of device
		category: String,			//PC-LAPTOP, PC-DESKTOP.. Kind of device
		brand: String,				//Brand of device
		model: String,				//Model of device
		serialNumber: String,		//Serial number of device
		processor: String,			//Processor
		memory: Number,				//Memory capacity
		disk: Number,				//Disk capacity
		provider: String,			//Vendor of device
		nicVendor: String,			//Vendor of network chip
		type: String				//Ethernet or Wifi

	}]

}