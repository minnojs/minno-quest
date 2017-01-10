// Sometimes you need to handpick a specific object out of a set.
// `byData` allows you to do that by matching the `data` properties of the inherit object and the objects within the set.
// Note, that if there are multiple fits to your data object, a random object will be picked from among them.
define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addTasksSet('default', [
  	{
  		type:'message',
  		keys: ' '
  	}
  ]);

  API.addTasksSet('tasks',[
    {inherit:'default', template:'Task 1', data:{num:1}},
    {inherit:'default', template:'Task 2', data:{num:2}},
    {inherit:'default', template:'Task 3', data:{num:3}}
  ]);

  API.addSequence([
    {inherit:{set:'tasks', type:'byData', data:{num:2}}},
    {inherit:{set:'tasks', type:'byData', data:{num:1}}},
    {inherit:{set:'tasks', type:'byData', data:{num:3}}}
  ]);

  return API.script;
});