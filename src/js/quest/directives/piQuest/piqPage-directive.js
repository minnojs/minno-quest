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
	var _ = require('underscore');
	var angular = require('angular');

	piqPageCtrl.$inject = ['$scope','$timeout', '$rootScope'];
	function piqPageCtrl($scope,$timeout, $rootScope){
		var self = this;

		$scope.global = $rootScope.global;
		$scope.current = $rootScope.current;

		/**
		 * Harvest piqPage questions, and log them.
		 */
		this.harvest = function(lognow){
			var questions = $scope.current.questions;

			_.each($scope.page.questions, function(q){
				// don't log if we don't have a name or if lognow is'nt true
				if (!q.name || !(lognow || q.lognow)){return;}

				// get the appropriate log
				var log = questions[q.name];

				// don't log if this has already been logged
				if (log.$logged){return;}

				// emit to quest directive
				$scope.$emit('quest:log', log, self.log);
				log.$logged = true;
			});
		};

		/**
		 * Proceed to next page.
		 *
		 * @name submit
		 * @param  {Boolean} skipValidation [Should skip validation of the form before submitting?]
		 */
		$scope.submit = function(skipValidation){
			var valid = $scope.pageForm.$valid;

			// mark this attempt for submitting
			// useful for validation...
			$scope.submitAttempt = true;

			if (!valid && skipValidation !== true){
				return true;
			}

			// broadcast to the quest controller
			$scope.$broadcast('quest:submit');

			self.proceed();
			$scope.$emit('quest:next');
		};

		/**
		 * Decline to answer. mark all questions on this page as declined
		 */
		$scope.decline = function($event){
			var $el = angular.element($event.target);
			var notDoubleClick = (this.page.decline !== 'double');

			// decline and proceed to next page
			// unless this is a double style decline and then simply set "active"
			if (notDoubleClick || $el.hasClass('active')){
				// broadcast to the quest controller
				$scope.$broadcast('quest:decline');
				self.proceed();
				$scope.$emit('quest:next');
			} else {
				$el.addClass('active');
			}
		};

		/**
		 * Go back to previous page.
		 */
		$scope.prev = function(){
			// broadcast to the quest controller
			self.proceed();
			$scope.$broadcast('quest:prev');
		};


		/**
		 * Proceed to the next page.
		 * After canceling timeout, and harvesting.
		 * @todo: optional harvesting
		 */
		this.proceed = function(){

			// remove timeout if needed
			if (self.timeoutDeferred){
				$timeout.cancel(self.timeoutDeferred);
				delete(self.timeoutDeferred);
			}

			// by default, harvest after every page..
			self.harvest($scope.page.lognow);
		};

		// setup page on page refresh
		pageSetup($scope.page);

		// refresh page on question change (deep watch)
		// should refresh this directive without animating the whole page in...
		$scope.$watch('current.questions', pageRefresh, true);

		// listen for auto submit calls
		$scope.$on('quest:submit:now', function(){
			$scope.submit();
		});

		// refresh $scope.page
		// indirectly triggers pageSetup
		function pageRefresh(){
			$scope.$emit('quest:refresh');
		}

		function pageSetup(newPage){
			// set the page log object
			self.log = {
				name: newPage.name,
				startTime: +new Date()
			};

			// If there is a timeout set, submit when it runs out.
			if (newPage.timeout){
				self.timeoutDeferred = $timeout(function(){
					self.log.timeout = true;
					$scope.submit(true);
					/* global alert */
					newPage.timeoutMessage && alert(newPage.timeoutMessage);
				}, newPage.timeout, false);
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