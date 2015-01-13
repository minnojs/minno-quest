/*jshint unused: vars */
define(function(){
	require.config({
		paths: {
			// libs
			underscore: ["//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min","../../bower_components/lodash/dist/lodash.min"],
			//angular: '../../bower_components/angular/angular',
			angular: ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min','../../bower_components/angular/angular.min'],
			animate: ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-animate.min', '../../bower_components/angular-animate/angular-animate.min'],
			text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min','../../bower_components/requirejs-text/text'],

			// this lib is needed for pipScorer
			jquery: ["//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min","../../bower_components/jquery/dist/jquery.min"]
		},

		packages:[
			{
				name: 'pipScorer',
				location: '../../bower_components/PIPlayer/dist/js/extensions/dscore',
				main: 'Scorer'
			}
		],
		shim: {
			angular : {exports : 'angular'},
			animate : {deps: ['angular'], exports: 'angular'}
		},
		deps: [
			// The APIs are preloaded into the app so we don't have to set them as dependencies here
			'angular', 'animate', 'underscore','text'
		]
	});

	//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
	window.name = 'NG_DEFER_BOOTSTRAP!';
});