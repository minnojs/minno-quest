/**
 * This is the default controller for all questions.
 * It exposes the local scope, and a `value` method that the harvester can use.
 */

define(function(require){
	var _ = require('underscore');

	questController.$inject = ['$scope', 'timerStopper', '$parse', '$attrs','$log'];
	function questController($scope, Stopper, $parse, $attr, $log){
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

			// set log and module
			if (_.isUndefined(ngModelGet($scope.$parent))){
				self.log = ngModel.$modelValue = log = {
					name: data.name,
					response: dfltValue,
					// @TODO: this is a bit fragile and primitive.
					// we should probably create a unique ID service of some sort...
					serial: _.size($parse('current.questions')($scope.$parent))
				};
				$scope.response = ngModel.$viewValue = dfltValue;

				ngModelGet.assign($scope.$parent, log);
			} else {
				log = self.log = ngModelGet($scope.$parent);
				$scope.response = ngModel.$viewValue = log.response;
				data.DEBUG && $log.warn('DEBUG: this question has already been in use: "' + log.name + '"');
			}


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
				log.declined = undefined;

				// if this is the first change
				if (!log.pristineLatency){
					log.pristineLatency = latency;
				}

				return log;
			});

			// make the model work with a custom event, so that it doesn't get confused with inner modules
			// note: this is a problem caused by nesting ngModule...
			ngModel.$options = _.defaults(ngModel.$options || {}, {updateOn: "quest"});

			$scope.$watch('response',function(newValue, oldValue /*, scope*/){
				newValue !== oldValue && ngModel.$setViewValue(newValue, 'quest');
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
		});

		// $scope.$on('$destroy', function(a,b){
		// 	console.log(a,b)
		// })
	}

	return questController;
});