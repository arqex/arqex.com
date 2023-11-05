---
slug: "/articles/using-redux-devtools-without-redux"
type: "article"
date: "2015-11-16"
source: ""
title: "Using redux devtools without redux"
link: "/1087/using-redux-devtools-without-redux"
---

<a href="https://github.com/rackt/redux" target="_blank">Redux</a> is probably the most popular library to manage the state of React.js applications at the moment. Wasn't that what Flux is about? That's it, redux is an alternative Flux library. It's creator, <a href="https://twitter.com/dan_abramov" target="_blank">Dan Abramov</a>, put a lot of effort in make redux a really flexible library, it is possible to extend it, or even change its behavior just adding your own functions to its action life cycle.

Advantages of redux goes beyond the library itself, because redux has an awesome companion called <a href="https://github.com/gaearon/redux-devtools" target="_blank">redux-devtools</a>. With the devtools you can see how the app state gets mutated and you can go back and forth in the state history, canceling and repeating actions, what is a really cool feature when developing.

<a href="http://arqex.com/wp-content/uploads/2015/11/devtools.gif"><img class="aligncenter size-full wp-image-1112" src="http://arqex.com/wp-content/uploads/2015/11/devtools.gif" alt="devtools" width="776"  /></a>

But I love <a href="https://github.com/arqex/freezer" target="_blank">freezer.js</a>, a different library. It is a such simple and lightweight solution to handle the app state and keep the data changes flowing just in one direction. The problem about using freezer.js is that I don't have the cool devtools I have with redux... don't I?

In this article I want to explore redux internals with the purpose of use redux-devtools in a freezer.js application, but you probably could use this info to use redux-devtools with any other Flux library. The result of the investigation is <a href="https://github.com/arqex/freezer-redux-devtools" target="_blank">freezer-redux-devtools</a>, a package ready to use freezer and redux-devtools together.
<h3>Knowing redux</h2>
Before starting, I need to say that I am not a redux expert, maybe some of the terms I use here are not accurate or things can be done much better: Feel free to complain in the comments.

So let's hack redux-devtools! Hacking is not bad, being hackable is one of the most cool features of redux, you can see it studing how the devtools work.

A redux application <strong>stores all of its state in one object</strong> and there is also <strong>just one function to update the state</strong>. That function receives the current state and an action, and returns a new state, the result of applying the action to the current state. The state received should never be modified inside the function, and the state returned will be its replacement for the application.

Never modifying the state directly is how we are getting the benifits of immutability using just functions in redux. It sounds much like the way that freezer works, creating new objects without modifying previous ones.

<img class="aligncenter wp-image-1091 size-full" src="http://arqex.com/wp-content/uploads/2015/11/redux.png" alt="Redux flux" width="581"  />

Every time that a new state is generated the app is re-rendered, hence we have a reactive application.

But, how can you make a so complex function that can handle all the possible changes in an application? The answer is creating it by composition of smaller functions. If your functions receive an state and returns a new one, it is simple to chain multiple smaller functions that handle different state parts in your app. If you want to know more of this basic pattern of redux, you can have a look at its <a href="http://rackt.org/redux/docs/basics/Reducers.html" target="_blank">reducer documentation</a>.

<img class="aligncenter wp-image-1092 size-full" src="http://arqex.com/wp-content/uploads/2015/11/redux-reducers.png" alt="redux reducers" width="744"  />

The important thing to know for us is that all the changes made to the state go through one only channel (like the event hub in freezer.js), and what's better: <strong>redux makes easy to intercept what's going through the channel using middleware</strong>. <a href="https://en.wikipedia.org/wiki/Middleware" target="_blank">Middleware</a> is a special kind of functions that have access to the action and the current state before they get into the big reducer function in order to modify them or to avoid that they generate a new state. Middleware functions can also modify the new state before it gets into the store again.

<a href="http://arqex.com/wp-content/uploads/2015/11/redux-middleware.png"><img class="aligncenter size-full wp-image-1094" src="http://arqex.com/wp-content/uploads/2015/11/redux-middleware.png" alt="redux-middleware" width="744"  /></a>

&nbsp;

Creating a middleware we can have access to all the actions that are dispatched in a redux app transparently.
<h3>Knowing redux-devtools</h2>
Redux-devtools is an independent redux application that lives beside the main one. It has its own store, dispatcher and reducer and it comes with a middleware function that should be applied to the app that we are developing. That middleware allows to update the devtools panel when an action is dispatched by the host app, or dispatch actions in the app when the devtools panel is used.

Let's see how to add the redux-tools to a redux app:
<pre class="lang:js decode:true">// This is the function that will create our store.
// It is compound by middleware functions.
// In our case, just the devTool one.
const finalCreateStore = compose(
  devTools()
)( Redux.createStore );

// Compose the big function that will handle all the
// state changes, `reducers` is just a list of functions
const reducer = combineReducers(reducers);

// Create the only store.
// Actions will be intercepted by the middleware
// Updates will be handled by the reducers
const store = finalCreateStore(reducer);

/**
 * Root component that will be updated on state changes.
 */
export default class Root extends Component {
  render() {
    return (
      &lt;div&gt;
        &lt;Provider store={store}&gt;{() =&gt; &lt;App /&gt;}&lt;/Provider&gt;
        &lt;DebugPanel top right bottom&gt;
          &lt;DevTools store={store} monitor={LogMonitor} /&gt;
        &lt;/DebugPanel&gt;
      &lt;/div&gt;
    );
  }
}</pre>
If we have a look at the app store, we will find the devtools store in it.
<pre class="lang:js decode:true">// store = {
// 	// this is the devtools store for redux-devtools next,
// 	// with React 0.14 support
// 	liftedStore:{ ... },
// 	...
// }</pre>
The strategy to use redux-devtools in a non-redux application is creating a store like if we were in a redux app, and apply our middleware and the devtools one to it. That way we will make the devtools believe that they are in a redux application. That's it,<strong> your Flux application must dispatch redux actions whenever an action is dispatched</strong>, and it also <strong>must listen to devTools actions in order to update its own state</strong>.
<h3>Creating middleware that communicates with redux-devtools</h2>
<a href="https://medium.com/@arqex/react-the-simple-way-cabdf1f42f12" target="_blank">Freezer way of flux</a> is much simpler than redux explanation above. A freezer object is a store that makes easy to update any piece of data in it, creating a new immutable state on every update. Everytime the state is updated, an update event is triggered in the freezer object. The freezer object is also a event hub, it is possible to trigger or listen any event on it, so if we use these events instead of traditional flux actions, we have a complete system to create Flux applications.

Following the strategy mentioned before, to make a freezer app work with redux-devtools we need to dispatch a redux action on any event triggered in the freezer store. Also, we need to reconstruct the freezer state when some action is dispatched in the devTools store. Let's have a look at how we can achieve this, fist of all, how to include redux-devtools in our freezer app:
<pre class="lang:js decode:true">// Create a freezer store
var FrezerStore = new Freezer({});
const store;
FrezerStore.on('afterAll', function( eventName ){
	// We don't dispatch if the flag is true
	if( this.skipDispatch )
		this.skipDispatch = 0;
	else {
		// Every argument but the first one is the reaction
		// input, so pass them to the action as arguments.
	
		var args = [].slice.call( arguments, 1 );

		// Dispatch an action in the store
		store.dispatch({ type: reactionName, args: args });
	}
});

// Create a redux store to make the devTools
// believe that is working within a redux app
const finalCreateStore = Redux.compose(
	// We will create a middleware to hijack
	// devtools actions
	FreezerMiddleware( State ),
	DevTools.devTools()
)( Redux.createStore );

store = finalCreateStore(combineReducers(reducers));

/**
 * Root component including devtools
 * and refreshing on state change
 */
export default class Root extends Component {
  render() {
    return (
      &lt;div&gt;
      	&lt;App state={ State.get() } /&gt;
      	// Add the panel to our Freezer app
			&lt;DebugPanel top right bottom&gt;
			 &lt;DevTools store={store} monitor={LogMonitor} /&gt;
			&lt;/DebugPanel&gt;
      &lt;/div&gt;
    );
  }
  componentDidMount() {
  	Store.on('update', () =&gt; this.forceUpdate());
  }
}</pre>
In the code, we create a redux store to make redux-devtools believe that it is in a redux application. Then, freezer's <code>afterAll</code> event is listened to transform all the freezer events in redux actions. Just with this, we will see how every interaction with our freezer app will be reflected in the devtools panel.

To update freezer's state when we interact with the devtools we have added the <code>FreezerMiddleware</code> function to redux's middleware stack. It works as follows:
<pre class="lang:js decode:true">var ActionTypes = {
	INIT: '@@INIT',
	PERFORM_ACTION: 'PERFORM_ACTION',
	TOGGLE_ACTION: 'TOGGLE_ACTION'
};

function FreezerMiddleware( State ){
	return function( next ){
		// We will be ignoring any reducer or state we may receive
		// and we will use ours instead
		return function FreezerStoreEnhancer( someReducer, someState ){
			// The comitted state will be the state inside devTools store
			var commitedState = State.get();

			// We are going to create our own reducer and ignore
			// any reducer passed to the store, because freezer
			// is the one that decide how the state is going to be after
			// an update
			var reducer = function( state, action ){
				// init action is triggered when the devtools
				// start or is recovered from the localStorage
				if( action.type == ActionTypes.INIT ){
					// Just sync freezer's state
					State.set( state || commitedState );
				}
				// perform an action only happens on an action
				// from outside the devTools that already have
				// been triggered in freezer
				else if( lastAction != ActionTypes.PERFORM_ACTION ) {
					// When the devtools dispatcha an action we
					// need to add a flag to our freezer store to now
					// enter in a infinite loop dispatch&lt;-&gt;trigger
					State.skipDispatch = 1;

					// Synch freezer's store with the action dispatched
					// by the devtools
					State.trigger.apply( State, [ action.type ].concat( action.arguments || [] ) );
				}

				// The only valid state is freezer's one,
				// so we return it
				return State.get();
			};

			// Pass our reducer to the next middleware (devTools one)
			// to get the store with devTools modification;
			var store = next( reducer );

			// Now the store has the liftedStore inside, the one used by
			// the devTools
			var dtStore = store.liftedStore;

			// Cache the original devTools dispatch method
			var toolsDispatcher = dtStore.dispatch;

			// Override devTools store's dispatch
			dtStore.dispatch = function( action ){
				// this is happening before the action
				// reaches the reducers
				
				// Store the action type to be read
				// in the reducer
				lastAction = action.type;

				// We only act when some action in the devTool is toggled
				if( action.type == ActionTypes.TOGGLE_ACTION ){

					// Get all the computed states stored in the devTools
					var states = dtStore.getState().computedStates;
					// And select the previous one to the one toggled
					var nextValue = states[ action.id - 1].state;

					// Sync freezer state with that devtools state
					// Devtools will reconstruct all the remaining steps
					// dispatching actions that will be captured by our
					// reducer
					State.set( nextValue );
				}

				// Call the devtools dispatch method, work as usual
				toolsDispatcher.apply( dtStore, arguments );

				return action;
			};

			return store;
		};
	};
}</pre>
Lot of code! I have tried to comment it well, but there are some things that you must know about the devtools store to fully understand it.
<ul>
	<li><code>PERFORM_ACTION</code> is dispatched by the devtools when a new action has happened in the app, in order to add it to the devtools. We won't use this kind of actions to trigger freezer events, because they are the product of the freezer events.</li>
	<li><code>TOGGLE_ACTION</code> is dispatched by the devtools when an action is activated/deactivated in the devtools panel. We need to reconstruct freezer's state based on these kind of actions.</li>
	<li>All the states generated by actions are stored in the devtools and you can find any of them using the <code>id</code> included in the devtool action.</li>
	<li>When an action is toggled, devtools set its own state to the state previous to that action dispatching. After that, it dispatches all the enabled actions that were in the devtools after the toggled action, so the state is reconstructed as if action was toggled.</li>
</ul>
There are two main points in this code
<ul>
	<li>We replace the devtools dispatcher to get prepared to the changes that will be produced by the devtools.</li>
	<li>We create a reducer that will modify freezer's state according to devtool actions and return the updated freezer's state. That state is the one that will be stored by the devtools as the result of its action.</li>
</ul>
<h3>What I have learned</h2>
I made this exercise to get some tools for freezer, but I have learned a lot about redux with it. I can understand now why redux is used by so many devs. It is a really flexible system that can adapt to any project and solves app state management in a very elegant way. I will continue using freezer in my React apps though, both solutions are very similar in concept but Freezer apps need much less boilerplate code and make easier to update big tree states.

I feel that redux-devtools can be used without much hassle by any Flux library that has one dispatcher or entry point for state change, since the communication can be created point to point between both dispatchers. In Flux implementations with multiple stores and dispatchers the things get more complicated, but I think it would be possible to create a mechanism to know what store to update on a devtool change.

If you are thinking to create a middleware to make your flux library work along with redux-devtools these are some nice links for you:
<ul>
	<li><a href="https://github.com/arqex/freezer-redux-devtools" target="_blank">The full implementation of the freezer adapter for redux-devtools</a>.</li>
	<li>Adding redux to your app is not even needed if you use <a href="https://github.com/zalmoxisus/redux-devtools-extension" target="_blank">chrome's redux-devtools extension</a>.</li>
	<li><a href="http://rackt.org/redux/docs/introduction/index.html" target="_blank">Redux documentation</a>. Read reducer and middleware docs is a must.</li>
</ul>