/**
 * This is the default controller for all questions.
 * It exposes the local scope, and a `value` method that the harvester can use.
 */

define(function(require){
	var _ = require('underscore');

	questController.$inject = ['$scope', 'timerStopper', '$parse', '$attrs','piConsole'];
	function questController($scope, Stopper, $parse, $attr, piConsole){
		var self = this;
		var log;
		var data = $scope.data;
		var defaults = {
			dflt: NaN
		};

		this.scope = $scope;
		this.stopper = new Stopper();


		this.registerModel = function(ngModel, options){

			options = _.defaults(options || {}, defaults);

			var ngModelGet = $parse($attr.ngModel);
			var dfltValue = ("dflt" in data) ? data.dflt : options.dflt; // use "in" to cover cases where dflt is set to "" or explicitly undefined

			// make model accesable from within scope
			$scope.model = ngModel;

			log = ngModelGet($scope.$parent);

			// init log

			// create log if it doesn't exist yet
			if (_.isUndefined(log)){
				log = {};
				ngModelGet.assign($scope.$parent, log);
			} else {
				piConsole(['question']).warn('This question has already been in use: "' + log.name + '"');
			}

			// expose all the stuff...
			self.log = ngModel.$modelValue = log;

			_.defaults(log,{
				name: data.name,
				response: dfltValue,
				// @TODO: this is a bit fragile and primitive.
				// we should probably create a unique ID service of some sort...
				serial: _.size($parse('current.questions')($scope.$parent))
			});

			$scope.response = ngModel.$viewValue = log.response;


			// model --> view
			// should probably never be called (since our model is an object and not a primitive)
			ngModel.$formatters.push(function(modelValue) {
				return modelValue.response;
			});

			// view --> model
			ngModel.$parsers.push(function(viewValue){
				// don't know exactly why this is needed!
				// probably has to do with our use of nested ng-module
				if (_.isUndefined(viewValue)){
					return log;
				}
				var latency = self.stopper.now();

				log.response = viewValue;
				log.latency = latency;

				// if this is the first change
				if (!log.pristineLatency){
					log.pristineLatency = latency;
				}

				return log;
			});

			$scope.$watch('response',function(newValue, oldValue /*, scope*/){
				newValue !== oldValue && ngModel.$setViewValue(newValue);
			});

			var correctValidator = function(value) {
				var response = value.response;
				var correctValue = data.correctValue;

				// make sure numbers are always treated as strings
				_.isNumber(correctValue) && (correctValue+="");
				_.isNumber(response) && (response+="");

				if (_.isEqual(correctValue, response)) {
					ngModel.$setValidity('correct', true);
				} else {
					ngModel.$setValidity('correct', false);
					//value.response = dfltValue;
				}

				return value;
			};

			if (data.correct) {
				ngModel.$parsers.push(correctValidator);
				data.response = correctValidator(this.log);
			}
		};

		$scope.$on('quest:decline', function(event){
			event.preventDefault();
			log.declined = true;
			log.submitLatency = self.stopper.now();
		});

		$scope.$on('quest:submit', function(event){
			event.preventDefault();
			log.declined = undefined;
			log.submitLatency = self.stopper.now();
		});
	}

	return questController;
});