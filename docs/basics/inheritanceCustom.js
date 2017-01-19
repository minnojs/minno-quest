// Custom inheritance is only for advanced users. It allows you to pick objects by any criteria that you like.
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
    {inherit:function(collection){
        return collection.at(2);
    }}
  ]);

  return API.script;
});