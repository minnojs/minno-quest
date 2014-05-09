define(['./database-module'],function(){

	var
		randomSpy = jasmine.createSpy("random").andReturn(1),
		exRandomSpy  = jasmine.createSpy('exRandom').andReturn([3,2,1]);

	describe('database.query',function(){

		var result
			, coll = [
				{set:1, data:{val:1, other:'value'}},
				{set:1, data:{val:2}},
				{set:2, data:{val:3}},
				{set:2, data:{val:4}}
			]
			, q;

		beforeEach(module('database'));
		beforeEach(module(function($provide){
			$provide.value("database.randomizer.randomInt", randomSpy);
			$provide.value("database.randomizer.randomArr", exRandomSpy);
		}));

		beforeEach(inject(function(query, Randomizer){
			randomSpy.reset();
			exRandomSpy.reset();
			q = function(){result = query.apply(null, [coll, new Randomizer(), arguments[0]]);};
		}));

		it('should support returning a random document', function(){
			q({});
			expect(result).toBe(coll[1]);
		});

		it('should support returning a random document by set', function(){
			q({set:2});
			expect(result).toBe(coll[3]);
		});

		it('should randomly pick from the appropriate set if the query is a string', function(){
			q(2);
			expect(result).toBe(coll[3]);
		});

		it('should support querying by data:Obj', function(){
			// the query only returns one row, we should reset the randomizer accordingly
			randomSpy.andReturn(0);

			q({data:{val:1}});
			expect(result).toBe(coll[0]);

			q({data:{val:3}});
			expect(result).toBe(coll[2]);
		});

		it('should support querying by a data:Function', function(){
			// the query only returns one row, we should reset the randomizer accordingly
			randomSpy.andReturn(0);

			q({data:function(value){return value.data.val === 3;}});
			expect(result).toBe(coll[2]);
		});

		it('should allow using a custom function a a query', function(){
			var compare = {some:1};
			var fn = jasmine.createSpy('dummy').andReturn(compare);
			q(fn);
			expect(result).toEqual(compare);
			expect(fn).toHaveBeenCalledWith(coll);
		});


	});
});