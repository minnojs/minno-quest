// You can use data set within the objects you are using from within templates.
// Check the documentation for the task you are using to know how the data object is called from within the template
// (the standard structure for the name is {{object type}}Data, so that tasks become tasksData).
define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addTasksSet('default', [
  	{
  		type:'message',
  		keys: ' ',
      data: {condition:'using data in templates'}
  	}
  ]);

  API.addSequence([
    {inherit:'default',template:'We are in the "<%= tasksData.condition %>" condition.'}
  ]);

  return API.script;
});