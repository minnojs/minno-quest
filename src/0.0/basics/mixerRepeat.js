// Repeats the element in `data` `times` times.
//
// Please note that the randomizer pre-mixes all the content in data,
// so that any branching mixers will be branched according to the environment as it is when the mixer is reached.
// If you want to delay the branching until it is reached, simply wrap it within a `wrapper` mixer.

define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addSequence([
    {
      mixer:'repeat', // declare the mixer
      times: 3, // how many times to repeat these tasks
      data:[ // a list of tasks to repeat
        {
          type:'message',
          keys: ' ',
          template: 'Task 1'
        },
        {
          type:'message',
          keys: ' ',
          template: 'Task 2'
        }
      ]
    }
  ]);

  return API.script;
});