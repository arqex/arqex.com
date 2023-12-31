---
slug: "/articles/react-js-the-simple-way"
type: "article"
date: "2015-10-30"
source: ""
title: "React.js the simple way"
link: "/1106/react-js-the-simple-way"
---

This article was <a href="https://medium.com/@arqex/react-the-simple-way-cabdf1f42f12" target="_blank">originally published at Medium</a>, 21st of september 2015 and explains how to create Flux applications almost without boilerplate code, and start enjoying React.
<h3>The key is the unidirectional dataflow</h2>
Everybody starting with React realize quiclkly about how easy is to create components and build an UI that can be used in production.

Once you get used to how components work, you begin to feel the need of handling the data that is used by them efficently. That data is often called “the state” of the app, and managing it well is the corner stone of every frontend application.

<strong>Flux</strong> is usually the concept used to manage the data with React. It contains <strong>actions</strong> to update the state, <strong>stores</strong> to hold it and a <strong>dispatcher</strong> to coordinate the changes, but the truth is that <strong>the important statement of flux is the unidirectional data flow</strong>: When the state is updated, the application is re-rendered reactively, so it is the state who rules the application.

You might be saying now “Hey! That’s not the definition of unidirectional data flow!”. Flux definition, including stores, actions and a dispatcher, usually explains the unidirectional dataflow in a more complex way that it should. Removing all the flux pieces, the unidirectional dataflow graph can be shown like this:

<a href="http://arqex.com/wp-content/uploads/2015/11/1-WOYT1aVy1jQMBw3C1lEbSw.png"><img class="aligncenter size-full wp-image-1108" src="http://arqex.com/wp-content/uploads/2015/11/1-WOYT1aVy1jQMBw3C1lEbSw.png" alt="1-WOYT1aVy1jQMBw3C1lEbSw" width="662"  /></a>

The main implication of this graph is that <strong>only state changes can update the UI</strong>. You will be building a data driven interface.

There are dozens of Flux frameworks out there (even <a href="https://github.com/arqex/fluxify" target="_blank">I created one</a> some time ago). Some of them don’t have a dispatcher, others don’t include stores… But everyone follows the unidirectional dataflow.
<h3>The simplest Flux with Freezer</h2>
The best way of explaining something is creating an example. Why not the the typical <strong>todo app</strong>? We are going to use <strong>Freezer</strong> to build it, <a href="http://freezer-todos.divshot.io/" target="_blank">you can see it working here</a> and <a href="https://github.com/arqex/freezer-todomvc" target="_blank">check the code at github</a>.

<a href="https://github.com/arqex/freezer" target="_blank">Freezer</a> is not a new library, but it is pretty unkown. It’s a data structure that triggers events when it is updated, and it happens to contain all the needed to add the unidirectional data flow to your app. It also have some other benefits for React:
Its data is immutable, an efficent way of saving memory and speed up your React app.
<ul>
	<li>It is tiny, 9kb minified.</li>
	<li>It has no dependencies.</li>
	<li>It has an open event system, the perfect dispatcher replacement.</li>
	<li>Data is stored in plain js array and objects, so it is possible to use popular utility libraries like underscore, lodash or rambda with it.</li>
	<li>Using it, you can have all the app state in one place.</li>
</ul>
These are nice reasons to give it a try, but the main one is the simplicity of developing React apps with it, without dispatcher, actions nor stores.
<h3>Freezer as the state holder</h2>
The famous todo app become really simple to create using React and Freezer. To start, let’s overview how Freezer works defining the app state in a Freezer object.

<script src="https://gist.github.com/arqex/2fdfdb3fde094c4803d7.js"></script>

The <code>freezer</code> object will hold the state of our app. In order to access to the state data you need to use the get method, and you will get an immutable object with all of it.

<script src="https://gist.github.com/arqex/94124081333099b99c68.js"></script>

The state data hold by Freezer is immutable. It cannot be changed, it will be replaced by new one when an update is needed. To do so, state nodes come with <a href="https://github.com/arqex/freezer#update-methods" target="_blank">updater methods</a> that request a new state for our application. For example, the push method in the arrays.

<script src="https://gist.github.com/arqex/095e6528f7b514c0c63b.js"></script>

Every time the state is updated, Freezer create a new immutable object for it reusing the unmodified parts of the data tree. It also triggers an update event, so you can subscribe to it in order to refresh your UI every time the data changes. This way we will have a reactive, data driven UI.

<script src="https://gist.github.com/arqex/5f675c10e416e9401f4e.js"></script>

The update event is always triggered on the next tick, so Freezer won’t try to re-render your UI if some updater method is called in a middle of a render (You should never update the state in a middle of a render, but just in case).
<h3>Freezer as the orchestra director</h2>
As I said before, using Freezer there is no need of a dispatcher, stores nor actions. You can develop in a very similar but simpler way.
<ul>
	<li>Instead of stores, all the data is hold in one Freezer object that emit events on change. It is possible to listen to changes in one particular node using listeners, in case that a fine grained rendering is needed.</li>
	<li>Instead of a dispatcher, we can use the open event system to coordinate the state changes.</li>
</ul>
<script src="https://gist.github.com/arqex/a28ccc1fe69d5c80dd26.js"></script>
<ul>
	<li>Instead of registering actions in the dispatcher, you can create reactions to Freezer events. Flux also recommends to create action creators (more boilerplate code) because payloads are not very sematic and they are difficult to read by the developers. Freezer events accepts any number of arguments and pass them to the reactions, easy to understand.</li>
</ul>

<script src="https://gist.github.com/arqex/05b2e10ae05a0e3eb053.js"></script>

<a href="https://gist.github.com/arqex/60221c8855fede91d07d" target="_blank">See here how much effort is needed to do the same with standard Flux</a>.

There is no need of having a <code>waitFor</code> method like in Flux, if you want to call a reaction after another, just trigger a new event at the end of the first one.

That’s it.<strong> Just events, reactions and no boilerplate code at all</strong>.
<h3>Tips to use React with Freezer</h2>
Events are the key piece for reducing boilerplate code of a traditional Flux system. We used Freezer’s ones, but you can even <a href="http://arqex.com/1028/better-flux-dom-events" target="_blank">use DOM events</a> if you are creating a web application, making the events bubble through the React hierarchy. Using Freezer has some other advantages though.
<h3>Familiar project structure</h3>
We don’t have dispatcher or stores, so we don’t need to register actions or bind listeners to stores often, but, we have reactions that are similar to actions. It is recommended group this actions by their domain, <a href="https://github.com/arqex/freezer-todomvc/blob/master/src/todoReactions.js" target="_blank">see the todoActions file</a> in the todo app. Don’t you find it clear?
<h3>Components without internal state</h3>
Using Freezer it is possible to have all the data outside the components. Did you realize how we had a <code>todoInput</code> property in our state? There the value of the main input to create new todos is stored. Everytime the user type in it, the property is updated. It allow us to control the contents of the input from inside and outside of the component.

<script src="https://gist.github.com/arqex/a21efc8fb9322947e959.js"></script>

The todo app also emulates that it is storing the todos in the server to show how to handle asynchronous reactions. Again it is really cool to control every todo status from outside, so we can show informative messages to the user while the server replies. Let’s see the code of the todo update reaction:

<script src="https://gist.github.com/arqex/1e8f859fa536ddc56047.js"></script>

<h3>Immutable data boosts your app performance</h3>
You might be thinking that having the input values outside the components will re-render your whole app everytime the user types. Fortunatelly, using Freezer also allows to skip useless re-render checks. Not having an internal state, our components have<strong> pure render methods</strong>. It means that if the props don’t change, calling the render method is not needed.

Since our properties are immutable, check if there has been some change in the data is as easy as using a plain comparison. Have a look at the TodoList component implementation.

<script src="https://gist.github.com/arqex/be1e96be2ff613690ece.js"></script>

It is possible to use the official <a href="https://facebook.github.io/react/docs/pure-render-mixin.html" target="_blank">pure render mixin</a> or <a href="https://github.com/gaearon/react-pure-render" target="_blank">react-pure-render</a> that offers the implementation as a higher order component.
<h3>Cheap undo and redo</h3>
This is the typical feature that is highlited when speaking about immutable data. See <a href="http://jsbin.com/hugusi/1/edit?js,output" target="_blank">a JSON editor made with Freezer</a> that offers undo/redo.

When the state is updated, all the nodes that were not changed are reused by the new state, so it is possible to save previous states and the memory usage is not going to increment drastically.
<h3>All the state in one place</h3>
Having all the app data in the same place let any part of the application know if something has changed elsewhere, so it is easier to coordinate the updates. But there are more benefits.

With all the data in one place it is easy to serialize and save it for later. That would let the user close the app and continue at the same point when he reopen it the following day.

Also, it is easier to inject the data in to the application making simpler to render the apps in the server side. Just recreate the data, and React will render the page to let you serve it without a browser.
<p style="text-align: center;">...</p>
Freezer and React are a great combo. They are easy to understand and take little effort to get used to work them. Why not to give them a try in your next project?