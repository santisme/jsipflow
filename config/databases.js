var BBDDCONF = {
	
	options: {
		db: { collection: 'argos', native_parser: true },
		server: { poolSize: 5 },
		user: 'argos',
		pass: 'argos2013'
	},
	uri: 'mongodb://localhost:27017/'

}

module.exports = BBDDCONF;