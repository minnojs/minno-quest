define(['./logger-module'],function(){

	var $httpBackend, logger, $log, settings = {pulse:3};

	describe('Logger', function(){

		beforeEach(module('logger', function(LoggerProvider){
			LoggerProvider.settings = {
				pulse: 10,
				url:'/url',
				fake: 'fake'
			};
		}));

		beforeEach(inject(function(_$httpBackend_, Logger, _$log_){
			$httpBackend = _$httpBackend_;
			logger = new Logger(settings);
			$log = _$log_;
		}));

		it('should add logged objects to the stack', function(){
			logger.log(1);
			logger.log(2);
			expect(logger.pending[0]).toBe(1);
			expect(logger.pending[1]).toBe(2);
		});

		it('should parse the input using logFn if it exists', function(){
			logger.settings.logFn = function(a, b){
				return a + b;
			};
			logger.log(1,2);
			expect(logger.pending[0]).toBe(3);
		});

		describe(': pulse', function(){
			it('should support send after logging settings.pulse objects', function(){
				spyOn(logger,'send');
				logger.log(1);
				logger.log(2);
				expect(logger.send).not.toHaveBeenCalled();
				logger.log(3);
				expect(logger.send).toHaveBeenCalled();
			});

			it('should not pulse if pulse is not set or set to 0', function(){
				spyOn(logger,'send');

				logger.settings.pulse = 0;
				logger.log(1);
				logger.log(2);
				expect(logger.send).not.toHaveBeenCalled();

				logger.settings.pulse = undefined;
				logger.log(3);
				logger.log(4);
				expect(logger.send).not.toHaveBeenCalled();
			});
		});

		describe(': send', function(){
			beforeEach(function(){
				$httpBackend.when('POST', '/url').respond({});
			});

			afterEach(function() {
				$httpBackend.verifyNoOutstandingExpectation();
				$httpBackend.verifyNoOutstandingRequest();
			});


			it('should post data to settings.url', function(){
				$httpBackend.expectPOST('/url');
				logger.log(1);
				logger.send();
				$httpBackend.flush();
			});

			it('should not post data if there are no pending objects', inject(function($http){
				spyOn($http,'post');
				expect($http.post).not.toHaveBeenCalled();
			}));

			it('should remove logged objects from the stack and save them after each send', function(){
				logger.log(1);
				logger.log(2);
				logger.log(3);
				expect(logger.sent.length).toBe(3);
				expect(logger.pending.length).toBe(0);
				$httpBackend.flush();
			});

			it('should throw an error only if there was a log but a url was not set',function(){
				expect(function(){
					logger.send();
				}).not.toThrow();

				logger.log(1);

				expect(function(){
					logger.send();
				}).not.toThrow();

				logger.log(1);
				logger.settings.url = undefined;

				expect(function(){
					logger.send();
				}).toThrow();
				$httpBackend.flush();
			});
		});

		it('should inherit settings (across instances)', function(){
			expect(logger.settings.fake).toBe('fake');
			expect(logger.settings.pulse).not.toBe(10); // make sure not to overide the explicit settings
		});

		it('should supply a log counter across instances', inject(function(Logger){
			var l1 = new Logger(settings);
			var l2 = new Logger(settings);
			expect(l1.getCount()).toBe(0);
			l1.log(123);
			l2.log(123);
			expect(l1.getCount()).toBe(2);
			l2.log(123);
			expect(l1.getCount()).toBe(3);
			expect(l2.getCount()).toBe(3);
		}));

		it('should log an object to the console if DEBUG is set to true', function(){
			spyOn($log,'log');

			logger.log(123);
			expect($log.log).not.toHaveBeenCalledWith(123);

			logger.settings.DEBUG = true;
			logger.log(123);
			expect($log.log).toHaveBeenCalledWith(123);
		});

		it('should extend the log object with whatever is set in settings.meta',inject(function(Logger){
			var l = new Logger({meta:{a:1}});
			l.log({b:2});
			l.log({c:3});
			expect(l.pending[0]).toEqual({a:1,b:2});
			expect(l.pending[1]).toEqual({a:1,c:3});
		}));

		it('should throw an error if meta is set and we try to log a non object', inject(function(Logger){
			var l = new Logger({meta:{a:1}});
			expect(function(){
				logger.log(1234);
			}).not.toThrow();

			expect(function(){
				l.log(1234);
			}).toThrow();
		}));
	});

});