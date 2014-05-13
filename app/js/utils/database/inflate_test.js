define(['./database-module'],function(){

	describe('database inflate',function(){

		var inflate,
			result,
			querySpy = jasmine.createSpy('query');

		beforeEach(module('database', function($provide){
			$provide.value('databaseQuery', querySpy);
		}));

		beforeEach(inject(function(databaseInflate, Collection){
			// any inherit = true will sequentialy inherit the objects in collection
			inflate = function(source, collection){
				var coll = new Collection(collection || []);
				querySpy.andCallFake(function(){return coll.next();});
				result = databaseInflate(source, coll, null);
			};
		}));

		it('should be fine when there is no inheritance', function(){
			inflate({});
			expect(result).toEqual({});
		});

		it('should run obj.customize function when there is no inheritance', function(){
			var spy = jasmine.createSpy();
			inflate({customize:spy});
			expect(spy).toHaveBeenCalledWith({customize:spy});
		});

		it('should return a copy, never the source', function(){
			var source;

			// without inheritance
			source = {};
			inflate(source);
			expect(result).not.toBe(source);

			// with inheritance
			source = {inherit:true};
			inflate(source, [{a:1}]);
			expect(result).not.toBe(source);
		});

		it('should recursively extend obj with the objects inherited by obj.inherit', function(){
			inflate({inherit:true}, [
				{a:1, inherit:true},
				{b:1, inherit:true},
				{c:1},
				{d:1}
			]);

			expect(result.a).toBeDefined();
			expect(result.b).toBeDefined();
			expect(result.c).toBeDefined();
			expect(result.d).not.toBeDefined();
		});

		it('should throw an error if depth exceeds 10', function(){
			expect(function(){
				inflate({inherit:true}, [
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{}
				]);
			}).toThrow();

		});

		it('should throw an exception if a query was not found', function(){
			expect(function(){
				inflate({inherit:true}, []);
			}).toThrow();
		});

		it('should inherit keys from the parent', function(){
			var parent = {a:1, b:[1,2], c:{a:1}};
			inflate({inherit:true},[parent]);
			// primitives
			expect(result.a).toBe(parent.a);
			// arrays
			expect(result.b).not.toBe(parent.b);
			expect(result.b).toEqual(parent.b);
			// objects
			expect(result.c).not.toBe(parent.c);
			expect(result.c).toEqual(parent.c);
		});

		it('should not inherit keys that the child has', function(){
			inflate({inherit:true,a:1},[{a:2}]);
			expect(result.a).toBe(1);
		});

		it('should extend data any way (child gets precedence)', function(){
			inflate({inherit:true, data:{a:1}}, [{data:{a:2, b:2}}]);
			expect(result.data.a).toBe(1);
			expect(result.data.b).toBe(2);
		});

		it('should run obj.customize function when there is inheritance', function(){
			var spy = jasmine.createSpy();
			var unspy = jasmine.createSpy('later customize');
			inflate({inherit:true}, [{customize:spy}]);
			expect(spy).toHaveBeenCalledWith({inherit:true, customize:spy});

			inflate({inherit:true, customize:spy}, [{customize:unspy}]);
			expect(spy).toHaveBeenCalledWith({inherit:true, customize:spy});
			expect(unspy).not.toHaveBeenCalled();
		});


	});
});