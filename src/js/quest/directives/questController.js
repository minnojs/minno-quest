/**
 * This is the default controller for all questions.
 * It exposes the local scope, and a `value` method that the harvester can use.
 */

define(function(require){
    var _ = require('underscore');

    questController.$inject = ['$scope', 'timerStopper', '$parse', '$attrs','piConsole', 'piInvoke', '$rootScope','questGuid'];
    function questController($scope, Stopper, $parse, $attr, piConsole, invoke, $rootScope,guid){
        var self = this;
        var log;
        var data;
        var defaults = {
            dflt: NaN,
            data: $scope.data
        };

        this.scope = $scope;
        this.stopper = new Stopper();


        this.registerModel = registerModel;

		/**
		 * Listen for quest events
		 */
        $scope.$on('quest:submit', function(event){
            event.preventDefault();
            log.declined = undefined;
            log.submitLatency = self.stopper.now();
            invoke(data.onSubmit, {log:log,question:data});
        });

        $scope.$on('quest:decline', function(event){
            event.preventDefault();
            log.declined = true;
            log.submitLatency = self.stopper.now();
            invoke(data.onDecline, {log:log,question:data});
        });

        $scope.$on('quest:timeout', function(event){
            event.preventDefault();
            log.timeout = true;
            invoke(data.onTimeout, {log:log,question:data});
        });


		/**
		 * Get the model and options from the directive
		 * @param  {Object} ngModel
		 * @param  {Object} options
		 */
        function registerModel(ngModel, options){
            options = _.defaults(options || {}, defaults);
            data = options.data;

            var ngModelGet = $parse($attr.ngModel);
            var dfltValue = data.hasOwnProperty('dflt') ? data.dflt : options.dflt;

			// make model accesable from within scope
            $scope.model = ngModel;

			// has to be evaluated in the context of the parent scope because we're assuming that the quest directives have an isolated scope
            log = ngModelGet($scope.$parent);

			// ********
			// create log if it doesn't exist yet
            if (_.isUndefined(log)){
                log = {};
                ngModelGet.assign($scope.$parent, log);
            } else {
                piConsole(['question']).warn('This question has already been in use: "' + log.name + '"');
            }

            if (!data.name){
                piConsole(['question']).warn('There is a question without a name! I\'d tell you what it is, but it has no name!');
            }

			// expose all the stuff...
            self.log = ngModel.$modelValue = log;

            _.defaults(log,{
                name: data.name,
                response: dfltValue,
                serial: guid()
            });

            $scope.response = ngModel.$viewValue = log.response;

            // model --> view
            // should probably never be called (since our model is an object and not a primitive)
            ngModel.$formatters.push(function(modelValue) {
                return _.get(modelValue, 'response');
            });

            // view --> model
            ngModel.$parsers.push(function(viewValue){
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
                if (!_.isEqual(newValue, oldValue)){
                    ngModel.$setViewValue(newValue);
                    invoke(data.onChange, {log:log,question:data});
                } 
            });

            $scope.$on('$destroy', function(){
                invoke(data.onDestroy, {log:log,question:data});
            });

            if (data.correct) {
                ngModel.$parsers.push(correctValidator);
                data.response = correctValidator(this.log);
            }

            invoke(data.onCreate, {log:log,question:data});

            $scope.$evalAsync(function() { 
                invoke(data.onLoad, {log:log,question:data});
            } );

            function correctValidator(value) {
                var response = value.response;
                var correctValue = data.correctValue;

                // make sure numbers are always treated as strings
                _.isNumber(correctValue) && (correctValue+='');
                _.isNumber(response) && (response+='');

                if (_.isEqual(correctValue, response)) {
                    ngModel.$setValidity('correct', true);
                } else {
                    ngModel.$setValidity('correct', false);
                }

                return value;
            }

        }
    }

    return questController;
});
