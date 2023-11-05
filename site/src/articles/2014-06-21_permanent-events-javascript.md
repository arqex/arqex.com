---
slug: "/articles/permanent-events-javascript"
type: "article"
date: "2014-06-21"
source: ""
title: "Permanent events in javascript"
link: "/900/permanent-events-javascript"
---

Events are old friends when we talk about javascript, and I think that I am not wrong if I say that you are not good at client javascript if you don't master how DOM events work. They are really helpful to handle the asynchronous nature of a web application, and that's why some libraries like jQuery and Backbone make an intensive use of custom events as a mechanism of communication among different parts of a web application.

The most used event in jQuery is the 'document ready' one, and from my point of view that<em> ready type</em> of events are kind of special ones. Those events are triggered when some data turns available, and if you try to listen to those events after they have been triggered, you will wait forever, even if the data is already there to be used.

That is not an unusal scenario when you load your files asynchronously, so, for some time, I have been using what I call <strong>permanent events</strong> to handle this problem.

<!--more-->
<h3>Introducing permanent events</h2>
What I needed was a kind of event that I can bind new listeners once it has been triggered, being sure that those listeners will be called. So something like following code would work great
<pre class="lang:js decode:true">object.trigger('ready');
object.on('ready', function(){
	// This will print 'It is ready' in the console
	// even if the listener has been added after the 
	// event triggering.
	console.log('It is ready'); 
});</pre>
That means that, in the future, I can load new files and they will be able to ask safely if the object is ready just adding a listener to the event.

This behaviour is quite similar to <a title="Promises in ECMAScript 6" href="http://www.html5rocks.com/en/tutorials/es6/promises/" target="_blank">the way the promises work</a>, once they are fulfilled any callback attached to them will be inmediately called. Using permanent events you can forget about promise objects and all the boilerplate code you need to handle them.

<em>Note: I think promises are great and permanent events aren't a general replacement for them, but an agile way of handling that 'data ready' situation.</em>
<h3>Building permanent events for Backbone.js</h2>
If you are looking for using permanent events in Backbone I recommend to give a try to the <a title="Permanent events in backbone.js" href="https://github.com/arqex/backbone-resolve" target="_blank">backbone-resolve plugin</a>, and you don't need to read anymore.

Are you still reading? Well, then I am forced to show how to create permanent events for Backbone.js. The same can be achieved for others libraries like jQuery following a similar approach.

Instead of creating a Backbone plugin like backbone-resolve to extend Backbone's Event module directly, we are going to extend just one object to make it ready for permanent events. Let's call our object <code>PermanentEvents</code>, and we are going to implement a method in it called <code>resolve</code> (nod to promises) which is called instead of  <code>trigger</code> if we want to create a permanent event. An example would go as follows
<pre class="lang:js decode:true">// First, extend our object with events
// thanks to underscore
var myobject = _.extend({}, PermanentEvents);

// trigger the permanent event 'ready'
myobject.resolve('ready', 'I am ready');

// listening to the event now, 
// will execute the callback inmediatelly
myobject.on('ready', function(message){
	// Prints out 'I am ready'
	console.log(message);
});</pre>
Of course, you could also add your listener before using the <code>resolve</code> function, and it will be called just after the event is resolved.

Want to see how the resolve method work? Here it is.
<pre class="lang:js decode:true crayon-selected">var PermanentEvents = _.({}, Backbone.Events);

PermanentEvents.resolve = function(name){
		// make sure we have a resolved array
		this._resolved || (this._resolved = {});

		// Any aditional parameter is used as argument for the callbacks
		var parameters = Array.prototype.slice.call(arguments, 1);

		// Store the parameter values of the resolved event
		this._resolved[name] = parameters;

		// Trigger the event to call any bound listener
		return this.trigger.apply(this, arguments);

}</pre>
Basically, <code>resolve</code> stores the events and any argument that needs to be passed to the listeners in a attribute called <code>_resolved</code>. Just after that, it calls Backbone.Events' <code>trigger</code> method, to execute any listener that may be bound already.

With that code we have half of our work done. Now we just need to make the method <code>on</code> check if the events are already resolved to execute their listeners.
<pre class="lang:js decode:true">PermanentEvents.on = function(name, callback, context){
	// If the event has been resolved, execute the callback
	if(this._resolved &amp;&amp; this._resolved[name])
		callback.apply(context || this, this._resolved[name]);

	// And then continue as a standard on call, calling the original
	// on method
	return Backbone.Events.on.apply(this, arguments);
}</pre>
And that's all. It wasn't difficult, isn't it? You can extend any object with <code>PermanentEvents</code> in order to make it ready to resolve events. In Backbone's Events implementation, any function used to add listeners like <code>once</code>, <code>listenTo</code> or <code>listenToOnce</code> use the method <code>on</code> internally, so the code above is the only thing we need to make them all understand permanent events.

Are you already using permanent events in your code? Drop a comment!