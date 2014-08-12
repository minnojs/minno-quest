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

	piqPageCtrl.$inject = ['$scope','$timeout', '$rootScope', 'questHarvest'];
	function piqPageCtrl($scope,$timeout, $rootScope, harvest){
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
		 *
		 * @name submit
		 * @param  {Boolean} skipValidation [Should skip validation of the form before submitting?]
		 */
		$scope.submit = function(skipValidation){
			var valid = $scope.pageForm.$valid;

			if (!valid && skipValidation !== true){
				return true;
			}

			self.proceed();
		};

		/**
		 * Decline to answer. mark all questions on this page as declined
		 * (leave filtering the responses themselves to the logger, so that answers can be saved despite declining)
		 */
		$scope.decline = function(){
			var questions = $scope.global.current.questions;
			// mark all questions on this page as declined
			_.forEach($scope.page.questions || {}, function(quest){
				questions[quest.name].declined = true;
			});
			self.proceed();
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
			self.harvest();
			next();
		};

		$scope.$watch('page', pageSetup);
		$scope.$on('quest:submit', function(){
			$scope.submit();
		});

		function next(proceedObj){
			$scope.$emit('quest:next', proceedObj);
		}

		function pageSetup(newPage, oldValue, scope){
			// set the page log object
			self.log = {
				name: newPage.name,
				startTime: +new Date()
			};

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