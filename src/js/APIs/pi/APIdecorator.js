define(function(require){

	var _ = require('underscore');
	var counter = 1000;

	function APIdecorator(constructor){
		constructor.prototype.save = save;
	}

	return APIdecorator;

	function save(obj){
		var script = this.script;
		if (!_.isPlainObject(obj)){
			throw new Error('API.save can send only objects.');
		}

		var meta = {
			taskName: script.name,
			taskNumber: script.serial || 0
		};

		var arr = _.map(obj, function(value, key){
			return _.extend({
				name: key,
				response: value,
				serial: ++counter
			}, meta);
		});

		return this.post('implicit/PiQuest', arr);
	}

});