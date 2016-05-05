// Each object has a special object called "meta" that has information regarding the relative location of the object within the sequence.
// Check the documentation for the task you are using to know how the meta object is called from within the template.
// (the standard structure for the name is {{object type}}Meta, so that tasks meta become tasksMeta).
//
// The meta objects has two properties `number` and `outOf`.

define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addTasksSet('default', [
  	{
  		type:'message',
  		keys: ' ',
      template: 'Task number <%= tasksMeta.number %> out of <%= tasksMeta.outOf %>.'
  	}
  ]);

  API.addSequence([
    {inherit:'default'},
    {inherit:'default'},
    {inherit:'default'},
    {inherit:'default'}
  ]);

  return API.script;
});