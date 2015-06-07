---
title: Overview
description: The project implicit task system.
---

The project implicit task system is a system for running questionnaires and cognitive tasks on-line. It is composed of several components that share several common principles. The basics section of the documentation is devoted to explaining the common principles that underlie all of our tasks.

The tasks we use are created in a simplified Javascript environment. So we first introduce some very basic [Javascript](javascript.html) to get you started.

Structurally, each task is composed of a series of Javascript Objects. The tasks are composed of frames, each represented by a single object. For instance the basic frame for piQuest is the page, which holds several sub-frames: the questions. Each page or question is represented by an object. The properties of these objects are discussed in the API section of each of their respective documentation sites (although as you will see some of the properties are common to all objects).

You will learn the basics of composing a task from these objects in the [Creating a task](create.html) section.

The tasks each present a series of frame/objects consecutively. This behavior is managed by the task sequence. In its simplest form the task sequence as an ordered list (an array) of task objects, and it activates them one after the other. There are several ways that you can modify the objects within the sequence and change their order during the sequence. These methods are covered in the [sequencer](sequencer.html) section of this documentation.

When creating your scripts you regularly use API objects (there is a special one for each of the individual task types). The API helps abstract away a lot of the Javascript that happens behind the scenes. The [API section](#API.html) gives you the details of using each one of the APIs methods. Of course, f you want, you can always use any Javascript that you like when creating your scripts. 
