---
title: Templates
description: Using dynamic values for player elements
---

One of the ways to create dynamic questionnaires is using templates. Templates are a format that allows you to dynamically generate settings for your questions. You can replace any non-object setting from within your elements with a template, and it will be rendered according to the [environmental variables](#variables) (The exception to this rule is the `inherit` setting that cannot use templates).

A template is a string that has a section of the form `<%= %>` in it. Within these brackets you can write any Javascript that you like and it will be evaluated and printed out. The player uses [lodash templates](http://lodash.com/docs#template) internally, you can look them up to see all the possible uses.

The main use of templates is probably accessing local and global variables. For instance, in order to print the global variable "name", you could create a template that looks like this: `My name is <%= global.name%>`.

Templates allow access only to a confined number of variables; These vary a bit between different tasks, but you can expect the templates to have access to the `global` and `current` objects. Element templates also have access to their own data property as {namespace}Data (so that trials will have a `trialData` object, and stimuli a `mediaData` property). Some objects have access to additional properties, you can find them in their respective documentation.

