---
slug: "/articles/adding-a-select-box-to-wordpress-tinymce-editor"
type: "article"
date: "2011-04-05"
source: ""
title: "Adding a select box to Wordpress tinyMCE editor"
link: "/387/adding-a-select-box-to-wordpress-tinymce-editor"
---

The process of adding a button to the wordpress editor is straight enough if you follow the instructions that there is in the <a href="http://codex.wordpress.org/TinyMCE_Custom_Buttons" target="_blank">Wordpress Codex</a> and in the the<a href="http://tinymce.moxiecode.com/wiki.php/Creating_a_plugin" target="_blank"> tinyMCE editor documentation</a>. The first one explain how to hook into Wordpress to define the name of your tinyMCE plugin and the path to the javascript that the editor calls. The second one define how to build that javascript.

Adding custom buttons to your editor is very useful when you are installing Wordpress for a client and he asks about some functionality inside the posts, that would be very easy if the client knew something about HTML, like add a class to a div. If you put a button that create a div with that class you don't have to explain any HTML to him, you just have to tell him "push the button", anyway he won't do it and he will call you asking "how can I....?" - Push the damn button!

But when I searched for adding a select box it wasn't easy to find the info in the tinyMCE documentation, so I decide to write a tutorial to never forget it.

<!--more U always wanted to know this, keep reading. -->

<a rel="attachment wp-att-388" href="http://marquex.es/387/adding-a-select-box-to-wordpress-tinymce-editor/shortcode-selector"><img class="aligncenter size-medium wp-image-388" title="shortcode-selector" src="http://marquex.es/wp-content/uploads/2011/04/shortcode-selector-570x235.jpg" alt="" width="570"  /></a>

The plugin that we are going to create will let us insert the shortcodes that we have available in our wordpress easily. I always forget the shortcodes I have so, for me, it is really useful. Its behavior will be really simple:
<ul>
	<li>Selecting a shortcode from the select box will wrap any text that is selected in the editor with the shortcode tags: <code>[tag]Selected text[/tag]</code></li>
	<li>If there is not selected text a empty tag will be inserted <code>[tag]</code></li>
</ul>
Well, are you hungry of code? here you have the main wordpress plugin file, we will name it <strong>Shortcodes editor selector,</strong> and you can dowload it :
<h3 style="text-align: center;"><a href="http://marquex.es/wp-content/uploads/2011/04/shortcodes-editor-selector.zip">Download Shortcodes editor selector</a></h2>
<h3>shortcodeseditorselector.php</h3>
<pre lang="php" line="1">
<?php
/*
Plugin Name: Shortcodes editor selector
Plugin URI: http://marquex.es/387/adding-a-select-box-to-wordpress-tinymce-editor
Description: Creates a button to the wordpress tinymce editor to add shortcodes easily.
Version: 0.1
Author: Javier Marquez 
Author URI: http://marquex.es
*/
if(!class_exists('ShortcodesEditorSelector')):

class ShortcodesEditorSelector{
	var $buttonName = 'ShortcodeSelector';
	function addSelector(){
		// Don't bother doing this stuff if the current user lacks permissions
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
			return;
	 
	   // Add only in Rich Editor mode
	    if ( get_user_option('rich_editing') == 'true') {
	      add_filter('mce_external_plugins', array($this, 'registerTmcePlugin'));
	      //you can use the filters mce_buttons_2, mce_buttons_3 and mce_buttons_4 
	      //to add your button to other toolbars of your tinymce
	      add_filter('mce_buttons', array($this, 'registerButton'));
	    }
	}
	
	function registerButton($buttons){
		array_push($buttons, "separator", $this->buttonName);
		return $buttons;
	}
	
	function registerTmcePlugin($plugin_array){
		$plugin_array[$this->buttonName] = plugins_url() . '/shortcodes-editor-selector/editor_plugin.js.php';
		if ( get_user_option('rich_editing') == 'true') 
		 	var_dump($plugin_array);
		return $plugin_array;
	}
}

endif;

if(!isset($shortcodesES)){
	$shortcodesES = new ShortcodesEditorSelector();
	add_action('admin_head', array($shortcodesES, 'addSelector'));
}
</pre>
I copied the code from the codex page and I modified some things to adapt it to my necessities. The first thing I've changed is create a class that contains all the functions and attributes, this is the best thing to avoid conflicts with others plugins.

I have added a comment about how to change the toolbar button row where the selectbox will be.

To add a button to the tinyMCE toolbar we need to complete two steps:
<ul>
	<li>Register the tinyMCE plugin, a javascript that contains the behavior of the button. We get this with the <em>registerTmcePlugin</em> method that hooks into 'mce_external_plugins'. Here the path to the javascript has been changed from the example in Wordpress Codex, because we want our plugin to have all the files inside its folder, and the example tell us to put it inside the tiny_mce folder. Using the <code>plugin_url()</code> function it is easy to get to our plugin folder.</li>
	<li>Register the control into the tinyMCE. In Wordpress the hooks are called 'mce_buttons' and 'mce_buttons_n' where <em>n</em> is the tinyMCE toolbar we want to add our control, and I say control because it don't have to be always a button although the hook name seems to say that it do. We want to add a selectbox but we still have to hook into 'mce_buttons'.</li>
</ul>
Once we have our Wordpress plugin ready, we need to create the tinyMCE plugin, that tell the editor to draw a select box with the shortcodes. That plugin should be a javascript file, but we need the javascript to include the shortcodes list that only can be retrived using the Wordpress PHP functions, so what we are going to do is register a PHP file as the tinyMCE plugin (using the 'mce_external_plugins' hook) that write javascript code, this way the editor get a valid javascript file (it doesn't care about the .php extension) and our server will execute the PHP commands inside it.

Here is its code, copied and subtly modified from the <a href="http://tinymce.moxiecode.com/wiki.php/Creating_a_plugin" target="_blank">tinyMCE docs</a>:
<h3>editor_plugin.js.php</h3>
<pre lang="php" line="1">
<?php 
	require_once('../../../wp-load.php');
	require_once('../../../wp-admin/includes/admin.php');
	do_action('admin_init');
	
	if ( ! is_user_logged_in() )
		die('You must be logged in to access this script.');
	
	if(!isset($shortcodesES))
		$shortcodesES = new ShortcodesEditorSelector();
	
	global $shortcode_tags;
	$ordered_sct = array_keys($shortcode_tags);
	sort($ordered_sct);
?>

(function() {
	//******* Load plugin specific language pack
	//tinymce.PluginManager.requireLangPack('example');

	tinymce.create('tinymce.plugins.<?php echo $shortcodesES->buttonName; ?>', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			
		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl : function(n, cm) {
			if(n=='<?php echo $shortcodesES->buttonName; ?>'){
                var mlb = cm.createListBox('<?php echo $shortcodesES->buttonName; ?>List', {
                     title : 'Shortcodes',
                     onselect : function(v) { //Option value as parameter
                     	if(tinyMCE.activeEditor.selection.getContent() != ''){
                         	tinyMCE.activeEditor.selection.setContent('[' + v + ']' + tinyMCE.activeEditor.selection.getContent() + '[/' + v + ']');
                        }
                        else{
                        	tinyMCE.activeEditor.selection.setContent('[' + v + ']');
                        }
                     }
                });

                // Add some values to the list box
                <?php foreach($ordered_sct as $sct):?>
                	mlb.add('<?php echo $sct;?>', '<?php echo $sct;?>');
		<?php endforeach;?>

                // Return the new listbox instance
                return mlb;
             }
             
             return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Shortcode selector',
				author : 'marquex',
				authorurl : 'http://marquex.es',
				infourl : 'http://marquex.es/387/adding-a-select-box-to-wordpress-tinymce-editor',
				version : "0.1"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('<?php echo $shortcodesES->buttonName; ?>', tinymce.plugins.<?php echo $shortcodesES->buttonName; ?>);
})();

</pre>
In our script file, the first thing to do is initialize the Wordpress admin framework, that will let us to use all the wordpress admin functions and variables and we get it with the first 3 lines of code
<pre lang="php" line="2">
require_once('../../../wp-load.php');
require_once('../../../wp-admin/includes/admin.php');
do_action('admin_init');
</pre>
The next step is make the script accessible only to logged users, just for security.
<pre lang="php" line="6">
if ( ! is_user_logged_in() )
		die('You must be logged in to access this script.');
</pre>
Now that we have the access to everything we are going to get the shortcodes list, that Wordpress stores in the global variable <em>$shortcode_tags</em>, and we are going to sort it alphabetically, making it more user friendly. This variable is an associative array where each element is a shortcode. The key of the element is the tag name that we use in the editor, and the value is an object that represents the function necessary to convert the shortcode in the expected result. We only need the keys, the part we need to write in the editor.
<pre lang="php" line="12">
	global $shortcode_tags;
	$ordered_sct = array_keys($shortcode_tags);
	sort($ordered_sct);
</pre>
The rest of the file is the example from the documentation where the plugin name has been changed to ours and we added the code to set up our list. The select boxes for the tinyMCE are called <a href="http://tinymce.moxiecode.com/wiki.php/API3:class.tinymce.ui.ListBox" target="_blank"><em>listBox </em></a>and they are easy to instantiate from inside the <em>createControl </em>method in a plugin. The function responsible of writing the shortcode are binded to the onselect event of the select box, this way we just have to click on the option we want to write it in the editor.

With<em> tinyMCE.activeEditor.selection.setContent </em>and <em>tinyMCE.activeEditor.selection.getContent </em>we get access to the text selected if there is any or otherwise the current position of the cursor.

To set the options for the select box, a little php will help us.

<pre lang="php" line="59">
                <?php foreach($ordered_sct as $sct):?>
                	mlb.add('<?php echo $sct;?>', '<?php echo $sct;?>');
		<?php endforeach;?>
</pre>

Finally, don't forget to add the plugin to the tinyMCE plugin manager if you want it to appear in your editor.
<pre lang="php" line="87">
	// Register plugin
	tinymce.PluginManager.add('<?php echo $shortcodesES->buttonName; ?>', tinymce.plugins.<?php echo $shortcodesES->buttonName; ?>);
</pre>
If you have get this bottom in the tutorial, I am sure you want to try the plugin. Create a folder named <em>shortcodes-editor-selector</em> in your /wp-content/plugins/ and copy both files there, then log in your Wordpress, activate the plugin and you will see the select box in your editor.

&nbsp;