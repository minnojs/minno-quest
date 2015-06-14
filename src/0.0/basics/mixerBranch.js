// Conditionally activate specific sub sequences.
define(['managerAPI'], function(Manager){

  var API = new Manager();

  // Set a global flag that we can test against
  API.addGlobal({condition:'cond1'});

  API.addSequence([
    {
      mixer: 'branch',
      conditions: [
        {compare: 'global.condition', to: 'cond1'}
      ],
      data: [
        {
          type:'message',
          keys: ' ',
          template: 'Task 1: will be displayed'
        }
      ],
      elseData: [
        {
          type:'message',
          keys: ' ',
          template: 'Task 2: will not be displayed'
        }
      ]
    }
  ]);

  return API.script;
});