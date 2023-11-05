---
slug: "/articles/front-page-on-carrington-theme"
type: "article"
date: "2011-07-10"
source: ""
title: "Front page on Carrington theme"
link: "/639/front-page-on-carrington-theme"
---

I have decided to improve my skills creating WordPress themes, and the only thing I was sure is that I would need a theme framework in order to be organized and have a solid structure. After having a look at the main frameworks, the chosen one was <a href="http://carringtontheme.com/">Carrington</a>. The reason, you can get a quick idea of what it does, it acts like a proxy for template parts, so if you want your home page to have a different header, you just add a new file in the headers folder called home.php and Carrington pick it for you. You can almost forget about WordPress conditional tags and if statements and focus in developing.

But that does not always work. In my case, I wanted to have a static page as home of my site, to do so I went to <em>"Settings" &gt; "Reading"</em> on my WP backend and chose the page I wanted to be the home page. I also wanted a new header for this new home page, so I added the "home.php" file to my headers folder, but Carrington just ignored it.

<!--more A useful WordPress hack if you continue reading...-->

<a rel="attachment wp-att-640" href="http://marquex.es/639/front-page-on-carrington-theme/carrington"><img class="aligncenter size-medium wp-image-640" title="carrington" src="http://marquex.es/wp-content/uploads/2011/07/carrington-570x141.png" alt="" width="570"  /></a>

Carrington only recognizes the home.php files as templates for your blog page, in case you want a different template for your front page you will need to create a new context. It sounds difficult, but you only will have to use this hack I leave here:
<pre lang="php">
<?php
add_filter('cfct_context', 'cfrontfix');
function cfrontfix($context){
	if(is_front_page())
		return 'front-page';
	return $context;
}
</pre>
You can add the code to your functions.php file or create a new file under the Carrington's plugin folder. Once done it, you can add files called front-page.php to your theme, and they will be picked properly.

&nbsp;