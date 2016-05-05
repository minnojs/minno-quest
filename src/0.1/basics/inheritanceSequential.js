// When you want to go through a set by the order it was created.
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
    {inherit:{set:'tasks', type:'sequential'}},
    {inherit:{set:'tasks', type:'sequential'}},
    {inherit:{set:'tasks', type:'sequential'}}
  ]);

  return API.script;
});