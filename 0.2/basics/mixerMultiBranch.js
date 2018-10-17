// Conditionally activate specific sub sequences.
define(['managerAPI'], function(Manager){

  var API = new Manager();

  // Set a global flag that we can test against
  API.addGlobal({condition:'cond1'});

  API.addSequence([
    {
      mixer: 'multiBranch',
      branches: [
          {
            conditions: [
              {compare: 'global.condition', to: 'cond0'}
            ],
            data: [
              {type:'message',keys: ' ',template: 'Task 0: will not be displayed'}
            ]
          },
          {
            conditions: [
              {compare: 'global.condition', to: 'cond1'}
            ],
            data: [
              {type:'message',keys: ' ',template: 'Task 1: will be displayed'},
              {type:'message',keys: ' ',template: 'Task 2: will be displayed'}
            ]
          }
      ]
    }
  ]);

  return API.script;
});