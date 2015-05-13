// ### Slider question
// An example for a simple slider question.
// It allows you to create a slider that allows the user to pick a response along a preassigned range.
//
// Full documentation is right [here](../quest/API.html#slider).
define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            header: 'Slider questions',
            questions: [
                {
                    type: 'slider',
                    stem: 'Sliders are exremely useful.',
                    min:1,
                    max:7,
                    steps:7,
                    labels: ['Strongly Agree', 'Neutral', 'Strongly Disagree']
                }
            ]
        } // page ends

    ]);

    return API.script;
});
