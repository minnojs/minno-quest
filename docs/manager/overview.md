# Overview

miManager is a player intent on presenting a series of tasks to the users. It uses the same overall API used throught the project implicit tasks.

It is written in JavaScript and is built to be extremely versatile and customizable. The scripts are written as JavaScript objects. This format allows writing simple and straightforward scripts using a constrained scripting language. The format also allows advanced users to easily create complex and dynamic scripts using in-line JavaScript.

### Central concepts

The basic unit it PImanager scripts is the task. A task is represented by a single object, the properties of the object define the task to be activated and some settings relevant to it. Tasks are organized and presented using the task sequence. The sequence is an ordered list of tasks.

Within the sequence you can use several tools in order to control the flow of your tasks. [mixers](../basics/sequencer.html#mixer) control the order in which your tasks are presented (and allow you to change the sequence conditionally). [inheritance](../basics/sequencer.html#inheritance) allows abstracting tasks and makes them shorter, simpler, more dynamic, and most important, reusable. And finally [templates](../basics/sequencer.html#templates) allow you to micro manage the style of your tasks.

### Tasks

There are four types of tasks built into miManager [miQuest](../quest/overview.html), [miTime](/mino-time/0.3/tutorials/overview.html), [messages](messages.html) and [post](post.html). You can run new tasks in several ways (see the [API](API.html#tasks)).
