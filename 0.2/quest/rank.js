// ### Rank question
// An example for a rank question.
//
// Full documentation is right [here](../quest/API.html#rank).
define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            questions: [
                { // question begins
                    type: 'rank',
                    stem: 'Please rank the colors of the rainbow by brighness:',
                    list: [
                        'Red',
                        'Orange',
                        'Yellow',
                        'Green',
                        'Blue',
                        'Indigo',
                        'Violet'
                    ]
                } // question ends
            ]
        } // page ends

    ]);

    return API.script;
});
