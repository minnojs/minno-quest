// ### Select Multi question
// An example for a multi select question.
// It allows you to pick one or more answers to the question.
// In this case we use the multiButtons style in order to have the buttons line up horizontally.
// Note the use of minWidth in order to keep all buttons on the same line.
//
// Full documentation is right [here](../quest/API.html#selectone-selectmulti).
define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            header: 'Select questions',
            questions: [
                { // question begins
                    type: 'selectMulti',
                    stem: 'On which days last week did you have breakfast?:',
                    style: 'multiButtons',
                    minWidth: '13%',
                    answers: [
                        1,2,3,4,5,6,7
                    ]
                } // question ends
            ]
        } // page ends

    ]);

    return API.script;
});
