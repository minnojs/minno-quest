/*
 * @name: piMessage Directive
 */
define(function (require) {

	var _ = require('underscore');

	directive.$inject = ['$compile', '$rootScope', '$document', 'piConsole'];
	function directive($compile, $rootScope, $document, $console){
		return {
			link: function($scope, $element) {
				var events = 'keydown';
				var script = $scope.script;
				var newScope = $scope.newScope = $scope.$new();
				var template;
				var context = {
					global : $rootScope.global,
					current : $rootScope.current
				};

				try {
					template = _.template(script.$template)(context);
				} catch(e){
					template = script.$template;
					$console('message').error(e);
				}

				_.extend($scope, context);
				$scope.done = done;

				// listen for events
				$document.on(events, onKeydown);
				$scope.$on('$destroy',function(){
					$document.off(events, onKeydown);
				});



				$element.html(template);
				$compile($element.contents())(newScope);

				// check if the we should proceed and if so call done
				function onKeydown(e){
					// accept both the keyCode and the key itself
					var keyArr = _.isArray(script.keys) ? script.keys : [script.keys];
					var keys = _.map(keyArr,function(value){
						return _.isString(value) ? value.toUpperCase().charCodeAt(0) : value;
					});

					if (~_.indexOf(keys, e.which)){
						$scope.done();
					}
				}

				function done(){
					newScope.$destroy();
					$element.empty();
					$scope.$emit('message:done');
				}
			}
		};
	}





	return directive;
});