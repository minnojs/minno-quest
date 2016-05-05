// You can use data set within the global (or for that matter current) object from within templates.
define(['managerAPI'], function(Manager){

  var API = new Manager();

  // Set a global flag that we can test against
  API.addGlobal({condition:'using global in templates'});

  API.addTasksSet('default', [
  	{
  		type:'message',
  		keys: ' '
  	}
  ]);

  API.addSequence([
    {inherit:'default',template:'We are in the "<%= global.condition %>" condition.'}
  ]);

  return API.script;
});