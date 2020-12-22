$s.extend({
	/**
	 * A simple shortcut function for document.querySelectorAll/document.getElementById with some service
	 *
	 * @typedef $s.qs
	 * @param selector
	 * @param baseObj
	 * @param element
	 * @returns {{}|null}
	 */
	qs: function(selector, baseObj, element)
	{
		let domObjects, _usesQS = true;

		if (typeof element !== "object") {
			element = {};
		}

		if (typeof baseObj !== "object" || typeof baseObj.querySelectorAll === "undefined") {
			baseObj = document;
		}

		if (selector.substr(0, 1) === "#" && selector.indexOf(" ") === -1 && selector.indexOf(".") === -1) {
			_usesQS    = false;
			domObjects = document.getElementById(selector.substr(1));
		} else {
			domObjects = baseObj.querySelectorAll(selector);
		}

		if (typeof domObjects === "object" && domObjects !== null) {
			if (!_usesQS) {
				element         = domObjects;
				element.items   = [domObjects];
				element.isList  = false;
			} else if (domObjects.length === 1) {
				element         = domObjects[0];
				element.items   = [domObjects[0]];
				element.isList  = false;
			} else if (domObjects.length > 0) {
				element         = {};
				element.items   = domObjects;
				element.isList  = true;
			} else {
				return null;
			}

			/**
			 * Wraps forEach for all types of returns
			 *
			 * @param callback
			 * @param scope
			 */
			element.forEach = function(callback, scope)
			{
				this.items.forEach(function(element, index, array) {
					callback.call(scope, element, index, array);
				});
			};

			/**
			 * Returns - if exists - the first parent with the given type of the current DOM Node to the callback
			 *
			 * @param callback
			 * @private
			 */
			element.onNextSibling = function (callback)
			{
				let _cfns = function(that, callback)
				{
					let sibl = that.nextSibling;
					if (sibl !== null) {
						while (!(sibl instanceof HTMLElement)) {
							if (sibl === null) break;
							sibl = sibl.nextSibling;
						}
						if (sibl instanceof HTMLElement) {
							callback(sibl);
						}
					}
				};
				if (this.isList) {
					this.forEach(function(element)
					{
						_cfns(element, callback);
					});
				} else {
					_cfns(this, callback);
				}
			};

			/**
			 * Returns - if exists - the first parent with the given type of the current DOM Node to the callback
			 *
			 * @param parentType
			 * @param callback
			 */
			element.onParentOfType =function (parentType, callback)
			{
				let _copot = function(that, parentType, callback)
				{
					let p = that.parentNode;
					if (p !== null) {
						while (p.nodeName !== parentType) {
							if (p.parentNode === null) {
								p = null;
								break;
							}
							p = p.parentNode;
						}
						if (p !== null) {
							callback(p);
						}
					}
				};
				if (this.isList) {
					this.forEach(function(element)
					{
						_copot(element, parentType, callback);
					});
				} else {
					_copot(this, parentType, callback);
				}
			};

			/**
			 * Returns - if exists - the first parent with the given classname of the current DOM Node to the callback
			 *
			 * @param parentClass
			 * @param callback
			 */
			element.onParentOfClass = function (parentClass, callback)
			{
				let _copoc = function(that, parentClass, callback)
				{
					let p = that.parentNode;
					if (p !== null) {
						while (!p.classList.contains(parentClass)) {
							p = p.parentNode;
							if (typeof p.classList === "undefined") {
								p = null;
								break;
							}
						}
						if (p !== null) {
							callback(p);
						}
					}
				};
				if (this.isList) {
					this.forEach(function(element)
					{
						_copoc(element, parentClass, callback);
					});
				} else {
					_copoc(this, parentClass, callback);
				}

			};
		} else {
			return null;
		}

		return element;
	}
});