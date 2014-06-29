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
	var template = require('text!./piqPage.html');

	piqPageCtrl.$inject = ['$scope','$timeout', 'mixerRecursive', '$rootScope', 'questHarvest'];
	function piqPageCtrl($scope,$timeout, mixer, $rootScope, harvest){

		var self = this;

		$scope.global = $rootScope.global;
		$scope.current = $rootScope.current;

		/**
		 * Harvest piqPage questions, and log them.
		 */
		this.harvest = function(){
			return harvest($scope,self.log, $scope.global);
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
			var valid = $scope.pageForm.$valid;

			if (!valid && skipValidation !== true){
				return true;
			}

			// remove timeout if needed
			if (self.timeoutDeferred){
				$timeout.cancel(self.timeoutDeferred);
				delete(self.timeoutDeferred);
			}

			// by default, harvest after every page..
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
			template:template
		};
	}

	return directive;
});