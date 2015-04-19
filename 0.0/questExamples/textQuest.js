// ### Text question
//
define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            header: 'Text questions',
            questions: [
                { // question begins
                    type: 'selectOne',
                    stem: 'When you say good morning, what do you mean?',
                    answers: [
                        'Do you wish me a good morning',
                        'Or mean that it is a good morning whether I want it or not',
                        'Or that you feel good this morning',
                        'Or that it is a morning to be good on',
                        'All of them at once'
                    ]
                } // question ends
            ]
        } // page ends

    ]);

    return API.script;
});
