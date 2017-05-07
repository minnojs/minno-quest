define(function(){

    parseProvider.$inject = ['piConsole'];
    function parseProvider(piConsole){
        function parse(script, db){
            db.createColl('pages');
            db.createColl('questions');

            db.add('pages', script.pagesSets || []);
            db.add('questions', script.questionsSets || []);

            script.settings || (script.settings = {});

            piConsole.setSettings(script.settings.DEBUG || {});
        }

        return parse;
    }

    return parseProvider;
});