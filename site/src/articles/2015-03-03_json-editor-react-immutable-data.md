---
slug: "/articles/json-editor-react-immutable-data"
type: "article"
date: "2015-03-03"
source: ""
title: "A JSON editor with React and Immutable data"
link: "/991/json-editor-react-immutable-data"
---

There is a big hype about immutable data and <a href="http://facebook.github.io/react/index.html" target="_blank">React.js</a> after the first react conference hold in SF, but it is not easy to find examples on how to use them together to get a great development experience. Today we are going to build a JSON editor using them to show all the benefits they provide.

Our JSON editor will be simple, it will let us:
<ul>
	<li>Adding, removing and editing attributes from our JSON object.</li>
	<li>It will store arrays, hashes and strings.</li>
	<li>It will highlight modified nodes.</li>
	<li>It will be ugly, no time for styling, sorry :)</li>
</ul>
<a class="jsbin-embed" href="http://jsbin.com/dujatu/2/embed?output">JS Bin</a>
<script src="http://static.jsbin.com/js/embed.js"></script>

<a href="http://jsbin.com/dujatu/2/edit?js,output" target="_blank">You can play with the code in the JSBin</a>. Don't you like it? I love it :D
<h3>Why immutable data?</h2>
The reason of using immutable data in our apps is to change the way we think about building web applications.

Our React.js component won't be able to update the data that it receives directly. Instead of that, it will request the changes, new data will be generated from the top and passed down through the parent components until our component receives it. If the data has changed, we re-render the component, otherwise we don't. That's sounds a lot like <a href="http://facebook.github.io/flux/" target="_blank">Flux</a> way of doing things recommended by Facebook when using React.js, with the data always flowing in the same direction.

Working that way, our UI can be completely data driven. <strong>We don't need to think about what to update in our views</strong> when some event happens: events will update the data, and <strong>our views will be just a representation of that data</strong>. Our code will be rather 'reactive' than 'proactive' and, since there will be less parts of the application where the data is updated, it will much easier to understand.

Immutable data also makes easier to check when a component should be updated. If the data can't change, just a direct comparison is needed to know if it is different to the current one:
<pre class="lang:default decode:true crayon-selected">componentShouldUpdate: function( newProps ){
  return this.props.data != newProps.data;
}</pre>
That function will save a lot of processing and reconciliation between react's virtual DOM and the real one, boosting our app performance. You can create your own <code>componentShouldUpdate</code> function like the one above or use the <a href="http://facebook.github.io/react/docs/pure-render-mixin.html" target="_blank">PureRenderMixin</a> that comes with react addons.
<h3>Understanding the JSON editor</h2>
Basically, our editor will be have 5 different components:

<a href="http://arqex.com/wp-content/uploads/2015/02/components.png"><img class="aligncenter size-full wp-image-994" src="http://arqex.com/wp-content/uploads/2015/02/components.png" alt="components" width="290"  /></a>

An <code>Attribute</code> is each object property or array element that our JSON data has. As I said before, the <code>Attribute</code>s can store 3 types of data: strings, objects and arrays, so every type has a component to edit its value properly. <code>AttributeCreator</code>s will let the user add new attributes to our arrays and objects.
<h3>Introducing freezer.js</h2>
Talking about immutable data in javascript is talking about <a href="http://facebook.github.io/immutable-js/" target="_blank">Immutable.js</a>, but today we will use <a href="https://github.com/arqex/freezer" target="_blank">Freezer.js</a> a simpler alternative that brings some benefits:
<ul>
	<li>It is lightweight (7KB minified).</li>
	<li>It uses objects and arrays to store the data, so we almost don't need to learn new methods to start using it.</li>
	<li>It emits events on data updates out of the box, so we can use them to refresh our app.</li>
</ul>
Creating and using a Freezer store is easy:
<pre class="lang:js decode:true">// Let's create a store
var store = new Freezer({
    a: {x: 1, y: 2, z: [0, 1, 2] },
    b: [ 5, 6, 7 , { m: 1, n: 2 } ],
    c: 'Hola',
    d: null // It is possible to store whatever
});

// Get the immutable data
var frozen = store.get();

// Read the data
frozen.c; // Hola
frozen.a.x; // 1
frozen.b[3].n // 2

// But the data is frozen and it is not possible
// to update it directly
frozen.c = 'Adios';
frozen.c; // Hola
</pre>
The idea behind Freezer.js is<strong> having one main store for our application</strong>. Every component receive its part of the store from the props, and that part of the store is immutable so the component can't edit it directly. The good news are that Freezer's store nodes have with them the tools needed by the component to request updates for that piece of the data.

Array and object nodes in a frozen store have methods like <code>set</code> to update the data, objects have <code>remove</code> to delete some attribute or it is possible to use methods like <code>push</code> or <code>splice</code> on the array nodes. But those methods don't udpate the nodes directly, they request the update to the store and it is the store who creates a new immutable object with the data updated, starting from the root of the tree.

Imagine we have a store with the following structure and we update some data on it
<pre class="lang:js decode:true">var store = new Freezer({
  a: {d: 1},
  b: 2,
  c: {e:3, f: {h: 4 ,i: 5}, g:6}
});

// Get the immutable data
var frozen = store.get();

// Somewhere inside a component an update
// is requested
var updated = frozen.c.f.set({h: 8});

// the method return the new frozen object
// for the domain;
updated; // {h: 8, i: 5}
store.get().c.f === updated; // true

// But the original one has not changed
// because it is immutable
frozen.c.f; // {h: 4 ,i: 5}</pre>
Instead of updating the node, Freezer creates a new data tree starting from the top. The nodes in the update path are new, but the rest are reused, so they won't trigger a UI refresh in the components that use non-modified nodes.

<a href="http://arqex.com/wp-content/uploads/2015/02/trees.png"><img class="aligncenter size-medium wp-image-1008" src="http://arqex.com/wp-content/uploads/2015/02/trees-300x150.png" alt="Trees" width="300"  /></a>

Since the store is updated from the top, the UI refresh start from the top component passing the updates to the children via props. But how do I know when a update happens? In the case of Freezer, the updates trigger an <code>update</code> event in the store that we can use to refresh the UI. Here an example
<pre class="lang:js decode:true">var store = new Freezer( {a:1, b:2} );

// A dumb component that refresh on data change
var DumbComponent = React.createClass({
	render: function(){		
		return &lt;div&gt;{this.props.frozen.a} - {this.props.frozen.b}&lt;/div&gt;;
	},
	componentDidMount: function(){
		var me = this;

		// Whenever the data change we pass the new one
		// to the props
		store.on('update', function(){
			me.setProps({ frozen: store.get() });
		});
	}
});

// Render our awesome component
React.render( &lt;DumbComponent frozen={ store.get() } /&gt;, document.body );</pre>
That's the only event listening that we need to make our app refresh on a store update. Using freezer, we stop thinking about what to update in the UI when something happens and we start thinking about what to render in our components depending on the props they receive.
<h3>Creating JSON editor top component</h2>
As I explained before we need a top component to refresh the props using the <code>setProps</code> method. In React.js components, component's <code>setProps</code> method can only be used by the top component and it won't work if we use it in a child. It is the way that React.js uses to encourage passing props down to the tree.

In our top component we will add a JSON previewer to check how our changes are applied to the store. The initialization code is like this:
<pre class="lang:js mark:21,31,44 decode:true">/****************
JSON data to edit
*****************/
var json = {
	hola: 'amigo',
	adios:'enemigo',
	obj: { hi: 'man', bye: 'dude' },
	arr: ['a', 'b', {c: 1}, 'd']
};

// Create a Freezer store
var frozen = new Freezer( { json: json });

// Our top component
var DocEditor = React.createClass({

	render: function(){
		var store = this.props.store;
		return (
			&lt;div className="docEditor"&gt;
				&lt;ObjectAttribute value={ this.props.store.json } original={ this.props.original.json }/&gt;
				&lt;pre&gt;{ JSON.stringify( this.props.store.json, null, '  ')}&lt;/pre&gt;
			&lt;/div&gt;
		);
	},

	componentDidMount: function(){
		var me = this,

			// Let's create a listener to update the store on change
			listener = this.props.store.getListener()
		;

		// We are going to update the props every time the store changes
		listener.on('update', function( updated ){
			me.setProps({ store: updated });
		});
	}
});

/****************
Start the UI
*****************/
React.render(&lt;DocEditor store={ frozen.get() } original={ frozen.get() } /&gt;, document.body);</pre>
Our top component receives the immutable data directly as its store prop. Instead of listening to the Freezer store directly, we create a listener for the immutable data itself, this way the Freezer store doesn't need to be exposed to the component, just its data. In a Freezer store you can create a listener at any array or object node using <code>getListener</code> and it will trigger update events when the node changes.

As you can see, we will keep a copy of the original JSON structure in order to highlight the nodes that have been updated.

I will explain the <code>ObjectAttribute</code> later, but now we need to know that we can use the component that represents an Object in our editor to hold the JSON editor, because a JSON structure is a javascript object itself.
<h3>Attributes</h2>
A JSON object is a tree that can have infinite levels of depth. Every node of the tree that is not a leaf, can be an <code>Array</code> or an <code>Object</code>, and their children have two main parts: a key and a value.

Our <code>Attribute</code> component will represent any child for an <code>Object</code> or <code>Array</code>. If it is a child of an <code>Object</code>, the key would be any string, and if the <code>Attribute</code> component is child of an <code>Array</code>, its key will be an integer that corresponds to the index of the value in the array:
<pre class="lang:js decode:true">// If we have this array
var arr = [ 'a', 'b' ];

// It will be composed by two attributes
&lt;Attribute attrkey="0" value="a" /&gt;
&lt;Attribute attrkey="1" value="b" /&gt;


// If we have this object
var ob = { first:'a', second: 'b' };

// It will be composed by two attributes
&lt;Attribute attrkey="first" value="a" /&gt;
&lt;Attribute attrkey="second" value="b" /&gt;</pre>
Depending on the value, the attribute will create a different component to edit it. Our editor supports <code>Objects</code>, <code>Arrays</code> and <code>Strings</code> so the <code>Attribute</code> component will render <code>ObjectAttribute</code>s, <code>ArrayAttribute</code>s and <code>StringAttribute</code>s. Since an <code>ObjectAttribute</code> or <code>ArrayAttribute</code> can have again multiple <code>Attribute</code>s inside we can handle an infinitely nested structure.

The code of our attribute component is the following.
<pre class="lang:js decode:true">var Attribute = React.createClass({
	render: function(){
		// createAttribute helper will return the proper Component depending on the value of our attribute
		var typeAttribute = createAttribute( this.props.value, this.props.original, this.props.parent, this.props.attrkey ),
			modifiedClass = this.props.value == this.props.original ? '' : ' modified',
			className = 'hashAttribute' + modifiedClass
		;

		return (
			&lt;div className={className}&gt;
				&lt;a href="#" className="attrRemove" onClick={ this.handleRemove }&gt;[x]&lt;/a&gt;
				&lt;span className="attrName"&gt;{this.props.attrkey }:&lt;/span&gt;
				&lt;span className="attrValue"&gt;{ typeAttribute }&lt;/span&gt;
			&lt;/div&gt;
		);
	},

	handleRemove: function( e ){
		e.preventDefault();
		if( this.props.parent.constructor == Array )
			this.props.parent.splice( this.props.attrkey, 1 );
		else
			this.props.parent.remove( this.props.attrkey );
	},

	shouldComponentUpdate: function( nextProps, nextState ){
		return nextProps.value != this.props.value || 
			nextProps.parent != this.props.parent
		;
	}
});</pre>
The <code>Attribute</code> component will receive the original value and we will use it to know if the node has been modified. This is the first place where we got a benefit from using immutable data, because we don't need to deep check if there is something in our attribute that has changed. Our data is immutable and we can do <code>this.props.value == this.props.original</code> to check if it has changed, no matter how deep is the structure, and add a class to our markup to highlight it.

Also, the parent node is passed as a prop to the Attribute component in order to be able of removing the attribute or update its value. This is a nasty way of update the node, <code>Attribute</code> scope is just the attribute and receiving the parent node we are allowing the <code>Attribute</code> to change data that is out of its scope. I will leave this example as it is for sake of simplicity, but ideally the updates should be done by the parent. To let the parent make the update, you can use <a href="http://facebook.github.io/react/tips/communicate-between-components.html" target="_blank">callbacks</a> or my preferred method, <a href="http://arqex.com/1028/better-flux-dom-events" target="_blank">events</a>.

As you can see in the example, <code>Attribute</code> is responsible of remove itself from the store and it uses Freezer methods to do so. Using <code>splice</code> for arrays and <code>remove</code> for objects, the component require the deletion of the attribute. The store will be then regenerated showing the results. It wasn't difficult, was it?

Usually, to update a nested structure we will handle paths to know what to update, but Freezer takes care of that for us, and since the tree is regenerated <code>Attribute</code>'s parent will refresh its child count and marked as modified automatically. Suddenly we have a lot of extra features for our editor out of the box, without writing a line of code.

If you are creating a more complex app or you want to take a more traditional Flux approach, you'd rather call an action with the frozen node as payload. That way the update is clearly triggered outside the view.

I have added also a <code>shouldComponentUpdate</code> method that will increase our UI performance. React.js DOM reconciliation is really fast and the UI would work fine without the method, but just adding that line we rest sure that not even render will be called if it is not necessary.
<h3>Adding elements to our JSON object</h2>
Now it is time to talk about non-leaf nodes. In a JSON object they can be <code>Object</code>s and <code>Array</code>s, that's why our editor will have special components for them. Nevertheless, <code>ObjectAttribute</code> and <code>ArrayAttribute</code> are very similar, they have a list of <code>Attribute</code> components and at the end they will render an <code>AttributeCreator</code> component to let the user add new elements to the node.

<code>AttributeCreator</code> is a stateful component, clicking on it will set its state to editing and it will show a type selector to add a new element to our node. If the <code>AttributeCreator</code> doesn't receive an attrkey prop ( <code>ObjectAttribute</code>s ), it will also display a text input box to let the  user define the key for the new attribute. <code>ArrayAttribute</code>s will set attrkey to the next index in order to add the element to the end of the array.

Let's have a look at the method that <code>AttributeCreator</code> uses to add elements:
<pre class="lang:js decode:true">createAttribute: function(){
	this.setState({creating: false});

	var parent = this.props.parent,
		value = typeDefaultValues[ this.state.type ]
	;

	if( parent.constructor == Array )
		parent.push( value )
	else
		parent.set(this.state.attrkey, value );
}</pre>
The same way than the <code>Attribute</code> component, <code>AttributeCreator</code> receive the parent node in order to add a new child to it ( ouch! Remember, use events or callback to fix it ). And, again, we can use Freezer immutable data to request the update using the push or set method depending if we are updating an <code>Array</code> or an <code>Object</code>. Those methods will refresh the store and the component will receive the new values.
<h3>Updating leaf nodes</h2>
I already have pointed out how our JSON editor  removes and adds elements to the store, and that is basically the function that <code>ArrayAttribute</code> and <code>ObjectAttribute</code> are designed for. Updating a leaf node is not much different, <code>StringAttribute</code> is the component that show and edit them in our editor. When editing a string, the store is updated on pressing the enter key or when the input box loses the focus, using the set method. I'd recommend to have a look at the code and check if you can fully understand it.
<h3>A bonus: Undo and redo</h2>
Undo &amp; redo feature is the most used example to show the benefits of immutable data and I couldn't resist adding it to our JSON editor. Whenever we update the store, the new tree reuses the nodes from the previous data that haven't been updated, that way it is not memory expensive to store the different states that are being generated. <a href="http://jsbin.com/hugusi/1/edit?js,output" target="_blank">Here you have the jsbin working with history support</a>.

The first thing to update in our editor to add the history capabilites is the render call to our top component method. We will pass the Freezer store to it instead of the immutable data.
<pre class="lang:js decode:true">React.render(&lt;DocEditor store={ frozen } original={ frozen.get() } /&gt;, document.body);</pre>
Freezer stores have a set method to replace the data completely and that is perfect for doing undos and redos. The idea is to save the state of the editor on every update, so we can roll back to previous states just replacing the data.
<pre class="lang:default decode:true">var DocEditor = React.createClass({
	getInitialState: function(){
		// We create a state with all the history
		// and the index to the current store
		return {
			storeHistory: [ this.props.store.get() ],
			currentStore: 0
		};
	},
  // ...
	undo: function(){
		var nextIndex = this.state.currentStore - 1;
		this.props.store.set( this.state.storeHistory[ nextIndex ] );
		this.setState({ currentStore: nextIndex });
	},
	redo: function(){
		var nextIndex = this.state.currentStore + 1;
		this.props.store.set( this.state.storeHistory[ nextIndex ] );
		this.setState({ currentStore: nextIndex });
	},
  // ...
	componentDidMount: function(){
		var me = this;

		// We are going to update the props every time the store changes
		this.props.store.on('update', function( updated ){

			var storeHistory, nextIndex;
			// Check if this state has not been set by the history
			if( updated != me.state.storeHistory[ me.state.currentStore ] ){

				nextIndex = me.state.currentStore + 1;
				storeHistory = me.state.storeHistory.slice( 0, nextIndex );
				storeHistory.push( updated );

				// Set the state will re-render our component
				me.setState({
					storeHistory: storeHistory,
					currentStore: nextIndex
				});
			}
			else {
				// The change has been already triggered by the state, no need of re-render
			}
		});
	}
  // ...
});</pre>
We have now a component state and we will let <code>setState</code> to be the one who re-renders our component instead of the <code>setProps</code> method. However our 'source of truth' will still be the store, and we will use the component state just to save the history.

As you can see in the code, undo and redo just set the <code>currentStore</code> index back and forward and set the store that is in our history. We have the 50% of all the work done with those methods to add the new feature, we just need to store new updates as new states whenever our store change to complete it. That's the part that can be seen in the <code>componentDidMount</code> method.

Voilà, a JSON editor with undo and redo buttons!
<h3>Conclusion</h2>
The greatest thing of immutable stores is that they force you to change the way you face building web applications. Your components will forget about what to update and they will focus on what to render, making easier for the developer to understand what is happening in the app. Once you start to work like this you won't go back.

Having one store to have our app data aligns really well with the idea of passing props down to child components, and it is a direct way to go if you are looking to render your app also in the server. Freezer seems to adapt perfectly to the one store paradigm because it makes easy to update nodes deep in the tree, and any update will update the parents too, so the new props will be passed from above. Probably you won't use Freezer's updating methods inside your components in a real app, it would be better to pass the nodes as action payloads to the dispatcher following a more 'traditional' Flux way.

It is possible to work in the same way with<a href="http://facebook.github.io/immutable-js/" target="_blank"> Immutable.js</a> + <a href="https://github.com/omniscientjs/immstruct" target="_blank">Immstruct.js</a>, but I feel that Freezer.js API is more agile. It uses objects and arrays to store the data and that helps when adding Freezer to any existing project, not needing heavy updates in the components.

And you? Are you already using frozen data in your apps?

&nbsp;