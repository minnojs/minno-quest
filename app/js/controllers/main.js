define(['angular'], function (angular) {
	'use strict';

	angular.module('piquestApp.controllers.MainCtrl', [])
		.controller('MainCtrl', function ($scope) {
			$scope.name = 'Max Karl Ernst Ludwig Planck (April 23, 1858 – October 4, 1947)';

			$scope.awesomeThings = [
				'HTML5 Boilerplate',
				'AngularJS',
				'Karma'
			];
		});
});
