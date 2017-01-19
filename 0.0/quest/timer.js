define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            header: 'Question timer, ',
            timer: {
                duration: 10,
                message: 'You are out of time, lets move on.'
            },
            questions: [
                { // question begins
                    type: 'selectOne',
                    stem: 'When you say good morning, what do you mean?',
                    autoSubmit: true,
                    answers: [
                        'Do you wish me a good morning',
                        'Or mean that it is a good morning whether I want it or not',
                        'Or that you feel good this morning',
                        'Or that it is a morning to be good on',
                        'All of them at once'
                    ],
                    help: true,
                    helpText: 'Selecting an answer once colors it blue.<br/>' +
                        'You can change your answer by selecting another option.<br/>' +
                        'To confirm, click the selected (blue) button a second time.'
                } // question ends
            ],
            noSubmit: true
        } // page ends

    ]);

    return API.script;
});
