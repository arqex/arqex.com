---
slug: "/articles/updating-your-wordpress-plugins-for-the-new-mp6-admin"
type: "article"
date: "2014-01-11"
source: ""
title: "Updating your WordPress plugins for the new MP6 admin"
link: "/842/updating-your-wordpress-plugins-for-the-new-mp6-admin"
---

WordPress 3.8 has arrived and it brings with it a new admin interface. Its name is MP6 and it follows the design trends: simple, clear and flat. This is good news for everybody, but for plugin developers implies updating their plugins' styles to adapt to the new UI.

<!--more-->

<a href="http://arqex.com/wp-content/uploads/2014/01/mp6.png"><img class="alignnone size-full wp-image-843" alt="mp6" src="http://arqex.com/wp-content/uploads/2014/01/mp6.png" width="839"  /></a>

Fortunatelly, there are no radical changes in the admin markup or classes, but if you need to update something, you need to be sure that you are supporting the previous versions of WordPress (Think about the people that can't update their blogs).

Bad news are that in the new UI there is nothing that we can use to recognize if the user WP has the MP6 or the old UI via css. Although we have the WP version and branch in the body classes, it is not good using them to apply our styles, because we would need to update our styles every time that a new WP version is released.

Our solution would be detect if the user has a WP version 3.8 or newer via PHP and add a new class to the admin body. The code is easy
<pre>function checkMP6($classes){
	global $wp_version;

	if ( !version_compare( $wp_version, '3.8', '>=' ) ) {
        $classes .= 'no-mp6';
    }
    return $classes;
}
add_filter('admin_body_class', 'checkMP6');</pre>
That will add the class <em>no-mp6</em> to the WP admin body if its version is lower than 3.8. Since WP is going to have the MP6 admin UI for a while, it is better to consider to tweak you CSS for the previous versions using the CSS <em>.no-mp6</em> class and keep styling your plugin as usual for MP6 (no css prefixes).