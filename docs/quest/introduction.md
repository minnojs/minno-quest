# Introduction

- [Structure](#structure)
- [Pages & Questions](#pages-questions)
- [Thats it](#thats-it)

### Structure

The first step learning to use miQuest is getting to know the structure of a miQuest script. The scripts are written in javascript, although all you really need to know is how to use our very specific API (this means that if you're in to that sort of thing, you can write any javascript that you like...).

Each script is wrapped within a [`define`](http://requirejs.org/docs/whyamd.html#amd) statement. At the beginning you create the API object, and at the end you return the script that you have created. This basic structure stays more or less constant across any script that you create. In other words: you can always just copy paste this portion of the script and get on with building your questionnaire:

```javascript
define(['questAPI'], function(Quest){
    // create new quest API
    var API = new Quest();

    /**
     * This is where the magic happens...
     */
    
    // return questionnaire script to the player gods...
	return API.script;
});
```

Between the declaration of the API and returning the script, we use the API to put the task together. The full functionality of the API is described in the [documentation ](API.html). This tutorial will walk you through using it to create a very basic questionnaire. You can use it as a template for creating your own questionnaires in the future.

We will use the API to setup the questionnaire environment (using `addSettings`), then we will create prototypes for pages and questions within the questionnaire (using `addPagesSet` and `addQuestionsSet`), and finally we will setup the sequence of questions that will be presented to the subjects (using `addSequence`).

```javascript
define(['questAPI'], function(Quest){
    // create new quest API
    var API = new Quest();

    // setup the environment
    API.addSettings(/* ... */);

    // create the prototypes
    API.addPagesSet(/* ... */);
    API.addQuestionsSet(/* ... */);

    // create questionnaire sequence
    API.addSequence(/* ... */);

    // return questionnaire script to the player gods...
    return API.script;
});
```

Before we jump into learning how each of these functions work, let us take a look at the basic building block of the questionnaire; pages and questions.

### Pages & questions
The basic building blocks within miQuest are **pages** and **questions**.

A page is an object that describes one screen within your questionnaire. If your questionnaire presents all of its questions in one screen, it will probably have only one page. The properties within a page manage how the question(s) is(are) displayed and how the participants interact with it (e.g., select an answer and then click a submit button).

For the purpose of this presentation we will create a page that has a "Hello world!" header, and allows participants to decline answering the questions. Further documentation of the properties of pages may be found in the [API docs](API.html#pages).

```javascript
var page = {
    header: 'Hello world!',
    decline: true,
    declineText: 'I prefer to keep this information to myself',
    questions: [
        /* This is where we will soon set our questions */
    ]
}
```

Within our page we want to ask the participant a question: 'When you say good morning, what do you mean?'. We want the user to select the correct answer out of a list, so we pick the *type* `selectOne` and set the answers within the *answers* property. Further documentation of the properties of questions may be found in the [API docs](API.html#questions).

```javascript
var quest = {
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
```

We will put the page and question together in a moment, but first let us get back to the API object and how we actually use these questions and objects.

### Thats it

The most important part of every questionnaire is the sequence. This is where you tell miQuest how to interact with the participants. In our case we want to simply present a single page with a single question so we get something like this:

```javascript
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
```

The code we put together is enough to run in your browser: [check it out](helloworldPlay.html).
