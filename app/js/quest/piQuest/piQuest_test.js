define(['./piQuest-module'],function(){

	describe('quest.piQuest',function(){

		var element, scope, currentTask, $compile, $document;
		var jqLite = angular.element;

		var compile = function compile(data){
			var html = '<div pi-quest></div>';
			element = jqLite(html);
			currentTask = data;
			$compile(element)(scope);
			scope.$digest();
		};

		beforeEach(module('quest.piQuest', function($provide) {
			$provide.factory('currentTask', function(){
				return currentTask;
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

		it('should submit when submit is clicked', function(){});

		it('should not submit when the form is not valid', function(){});

	});
});