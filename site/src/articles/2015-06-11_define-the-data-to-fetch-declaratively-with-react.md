---
slug: "/articles/define-the-data-to-fetch-declaratively-with-react"
type: "article"
date: "2015-06-11"
source: ""
title: "Define the data to fetch in a declarative way with React"
link: "/1058/define-the-data-to-fetch-declaratively-with-react"
---

Fetching data in Flux applications has always been a controversial point. Should it be handled inside the stores? Should we have asynchronous actions to get it?

In the last React conference we knew <a href="http://facebook.github.io/react/blog/2015/02/20/introducing-relay-and-graphql.html" target="_blank">how Facebook fetches the data in their react applications</a>. Basically they <em>created </em>a language to compose fetch queries called <strong>GraphQL</strong>. Their servers understand GraphQL queries and return just the requested data.

It is really interesting how they create the GraphQL queries. <strong>Every component define their data dependencies declaratively</strong>. Something like this:
<pre class="lang:js decode:true">var FriendInfo = React.createClass({
    statics: {
        queries: {
            user: function(){
                return graphql `User { name, mutual_friends { count } }`;
            }
        }
    },
    render: function() { ... }
});</pre>
Before the component is mounted, facebook app fetches the data that it needs and inject it as props, so <code>FriendInfo</code> can access to the user data just accessing to <code>this.props.user</code>. This is done automatically thanks to a framework that they created called <strong>Relay</strong>, no special development (actions, actionHandlers... ) is needed when creating a new component to fetch the needed data.

GraphQL, Relay... sounds really complex, and they are not opensourced yet. Is it possible to have the same workflow nowadays with our current tools? Sure, let's make a small app that works this way:

* <a href="http://development.react-declarative-fetching.divshot.io/" target="_blank">Here the app finished and working</a>.
* <a href="https://github.com/arqex/react-declarative-fetching" target="_blank">Here its source code at github</a>.
<h3>What do we want?</h2>
We want to <strong>define data dependencies</strong> for the components <strong>declaratively</strong> and <strong>inside the components themselves</strong>, the same way that is done with Facebook's Relay.

Imagine we have a <code>Posts</code> component that lists all the posts in our blog. We need to fetch all the posts of the blog for our component, so it will be like this:
<pre class="lang:js decode:true">var Posts = React.createClass({
    statics: {
        deps: function(){
            return { posts: '/posts' };
        }
    },

    render: function() {
        return (
            &lt;div className="postsPage"&gt;
                &lt;h2&gt;Posts&lt;/h2&gt;
                &lt;Table rows={ this.props.posts } /&gt;
            &lt;/div&gt;
        );
    }
}</pre>
We have defined that the component will need the data from the API route <code>/posts</code>.  That data should be fetched automatically, so the component can access to it through <code>this.props.posts</code>.

This declaration is inside a static method in the react component because it will be called before the component is mounted, Even before it is instantiated, so it is not possible to call <code>this</code> inside the method.

Since we don't have a GraphQL server, we are going to use a REST API. You probably would prefer to create an abstraction for fetching your data models, and not to use URLs inside the components, but for the sake of the demo I will leave it like this, keeping it easy to understand.

In every step, I will explain the tools I have used to make my development easier:

* <a href="https://github.com/typicode/jsonplaceholder" target="_blank">jsonplaceholder</a> let us to build our test REST service in just 30 seconds.
* <a href="https://github.com/arqex/react-json-table" target="_blank">react-json-table</a> will format the post list for us.
<h3>Reading component's dependencies</h2>
Declaring the dependencies is easy, but we need to read and fetch them before mounting the component. That's sounds much harder. For doing so our app will use <a href="https://github.com/rackt/react-router" target="_blank">react-router</a>, but it is possible to follow the same strategy using other wrappers.

The app will be navigable, every time the user navigates the URL will change and react-router will load a different component for every URL. When the router is loading the component, it is the perfect time to read, fetch and inject the dependencies.

We will have routes to manage <em>posts</em> and <em>users</em>:
<pre class="lang:js decode:true">var routes = (
	&lt;Route name="app" path="/" handler={ App } location="history" &gt;
		&lt;DefaultRoute name="home" handler={ Home } /&gt;

		&lt;Route name="posts" path="/posts" handler={ Posts } /&gt;
		&lt;Route name="post" path="/post/:id" handler={ Post } /&gt;
		&lt;Route name="users" path="/users" handler={ Users } /&gt;
		&lt;Route name="user" path="/user/:id" handler={ User } /&gt;

    	&lt;NotFoundRoute name="notfound" handler={ Home } /&gt;
	&lt;/Route&gt;
);</pre>
In case you are not familiar with react-router, the code above defines the routes for our application. The main route <code>/</code> is handled by the <code>App</code> component, and inside it, other components will be loaded depending on the current URL. For the route <code>/posts</code> the component <code>Post,</code> that we defined before, will be loaded inside <code>App</code>. Let's have a look at the <code>App</code>'s <code>render</code> method to understand how it works:
<pre class="lang:js decode:true">var App = React.createClass({
	contextTypes: {
		// Router available through this.context.router
		router: React.PropTypes.func
	},

	render: function() {
		return (
			&lt;div&gt;
				&lt;Header /&gt;
				&lt;div className="content wrapper"&gt;
					&lt;RouteHandler /&gt;
				&lt;/div&gt;
			&lt;/div&gt;
		);
	}
}</pre>
<code>RouteHandler</code> is a component provided by react-router. It will display the component for the route that matches the current URL, if we visit the route <code>/posts</code> it will print the <code>Posts</code> component out, or if we are in <code>/users</code> it will show the <code>Users</code> component.

Our tasks are clear in order to load the dependencies:
<ul>
	<li>Detect URL changes.</li>
	<li>Know what is the component that <code>RouteHandler</code> is going to show and check its dependencies.</li>
	<li>Fetch their dependencies and inject them into the component.</li>
</ul>
We are going to add state to our <code>App</code> component to control this process:
<pre class="lang:js decode:true">var App = React.createClass({
	getInitialState: function(){
		return { 
			// Last URL loaded
			currentPath: false, 
			// Whenever it is fetching dependencies
			loadingDeps: false,
			// Fetched data for the current route component
			handlerDeps: {} 
		};
	}, ...
}</pre>
When I introduced the <code>App</code> component before, I defined a <code>contextType</code> for the router. That makes the <code>router</code> object accessible inside the <code>App</code> component using <code>this.context.router</code> and, thanks to it, we can check if there has been route changes easily . We will check if there has been any URL change everytime that the <code>App</code> component updates:
<pre class="lang:js decode:true">// Inside App component....
	isURLChanged: function(){
		return this.context.router.getCurrentPath() !== this.state.currentPath;
	},
	componentWillMount: function(){
		if( this.isURLChanged() ){
			this.fetchDependencies();
		}
	},
	componentWillReceiveProps: function(){
		if( this.isURLChanged() ){
			this.fetchDependencies();
		}
	}</pre>
Now it is clear when we are going to fetch the dependencies, but we need to know what data to fetch and, to do so, we will need what is the component that <code>RouteHandler</code> will load.

The <code>router</code> object has the <code>getCurrentRoutes</code> method that return an Array with all the routes that matches the current URL. So if we visit <code>/posts</code>, <code>this.context.router.getCurrentRoutes()</code> will return something like <code>[{route:'app'},{route:'posts'}]</code>. Knowing this we can get what component, AKA route handler, will be loaded:
<pre class="lang:js decode:true">// Inside App component
	getRouteHandler: function(){
		var currentRoutes = this.context.router.getCurrentRoutes(),
			i = 0,
			handler = currentRoutes[0]
		;

		// Find this component as route handler
		while( currentRoutes[ i ].handler !== this.constructor )
			i++;

		// Return the next handler, our child
		return currentRoutes[ i + 1 ].handler;
	},</pre>
Once we have the component that is going to be mounted, getting its dependencies is as easy as:
<pre class="lang:js decode:true">// Inside App component
	fetchDependencies: function(){
		var deps = this.getRouteHandler().deps();
		....
	}
</pre>
That's all, we already know what data dependencies we need to fetch from the server. In this part the only tool we have introduced is <a href="https://github.com/rackt/react-router" target="_blank">react-router</a>, them most popular router implementation for react that handles the component load and manage browser history for us.
<h3>Fetching and injecting the data</h2>
We already have access to what data the component needs, but we still need to fetch it before the component is mounted. That's not possible with the current <code>App</code>'s render method, data fetching takes time and the component is mounted as soon as the URL changes, so we need to delay the mounting to wait for the data. Let's modify our render method to do so:
<pre class="lang:js decode:true">// Inside App component
	render: function() {
		var handler = &lt;h1&gt;Loading...&lt;/h1&gt;;

		if( !this.state.loadingDeps )
			handler = React.createElement(RouteHandler, this.state.handlerDeps );

		return (
			&lt;div&gt;
				&lt;Header /&gt;
				&lt;div className="content wrapper"&gt;
				{ handler }
				&lt;/div&gt;
			&lt;/div&gt;
		);
	}</pre>
In the update we have created a cool <code>Loading...</code> message for whenever the data is being loaded instead of the <code>RouteHandler</code>. Whenever the data has been loaded we need to update <code>this.state.loadingDeps</code> and the <code>RouteHandler</code> can be mounted with its needed data already there.

We are using <code>React.createElement</code> method ( <a href="https://facebook.github.io/react/docs/glossary.html" target="_blank">see how it works</a> ) instead of JSX to render the <code>RouteHandler</code>. This way we can pass all the props to it at once, instead of writing all the JSX tag attributes.

Everything is set up just to fetch the data, so let's have a look at the <code>fetchDependencies</code> method that actually do that:
<pre class="lang:js decode:true">// Inside App component
	fetchDependencies: function(){
		// We are going to refresh the dependencies
		this.setState({ currentPath: currentPath, handlerDeps: {}  });

		var handler = this.getRouteHandler();
		// If there is nothing to fetch return
		if( !handler || !handler.deps )
			return;

		// We are going to fetch data
		this.setState( { loadingDeps: true } );

		var me = this,
			router = this.context.router,
			handlerDeps = handler.deps( router.getCurrentParams(), router.getCurrentQuery() )
		;

		this.fetch( handlerDeps )
			.then( function( deps ){
				// Update the deps to load the route handler
				me.setState({
					loadingDeps: false,
					handlerDeps: deps
				});
			})
			.catch( function( err ){
				console.log( err.stack || err );
			})
		;
	}</pre>
First thing to notice is how the state of the <code>App</code> component is updated before start fetching, in order to display the <em>loading</em> message automatically while the user waits. As you can see, as soon as the data has been fetched, we set it in <code>state</code>'s <code>handlerDeps</code> and that will refresh the <code>App</code>, rendering the component with the data.

Second, we are passing the current URL parameters and query to the static <code>deps</code> method:
<pre class="lang:js decode:true">handlerDeps = handler.deps( router.getCurrentParams(), router.getCurrentQuery() )</pre>
That will let a component different show data depending on the current URL. In our app we have a route <code>/post/:id</code> handled by the <code>Post</code> component. That route has the id parameter, and <code>Post</code> should display the details of the post that has that id, so we pass all the current parameters and even the URL query to the <code>deps</code> method in order to let the <code>Post</code> component fetch the right data.

Let's have a look at how the <code>Post</code> component uses the id URL parameter:
<pre class="lang:js decode:true">var Post = React.createClass({
	statics: {
		deps: function( params, query ){
			return { post: '/posts/' + params.id };
		}
	},

	render: function() {
		var post = this.props.post;
		return (
			&lt;div className="post"&gt;
				&lt;h2&gt;{ post.title }&lt;/h2&gt;
				&lt;Json value={ post } /&gt;
			&lt;/div&gt;
		);
	}
});</pre>
As you can see, it defines the REST endpoint to hit using the <code>id</code> parameter.

The last interesting thing of <code>fetchDependencies</code> methods is that it is using promises to know when the data has been fetched. Devs don't like promises so much lately because they hide errors and they are not cancellable. In this case they are really handy, because promises let's us fetch data from an unknown number of endpoints at the same time. We really don't care how many requests we are going to do to get all the data, we can use methods like <code>all</code> from the <a href="https://github.com/kriskowal/q" target="_blank">Q</a> promise library to get the response of all of them when they are finished.

For example, the <a href="http://development.react-declarative-fetching.divshot.io/user/5" target="_blank">User component</a> displays user's details and also the list of posts of this user. It needs to fetch data from two different REST endpoints:
<pre class="lang:js decode:true">var User = React.createClass({
	statics: {
		deps: function( params ){
			return {
				user: '/users/' + params.id,
				posts: '/posts?userId=' + params.id
			};
		}
	},

	render: function() {
		var user = this.props.user;
		return (
			&lt;div className="user"&gt;
				&lt;h2&gt;{ user.name }&lt;/h2&gt;
				&lt;Json value={ user } /&gt;
				&lt;h2 className="userPosts"&gt;{ user.name }&amp;#39;s posts&lt;/h2&gt;
				&lt;Table rows={ this.props.posts } /&gt;
			&lt;/div&gt;
		);
	}
});</pre>
Both sets of data are fetched at the same time thanks to promises and Q.

In this part, the app uses useful libraries like:

* <a href="https://github.com/arqex/react-json" target="_blank">react-json</a> is a cool component for editing JSON and creating forms that is still under development, but it has a lot of potential.
* <a href="https://github.com/kriskowal/q" target="_blank">Q</a> give us a lot of tools for handling promises.
* <a href="https://github.com/gre/qajax" target="_blank">qajax </a>is a library that make ajax requests returning promises.
<h3>What's next?</h2>
We already have the app running, was it hard?

* <a href="http://development.react-declarative-fetching.divshot.io/" target="_blank">Here the app finished and working</a>.
* <a href="https://github.com/arqex/react-declarative-fetching" target="_blank">Here its source code at github</a>.

This article doesn't intend to be really strict about how defining data dependencies must be done, it just shows that it is achievable and it will boost our productivity when creating components.

In Facebook's conf they show that their Relay framework can fetch data for components deep in the component hierarchy, all at once, a really cool feature that is not explored in this article.

Also, the approach explained in this article would make two components that request the same data at the same time receive two different copies of the data. If one updates the data, the other component would get out of sync. In frontends, it is important that when one entity is updated, all the components that depends on that entity get notified. I will tackle that matter in my next post, so stay tuned ;)