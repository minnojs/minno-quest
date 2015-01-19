define(['./timer-module'], function(){

	describe('timer', function(){
		beforeEach(module('timer'));

		describe('stopper', function(){
			var Stopper, timeStack;

			beforeEach(module(function($provide){
				$provide.value('timerNow', function(){return timeStack.shift();});
			}));
			beforeEach(inject(function(timerStopper){
				Stopper = timerStopper;
			}));

			it('should return time since creation when "now" is called', function(){
				timeStack = [10,20,30];
				var st = new Stopper();
				expect(st.now()).toBe(10);
				expect(st.now()).toBe(20);
			});

		});


	});

});