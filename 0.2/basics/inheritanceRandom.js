// When a set has several objects you may want to inherit a random object out of that set.
// Note that you are not guaranteed that items will not be repeated when you randomly inherit (if that is what you want, use Exclusive Random: `exRandom`).
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
    {inherit:'tasks'}, // this is a shortcut that is equivalent to the full inherit random object.
    {inherit:{set:'tasks', type:'random'}},
    {inherit:{set:'tasks', type:'random'}}
  ]);

  return API.script;
});