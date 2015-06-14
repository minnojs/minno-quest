// Randomizes the order of elements in `data`.
//
// Please note that the randomizer pre-mixes all the content in data,
// so that any branching mixers will be branched according to the environment as it is when the random mixer is reached.
// If you want to delay the branching until it is reached, simply wrap it within a `wrapper` mixer.

define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addSequence([
    {
      mixer:'random', // declare the mixer
      data:[ // a list of tasks to randomize
        {
          type:'message',
          keys: ' ',
          template: 'Task 1'
        },
        {
          type:'message',
          keys: ' ',
          template: 'Task 2'
        },
        {
          type:'message',
          keys: ' ',
          template: 'Task 3'
        }
      ]
    }
  ]);

  return API.script;
});