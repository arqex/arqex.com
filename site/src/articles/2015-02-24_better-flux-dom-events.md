---
slug: "/articles/better-flux-dom-events"
type: "article"
date: "2015-02-24"
source: ""
title: "A better Flux with DOM events"
link: "/1028/better-flux-dom-events"
---

I have been <a href="https://github.com/arqex/curxor/issues/1" target="_blank">discussing a lot lately with smart guys</a> about what is the best way of organizing your application using <a href="http://facebook.github.io/react/docs/getting-started.html" target="_blank">React.js</a> and I would like to share what I have learnt.

Facebook released react two years ago saying <em>"Hey guys, here you have the V for your MVC web apps!"</em> and it turned out to be a great V. But how should I organize the rest of the app? People tried to mix react views with backbone models then to try to fill the gap then, but those solutions were a bit overkilling.

Last year React guys appeared again to say <em>"Hey guys, use <a href="https://github.com/facebook/flux" target="_blank">Flux</a>, your data should flow in just one direction"</em>. The second commandament was really good too. Receiving the props from above and reducing component states reduce the complexity of developing web apps. But it made grow more questions in developers' heads: where should I put the code to fetch data from the server? How can I handle async actions? How can a child component communicate with its parent?
<h3>The rise of Flux libraries</h2>
Whenever questions are made, people try to answer their own way, and a lot of custom flux implementations started to appear: <a href="http://fluxxor.com/" target="_blank">Fluxxor</a>, <a href="https://github.com/spoike/refluxjs" target="_blank">Reflux</a>, <a href="https://github.com/yahoo/fluxible" target="_blank">Fluxible</a>, <a href="http://martyjs.org/" target="_blank">Marty</a>... Even I released my own implementation: <a href="https://github.com/arqex/fluxify" target="_blank">Fluxify</a>.

<strong>All of them do the same and all of them are incompatible with the others</strong>. Once you start using one implementation, your react components get highly coupled to that library, and it is not easy to switch from one to another.

But the way that React.js components are defined encourages to reuse and encapsulate them. <strong>Why can't we use them like if they were web components</strong>?
<h3>Events to the rescue</h2>
Flux idea is great, <a href="https://vimeo.com/3191188" target="_blank">flow like water my friend</a>. But the way that Facebook propose to flow is pushing the water with the hand. <strong>Dispatching actions from the components is too imperative</strong>, our views need to say <em>"Hey app, something happened"</em> instead of <em>"Hey app, do something"</em>.

Events are the natural way of saying that something has happened in web pages. They have been used succesfully by HTML elements for years and it is the recommended way for the a web component to communicate with the world outside its shadow DOM. And the best part of events is that they are shipped by every browser, so why not to use them with react.js?
<h3>Flux with DOM events</h2>
It would be great to use React's synthetic event system, but it has an event set defined and it is not possible to use it to emit custom events.

So let's use DOM events. Some of you will think that DOM and React are not a good match, but this has nothing to do with fast rendering,<strong> it is about communicate user interaction to our app</strong>.

<strong>DOM events will replace Flux dispatcher</strong> and actions will react ( oops! I used the r word! ) to those events in order to update the stores. <strong>They should be rather called reactions</strong>.

So instead of having the traditional Flux diagram

<a href="http://arqex.com/wp-content/uploads/2015/02/traditionalFlux.png"><img class="aligncenter size-full wp-image-1033" src="http://arqex.com/wp-content/uploads/2015/02/traditionalFlux.png" alt="traditionalFlux" width="300"  /></a>

Using events we have something simpler, aligned with some of the most popular flux implementations that don't implement a dispatcher either.

<a href="http://arqex.com/wp-content/uploads/2015/02/eventFlux.png"><img class="aligncenter size-full wp-image-1034" src="http://arqex.com/wp-content/uploads/2015/02/eventFlux.png" alt="eventFlux" width="300"  /></a>

Notice that the line that the line that binds the view with the reactions is dashed. The graph want to remark that <strong>Views are independent from the reactions</strong>, they will emit events but <strong>they don't know anything about reactions</strong>.

We need also a <strong>hub</strong> where our reactions will be listening to the events. I think that <strong>the document object would be perfect</strong>. The events will be emitted by the DOM node of our components, so the reactions will wait for the events to bubble up through the DOM until they reach the document object, starting the reactions.

The reactions can be coordinated using events too. <strong>A reaction can emit new events on finishing, starting new reactions</strong>, so we don't need the dispatcher's <code>waitFor</code> method anymore. In this eventful system, async reactions can work the same way than sync ones, triggering events on finishing. At this point, if we have several reactions dependant from others you can use event stream libraries like <a href="https://github.com/Reactive-Extensions/RxJS" target="_blank">RxJS</a> or <a href="https://baconjs.github.io/" target="_blank">Bacon.js</a> to make easier event handling if you want ( RxJS and React.js at the same time! ).
<h3>A simple example</h2>
Let's make a simple counter with a button to increase.
<pre class="lang:js decode:true">// A simple store
var store = {count: 0};

// Let's create a counter component that we can use
// in all of our projects
var Counter  = React.createClass({  
    render: function(){
        return (
            &lt;div className="counter"&gt;
                &lt;span&gt;{this.props.count}&lt;/span&gt;
                &lt;button onClick={ this.onIncrease }&gt;Increase&lt;/button&gt;
            &lt;/div&gt;
        );
    },
    onIncrease: function(){
        // Hit the button will just emit an event
        var e = document.createEvent('Event');
        e.initEvent('counter', true, true);
        
        this.getDOMNode().dispatchEvent( e );
    }
});

// Our reaction
var increaseReaction = function( e ){
    store.count++;

    // The ideal store would trigger a change event,
    // our store is a common object, so we are going to 
    // refresh the page for demonstration purposes
    React.render( &lt;Counter count={ store.count } /&gt;, document.body );
}
document.addEventListener( 'counter', increaseReaction, false );

React.render( &lt;Counter count={ store.count } /&gt;, document.body );</pre>
<a href="http://jsbin.com/rudabafefa/2/edit?html,js,output" target="_blank">You can see it working in this JSBin</a>.
<h3>Communication children-parent</h2>
Using DOM events also make easier the communication between a parent its children components. Sometimes, it is handy that the parent manages the state of its children and, to do so, Facebook recommends to <a href="http://facebook.github.io/react/tips/communicate-between-components.html" target="_blank">pass a callback to the child component</a>. It is a messy solution, it generates some boilerplate code to store the callbacks and makes you develop your child components depending on functions that live outside them.

Since we have eventful components now, our parent component can now listen to children events to coordinate them, and the children will just execute its own code. Let's create a selectable list:
<pre class="lang:js decode:true">// A simple store
var store = {count: 0};

// Let's create a counter component that we can use
// in all of our projects
var Item  = React.createClass({  
    render: function(){
      var className = 'item';
      if( this.props.selected )
        className = ' selected';
       
      return (
        &lt;div className={ className }&gt;
        &lt;span&gt;Item { this.props.index } &lt;/span&gt;
        &lt;button onClick={ this.onSelect }&gt;Select&lt;/button&gt;
        &lt;/div&gt;
      );
    },
    onSelect: function(){
    
        // Hit the button will just emit an event
        var e = document.createEvent('Event');
        e.initEvent('select', true, true);
        
        // Add item index to the event
        e.detail = this.props.index;
        
        this.getDOMNode().dispatchEvent( e );
    }
});

var List = React.createClass({
  getInitialState: function(){
    // The list will store the selected state
    return {selected: -1}
  },
  render: function(){
    var items = [],
      i = 0
    ;
    
    for(;i&lt;3;i++){
      items.push( 
        &lt;Item key={ i } index={ i } selected={ i == this.state.selected } /&gt; 
      );
    }
    
    return &lt;div className="list"&gt;{ items }&lt;/div&gt;;
  },
  componentDidMount: function(){
    var me = this;
    
    // Detect if some child has been selected
    this.getDOMNode().addEventListener( 'select', function( e ){
      me.setState({ selected: e.detail });
    });
  }
});

React.render( &lt;List /&gt;, document.body );</pre>
<a href="http://jsbin.com/kemufabilo/1/edit?html,js,output" target="_blank">This is the list working in a JSBin</a>.

The selected item state is stored in the list instead of in the items, that way it is easy to have just one item selected at a time.
<h3>Conclusion</h2>
Using events for the communication of your components has benefits that can be spotted at the first use. It is not just making our components independent, moving the application logic to the reactions creates a clear C for the MVC pattern, taking it out from the Views and the Model, enforcing a clear separation of concerns.

If you liked the article, I have created a quick helper called <a href="https://github.com/arqex/flux-reactions" target="_blank">flux-reactions</a> to reduce boilerplate of using events on your components, every contribution is welcome!

If you are looking for a great Model to complete the MVC, I would recommend <a href="https://github.com/arqex/freezer" target="_blank">Freezer</a>, because I am the author, but any other immutable store would make your development fly.