define(['./API'], function(Quest){

    describe('API', function(){
        var API, script;

        beforeEach(function(){
            API = new Quest();
            script = API.script;
        });

        it('should create a script object', function(){
            expect(script).toEqual(jasmine.any(Object));
        });

        it('should addSettings correctly', function(){
            expect(script.settings).toEqual(jasmine.any(Object));

            API.addSettings('test', {a:1});
            API.addSettings('test', {b:2});
            expect(script.settings.test.a).toBe(1);
            expect(script.settings.test.b).toBe(2);

            API.addSettings('test', 123);
            expect(script.settings.test).toBe(123);
        });

        it('should addPagesSet correctly', function(){
            var a = {}, b = {};
            expect(script.pages).toEqual(jasmine.any(Array));

            API.addPagesSet('test1', a);
            expect(script.pages[0]).toBe(a);
            expect(script.pages[0].set).toBe('test1');

            API.addPagesSet('test2', [b,a]);
            expect(script.pages[1]).toBe(b);
            expect(script.pages[1].set).toBe('test2');
            expect(script.pages[2]).toBe(a);
            expect(script.pages[2].set).toBe('test2');
        });

        it('should addQuestionsSet correctly', function(){
            var a = {}, b = {};
            expect(script.questions).toEqual(jasmine.any(Array));

            API.addQuestionsSet('test1', a);
            expect(script.questions[0]).toBe(a);
            expect(script.questions[0].set).toBe('test1');

            API.addQuestionsSet('test2', [b,a]);
            expect(script.questions[1]).toBe(b);
            expect(script.questions[1].set).toBe('test2');
            expect(script.questions[2]).toBe(a);
            expect(script.questions[2].set).toBe('test2');
        });

        it('should addSequence correctly', function(){
            expect(script.sequence).toEqual(jasmine.any(Array));

            API.addSequence(123);
            expect(script.sequence[0]).toBe(123);

            API.addSequence([2,3]);
            expect(script.sequence[1]).toBe(2);
            expect(script.sequence[2]).toBe(3);
        });

        it('should addGlobal correctly', function(){
            expect(script.global).toEqual(jasmine.any(Object));

            API.addGlobal({a:1, b: {c:3}});
            API.addGlobal({b:{d:4}});

            expect(script.global.a).toBe(1);
            expect(script.global.b.c).toBe(3);
            expect(script.global.b.d).toBe(4);

            expect(function(){
                API.addGlobal(123);
            }).toThrow();
        });

        it('should addCurrent correctly', function(){
            expect(script.current).toEqual(jasmine.any(Object));

            API.addCurrent({a:1, b: {c:3}});
            API.addCurrent({b:{d:4}});

            expect(script.current.a).toBe(1);
            expect(script.current.b.c).toBe(3);
            expect(script.current.b.d).toBe(4);

            expect(function(){
                API.addCurrent(123);
            }).toThrow();

        });


    });

});