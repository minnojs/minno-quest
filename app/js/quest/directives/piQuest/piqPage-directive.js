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

	piqPageCtrl.$inject = ['$scope','$timeout', 'mixerRecursive'];
	function piqPageCtrl($scope,$timeout, mixer){

		var self = this;
		var questStack = [];

		/**
		 * Allows a controller to register with piqPage
		 * @param {[Controller]} quest [a controller with a "valid" and "value" methods]
		 */
		this.addQuest = function(quest){
			questStack.push(quest);
		};

		/**
		 * Removes a controller registered with piqPage
		 * @param {[Controller]} quest [a controller previously registered]
		 */
		this.removeQuest = function(quest){
			var index = _.indexOf(questStack, quest);
			if (index > 0){
				questStack.splice(index,1);
			}
		};

		/**
		 * Harvest piqPage questions, and log them.
		 */
		this.harvest = function(){
			var logs = _.map(questStack, function(quest){
				return quest.value();
			});

			$scope.$emit('quest:log', logs, self.log);

			questStack = [];
		};

		/**
		 * Proceed to next page.
		 * By default validates the form first.
		 * `skipValidation` allows proceeding without validation (good for timeout/decline to answer)
		 *
		 * @name submit
		 * @param  {Boolean} skipValidation [Should skip validation of the form before submitting?]
		 */
		$scope.submit = function(skipValidation){
			var valid = _.reduce(questStack, function(result, quest){
				return result &= quest.valid();
			}, true);

			if (!valid && skipValidation !== true){
				return true;
			}

			// reomve timeout if needed
			if (self.timeoutDeferred){
				$timeout.cancel(self.timeoutDeferred);
				delete(self.timeoutDeferred);
			}

			self.harvest();
			next();
		};

		$scope.$watch('page', pageSetup);

		function next(proceedObj){
			$scope.$emit('quest:next', proceedObj);
		}

		function pageSetup(newPage, oldValue, scope){
			// set the page log object
			self.log = {
				name: newPage.name,
				startTime: +new Date()
			};

			/**
			 * Render questions (mixem up!!)
			 */
			$scope.questions = mixer($scope.page.questions);


			// If there is a timeout set, submit when it runs out.
			if (newPage.timeout){
				self.timeoutDeferred = $timeout(function(){
					self.log.timeout = true;
					scope.submit(true);
					/* global alert */
					newPage.timeoutMessage && alert(newPage.timeoutMessage);
				}, newPage.timeout);
			}
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