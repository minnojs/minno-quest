// ### Grid question
// An example for a simple grid question.
// It allows you to create a series of multiple choice questions.
//
// Full documentation is right [here](../quest/API.html#grid).
define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            header: 'GridMulti questions simple',
            questions: [
                {
                    type: 'multiGrid',
                    name:'multiGrid1',
                    columns: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    rows: ['Days you work out', 'Days you go to work']
                }
            ]
        }, // page ends
        { // page begins
            header: 'GridMulti questions advanced',
            questions: [
                {
                    type: 'multiGrid',
                    name:'multiGrid2',
                    columns: [
                        {stem:'Gender', type:'dropdown', answers: ['Male', 'Female']},
                        'Study together',
                        'Work together',
                        {stem:'Description', type:'input'}
                    ],
                    rows: ['Friend 1', 'Friend 2' ]
                }
            ]
        } // page ends
    ]);

    return API.script;
});
