// One of the main uses for inheritance is simplifying your scripts.
// Instead of repeating the settings for your tasks, you can abstract them into a set and inherit them each time.
//
// Note that you can inherit from within sets as well, so that you can several levels of abstraction.

define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addTasksSet('default', [
  	{
  		type:'message',
  		keys: ' '
  	}
  ]);

  // Instead of setting the task type and keys properties, we simply inherit the 'default' task set.
  // (Setting inherit to a String is equivalent to using random. This works for us because there is only one object within the 'default' set.)
  API.addSequence([
  	{inherit:'default', template:'Task 1'},
  	{inherit:'default', template:'Task 2'},
  	{inherit:'default', template:'Task 3'}
  ]);

  return API.script;
});