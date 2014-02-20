var globals = require('../config/globals.js');

var bbddConf = require('../config/databases.js');

//Database connection
var mongoose = require('mongoose');
mongoose.connect(bbddConf.uri+bbddConf.options.db.collection, bbddConf.options);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {

	mongoose.connection.close(function () {

		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);

	});

});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {

	try {

		var usersSchema = mongoose.Schema(require(globals['SCHEMASPATH']+'users.js'));
		var users = db.model('users', usersSchema);

		var userData  ={ searchCode: 'sc2',
					        fullName: 'fn',
					        orgName: 'org',
					        jobTitle: 'jt',
					        email: 'email',
					        cemexnet: Number(1),
					        location: 'lc',
					        businessUnit: 'bu',
					        employeeNumber: Number(1),
					        picture: '',
					        devices: new Array(users.schema.tree.devices[0]) };

		var user =  new users(userData);

		users.find(userData.searchCode, function(err, rows) {

			if (err) { console.error(err); return 1; }

			if (rows.length > 0) {
				console.log(rows[0].devices[0].mac);
				console.log('updating...');
				updateModel(users, { searchCode : userData.searchCode }, userData);

			} else {

				console.log('saving...');
				saveObj(user);

			}


		});


	} catch (err) {

		console.error(err);
		mongoose.connection.close();

	}

});

function saveObj(obj) {

	obj.save(function (err) {

		if (err) console.error(err);
		return 0;

	});

};

function updateModel(model, query, update) {

	model.update(query, update, function (err, numberAffected, raw) {

		if (err) console.error(err);
		console.log('The number of updated documents was %d', numberAffected);
//		console.log('The raw response from Mongo was ', raw);
		return 0;

	});

};
