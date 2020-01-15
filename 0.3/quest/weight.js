//
// The weight questionnaire is a solid example of how we create a fairly complex questionnaire.
// It is heavily commented so that you can follow everything that goes on.
// After reading the documentation feel free to download the file and modify it according to your needs.
//
// ### Opening section
//
// The opening section of each script is always more or less the same.
// We create the wrapper for the script (`define`), and create a new instance of a questionnaire.
define(['questAPI'], function(Quest){

  var API = new Quest();

  // ### Creating page and questions sets
  //
  // The first thing we do in this script is create prototypes of the pages and questions that we will use.
  // Many times (usually?), questionnaires use similar settings to describe the **pages** and **questions** in their studies.
  // miQuest provides a system that allows us to prototype them so that our script may be shorter and easier to maintain
  // (it's better to make a change in one place and have it affect all your questions than having to go through each question and change it individually).
  // It's worth while to mention that it is not strictly necessary to use prototypes and inheritance,
  // you can create your pages and questions from scratch from within the [sequence](API.html#sequence).
  //
  // The prototyping system uses `API.addPagesSet` and `API.addQuestionsSet` in order to create sets of prototypical pages/questions,
  // later on we can `inherit` them into our sequence.
  // Essentially, inheritance means that we use the object that we inherit as a base for the creation of a new object
  // (see the [API](API.html#inheritance) for more details).


  // #### Page prototype
  // Here we create a prototype for the [pages](API.html#pages) in our group.
  // The prototype belongs to a group that we arbitrarily call 'basicPage', we will later use this name in order to inherit this page.
  // We will be using auto submit within the questions, so we disable the submit button for all pages (`noSubmit`).
  // And finally we add a progress bar that will track the location of the participants within the questionnaire (`progressBar`).

  /**
   * Page prototype
   */
  API.addPagesSet('basicPage',{
    noSubmit:true,
    progressBar: '<%= pagesMeta.number %> out of 15'
  });

  // Note the use of templates within the progress bar.
  // Templates are strings that have the `<%= %>` delimiters, they allow you to access environmental variables,
  // in this case we access the `pagesMeta` variable and get the current page number.
  // You can use templates anywhere you like within miQuest.
  // Both [templates](API.html#templates) and [environmental variables](API.html#variables) are fully documented within the API.


  // #### Question prototypes
  //
  // We are going to use two types of [questions](API.html#questions) throughout this questionnaire, and we'll create a prototype for each of them.
  //
  // The first question type is a simple [multiple choice input](API.html#selectone-selectmulti) (`type: 'selelctOne'`).
  // We set it to `autoSubmit` thus making the submit button redundant (autoSumit means that double clicking a response submits the page).
  // Then we request `numericValues` so that the player logs the responses to questions as numbers instead of plain text.
  // And finally we activate `help` for each of the questions and set the `helpText` for it.
  // Note the use of templates again here to return a true/false value so that the help message is shown only on the first three pages.

  /**
   * Question prototypes
   */
  API.addQuestionsSet('basicSelect',{
    type: 'selectOne',
    autoSubmit:true,
    numericValues:true,
    help: '<%= pagesMeta.number < 3 %>', // show the help message only for the first three pages
    helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'
  });

  // The second question is a another selectOne input. This time we use the multiButtons style.
  // This is useful for questions with very many answers. Note the use of `minWidth` here, this allows us to set the width of the buttons, thus making sure they line up symmetrically.

  API.addQuestionsSet('basicDropdown',{
    type: 'selectOne',
    style: 'multiButtons',
    minWidth: '150px',
    autoSubmit:true,
    numericValues:true
  });

  // ### The Sequence
  //
  // The sequence is an ordered list of all the pages that you want to present.
  // This is where you tell miQuest how to interact with the participants.
  // The sequence is created using the `API.addSequence` function which takes a single array of pages.
  //
  // This questionnaire has several demographic/personal questions that appear at the beginning in a constant order.
  // After them we have a series of general questions that appear in a randomized order.

  API.addSequence([

    // #### Personal questions segment
    //
    // This segment has 6 demographic/personal questions.
    // They are simply listed consecutively within the sequence array.
    //
    // Each page inherits the *basicPage* prototype that we defined previously (`inherit`) and manually create the questions for it.
    // Each page has one question set into into it, inheriting either from the *basicSelect* or *basicDropdown* sets.
    // The questions each have a unique `name` set into them here as well
    // as the `stem` which is the question itself
    // and the `answers` array that holds the possible answers for multiple choice questions.
    //
    // The concept that you should keep in mind reading this code is that the inherit property extends each object with its parents properties,
    // so that each page inherits the `noSubmit` that we set into the *basicPage* prototype.

    {
      inherit : 'basicPage',
      questions : [{
        inherit : 'basicSelect',
        name: 'weightpref',
        stem: 'Which statement best describes you?',
        answers: [
          'I strongly prefer Thin People to Fat People.',
          'I moderately prefer Thin People to Fat People.',
          'I slightly prefer Thin People to Fat People.',
          'I like Thin People and Fat People equally.',
          'I slightly prefer Fat People to Thin People.',
          'I moderately prefer Fat People to Thin People.',
          'I strongly prefer Fat People to Thin People.'
        ]
      }]
    },
    {
      inherit : 'basicPage',
      questions : [{
        inherit : 'basicSelect',
        name: 'tempfat',
        stem: 'How warm or cold do you feel towards <b>fat people</b>?',
        answers: [
          'Extremely warm',
          'Very warm',
          'Moderately warm',
          'Somewhat warm',
          'Slightly warm',
          'Neither warm nor cold',
          'Slightly cold',
          'Somewhat cold',
          'Moderately cold',
          'Very cold',
          'Extremely cold'
        ]
      }]
    },
    {
      inherit : 'basicPage',
      questions : [{
        inherit : 'basicSelect',
        name: 'tempthin',
        stem: 'How warm or cold do you feel towards <b>thin people</b>?',
        answers: [
          'Extremely warm',
          'Very warm',
          'Moderately warm',
          'Somewhat warm',
          'Slightly warm',
          'Neither warm nor cold',
          'Slightly cold',
          'Somewhat cold',
          'Moderately cold',
          'Very cold',
          'Extremely cold'
        ]
      }]
    },
    {
      inherit : 'basicPage',
      questions : [{
        inherit : 'basicDropdown',
        name: 'myheight',
        stem: 'Please indicate your height by selecting the most accurate option.',
        answers: [
          '3 ft 0 in :: 91 cm',
          '3 ft 1 in :: 94 cm',
          '3 ft 2 in :: 97 cm',
          '3 ft 3 in :: 99 cm',
          '3 ft 4 in :: 102 cm',
          '3 ft 5 in :: 104 cm',
          '3 ft 6 in :: 107 cm',
          '3 ft 7 in :: 109 cm',
          '3 ft 8 in :: 112 cm',
          '3 ft 9 in :: 114 cm',
          '3 ft 10 in :: 117 cm',
          '3 ft 11 in :: 119 cm',
          '4 ft 0 in :: 122 cm',
          '4 ft 1 in :: 124 cm',
          '4 ft 2 in :: 127 cm',
          '4 ft 3 in :: 130 cm',
          '4 ft 4 in :: 132 cm',
          '4 ft 5 in :: 135 cm',
          '4 ft 6 in :: 137 cm',
          '4 ft 7 in :: 140 cm',
          '4 ft 8 in :: 142 cm',
          '4 ft 9 in :: 145 cm',
          '4 ft 10 in :: 147 cm',
          '4 ft 11 in :: 150 cm',
          '5 ft 0 in :: 152 cm',
          '5 ft 1 in :: 155 cm',
          '5 ft 2 in :: 157 cm',
          '5 ft 3 in :: 160 cm',
          '5 ft 4 in :: 163 cm',
          '5 ft 5 in :: 165 cm',
          '5 ft 6 in :: 168 cm',
          '5 ft 7 in :: 170 cm',
          '5 ft 8 in :: 173 cm',
          '5 ft 9 in :: 175 cm',
          '5 ft 10 in :: 178 cm',
          '5 ft 11 in :: 180 cm',
          '6 ft 0 in :: 183 cm',
          '6 ft 1 in :: 185 cm',
          '6 ft 2 in :: 188 cm',
          '6 ft 3 in :: 191 cm',
          '6 ft 4 in :: 193 cm',
          '6 ft 5 in :: 196 cm',
          '6 ft 6 in :: 198 cm',
          '6 ft 7 in :: 201 cm',
          '6 ft 8 in :: 203 cm',
          '6 ft 9 in :: 206 cm',
          '6 ft 10 in :: 208 cm',
          '6 ft 11 in :: 211 cm',
          '7 ft 0 in :: 213 cm',
          '7 ft 1 in :: 216 cm',
          '7 ft 2 in :: 218 cm',
          '7 ft 3 in :: 221 cm',
          '7 ft 4 in :: 224 cm',
          '7 ft 5 in :: 226 cm',
          '7 ft 6 in :: 229 cm',
          '7 ft 7 in :: 231 cm',
          '7 ft 8 in :: 234 cm',
          '7 ft 9 in :: 236 cm',
          '7 ft 10 in :: 239 cm',
          '7 ft 11 in :: 241 cm',
          '8 ft 0 in :: 244 cm',
          '8 ft 1 in :: 246 cm',
          '8 ft 2 in :: 249 cm',
          '8 ft 3 in :: 251 cm',
          '8 ft 4 in :: 254 cm',
          '8 ft 5 in :: 257 cm',
          '8 ft 6 in:: 259 cm'
        ]
      }]
    },
    {
      inherit : 'basicPage',
      questions : [{
        inherit : 'basicDropdown',
        name: 'myweight',
        stem: 'Please indicate your weight by selecting the most accurate option.',
        answers: [
          '50 lb :: 23 kg',
          '55 lb :: 25 kg',
          '60 lb :: 27 kg',
          '65 lb :: 30 kg',
          '70 lb :: 32 kg',
          '75 lb :: 34 kg',
          '80 lb :: 36 kg',
          '85 lb :: 39 kg',
          '90 lb :: 41 kg',
          '95 lb :: 43 kg',
          '100 lb :: 45 kg',
          '105 lb :: 48 kg',
          '110 lb :: 50 kg',
          '115 lb :: 52 kg',
          '120 lb :: 55 kg',
          '125 lb :: 57 kg',
          '130 lb :: 59 kg',
          '135 lb :: 61 kg',
          '140 lb :: 64 kg',
          '145 lb :: 66 kg',
          '150 lb :: 68 kg',
          '155 lb :: 70 kg',
          '160 lb :: 73 kg',
          '165 lb :: 75 kg',
          '170 lb :: 77 kg',
          '175 lb :: 80 kg',
          '180 lb :: 82 kg',
          '185 lb :: 84 kg',
          '190 lb :: 86 kg',
          '195 lb :: 89 kg',
          '200 lb :: 91 kg',
          '205 lb :: 93 kg',
          '210 lb :: 95 kg',
          '215 lb :: 98 kg',
          '220 lb :: 100 kg',
          '225 lb :: 102 kg',
          '230 lb :: 105 kg',
          '235 lb :: 107 kg',
          '240 lb :: 109 kg',
          '245 lb :: 111 kg',
          '250 lb :: 114 kg',
          '255 lb :: 116 kg',
          '260 lb :: 118 kg',
          '265 lb :: 120 kg',
          '270 lb :: 123 kg',
          '275 lb :: 125 kg',
          '280 lb :: 127 kg',
          '285 lb :: 130 kg',
          '290 lb :: 132 kg',
          '295 lb :: 134 kg',
          '300 lb :: 136 kg',
          '305 lb :: 139 kg',
          '310 lb :: 141 kg',
          '315 lb :: 143 kg',
          '320 lb :: 145 kg',
          '325 lb :: 148 kg',
          '330 lb :: 150 kg',
          '335 lb :: 152 kg',
          '340 lb :: 155 kg',
          '345 lb :: 157 kg',
          '350 lb :: 159 kg',
          '355 lb :: 161 kg',
          '360 lb :: 164 kg',
          '365 lb :: 166 kg',
          '370 lb :: 168 kg',
          '375 lb :: 170 kg',
          '380 lb :: 173 kg',
          '385 lb :: 175 kg',
          '390 lb :: 177 kg',
          '395 lb :: 180 kg',
          '400 lb :: 182 kg',
          '405 lb :: 184 kg',
          '410 lb :: 186 kg',
          '415 lb :: 189 kg',
          '420 lb :: 191 kg',
          '425 lb :: 193 kg',
          '430 lb :: 195 kg',
          '435 lb :: 198 kg',
          '440 lb :: 200 kg',
          '>440 lb :: >200kg'
        ]
      }]
    }, // end personal segment

    // #### General questions segment
    //
    // This segment has several generic questions.
    // As far as the questions are concerned it follows the same principle that the previous segment followed.
    // The main difference is that we want to randomize the order in which the questions appear.
    //
    // The sequence offers a tool for controlling the flow of pages within the sequence (or questions within a page).
    // Instead of putting pages in the sequence you may put objects called mixers that allow you to manipulate "sub sequences" in different ways.
    // In this case we will be using the `random` mixer in order to randomize a sub sequence of pages.
    //
    // Just to get a better  idea of what is going on here, you should know that mixers usually take the following form:
    //
    // ```javascript
    // var mixer = {
    //  mixer : 'random', // the type of mixer that we should use
    //  data : [] // the subsequence to which we apply the mixer
    // }
    // ```
    //
    // In this case we wrap the pages that with general questions within the `data` property of a `type:'random'` mixer.

    {
      mixer: 'random',
      data:[
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'mostpref',
            stem: 'Do most people prefer fat people or thin people?',
            answers: [
              'Most people strongly prefer Fat People to Thin People','Most people somewhat prefer Fat People to Thin People','Most people slightly prefer Fat People to Thin People','Most people like Fat People and Thin People equally ','Most people slightly prefer Thin People to Fat People', 'Most people somewhat prefer Thin People to Fat People','Most people strongly prefer Thin People to Fat People'
            ]
          }]
        },
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'controlyou',
            stem: 'How much control do you have over your weight?',
            answers: [
              'Complete control','A lot of control','Some control ','A little control',   'No control'
            ]
          }]
        },
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'controlother',
            stem: 'How much control do people have over their weight?',
            answers: [
              'Complete control','A lot of control','Some control ','A little control',   'No control'
            ]
          }]
        },
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'iam',
            stem: 'Currently, I am:',
            answers: [
              'Very underweight','Moderately underweight',    'Slightly underweight','Neither underweight nor overweight','Slightly overweight','Moderately overweight','Very overweight'
            ]
          }]
        },
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'othersay',
            stem: 'Other people would say that I am:',
            answers: [
              'Very underweight','Moderately underweight',    'Slightly underweight','Neither underweight nor overweight','Slightly overweight','Moderately overweight','Very overweight'
            ]
          }]
        },
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'comptomost',
            stem: 'Compared to most people I interact with, I am:',
            answers: [
              'Much thinner','Moderately thinner','Slightly thinner','About the same','Slightly fatter','Moderately fatter','Much fatter'
            ]
          }]
        },
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'important',
            stem: 'How important is your weight to your sense of who you are?',
            answers: [
              'Not at all important','Slightly important','Moderately important','Very important','Extremely important'
            ]
          }]
        },
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'idfat',
            stem: 'How much do you feel similar to people who are fat?',
            answers: [
              'Not at all similar','Somewhat similar','Moderately similar','Very similar','Extremely similar'
            ]
          }]
        },
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'idthin',
            stem: 'How much do you feel similar to people who are thin?',
            answers: [
              'Not at all similar','Somewhat similar','Moderately similar','Very similar','Extremely similar'
            ]
          }]
        },
        {
          inherit : 'basicPage',
          questions : [{
            inherit : 'basicSelect',
            name: 'easytolose',
            stem: 'How easy or difficult would it be for you to lose 5 to 10 pounds if you wanted to?',
            answers: [
              'Very easy','Moderately easy','Somewhat easy','Somewhat difficult','Moderately difficult','Very difficult'
            ]
          }]
        }
      ]
    }

    // Now, we just close the sequence.
  ]);

  // ### Closing section
  //
  // And finally, we close the script.
  // Here again, all scripts look more or less the same.
  // We return the `script` and close the `define` wrapper.
  return API.script;
});