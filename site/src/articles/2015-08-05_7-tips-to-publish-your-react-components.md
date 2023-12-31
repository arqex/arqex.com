---
slug: "/articles/7-tips-to-publish-your-react-components"
type: "article"
date: "2015-08-05"
source: ""
title: "7 tips to publish your React components"
link: "/1072/7-tips-to-publish-your-react-components"
---

I have started to publish some React components I have created for my projects. The first one in get published was a simple way of display json data, <a href="https://github.com/arqex/react-json-table" target="_blank">react-json-table</a>, and recently I decided to make <a href="https://github.com/arqex/react-datetime" target="_blank">react-datetime</a> available for everybody, a date time picker. I have some more that I would like to make public soon, so stay tuned.

Creating a React component is not difficult, but I want to share some thoughts and conclusions I got in the process of making them public, trying to make them useful for as many projects as possible. I want to share them with you:
<h3>1 Keep it simple</h2>
I am sure you want to create a really flexible component to fit everybody needs, but a component that accepts 50 different props scares the developer. Try to make your component's API small, easy to understand and, what is more important:<strong> give default values to your props</strong>. Ideally, your component should work ok without any prop.

For me, as an user:
<pre class="lang:js decode:true">// I'll be glad to use your component if this works
&lt;YourComponent /&gt;

// I will probably curse you if you make me write this
// every time I use your component
&lt;YourComponent prop1={ true } prop2={ true } prop3={ true }/&gt;</pre>
<a href="https://facebook.github.io/react/docs/reusable-components.html#default-prop-values" target="_blank">Default values for props</a> really matters for usability ( not user usability, but developer one ). Even if your component accepts 100 different props, having a good set of defaults, I can start using it out of the box and learn the props I need progressivelly, without any pain.
<h3>2. Remember, it will be used by others</h2>
Most of the times, the package you want to publish was created for some specific project of yours and it works great. In order to work great in any projecs you need to have in mind:
<ul>
	<li>Classes for your markup needs to be prefixed to not to cause collision with other project's styles. If <code>YourComponent</code> render something like <code>&lt;div className="content"&gt;&lt;/div&gt;</code> your styles may mess up others' project design. Rename it to <code>&lt;div className="yc_content"&gt;&lt;/div&gt;</code> or similar.</li>
	<li>Pass component's props to the component root element, it will let your component's users add html attributes to the markup generated. You may want to filter what props not to apply to your root element in order to have the control.</li>
</ul>
<pre class="lang:default decode:true crayon-selected">class YourComponent extends React.Component{
	render(){
		// If you pass the props to the wrapper
		// of your component...
		return &lt;div {...this.props}&gt;&lt;/div&gt;;
	}
}

// I can use it like this
&lt;YourComponent 
		className="sideComponent"
		style={{ background: "red" }}
		onClick={ makeSomething } /&gt;</pre>
<ul>
	<li>Do not hardcode any text. Your component's users would like to customize those texts or translate them to their languages, so any text should be configurable.</li>
</ul>
<h3>3. User input needs to be controlled</h2>
If your component is updated by user interaction, like an input field, please create it as a <strong>controlled component</strong>. React is a data driven system, any changes by the user should update the data, and the data is the one that should update your component. I, as a developer, should be able to update the component by updating the data at any time, that's why the concept of <a href="https://facebook.github.io/react/docs/forms.html#controlled-components" target="_blank">controlled components</a> exists.

Imagine your component is a slider, to select a value between 0 and 10. I initialized it like this <code>&lt;YourComponent value="5" /&gt;</code> so the component sets its internal state to <code>5</code> and the user starts to move the slider changing the value of the slider.

Gently, you have a added a prop <code>onChange</code> to the component to let me know when the user has moved the slider, and that's cool because it allows me to know the current value. The problem arrives when I need to add a button to reset the value of your slider again to <code>5</code>. I try to re-render <code>&lt;YourComponent value="5" /&gt;</code> but since it displays its interal value, i can't reset the value. I have lost the control of the component.

Ideally, <strong>your component should always display the value passed as a prop</strong>. The developer is the one who has to update the prop <code>value</code> every time the user move the slider.

You might think that it would be a tedious work for the developer and maybe he/she never needs to control the component. If so, you can let use your component <a href="https://facebook.github.io/react/docs/forms.html#uncontrolled-components" target="_blank">uncontrolled</a>, using the <code>defaultValue</code> prop for initializing it.

<code>value</code>, <code>defaultValue</code> and <code>onChange</code> are pretty standard in React world, so you should stick to them and make dev life easier, even if you think that <code>onUpdateComponentValue</code> is a much more better name for your prop.
<h3>4. Test your component</h2>
Since React is data driven, what your component display should depend 100% on the props it receives, and that make React components much easier to test than any traditional UI.

A nice set of tests will tell to the developers that they are in front of a serious project. Beside of checking that the component works as expected, it will also help you to accept pull requests from the community, being sure that they are not breaking anything.

Facebook recommends using its own testing framework Jest, which comes with lots of features thought to test React components.

Maybe I am too old fashioned, but I feel really comfortable using Mocha and JSDOM to test my components. Probably it is because they are two tools I know well, and I feel lazy about learning how to use Jest.

There are multiple <a href="http://www.hammerlab.org/2015/02/14/testing-react-web-apps-with-mocha/">nice tutorials</a> to learn how to test react components with Mocha and JSDOM, and you can also have a look at the <a href="https://github.com/arqex/react-datetime/blob/master/tests/datetime-spec.js">tests of react-datetime</a> for example.
<h3>5. Calm your dependencies down</h2>
This is something that can be applied to every javascript project that you are publishing to npm, not only react ones: <strong>Try to add as few dependencies as possible to your component</strong>. Lightweight components are like a bless. I pay special attention to this when I am about to add a npm dependency, sometimes I have found packages as big as the whole project.

Installing dependencies with npm is so easy that we use to forget that we are bloating our package with a lot of code, and sometimes we install a big dependency just to use one feature. Every time that you are going to add a dependency think that you are forcing your component's users to install it too, maybe it is a way of adding the feature without carrying the weight of the dependency.

In case of creating a React component, keep in mind that you <strong>shouldn't define React.js as a dependency</strong>. With a npm version previous than v3, it will install React again and it will probably break the host project. You can define it as as peerDependency in case that you want to remark that React.js is needed to make it work.
<h3>6. Pack it as a single file</h2>
You may think that this is not really important. Nowadays with webpack or browserify we can add the component to any project using commonjs or es6 modules, and there is no need to create a single bundle.

It's true, but packing your component in a single UMD module will allow your component to be loaded using a script tag, so <strong>you will be able to create demos</strong> using popular services like <a href="https://jsfiddle.net/reactjs/69z2wepo/" target="_blank">jsFiddle</a> or <a href="http://codepen.io/bradleyboy/pen/OPBpGw" target="_blank">codepen.io</a>. Demos are the best way of let your potential users test your component before installing, and a great companion for your documentation. They are like live tutorials!

Moreover, the single file will give you an idea of the size of your component, something important to pay attention to if you want to create a sleek component.

You have many options to create an UMD from your code. <a href="http://webpack.github.io/docs/configuration.html#output-librarytarget" target="_blank">Webpack can do it for you</a> out of the box, <a href="http://dontkry.com/posts/code/browserify-and-the-universal-module-definition.html" target="_blank">browserify and grunt</a> can make the trick, or you can use <a href="https://github.com/eduardolundgren/gulp-umd" target="_blank">gulp-umd</a>.
<h3>7. Promote your component</h2>
Once you have published your component to npm I am sure you want everybody to use it, don't you? There are multiple sites that index react components and will make your component visible:
<ul>
	<li><a href="http://react.rocks/" target="_blank">React rocks</a></li>
	<li><a href="https://react.parts/web" target="_blank">React parts</a></li>
	<li><a href="http://react-components.com/" target="_blank">React components</a></li>
	<li><a href="http://www.reactjsx.com" target="_blank">React jsx</a></li>
</ul>
Some of them just need you to add the keyword <code>react-component</code> to your <code>package.json</code> file. Easy, isn't it?
<h3>And many more</h3>
Good docs, paying attention to the community, searching for existing similar problems and learning from them... Publishing your component can require more effort than creating it, but it deserves the work. If you have any hints that are not mentioned in this article, go ahead and leave a comment. I will add it to the list metioning you :)

&nbsp;