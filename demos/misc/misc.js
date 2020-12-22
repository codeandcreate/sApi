$s.onApiReady("frontendLogger", function()
{
	$s.frontendLogger.log("starting misc.js");

	let jsLoaderButtons = $s.qs("button.cssLoader");
	if (jsLoaderButtons !== null) {
		jsLoaderButtons.forEach(function(element, index) 
		{
			let cssFileToLoad = element.getAttribute("data-css");
			if (cssFileToLoad !== "") {
				$s.frontendLogger.log("found css loader button for " + cssFileToLoad);
				element.addEventListener("click", function() {
					$s.require.css(cssFileToLoad, function()
					{
						var countRequiredCSSLoaders = 0;
						var requiredCSSLoaders = $s.qs("head link[id^='sRequire-']");
						if (requiredCSSLoaders !== null) {
							countRequiredCSSLoaders = requiredCSSLoaders.items.length;
						}
						$s.frontendLogger.log("loaded " + cssFileToLoad + "; count with require.css loaded files: " + countRequiredCSSLoaders);
					});
				});
			}
		});
	}

	let cssLoaderButtons = $s.qs("button.ajaxLoader");
	if (cssLoaderButtons !== null) {
		cssLoaderButtons.forEach(function(element, index) 
		{
			let fileToLoad = element.getAttribute("data-ajax");
			if (fileToLoad !== "") {
				$s.frontendLogger.log("found ajax loader button for " + fileToLoad);
				element.addEventListener("click", function() {
					$s.ajax({
						url: fileToLoad,
						callback: function(data)
						{
							$s.frontendLogger.log("loaded following data with ajax: '" + data  + "'");
						}
					});
				});
			}
		});
	}
});
