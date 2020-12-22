/**
 * a $( document ).ready({});-alike
 * Forked from https://github.com/jfriend00/docReady
 * It uses d and w of the $s-Api initial params.
 */
$s.extend({
	_docReadyList                   : [],
	_docReadyFired                  : false,
	_docReadyEventHandlersInstalled : false,

	/**
	 * just a function...
	 *
	 * @typedef $s.ready
	 * @param callback   that will be fired if document is ready
	 * @param context    optional context
	 */
	ready: function (callback, context)
	{
		/**
		 * Belongs to _docReady
		 */
		function _documentIsReady()
		{
			if (!$s._docReadyFired) {
				$s._docReadyFired = true;
				for (var i = 0; i < $s._docReadyList.length; i++) {
					try {
						$s._docReadyList[i].fn.call(w, $s._docReadyList[i].ctx);
					} catch (error) {
						console.warn(error);
					}
				}
				$s._docReadyList = [];
			}
		}

		/**
		 * Belongs to _docReady
		 */
		function _readyStateChange()
		{
			if (document.readyState === "complete") {
				_documentIsReady();
			}
		}

		if ($s._docReadyFired) {
			setTimeout(function ()
			{
				try {
					callback(context);
				} catch (error) {
					console.warn(error);
				}
			}, 1);
			return;
		} else {
			$s._docReadyList.push({fn: callback, ctx: context});
		}
		if (d.readyState === "complete") {
			setTimeout(_documentIsReady, 1);
		} else if (!$s._docReadyEventHandlersInstalled) {
			if (d.addEventListener) {
				d.addEventListener("DOMContentLoaded", _documentIsReady, false);
				w.addEventListener("load", _documentIsReady, false);
			} else {
				document.attachEvent("onreadystatechange", _readyStateChange);
				w.attachEvent("onload", _documentIsReady);
			}
			$s._docReadyEventHandlersInstalled = true;
		}
	}
});