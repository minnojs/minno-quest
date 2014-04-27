define(['./collection-module'],function(){

	describe('Collection',function(){

		var collection;

		beforeEach(module('collection'));
		beforeEach(inject(function(Collection){
			collection = new Collection();
		}));


		it('should init with an array or without one', inject(function(Collection){
			var col, arr = [1,2,3,4];

			col = new Collection(arr);
			expect(col.collection).toBe(arr);

			col = new Collection();
			expect(col.collection.length).toBe(0);
		}));

		it('should throw an error if initiated with a non Array', inject(function(Collection){
			expect(function(){
				new Collection({});
			}).toThrow();
		}));

		it('should support "add"', function(){
			collection.add(1);
			expect(collection.collection.length).toBe(1);

			collection.add([2,3]);
			expect(collection.collection.length).toBe(3);
		});

		it('should support "at"', function(){
			collection.add([1,2,3]);
			expect(collection.at(0)).toBe(1);
			expect(collection.at(2)).toBe(3);
		});

		it('should support navigating back and forth', function(){
			collection.add([1,2,3,4]);

			expect(collection.current()).toBe(undefined);
			expect(collection.pointer).toBe(-1);

			expect(collection.first()).toBe(1);
			expect(collection.pointer).toBe(0);

			expect(collection.next()).toBe(2);
			expect(collection.pointer).toBe(1);

			expect(collection.previous()).toBe(1);
			expect(collection.pointer).toBe(0);

			expect(collection.current()).toBe(1);

			expect(collection.last()).toBe(4);
			expect(collection.pointer).toBe(3);

			expect(collection.end()).toBe(undefined);
			expect(collection.pointer).toBe(4);
		});




	});
});