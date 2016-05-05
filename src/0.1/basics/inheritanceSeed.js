// The inheritance systems uses seeds to keep track of consecutive calls to the different types of inheritance.
// If you want to have parallel groups of inheritance to the same set, you can use seeds.
// This examples shows how to reset the `sequential` type, it works for `exRandom` as well...
// The options here are pretty endless, you should look into the documentation in order to get a better understanding of how this feature works.
define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addTasksSet('default', [
  	{
  		type:'message',
  		keys: ' '
  	}
  ]);

  API.addTasksSet('tasks',[
    {inherit:'default', template:'Task 1'},
    {inherit:'default', template:'Task 2'},
    {inherit:'default', template:'Task 3'}
  ]);

  API.addSequence([
    {inherit:{set:'tasks', type:'sequential', seed: 'block1'}},
    {inherit:{set:'tasks', type:'sequential', seed: 'block1'}},
    {inherit:{set:'tasks', type:'sequential', seed: 'block2'}},
    {inherit:{set:'tasks', type:'sequential', seed: 'block2'}},
    {inherit:{set:'tasks', type:'sequential', seed: 'block2'}}
  ]);

  return API.script;
});