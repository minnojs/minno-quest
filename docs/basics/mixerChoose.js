// Choose a random subgroup of elements from the sub-sequence.
// By default chooses one. The `n` property allows to set how many to choose.
define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addSequence([
    {
      mixer:'choose', // declare the mixer
      n:2, // choose two of the follwoing elements
      data:[ // a list of tasks to bhoose from
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