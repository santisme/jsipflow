function Schema(mod) {
		
	var schema = mod;
	var globals = require('../config/globals.js');
	var cloner = require(globals['LIBPATH']+'cloneObject.js');
	this.model = cloner(schema);	//Clone object

	this.schema = function() {

		return schema;

	}

	this.validateModel = function() {

		for (var obj in this.model) {

			if (typeof(this.model[obj]) !== typeof(schema[obj])) {

				throw('Error: '+obj+' type missmatch for '+typeof(this.model[obj])+' and '+typeof(schema[obj]));

			}
		}

	};

	this.model = Object.preventExtensions(this.model);

	return Object.preventExtensions(this);

}

module.exports = Schema;