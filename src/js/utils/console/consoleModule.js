define(function(require){
	var angular = require('angular');
	var module = angular.module('piConsole',[]);

	module.service('piConsole', require('./consoleProvider'));
	module.service('piConsolePrototype', require('./consolePrototypeProvider'));
	module.directive('piConsole', require('./consoleDirective'));

	module.filter('stringify', function(){
		return stringify;
	});

	return module;

	function stringify(value, pretty) {
		if (value == null) { // null || undefined
			return '<i class="text-muted">undefined</i>';
		}
		if (value === '') {
			return '<i class="text-muted">an empty string</i>';
		}

		switch (typeof value) {
			case 'string':
				break;
			case 'number':
				value = '' + value;
				break;
			case 'object':
				if (value instanceof Error){
					value = value.message;
					break;
				}
			/* fall through */
			default:
				value = '<a href="javascript:void(0)">' + angular.toJson(value, !!pretty) + '</a>';
		}

		return value;
	}
});


