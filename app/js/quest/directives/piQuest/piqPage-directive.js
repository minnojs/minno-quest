/**
 * Main tag for piqPage component.
 * Used automaticaly from within the piQuest directive.
 *
 * This directive is responsible for:
 * 1. Displaying page questions.
 * 2. Detecting the end of a page (submit, TO).
 * 3. Harvesting information from the questions.
 * 4. Suplying information to the logger.
 *
 * @name piqPage
  */
define(function (require) {

	var _ = require('underscore');
	var template = require('text!./piqPage.html');

	piqPageCtrl.$inject = ['$scope'];
	function piqPageCtrl($scope){
		var self = this;
		var questStack = [];

		this.addQuest = function(quest){
			questStack.push(quest);
		};

		this.removeQuest = function(quest){
			var index = _.indexOf(questStack, quest);
			if (index > 0){
				questStack.splice(index,1);
			}
		};

		this.harvest = function(){
			var logs = _.map(questStack, function(quest){
				return quest.value();
			});

			$scope.$emit('quest:log', logs);

			questStack = [];
		};

		$scope.submit = function(validate){
			var valid = _.reduce(questStack, function(result, quest){
				return result &= quest.valid();
			}, true);

			if (!valid && validate !== false){
				return true;
			}

			self.harvest();
			next();
		};

		function next(proceedObj){
			$scope.$emit('quest:next', proceedObj);
		}
	}

	function directive(){
		return {
			replace: true,
			controller: piqPageCtrl,
			template:template //,
			//link: function(scope, element, attr, ctrl) {}
		};
	}

	return directive;
});