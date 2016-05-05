// The inheritance systems uses seeds to keep track of consecutive calls to the different types of inheritance.
// If you want to have paralel groups of inhertiance to the same set, you can use seeds.
// This examples shows how to reset the `sequential` type, it works for `exRandom` as well...
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

  API.addTasksSet('pairs',[
    {inherit:'default', template:'Pair 1'},
    {inherit:'default', template:'Pair 2'},
    {inherit:'default', template:'Pair 3'}
  ]);


  API.addSequence([
    {inherit:{set:'tasks', type:'exRandom', seed: 'block1'}},
    {inherit:{set:'pairs', type:'exRandom', seed: 'block1', repeat:true}},
    {inherit:{set:'tasks', type:'exRandom', seed: 'block1'}},
    {inherit:{set:'pairs', type:'exRandom', seed: 'block1', repeat:true}},
    {inherit:{set:'tasks', type:'exRandom', seed: 'block1'}},
    {inherit:{set:'pairs', type:'exRandom', seed: 'block1', repeat:true}}
  ]);

  return API.script;
});