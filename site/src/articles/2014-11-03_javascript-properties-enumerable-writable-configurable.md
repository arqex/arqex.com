---
slug: "/articles/javascript-properties-enumerable-writable-configurable"
type: "article"
date: "2014-11-03"
source: ""
title: "Javascript properties are enumerable, writable and configurable"
link: "/967/javascript-properties-enumerable-writable-configurable"
---

Objects are one of the main parts of Javascript. JS syntax for Objects is really concise and easy to use, so we are constantly creating objects and using them as hashmaps effortlessly.
<pre class="lang:js decode:true">// My beloved object ob
var ob = {a: 1};

// Accessing to a property
ob.a; // =&gt; 1

// Modifying the value of a property
ob.a = 0;
ob.a; // =&gt; 0;

// Creating a new property
ob.b = 2;
ob.b; // =&gt; 2

// Deleting a property
delete ob.b;
ob.b; // =&gt; undefined</pre>
But, do you know that all the object properties in the example above are enumerable, writable and configurable? I mean:
<ul>
	<li><strong>Enumerable</strong>: I can access to all of them using a <code>for..in</code> loop. Also, enumerable property keys of an object are returned using <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys" target="_blank"><code>Object.keys</code></a> method.</li>
	<li><strong>Writable</strong>: I can modify their values, I can update a property just assigning a new value to it: <code>ob.a = 1000</code>;</li>
	<li><strong>Configurable</strong>: I can modify the behavior of the property, so I can make them non-enumerable, non-writable or even non-cofigurable if I feel like doing so. Configurable properties are the only ones that can be removed using the <code>delete</code> operator.</li>
</ul>
I bet that you knew about the two first features of <code>Object</code>'s properties, but there are less developers that know that they can <strong>create and update them to be non-enumerable or immutable</strong> using the <code>Object</code>'s method called <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty" target="_blank">defineProperty</a>.
<pre class="lang:js decode:true">// Adding a property to ob using Object.defineProperty
Object.defineProperty( ob, 'c', {
  value: 3,
  enumerable: false,
  writable: false,
  configurable: false
});

ob.c; // =&gt; 3

Object.getOwnPropertyDescriptor( ob, 'c' ); 
// =&gt; {value: 3, enumerable: false, writable: false, configurable: false}</pre>
I reckon that the syntax is not as friendly as usual one, but having this kind of properties can be really handy for some purposes. The object that define the property is called<strong> descriptor</strong>, and you can have a look at the descriptor of any property using <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor" target="_blank"><code>Object.getOwnPropertyDescriptor</code></a> method.

It is funny that <strong>the default option values</strong> for <code>Object.defineProperty</code><strong> are completely the opposite</strong> to the ones applied when adding a property by assigment: The default property by assignment is non-enumerable, non-writable and non-configurable.
<pre class="lang:js decode:true">// The 'f' property will be non-enumerable. non-writable and non-configurable
Object.defineProperty( ob, 'f', {value: 6} );</pre>
It is also possible to define the properties on object creation if you instantiate it using the method <a href="https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/create" target="_blank"><code>Object.create( prototype, properties )</code></a>. It accepts an object with property descriptors as the second parameter, and it can be used as follows
<pre class="lang:js decode:true">var ob = Object.create(Object.prototype, {
  a: { writable:true, enumerable:true, value: 1 },
  b: { enumerable: true, value: 2 }
}});

ob; // =&gt; {a:1, b:2}</pre>
<h3>Object's non-enumerable properties</h2>
As I said before, enumerable properties are accessible using <code>for...in</code> loops, so, non-enumerable ones aren't. Basically, non-enumerable properties won't be available using most of the functions that handle <code>Objects</code> as hashmaps.
<ul>
	<li>They won't be in <code>for..in</code> iterations.</li>
	<li>They won't appear using <code>Object.keys</code> function.</li>
	<li>They are not serialized when using <code>JSON.stringify</code></li>
</ul>
So they are kind of <em>secret</em> variables, but you can always access to them directly.
<pre class="lang:default decode:true">var ob = {a:1, b:2};

ob.c = 3;
Object.defineProperty(ob, 'd', {
  value: 4,
  enumerable: false
});

ob.d; // =&gt; 4

for( var key in ob ) console.log( ob[key] ); 
// Console will print out
// 1
// 2
// 3

Object.keys( ob );  // =&gt; ["a", "b", "c"]

JSON.stringify( ob ); // =&gt; "{a:1,b:2,c:3}"

ob.d; // =&gt; 4</pre>
Since this kind of properties are not serialized, I found them really useful when handling data model objects. I can add handy information to them using non enumerable properties.
<pre class="lang:js decode:true">// Imagine the model that represent a car, it has a reference
// to its owner using owner's id in the owner attribute

var car = {
  id: 123,
  color: red,
  owner: 12
};

// I also have fetched the owner from the DB
// Of course, the car is mine :)
var owner = {
 id: 12,
 name: Javi
}

// I can add the owner data to the car model
// with a non-enumerable property, maybe it can
// be useful in the future
Object.defineProperty( car, 'ownerOb', {value: owner} );

// I need the owner data now
car.ownerOb; // =&gt; {id:12, name:Javi}

// But if I serialize the car object, I can't see me
JSON.stringify( car ); // =&gt; '{id: 123, color: "red", owner: 12}'


</pre>
Can you think how useful can this be to create a ORM library for example?

In case that you need to know all properties in an object, enumerable and non-enumerable ones, the method <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames" target="_blank"><code>Object.getOwnPropertyNames</code></a> returns an array with all the names.
<h3>Object's non-writable properties</h2>
While the world waits for ES6 to finally arrive with the desired <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const" target="_blank"><code>const</code> statemen</a>t, non-writable properties are the <strong>most similar thing to a constant</strong> that we have in Javascript. Once its value is defined, <strong>it is not possible to change it using assignments</strong>.
<pre class="lang:js decode:true">var ob = {a: 1};

Object.defineProperty( ob, 'B', {value: 2, writable:false} );

ob.B; // =&gt; 2

ob.B = 10;

ob.B; // =&gt; 2</pre>
As you can see, the assignment didn't affect the value of <code>ob.B</code> property. You need to be careful, because <strong>the assignment always returns the value assigned</strong>, even if the property is non-writable like the one in the example. In strict mode, trying to modifying a non-writable property would throw an <code>TypeError</code> exception:
<pre class="lang:js decode:true">var ob = {a: 1};
Object.defineProperty( ob, 'B', {value: 2, writable:false} );

// Assingments returns the value
ob.B = 6; // =&gt; 6
ob.B = 1000; // =&gt; 1000

// But the property remains the same
ob.B; =&gt; 2;

function updateB(){
  'use strict';
  ob.B = 4; // This would throw an exception
}

updateB(); // Throws the exception. I told you.
</pre>
It is also needed to keep in mind that<strong> if the non-writable property contains an object</strong>, the reference to the object is what is not writable, but <strong>the object itself can be modified yet</strong>:
<pre class="lang:js decode:true">var ob = {a: 1};
Object.defineProperty( ob, 'OB', {value: {c:3}, writable:false} );

ob.OB.c = 4;
ob.OB.d = 5;

ob.OB; // =&gt; {c:4, d:5}

ob.OB = 'hola';

ob.OB; // =&gt; {c:4, d:5}</pre>
If you want to have a property with an completely non-writable object, you can use the function <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze" target="_blank"><code>Object.freeze</code></a>. <code>freeze</code> will make impossible to add, delete or update any object's property, and you will get a <code>TypeError</code> if you try so in strict mode.
<pre class="lang:js decode:true">var ob = { a: 1, b: 2 };

ob.c = 3;

// Freeze!
Object.freeze( ob ); // =&gt; {a:1,b:2,c:3}

ob.d = 4;
ob.a = -10;
delete ob.b;

Object.defineProperty( 'ob', 'e', {value: 5} );

// Every modification was ignored
ob; // =&gt; {a:1,b:2,c:3}</pre>
<h3>Object's non-configurable properties</h2>
You can update the previous behaviors of the properties if they are defined as configurable. You can use <code>defineProperty</code> once and again to change the property to writable or to non-enumerable. But once you have defined the property as non-configurable, there is only one behaviour you can change: If the property is writable, you can convert it to non-writable. Any other try of definition update will fail throwing a <code>TypeError</code>.
<pre class="lang:js decode:true">var ob = {};
Object.defineProperty( ob, 'a', {configurable:false, writable:true} );

Object.defineProperty(ob, 'a', { enumerable: true }); // throws a TypeError
Object.defineProperty(ob, 'a', { value: 12 }); // throws a TypeError
Object.defineProperty(ob, 'a', { writable: false }); // This is allowed!!
Object.defineProperty(ob, 'a', { writable: true }); // throws a TypeError
</pre>
An important thing to know about the non-configurable properties is that they can't be removed from the object using the operator <code>delete</code>. So if you create a property non-configurable and non-writable you have a <em>frozen</em> property.
<pre class="lang:js decode:true">var ob = {};

Object.defineProperty( ob, 'a', {configurable: true, value: 1} );

ob; // =&gt; {a:1}
delete ob.a; // =&gt; true
ob; // =&gt; {}

Object.defineProperty( ob, 'a', {configurable: false, value: 1} );

ob; // =&gt; {a:1}
delete ob.a; // =&gt; false
ob; // =&gt; {a:1}</pre>
<h3>Conclusion</h2>
<code>Object.defineProperty</code> was introduced with ES5, and you can start using it right now, <strong>it is supported by all modern browsers</strong>, including IE 9 ( and even IE 8, but <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Internet_Explorer_8_specific_notes" target="_blank">only for DOM objects</a> ). It is always fun to play with javascript basics in a different way that we are used to, and it is easy to learn new stuff just observing how javascript core objects work.

<code>Object.defineProperty</code> also give us the chance of creating customized getters and setters for the properties, but I won't write about that today. If you want to learn more, have a look at the always amazing <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty" target="_blank">Mozilla's documentation</a>.

&nbsp;