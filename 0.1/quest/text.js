// ### Text question
// An example for a simple text question.
// It allows you to input some text.
// In this caase, we require the user to respond to the question, and set a custom error message.
//
// Full documentation is right [here](../quest/API.html#text-textarea).
define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            header: 'Text questions',
            questions: [
                { // question begins
                    type: 'text',
                    stem: 'When you say good morning, what do you mean?',
                    required: true,
                    errorMsg: {
                        required: 'This question is truly important to us, please take your time to answer.'
                    }

                } // question ends
            ]
        } // page ends

    ]);

    return API.script;
});
