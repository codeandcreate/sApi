/**
 * $s.ajax() as sApi Extention
 *
 */
$s.extend({
	/**
	 * Shortcut function for XMLHttpRequest with NativeOS Feature for Exozet Newsapp
	 *
	 * @typedef $s.ajax
	 * @param urlOrObject
	 * @param callback
	 * @param data
	 * @param method
	 * @returns {boolean}
	 */
	ajax: function (urlOrObject, callback, data, method)
	{
		var errorCallback, headers, withCredentials;

		if (typeof urlOrObject === "object") {
			data            = urlOrObject.data || "";
			method          = urlOrObject.method || "GET";
			callback        = urlOrObject.callback || undefined;
			errorCallback   = urlOrObject.errorCallback || undefined;
			headers         = urlOrObject.headers || {};
			withCredentials = urlOrObject.withCredentials || undefined;

			urlOrObject = urlOrObject.url || undefined;
		}

		if (typeof urlOrObject === "undefined" || typeof callback === "undefined") {
			return false;
		}

		if (typeof window.sApi_jsHost !== "undefined" && urlOrObject.indexOf("://") === -1) {
			urlOrObject = window.sApi_jsHost + urlOrObject;
		}

		if (typeof data === "object") {
			var dataObject = data;
			data           = "";
			for (var key in dataObject) {
				data = data + "&" + key + "=" + encodeURIComponent(dataObject[key]);
			}
		}

		// Legacy workflow => fetch needs a major reworking of many scripts
		var xmlHttp = new XMLHttpRequest();
		if (withCredentials === true) {
			xmlHttp.withCredentials = true;
		}

		function readyStateHandler()
		{
			if (xmlHttp.readyState === 4 && (xmlHttp.status === 200 || xmlHttp.status === 201)) {
				callback(xmlHttp.responseText);
			} else if (typeof errorCallback === "function") {
				errorCallback(xmlHttp);
			}
		}

		xmlHttp.onload = readyStateHandler;
		xmlHttp.onreadystatechange = function()
		{
			/**
			 * separate function is needed because in case of a 500 xmlHttp.onload will be never called
			 */
			if (xmlHttp.status === 500 && typeof errorCallback === "function") {
				errorCallback(xmlHttp);
			}
		};

		if (typeof data === "undefined") {
			data = "";
		}
		if (method !== "GET" && method !== "POST") {
			method = "GET";
		}

		if (method === "POST" || method === "PUT" || method === "DELETE") {
			xmlHttp.open(method, urlOrObject, true);
			xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			if (typeof headers === "object") {
				for (var i in headers) {
					xmlHttp.setRequestHeader(i, headers[i]);
				}
			}
			xmlHttp.send(data);
		} else {
			if (data !== "") {
				data = "?" + data;
			}
			xmlHttp.open("GET", urlOrObject + data, true);
			if (typeof headers === "object") {
				for (var i in headers) {
					xmlHttp.setRequestHeader(i, headers[i]);
				}
			}
			xmlHttp.send();
		}
		return true;
	}
});