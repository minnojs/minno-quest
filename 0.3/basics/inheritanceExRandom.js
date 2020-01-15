// When you want to randomly pick from within a set without repeating any of the elements
// (When the sequencer runs out of elements in the set, it resets the randomization).
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
    {inherit:{set:'tasks', type:'exRandom'}},
    {inherit:{set:'tasks', type:'exRandom'}},
    {inherit:{set:'tasks', type:'exRandom'}}
  ]);

  return API.script;
});