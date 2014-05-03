define(['./store-provider'],function(provider){

	var querySpy = jasmine.createSpy("query").andReturn("query result");

	angular
		.module('database.store',[])
		.value('database.query', querySpy)
		.service('Store',provider);


	describe('database.store',function(){

		var store;

		beforeEach(module('database.store'));

		beforeEach(inject(function(Store){
			store = new Store();
		}));

		it('should instantiate a store object', function(){
			expect(store.store).toEqual({});
		});

		it('should support creating a collection', function(){
			// create instiates an empty array
			store.create('nameSpace');
			expect(store.store.nameSpace).toEqual([]);
			expect(store.store.nameSpace.length).toBe(0);
		});

		it('should throw an error if trying to recreate an existing nameSpace', function(){
			store.create('nameSpace');
			expect(function(){
				store.create('nameSpace');
			}).toThrow();
		});

		it('should support read', function(){
			store.store = {
				nameSpace: "content"
			};
			expect(store.read('nameSpace')).toBe("content");
		});

		it('should throw an error if trying to read a non existing nameSpace', function(){
			expect(function(){
				store.read('nameSpace');
			}).toThrow();
		});


		it('should support update (with both object and array notations)', function(){
			store.store = {
				nameSpace: []
			};

			store.update('nameSpace', 1);
			expect(store.store.nameSpace).toEqual([1]);

			store.update('nameSpace', [2,3]);
			expect(store.store.nameSpace).toEqual([1,2,3]);
		});

		it('should support del', function(){
			store.store = {
				nameSpace: []
			};

			store.del('nameSpace');
			expect(store.store.nameSpace).toBeFalsy();
		});

		it('should support querying', function(){
			var result = store.query('nameSpace','query');
			expect(querySpy).toHaveBeenCalledWith('nameSpace','query');
			expect(result).toBe("query result");
		});
	});
});