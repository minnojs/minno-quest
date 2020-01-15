// ### Opening section
//
// This script is a companion for the [introduction turorial](introduction.html).
// Refer there to get a deeper explanation of what is going on.
//
// The opening section of each script is always more or less the same.
// We create the wrapper for the script (`define`), and create a new instance of a questionnaire.

define(['questAPI'], function(Quest){
    var API = new Quest();

    // ### The sequence
    // The most important part of every questionnaire is the sequence.
    // This is where you tell miQuest how to interact with the participants.
    // In our case we want to simply present a single page with a single question so we get something like this:

    API.addSequence([
        // Settings for the page environment
        { // page begins
            header: 'Hello world!',
            decline: true,
            declineText: 'I prefer to keep this information to myself',
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

    // ### Closing section
    // return questionnaire script to the player gods...
    return API.script;
});
