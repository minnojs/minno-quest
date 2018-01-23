function parseProvider(){
    function parse(script, db){
        db.createColl('pages');
        db.createColl('questions');

        db.add('pages', script.pagesSets || []);
        db.add('questions', script.questionsSets || []);

        script.settings || (script.settings = {});
    }

    return parse;
}

export default parseProvider;
