define(['underscore','./mixer-module'],function(_){

	var mixer, randomCutoff = 0.5;

	describe('Mixer', function(){
		beforeEach(module('mixer', function($provide){
			$provide.value('mixerShuffle', function(arr){
				return _(arr).reverse().value();
			});
			$provide.value('mixerRandom', function(){return randomCutoff;});
		}));

		beforeEach(inject(function(_mixer_){
			mixer = _mixer_;
		}));

		it('should return any non mixer object as is', function(){
			expect(mixer(123)).toEqual([123]);
			expect(mixer([])).toEqual([[]]);
			expect(mixer({a:345})).toEqual([{a:345}]);
		});

		it('should throw an error if an unknow mixer is used', function(){
			expect(function(){
				mixer({mixer:'unknow'});
			}).toThrow();
		});

		it('should repeat any data in a repeat n times', function(){
			expect(mixer({
				mixer:'repeat',
				times:'2',
				data: [1,2]
			})).toEqual([1,2,1,2]);
		});

		it('should return the data in a wrapper as is', function(){
			expect(mixer({
				mixer:'wrapper',
				data: [1,2]
			})).toEqual([1,2]);
		});

		it('should return the data in a random element randomized', function(){
			expect(mixer({
				mixer:'random',
				data: [1,2,3]
			})).toEqual([3,2,1]);
		});

		it('should choose n || 1 random elements', function(){
			expect(mixer({
				mixer:'choose',
				data: [1,2,3,4]
			})).toEqual([4]);

			expect(mixer({
				mixer:'choose',
				n: 2,
				data: [1,2,3,4]
			})).toEqual([4,3]);
		});

		it('should know how to weightedRandom', function(){
			randomCutoff = 0.5;
			expect(mixer({
				mixer:'weightedRandom',
				weights: [0.2, 0.8],
				data: [1,2]
			})).toEqual([2]);

			randomCutoff = 0.1;
			expect(mixer({
				mixer:'weightedRandom',
				weights: [0.2, 0.8],
				data: [1,2]
			})).toEqual([1]);

			randomCutoff = 0.9;
			expect(mixer({
				mixer:'weightedRandom',
				weights: [0.2, 0.6, 0.2],
				data: [1,2, 3]
			})).toEqual([3]);
		});
	});

	xdescribe(': mix', function(){
		it('should mix the current element', function(){
			sequence.mix();
			expect(mixerSpy).toHaveBeenCalledWith(1);
			sequence.next();
			sequence.mix();
			expect(mixerSpy).toHaveBeenCalledWith(2);
		});

		it('should replace current element with the mixed array', function(){
			mixerSpy.andCallFake(function(a){return [a,a];});
			sequence.mix();
			expect(sequence.collection).toEqual([1,1,2,3,4]);
			sequence.last();
			sequence.mix();
			expect(sequence.collection).toEqual([1,1,2,3,4,4]);
		});

		it('should update length', function(){
			mixerSpy.andCallFake(function(a){return [a,a];});
			expect(sequence.length).toBe(4);
			sequence.mix();
			expect(sequence.length).toBe(5);
			sequence.mix();
			expect(sequence.length).toBe(6);
		});

		it('should mix recursively', function(){

		});

		it('should break recursion when mixerDepth is reached', function(){

		});
	});

});