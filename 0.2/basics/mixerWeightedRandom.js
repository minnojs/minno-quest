// Randomizes the order of elements in `data`.
//
// Please note that the randomizer pre-mixes all the content in data,
// so that any branching mixers will be branched according to the environment as it is when the random mixer is reached.
// If you want to delay the branching until it is reached, simply wrap it within a `wrapper` mixer.

define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addSequence([
    {
      mixer:'weightedRandom', // declare the mixer
      weights: [0.2, 0.8], // weights by which to randomize
      data:[ // a list of tasks to randomize
        {
          type:'message',
          keys: ' ',
          template: 'Task 1 (20% of the time)'
        },
        {
          type:'message',
          keys: ' ',
          template: 'Task 2 (80% of the time)'
        }
      ]
    }
  ]);

  return API.script;
});
