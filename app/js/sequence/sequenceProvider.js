/*
* deep inspiration from route provider
*/
define(function(require){
	//var angular = require('angular');
	require;

	var sequenceProvider = function sequenceProvider(){
		var sequence = [];
		var pointer = 0;

		// add a task
		this.when = function(task){
			sequence.push(task);
			return this;
		};

		// what to do at the end?
		this.otherwise = function(){

		};

		var tmp = {
			header:'My header',
			questions: [
				{type:'textNumber', stem:'argh?', minlength:3,maxlength:7,required:false, errorMsg: {minlength:'rejoice!'}},
				{type:'text', stem:'Dope!',pattern:'/[0-9]/',required:true}
			]
		};

		this.$get = function($rootScope){
			var $sequence = {
				sequence: sequence,		// expose sequence
				current: tmp,			// the curernt task
				next: function(){
					var task = sequence[pointer++];
					if (typeof task !== 'object'){
						throw new Error ('Hey, we ran out of options');
					} else {
						this.current = task;
					}
				}
			};

			$rootScope.$on('$sequenceNext', function(){});

			return $sequence;
		};
		this.$get.$inject = ['$rootScope'];
	};

	return sequenceProvider;

});