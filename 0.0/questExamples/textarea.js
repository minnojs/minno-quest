// ### Textarea question
// An example for a textarea question.
// It allows you to input some text. In particular it is good for larger amounts of text as it allows better control of the text area size.
// In this case, we use a text area 3 rows deep and require at least 80 characters of text.
//
// Full documentation is right [here](../quest/API.html#text-textarea).

define(['questAPI'], function(Quest){
    var API = new Quest();

    API.addSequence([
        { // page begins
            header: 'Text questions',
            questions: [
                { // question begins
                    type: 'textarea',
                    stem: 'When you say good morning, what do you mean?',
                    rows: 3,
                    minLength: 400
                } // question ends
            ]
        } // page ends

    ]);

    return API.script;
});
