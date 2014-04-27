define(['./piQuest-module','../text/text-module'],function(){

	describe('quest.piQuest',function(){

		var element, scope, currentTask, nextSpy, $compile, $document;
		var jqLite = angular.element;

		var compile = function compile(data){
			var html = '<div pi-quest></div>';
			element = jqLite(html);
			currentTask = data;
			$compile(element)(scope);
			scope.$digest();
		};

		// we need the text module in order to realy test this...
		beforeEach(module('quest.text'));
		beforeEach(module('quest.piQuest', function($provide) {
			// create spy for next
			nextSpy = jasmine.createSpy('$sequence.next');

			$provide.factory('$sequence', function(){
				return {
					current: currentTask,
					next: nextSpy
				};
			});

		}));

		beforeEach(inject(function($injector) {
			$compile = $injector.get('$compile');
			$document = $injector.get('$document');
			scope = $injector.get('$rootScope');
		}));


		it('should compile the correct number of questions', function(){
			compile({
				questions: [{},{},{}]
			});
			expect(element.find('li').length).toBe(3);
		});

		it('should compile the header', function(){
			compile({
				header: 'My header'
			});

			expect(element.find('h2').text()).toBe('My header');
		});

		it('should be valid only if the question are valid', function(){
			compile({
				questions: [{required:true}]
			});
			expect(element).toBeInvalid();
		});

		it('should not show a header if it doesnt exist', function(){
			compile({});
			expect(element.find('h2').length).toBe(0);
		});

		it('should submit when submit is clicked', function(){
			compile({});
			element.find('[data-role="submit"]').click();
			expect(nextSpy).toHaveBeenCalled();
		});

		it('should not submit when the form is not valid', function(){
			var submitBtn = element.find('[data-role="submit"]');
			compile({});
			scope.form.$setValidity('test');
			scope.$digest();
			submitBtn.click();
			expect(nextSpy).not.toHaveBeenCalled();
		});

	});
});