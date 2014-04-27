/*
* deep inspiration from route provider
*/
define(function(require){
	//var angular = require('angular');
	require;
	var tmpo;

	var sequenceProvider = function sequenceProvider(){
		var stack = [];
		var pointer = 0;

		// add a task
		this.when = function(task){
			stack.push(task);
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

		stack.push({
			header:'SecondPage',
			questions: [
				{type:'textNumber', stem:'blargh?', min:3,maxlength:7,required:false, errorMsg: {min:'rejoice!'}},
				{type:'text', stem:'Dope!',pattern:'/[0-9]/',required:false}
			]
		});

		this.$get = function($rootScope){
			var $sequence = {
				getStack: function(){return stack;},		// expose sequence
				current: tmp,								// the curernt task
				next: function(){
					var task = stack[pointer++];
					if (typeof task !== 'object'){
						throw new Error ('Hey, we ran into some trouble in the sequencer');
					} else {
						this.current = task;
						tmpo = task;
						$rootScope.$evalAsync(updateTask);
					}
				}
			};

			$rootScope.$on('$sequence:update', updateTask);

			return $sequence;
		};
		this.$get.$inject = ['$rootScope'];
	};

	return sequenceProvider;

	function updateTask(){
		console.log(tmpo);
	}

});