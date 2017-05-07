define(function(require){
    var jqLite = require('angular').element;
    require('../questDirectivesModule');

    describe('multiGrid', function(){
        var $table, $scope, $rootScope, $compile;

        function compile(data){
            $table = jqLite('<div quest-multi-grid quest-data="data" ng-model="current.questions[data.name]"></div>');
            $scope.current = $rootScope.current;
            $scope.data = data;
            $compile($table)($scope);
            $scope.$digest();
        }

        function submitAttempt(){
            $scope.$parent.submitAttempt = true;
            $scope.$digest();
        }

        function choose(row, column){
            $table.find('tbody tr').eq(row-1).find('td [ng-switch-when]').eq(column-1).trigger('click');
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

            describe(': checkbox', function(){
                it('should be the default', function(){
                    compile({columns:[{}], rows:[1]});
                    var cell = $table.find('tbody tr [ng-switch-when="checkbox"]');
                    expect(cell.is('button')).toBeTruthy();
                });

                it('should set checkboxType', function(){
                    compile({columns:[{}], rows:[1], checkboxType:'test'});
                    var cell = $table.find('tbody tr [ng-switch-when="checkbox"]');
                    expect(cell).toHaveClass('test');
                });

                it('should respect type=checkbox', function(){
                    compile({columns:[{type:'checkbox'}], rows:[1]});
                    var cell = $table.find('tbody tr [ng-switch-when="checkbox"]');
                    expect(cell.is('button')).toBeTruthy();
                });
            });

            it('should respect type=text', function(){
                compile({columns:[{type:'text', textProperty:'test1'}], rows:[{test1:1234}]});
                var cell = $table.find('tbody tr [ng-switch-when="text"]');
                expect(cell.text()).toBe('1234');
            });

            describe(': input', function(){
                it('should respect type=input', function(){
                    compile({columns:[{type:'input'}], rows:[{test1:1234}]});
                    var cell = $table.find('tbody tr [ng-switch-when="input"]');
                    expect(cell.children('input').length).toBeTruthy();
                });
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

            describe(': binding', function(){
                it('should bind to checkboxes to model (and set default values)', function(){
                    compile({rows:[{name:'name'},{name:'name2'}], columns: [111,222,333]});
                    choose(1,2);
                    expect($scope.current.questions.name.response).toEqual([false, true, false]);
                    choose(2,1);
                    expect($scope.current.questions.name2.response).toEqual([true, false, false]);
                });

                it('should bind input to model', function(){
                    compile({rows:[{name:'name'}], columns: [1, {type:'input'}, 3]});
                    var input = $table.find('tbody tr input');
                    input.val(1234).trigger('change');
                    expect($scope.current.questions.name.response).toEqual([false, '1234', false]);
                });

                xit('should bind dropdown to model', function(){
                    compile({rows:[{name:'name'}], columns: [1, {type:'dropdown', answers: [{text:1, value:555}, 44]}, 3]});
                    var input = $table.find('tbody tr select');
                    input.val('555').trigger('change');
                    expect($scope.current.questions.name.response).toEqual([false, '555', false]);
                });
            });

            it('should respect column.value', function(){
                compile({rows:[{name:'name'}], columns: [111,222,{value:'abc'}]});
                choose(1,3);
                expect($scope.current.questions.name.response).toEqual([false, false, 'abc']);
            });

            it('should auto generate row names', function(){
                compile({name:'test',rows:[1], columns: [111,222,333]});
                choose(1,2);
                expect($scope.current.questions.test001.response).toEqual([false, true, false]);
            });

            it('should data.shuffle rows', function(){
                compile({rows:['t0','t1','t2'], shuffle:true});
                var $rows = $table.find('tbody tr th');
				// shuffle is mocked to reverse
                expect($rows.eq(0).text()).toBe('t2');
                expect($rows.eq(1).text()).toBe('t1');
            });

            xit('should overwrite[] column correctly', function(){
                compile({rows:['t0',{overwrite:[null, {type:'dropdown', answers:[123,345,345]}]},'t2'], columns: [1,2,3]});
                var column = $table.find('tbody tr td:nth-child(3)');
                var regular = column.eq(0).find('[ng-switch-when="dropdown"]');
                var overide = column.eq(1).find('[ng-switch-when="dropdown"]');
                expect(regular.length).toBe(0);
                expect(overide.length).toBe(1);
                expect(overide.find('option').length).toBe(3); // make sure that all attributes get copied to the overwritten column
            });
        });
    });
});
