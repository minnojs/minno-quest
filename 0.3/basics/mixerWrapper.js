// By default the mixer mixes depth first.
// This means that all the internal mixers will be mixed before the external mixer will be mixed before an external mixer kicks in.
// The  wrapper mixer serves as a sort of parentheses allowing you to control the order of mixing.
// In this example we show how to cause a random mixer to treat task 3 and 4 as a single chunk, and therefore keep them together despite randomization.
define(['managerAPI'], function(Manager){

  var API = new Manager();

  API.addSequence([
    /* The random mixer */
    {
      mixer: 'random',
      data: [
        {
          type:'message',
          keys: ' ',
          template: 'Task 1'
        },
        {
          type:'message',
          keys: ' ',
          template: 'Task 2'
        },
        /* The Wrapper mixer. Tasks 3 and 4 will be treated as a single object when randomizing */
        {
          mixer: 'wrapper',
          data: [
            {
              type:'message',
              keys: ' ',
              template: 'Task 3 (always comes before 4)'
            },
            {
              type:'message',
              keys: ' ',
              template: 'Task 4 (always comes after 3)'
            }
          ]
        }
      ]
    }
  ]);

  return API.script;
});