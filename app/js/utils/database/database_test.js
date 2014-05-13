define(['underscore', './database-module'],function(_){

	describe('database constructor',function(){

		var db,
			inflateSpy = jasmine.createSpy('inflate'),
			store = jasmine.createSpyObj('store',['create', 'add','read']);

		beforeEach(module('database', function($provide){
			$provide.value('DatabaseStore', function(){_.extend(this,store);});
			$provide.value('DatabaseRandomizer', function(){});
			$provide.value('databaseInflate', inflateSpy);
		}));

		beforeEach(inject(function(Database){
			db = new Database();
		}));

		it('should create a local store', inject(function(DatabaseStore){
			expect(db.store).toEqual(jasmine.any(DatabaseStore));
		}));

		it('should create a local randomizer', inject(function(DatabaseRandomizer){
			expect(db.randomizer).toEqual(jasmine.any(DatabaseRandomizer));
		}));

		it('should "get" and inflate an object', function(){
			store.read.andReturn('coll');
			inflateSpy.andReturn(123);
			var result = db.get("namespace", "obj");

			expect(result).toBe(123);
			expect(inflateSpy).toHaveBeenCalledWith('obj','coll',db.randomizer);
		});

		it('should "create" a column', function(){
			store.create(123);
			expect(store.create).toHaveBeenCalledWith(123);
		});

		it('should "add" data', function(){
			store.add(123);
			expect(store.add).toHaveBeenCalledWith(123);
		});
	});
});