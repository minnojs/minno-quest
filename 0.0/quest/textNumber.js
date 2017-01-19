// ### Text Number question
// An example for a simple textNumber question.
// It allows you to input some numbers.
// In this case we require an answer between 1 and 10.
//
// Full documentation is right [here](../quest/API.html#textnumber).

define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            header: 'Text questions',
            questions: [
                { // question begins
                    type: 'textNumber',
                    stem: 'How many cups of coffee do you drink each morning?',
                    min: 1,
                    max: 10
                } // question ends
            ]
        } // page ends

    ]);

    return API.script;
});
