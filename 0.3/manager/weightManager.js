//
// The weight manager is a basic example of how we user miManager.
// It is heavily commented so that you can follow everything that goes on.
// After reading the documentation feel free to download the file and modify it according to your needs.
//
// ### Opening section
//
// The opening section of each script is always more or less the same.
// We create the wrapper for the script (`define`), and create a new instance of a manager.
define(['managerAPI'], function(Manager){

  var API = new Manager();

  // ### The sequence
  // The most important part of every manager script is the sequence.
  // This is where you tell it how to interact with the participants.
  // In our case we want to simply present a single instruction page, and then activate a miQuest questionnaire.
  API.addSequence([
    // #### Instructions
    // This is a message task. It is used to give instructions to the user.
    //
    // The task type is defined using the `type` property.
    // Setting `keys` to '&nbsp;&nbsp;' allows using the space button in order to proceed.
    // We use `template` to insert a plain html template to the task.
    // Usually it is more convenient to use `templateUrl` and get the html out of a separate file, we chose this method here in order to keep the script concise.
    {
      type: 'message',
      keys: ' ',
      template:
        '<div class="panel panel-info" style="margin-top:1em">' +

          '<div class="panel-heading">' +
            '<h1 class="panel-title" style="font-size:2em">Welcome</h1>' +
          '</div>' +

          '<div class="panel-body">' +
            '<p>You are about to take a questionnaire that has to do with your perception of personal weight.</p>' +
            '<p>Please take your time and answer to the best of your ability. In case there is no answer that fits you exactly, pick the closest answer possible.</p>' +
            '<div style="max-width: 50%; margin: 30px auto 10px;" class="well">' +
              '<button pi-message-done type="button" class="btn btn-primary btn-block">Click Here or press the space button to Proceed</button>' +
            '</div>' +
          '</div>' +

        '</div>'
    },
    // #### Weight Questionnaire
    // This is a miQuest task. In this case it is the central task of this experiment.
    // The questionnaire is loaded from a file (you can see it right [here](../quest/weightDocco.html)).
    {
      type: 'quest',
      name: 'weightQuest',
      scriptUrl: '../../quest/weight.js'
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
