define(['questAPI'], function(Quest){
    // create new quest API
    var API = new Quest();

    // create questionnaire sequence
    API.addSequence([
        // page begins
        {
            header: 'Hello world!',
            decline: true,
            declineText: 'I prefer to keep this information to myself',
            questions: [
                // question begins
                {
                    type: 'selectOne',
                    stem: 'When you say good morning, what do you mean?',
                    answers: [
                        'Do you wish me a good morning',
                        'Or mean that it is a good morning whether I want it or not',
                        'Or that you feel good this morning',
                        'Or that it is a morning to be good on',
                        'All of them at once'
                    ]
                }
                // question ends
            ]
        }
        // page ends
    ]);

    // return questionnaire script to the player gods...
    return API.script;
});
