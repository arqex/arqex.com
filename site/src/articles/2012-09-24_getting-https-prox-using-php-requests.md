---
slug: "/articles/getting-https-prox-using-php-requests"
type: "article"
date: "2012-09-24"
source: ""
title: "Getting https pages through a proxy using PHP and Requests"
link: "/719/getting-https-prox-using-php-requests"
---

Today I was searching the internet looking for a HTTP client that supports authentication and https connections because I couldn't use the function
<pre>file_get_contents</pre>
with htpps addresses.

I found some interesting and modern projects like <a title="Httpful client home page" href="http://phphttpclient.com/" target="_blank">Httpful </a>and <a title="Guzzle http client homepage" href="http://guzzlephp.org/" target="_blank">Guzzle</a>, but they created with REST in mind, and I was looking for something much simpler, but powerful enough to allows to get https pages and authentication.

And searching a bit deeper I could finally find <a title="Requests php http client homepage" href="http://requests.ryanmccue.info/" target="_blank">Requests</a>. Yeah, with that name it's really difficult to find it, everyting is called request on the internet. What I found is a Http client for PHP created by Ryan McCue, inspired by the python's Requests library.

<!--more Click to discover the magic -->

<img class="aligncenter size-medium wp-image-721" title="https-background" src="http://marquex.es/wp-content/uploads/2012/09/https-background-399x300.jpg" alt="" width="399"  />

Requests uses cURL and fsockopen, depending on what your system has available, but abstracts all the nasty stuff out of your way, providing a consistent API. Long story short, make easy to get http/https pages from your php scripts. Using it, getting a secure webpage as https://www.google.com is as easy as:
<pre lang="php">// First, include Requests
include('/path/to/library/Requests.php');

// Next, make sure Requests can load internal classes
Requests::register_autoloader();

//get the page
$response = Requests::get('https://www.google.es');</pre>
It does not matter if your php installation doesn't have the openssl wrapper installed, that one that let's you get the pages using the file_get_contents function. Requests will find it way to get the page for you.

But I had another problem, and I could not find info in the internet about: How to get those pages through my office's proxy?? I found a solution by myself, and I am glad to share it :)

As I said before, Requests can use cURL to get the pages, so we can config cURL to handle the proxy for us. Unfortunately, Requests don't give any simple way to pass config parameter to cURL, so we will have to extend the cURL transport class to set it up, and force Requests to use it. The result is this piece of code
<pre lang="php">require_once '/path/to/library/Requests.php';
Requests::register_autoloader();
//Our class
class Options_Curl_Transport extends Requests_Transport_cURL {
  var $options = array(
    CURLOPT_PROXY => 'fakeproxy.com:1080',
    CURLOPT_PROXYUSERPWD=> 'user:password'
  );
  function __construct(){
    parent::__construct();
    foreach($this->options as $key => $val)
		curl_setopt($this->fp, $key, $val);
  }
}
$response = Requests::get($url, array(), array('transport' => 'Options_Curl_Transport'));</pre>
This way I could, after hours of research, get my https pages through a proxy. I hope this make your resarch time much shorter. Go try <a title="Requests php http client" href="http://requests.ryanmccue.info/" target="_blank">Requests library</a>!