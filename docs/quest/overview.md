# Overview

miQuest is written in JavaScript and is built to be extremely versatile and customizable. The scripts are written as JavaScript objects. This format allows writing simple and straightforward scripts using a constrained scripting language. The format also allows advanced users to easily create complex and dynamic scripts using in-line JavaScript.

### Table of contents

* [Central concepts](#central-concepts)
* [A short introduction ](#a-short-introduction)

### Central concepts

The player treats each questionnaire a **sequence** of **pages**. Each page may have one or more **questions**.

The pages are set into a sequence and presented sequentially. This is essentially all you need to know in order to start writing questionnaires.

The sequence supports ***mixers*** that allow randomizing the order of the pages (or questions) that you create, and other features often needed when creating the sequence of a questionnaire. The questionnaire also supports an *inheritance* system, that allows abstracting questionnaires and makes them shorter, simpler, more dynamic, and most important, reusable.

Questionnaires are created by writing a Java-script object that has several property objects: `settings`, `sequence`, `pages`, `questions`, `global` and `current`. Some of these properties have to do with advanced uses of the player. The only objects that you **have** to know are `sequence` and `settings`. We'll first show a simple questionnaire, then go through each of the more advanced options.

### A short introduction

The basic unit in PIquest's scripts is the page. A page represents one screen in the questionnaire. A page can have a few properties to define its settings, and, most importantly, a list of one or more questions that will be displayed in the page. Here is the most basic page. It only has the `questions` property. It creates a simple page with no header/progress-bar/decline button, and other features.

```javascript
var page = {
    questions: []
}
```

There are plenty of additional features that [pages have](API.html#pages), but this is the very minimum that you'll need.

Well, you also need to define the questions. There are several [types of questions](API.html#questions). All share a few basic properties.

```javascript
var question = {
    type: 'text',
    name: 'myQuestName',
    stem: 'What would you like to know?'
}
```

The `type` of question is the first decision that you have to make, it defines the question type and interface. This is where you decide if you want the user to enter some text, choose from a list or use a slider. The `name` is the question's name to save when logged to the server. The name also allows you to refer to the question from other objects. Finally, `stem` is the text that will be displayed.

The question in the example above shows a text input with the question 'What would you like to know?'. 

Here is an example of a `selectOne` question that prompts the user to choose one response out of a list of answers: red, blue or green.

```javascript
var question = {
    type: 'selectOne',
    name: 'mySelectQuest',
    stem: 'What color is the sky?',
    answers: [
        'red',
        'blue',
        'green'
    ]
}
```

Now that we know how to create questions, let's create the sequence. The main component of your questionnaire will always be the sequence. The sequence describes the course of your questionnaire; most of the time it is possible to create everything that you want just within the sequence (i.e., define all the pages and all the questions when you define the sequence). The sequence is a javascript array of page objects that are activated one after the other. The following sequence includes two pages, the first has two questions, the second only one:

```javascript
var sequence = [
    // 1. This is a page object
    {
        // It has a questions property
        questions:[
            // 1a. This is the first question (a text input):
            {
                type: 'text',
                stem: 'What is your name?'
            },
            // 1b. This is a second question (a select one input)
            {
                type: 'selectOne',
                stem: 'How are you?',
                answers: ['good', 'fair' ,'bad']
            }
        ]
    },
    // 2. This is the second page object
    {
        // It has the same structure as the previous one
        questions:[
            // 2a. But only one question
            {
                type: 'text',
                stem: 'What is your name again?'
            }
        ]
    }
]
```

The sequence also supports randomization and branching. Read about it [here](API.html#mixer).

Now that we've created the sequence, let's put it into the player. The first and last two lines are the same for all scripts (they have to do with the way Javascript works), you can simply ignore them. The `API` object assists you in putting your script together, you will [eventually](API.html#API) learn more about its functionality, but for now we only need to know that the `addSequence` function is responsible for adding pages into the sequence. You may call it as many times as you like.

```javascript
define(['questAPI'], function(quest){
    var API = new quest();

    API.addSequence([
        {
            questions:[
                {
                    type: 'text',
                    stem: 'What is your name?'
                },
                {
                    type: 'selectOne',
                    stem: 'How are you?',
                    answers: ['good', 'fair' ,'bad']
                }
            ]
        },
        {
            questions:[
                {
                    type: 'text',
                    stem: 'What is your name again?'
                }
            ]
        }
    ]);

    return API.script;
});
```

That's it! PIquest has loads of additional features (as you can read below), but this was the very basic information that you must know first. (by the way, if you want to log the responses to your questions you should learn about the [ logger setting ](API.html#settings)).
