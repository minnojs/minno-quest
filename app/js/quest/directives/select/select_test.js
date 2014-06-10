define(['../questDirectivesModule', 'utils/randomize/randomizeModuleMock'], function(){

	describe('select', function(){
		var mixerSpy = jasmine.createSpy('mixer').andCallFake(function(a){return a;});
		beforeEach(module('questDirectives', 'randomizeMock'));

		describe('Mixer', function(){
			var mixer;
			beforeEach(module(function($provide){
				$provide.value('mixerRecursive', mixerSpy);
			}));
			beforeEach(inject(function(questSelectMixer){
				mixer = questSelectMixer;
				mixerSpy.reset();
			}));

			it('should mix the answers', inject(function(mixerRecursive){
				var answers = [1,2,3,4];
				mixer(answers, {});
				expect(mixerRecursive).toHaveBeenCalledWith(answers);
			}));

			it('should inject default values', function(){
				var result = mixer([1, {text:123}, {value:'custom'}], {});
				expect(result[0].value).toBe(0);
				expect(result[1].value).toBe(1);
				expect(result[2].value).toBe('custom');
			});

			it('should support randomize', function(){
				var result = mixer([1,2,3], {randomize:true});
				expect(result[0].text).toBe(3);
				expect(result[1].text).toBe(2);
				expect(result[2].text).toBe(1);
			});

			it('should support reverse', function(){
				var result = mixer([1,2,3], {reverse:true});
				expect(result[0].text).toBe(3);
				expect(result[1].text).toBe(2);
				expect(result[2].text).toBe(1);
			});

			it('should log the question order', function(){
				var result = mixer([1,2,3], {randomize:true});
				expect(result[0].order).toBe(0);
				expect(result[1].order).toBe(1);
				expect(result[2].order).toBe(2);
			});
		}); // end mixer

		xdescribe('SelectOne',function(){
			var formElm, inputElm, scope, $compile, choose, jqLite = angular.element;

			var compileInput = function compileInput(data){
				formElm = jqLite('<div piq-page-inject quest-select-one quest-data="data"');
				scope.data = data;
				$compile(formElm)(scope);
				scope.$digest();
				inputElm = formElm.find('input');
			};

			var addSpy = jasmine.createSpy('addQuest');
			beforeEach(module(function($compileProvider){
				//this is a hack to get the piq-page controller registered by the directive
				$compileProvider.directive('piqPageInject', function(){
					return {
						priority: -100,
						link: function(scope,element){
							element.data('$piqPageController', {
								addQuest : addSpy
							});
						}
					};
				});
			}));

			beforeEach(inject(function($injector) {
				$compile = $injector.get('$compile');
				scope = $injector.get('$rootScope').$new();

				choose = function(at){
					return jqLite('.list-group').children().at(at).click();
				};
			}));

			it('should register with piqPage', function(){
				compileInput({});
				expect(addSpy).toHaveBeenCalledWith(inputElm.controller('questSelectOne'));
			});

			it('should bind to a model', function(){
				compileInput({
					answers: [1,2]
				});
				expect(scope.response).toBe('');
				choose(1);
				expect(scope.response).toBe(1);
			});

			it('should print the correct number of answers', function(){
				compileInput({answers: [1,2,3]});
				expect(inputElm.find('button').length).toBe(3);
			});

			it('should support dflt',function(){
				compileInput({
					dflt:"default value",
					answers: [1,2,{value:'default value'}]
				});
				expect(scope.response).toBe('default value');
				expect(inputElm.find('.active').length).toBe(1);
				expect(inputElm.find('button').at(2)).toHaveClass('active');
			});

			it('should mix the answers', function(){
				compileInput({answers: [1,2,3]});
				expect(scope.quest.answers).toBeDefined();
			});
		});

	});



});