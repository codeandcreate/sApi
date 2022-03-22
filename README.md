# sApi - Small Javascript Api
A minimalistic javascript api: The core is a little javascript that can extend itself with other objects or functions by calling ```$s.extend()```. If a extention should be packed within the minifing, it must be just placed into sApi_modules.

## Changes

|&nbsp;&nbsp;&nbsp;Version&nbsp;&nbsp;&nbsp;| Info |
|---|---|
| 202203.01 | Sync with internal version. Mostly bugfixes |
| 202112.01 | Init for bundled sApi_modules, bugfix for $s.require.object() |
| 202012.01 | First public version of sApi, based on smdQS/smdApi from Schwäbisch Media Digital |
| 202106.01 | Some little fixes |

## Examples

- extend() - the core functionality

``` js
$s.extend({
	_objectReady: false, //optional if a function wants to check if init was called...

	myExtention: {
		myFunction: function(param)
		{
			// Just a sample how to check if i'm ready...
			if (this._objectReady !== false) {
				//...
			}
		},
		
		init: function()
		{
			// some stuff i want to execute in the moment this object will be added to sApi
		}
	}
});
```

- onApiReady() - checks if $s has an extention loaded

``` js
$s.onApiReady("myExtention", function()
{
	$s.myExtention.myFunction("something");
});
```
Also works with "myExtention.subExtention" if needed.

- ajax() call:

``` js
$s.ajax({
	url:		"/testscript.php", 		//required
	method:		"GET",
	data:		{},
	callback:	function( returnData ) {	//required
				console.log(returnData);					
			},
	errorCallback:	function( XMLHttpRequest ) {
				console.log(XMLHttpRequest);
			}
});	
```

- ready() - Execute something on document ready:

``` js
$s.ready(function() {
	console.log("document is ready");					
}
```

- require.js() - load an other js:

``` js
$s.require.js("/js/somejsfile.js", function() {
	console.log("js file is loaded.");					
}
```

- require.css() - load an other css:

``` js
$s.require.css("/css/somecssfile.css", function() {
	console.log("css file is loaded.");					
}
```

- require.object() - waits till a javascript object (outside of sApi) is loaded

``` js
$s.require.object(
	"javascriptObjectName"
	function() 
	{
		// some callback stuff
	},
	"optionalListenerName" // if param is not set, there runs a time in background to wait for javascriptObjectName.
);
```

- shortcut for document.querySelectorAll():

``` js
let myNode = $s.qs(".classOfMyNode");

```

- working with a array of nodes:

``` js
var aListOfNodes = $s.qs(".btn");
if (aListOfNodes !== null) {
	var isAList = aListOfNodes.isList;

	//...

	aListOfNodes.forEach(function(oneOfThisNodes, index, array) 
	{
		oneOfThisNodes.removeAttribute("onclick");
		oneOfThisNodes.addEventListener("click", function() 
		{
			console.log("You have clicked on the button with the index " + index);
		});
	});
} 
```

## sApi_jsHost

If the javascript variable sApi_jsHost is set, $s.ajax() and $s.require.js() uses it as hostname to call all requests to. If a url has already a hostname the variable is ignored.

## Packer and building

The default minifing is done by packer (http://dean.edwards.name/packer/). To make own minified build either install yui compressor or place the packer php file from http://joliclic.free.fr/php/javascript-packer/en/ into tools/packer.

To pack (and optionally minify) sApi: ```bash build.sh sApi.js```

## Misc

This version includes a forked version of docReady (https://github.com/jfriend00/docReady)

Matthias Weiß
