define(function(require){
	var jqLite = require('angular').element;
	require('../questDirectivesModule');

	describe('grid', function(){
		var $table, $scope, $rootScope, $compile;

		function compile(data){
			$table = jqLite('<div quest-grid quest-data="data" ng-model="current.questions[data.name]"></div>');
			$scope.current = $rootScope.current;
			$scope.data = data;
			$compile($table)($scope);
			$scope.$digest();
		}

		function choose(row, column){
			$table.find('tbody tr').eq(row-1).find('td button').eq(column-1).trigger('click');
		}

		beforeEach(module('questDirectives', function($provide){
			$provide.value('questShuffle', function(arr){
				return arr.reverse();
			});
		}));

		beforeEach(inject(function($injector){
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			$compile = $injector.get('$compile');
			$rootScope.current = {questions:{}};
		}));

		describe(': columns', function(){
			it('should create a table with columns.length+1 columns', function(){
				compile({columns:['t1','t2']});
				var $headers = $table.find('thead th');
				expect($headers.length).toBe(3);
			});

			it('should set columns names', function(){
				compile({columns:['t1',{stem:'t2'}]});
				var $headers = $table.find('thead th');
				expect($headers.eq(1).text()).toBe('t1');
				expect($headers.eq(2).text()).toBe('t2');
			});

		});

		describe(': rows', function(){
			it('should create a table with rows.lenght rows', function(){
				compile({rows:[{},{},{}]});
				var $rows = $table.find('tbody tr');
				expect($rows.length).toBe(3);
			});

			it('should set row stems', function(){
				compile({rows:['t1',{stem:'t2'}]});
				var $rows = $table.find('tbody tr th');
				expect($rows.eq(0).text()).toBe('t1');
				expect($rows.eq(1).text()).toBe('t2');
			});

			it('should bind to model', function(){
				compile({rows:[{name:'name'}], columns: [111,222,333]});
				choose(1,2);
				expect($scope.current.questions.name.response).toBe(2);
			});

			it('should respect column.value', function(){
				compile({rows:[{name:'name'}], columns: [111,222,{value:'abc'}]});
				choose(1,3);
				expect($scope.current.questions.name.response).toBe('abc');
			});

			it('should know how to row.reverse', function(){
				compile({rows:[{name:'name', reverse:true}], columns: [111,222,{value:'abc'}]});
				choose(1,1);
				expect($scope.current.questions.name.response).toBe(3);
			});

			it('should auto generate row names', function(){
				compile({name:'test',rows:[1], columns: [111,222,333]});
				choose(1,2);
				expect($scope.current.questions.test001.response).toBe(2);
			});

			it('should data.shuffle rows', function(){
				compile({rows:['t0','t1','t2'], shuffle:true});
				var $rows = $table.find('tbody tr th');
				// shuffle is mocked to reverse
				expect($rows.eq(0).text()).toBe('t2');
				expect($rows.eq(1).text()).toBe('t1');
			});
		});

		describe(': table', function(){
			it('should keep track of the sum of answers', function(){
				compile({name:'test',rows:[1,2], columns: [111,222,333]});
				choose(1,2);
				choose(2,3);
				expect($rootScope.current.questions.test.response).toBe(5);
			});

			it('should not count rows that have a non numeric response', function(){
				compile({name:'test',rows:[1,2], columns: [111,222,{value:'a'}]});
				choose(1,2);
				choose(2,3);
				expect($rootScope.current.questions.test.response).toBe(2);
			});
		});
	});
});