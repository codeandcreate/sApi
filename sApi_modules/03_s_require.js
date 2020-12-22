/**
 * Loads JS or CSS and executes a function after successful loading
 */
$s.extend({
	/**
	 * @typedef $s.require
	 */
	require: {
		_runningRequireOperationsForId: [],

		/**
		 * Based on loadJS;
		 * inserts a script tag or a link (css) tag  and executes an optional callback onload
		 *
		 * @param type      type of the script (stylesheet or javascript)
		 * @param source    URL of a script
		 * @param callback  optional callback function
		 * @param clear     drops an existing tag before (re)insert
		 * @typedef $s.require._requireElement
		 * @private
		 */
		_requireElement: function (type, source, callback, clear)
		{

			var requireObjectName = undefined;
			if (typeof source === "object") {
				requireObjectName = source.objectName || null;
				source            = source.url || undefined;
			}

			if (
				typeof source === "undefined" ||
				typeof type === "undefined"
			) {
				return false;
			}

			if (typeof window.sApi_jsHost !== "undefined" && source.indexOf("://") === -1) {
				source = window.sApi_jsHost + source;
			}

			var idForLoaderTag  = "sRequire-" + btoa(source);
			var existingElement = null;
			if (this._runningRequireOperationsForId.indexOf(idForLoaderTag) === -1) {
				this._runningRequireOperationsForId.push(idForLoaderTag);
				existingElement = document.getElementById(idForLoaderTag);

				if (existingElement !== null && clear === true) {
					existingElement.parentNode.removeChild(existingElement);
					existingElement = null;
				}
			}

			if (existingElement === null) {
				"use strict";

				var ref        = null;
				var newElement = null;

				switch (type) {
					case 'javascript':
						ref            = window.document.getElementsByTagName("script")[0];
						newElement     = window.document.createElement("script");
						newElement.src = source;
						newElement.id  = idForLoaderTag;
						break;
					case 'stylesheet':
						ref             = window.document.getElementsByTagName("link")[0];
						newElement      = window.document.createElement("link");
						newElement.href = source;
						newElement.type = "text/css";
						newElement.rel  = "stylesheet";
						newElement.id   = idForLoaderTag;
						break;
				}

				if (newElement === null) {
					return false;
				}

				if (callback && typeof (callback) === "function") {
					if (requireObjectName !== undefined) {
						newElement.onload = function()
						{
							$s.require.object(requireObjectName, callback);
						}
					} else {
						newElement.onload = callback;
					}
				}

				if (ref === null || typeof ref === "undefined") {
					window.document.head.appendChild(newElement);
				} else {
					ref.parentNode.insertBefore(newElement, ref);
				}
			} else if (typeof (callback) === "function") {
				if (requireObjectName !== undefined) {
					$s.require.object(requireObjectName, callback);
				} else {
					callback();
				}
			}
			if (this._runningRequireOperationsForId.indexOf(idForLoaderTag) !== -1) {
				this._runningRequireOperationsForId.splice(this._runningRequireOperationsForId.indexOf(idForLoaderTag), 1);
			}
		},

		/**
		 * Loads a javascript from scriptSource
		 *
		 * @param scriptSource
		 * @param callback
		 * @param clear
		 * @returns {*}
		 * @typedef $s.require.js
		 * @private
		 */
		js: function (scriptSource, callback, clear)
		{
			this._requireElement("javascript", scriptSource, callback, clear);
		},

		/**
		 * Loads a stylesheet from sheetSource
		 *
		 * @param sheetSource
		 * @param callback
		 * @param clear
		 * @returns {*}
		 * @typedef $s.require.css
		 * @private
		 */
		css: function (sheetSource, callback, clear)
		{
			this._requireElement("stylesheet", sheetSource, callback, clear);
		},

		/**
		 * Waits for an object to be available in window
		 *
		 * @typedef $s.require.object
		 * @param objectName
		 * @param callback
		 * @param useCustomEventListener
		 */
		object: function (objectName, callback, useCustomEventListener)
		{
			useCustomEventListener = useCustomEventListener || false;
			if (objectName in window) {
				callback();
			} else if (useCustomEventListener !== false) {
				$s.ready(function()
				{
					document.body.addEventListener(useCustomEventListener, callback);
				});
			} else {
				setTimeout(function ()
				{
					$s.require.object(objectName, callback)
				}, 100);
			}
		}
	}
});