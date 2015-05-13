// ### Grid question
// An example for a simple grid question.
// It allows you to create a series of multiple choice questions.
//
// Full documentation is right [here](../quest/API.html#grid).
define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            header: 'Grid questions',
            questions: [
                {
                    type: 'grid',
                    stem: 'What sort of things do you like?',
                    columns: ['Strongly agree' , 'agree' , 'don\'t know' , 'disagree' , 'Strongly disagree'],
                    rows: ['I like grids', 'I like bannanas too']
                }
            ]
        } // page ends

    ]);

    return API.script;
});
