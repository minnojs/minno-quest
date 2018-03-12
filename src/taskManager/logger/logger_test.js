import Logger from './logger';
import _ from 'lodash';

describe('Logger', function(){
    var logger;

    beforeEach(function(){
        logger = Logger({
            onRow: _.noop,
            onEnd: _.noop,
            serialize: _.noop,
            send:_.noop
        });
    });

    it('should create  a logger', function(){
        expect(logger.createLog).toEqual(jasmine.any(Function));
        expect(logger.ctx).toEqual(jasmine.any(Object));
    });

    ['onRow','onEnd','serialize','send'].forEach(function(fnName){
        it('should throw if @param "' + fnName + '" is missing', function(){
            var settings = _.set({}, fnName, null);
            expect(logger.createLog.bind(null, 'taskName', settings)).toThrow();
        });
    });

    it('should apply onRow and onEnd', function(){
        var onRow = jasmine.createSpy('onRow');
        var onEnd = jasmine.createSpy('onEnd');
        var log = logger.createLog('taskName', {
            onRow: onRow,
            onEnd: onEnd
        });

        log({a:1});
        log({a:1});
        expect(onRow).toHaveBeenCalledWith('taskName', {a:1}, jasmine.any(Object), jasmine.any(Object));
        expect(onRow.calls.count()).toBe(2);
        expect(onEnd.calls.count()).toBe(0);

        log.end(true);
        expect(onRow).toHaveBeenCalledWith('taskName', {a:1}, jasmine.any(Object), jasmine.any(Object));
    });

    it('should serialize values returned from onRow/onEnd', function(){
        var serialize = jasmine.createSpy('serialize');
        var log = logger.createLog('taskName', {
            onRow: _.constant(1),
            onEnd: _.constant(2),
            serialize: serialize
        });

        log({a:1});
        log({a:1});
        expect(serialize).toHaveBeenCalledWith('taskName', 1, jasmine.any(Object), jasmine.any(Object));
        expect(serialize.calls.count()).toBe(2);
        serialize.calls.reset();

        log.end(true);
        expect(serialize).toHaveBeenCalledWith('taskName', 2, jasmine.any(Object), jasmine.any(Object));
        expect(serialize.calls.count()).toBe(1);
    });

    it('should not serialize onRow/onEnd return undefined', function(){
        var serialize = jasmine.createSpy('serialize');
        var log = logger.createLog('taskName', {
            onRow: _.noop,
            onEnd: _.noop,
            serialize: serialize
        });

        log({a:1});
        log({a:1});
        log.end(true);

        expect(serialize).not.toHaveBeenCalled();
        expect(serialize.calls.count()).toBe(0);
    });

    it('should send the results of serialize', function(){
        var send = jasmine.createSpy('send');
        var log = logger.createLog('taskName', {
            onRow: _.constant(1),
            serialize: _.constant(2),
            send: send
        });

        log({a:1});
        expect(send).toHaveBeenCalledWith('taskName', 2, jasmine.any(Object), jasmine.any(Object));
    });

    it('should pass the same context across log streams', function(){
        var log1 = logger.createLog('task1', {onRow:onRow});
        var log2 = logger.createLog('task2', {onRow:onRow});

        log1({a:1});
        log1({a:1});
        log2({a:1});
        log2({a:1});
        expect(logger.ctx.counter).toBe(4);
        function onRow(name,log,settings,ctx){ctx.counter = ++ctx.counter || 1; }
    });
});

