# Overview

The Minno online experimentation system is a system for running questionnaires and cognitive tasks on-line.
It is composed of several sub components that share several common principles.
The basics section of the documentation is devoted to explaining the common principles that underlie all of our tasks.

The tasks we use are created in a simplified Javascript environment.
So we first introduce some very basic [Javascript](javascript.html) to get you started.

Structurally, each task is composed of frames (each defined using Javascript).
For instance, the basic frame for piQuest (our questionnaires component) is the page, which holds several sub-frames: the questions.
Each page or question is represented by an object (defined with Javascript).
The programming of a task involves setting the properties of these objects (e.g., set the wording of your question into a question object).
The properties of these objects are discussed in the API section of each of their respective documentation sites.

You will learn the basics of composing a task from these objects in the [Creating a task](create.html) section.

Each task presents a sequence of frames/objects.
In its simplest form the task sequence is an ordered list (an array) of frames (e.g., pages in a questionnaire), and it activates them one after the other.
There are several ways that you can control the sequence order (e.g., random selection of questionnaire questions).
These methods are covered in the [sequencer](sequencer.html) section of this documentation.

When creating your scripts you regularly use API objects (there is a special one for each of the individual task types).
The API helps abstract away a lot of the Javascript that happens behind the scenes.
The [API section](#API.html) gives you the details of using each one of the APIs methods.
If you want, you can also develop your own task types, using Javascript, and simply add them to the sequence of tasks that comprise a study.
