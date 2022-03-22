$s.extend({
	/**
	 * Support object dom handling
	 *
	 * @typedef smd.dom
	 */
	dom: {
		/**
		 * Wrapper for $s.dom.scriptInsteadOf which adds a script to the dom
		 *
		 * @typedef $s.dom.mixedNodes
		 * @param base64Data
		 */
		mixedNodes      : function (base64Data)
		{
			this.elementInsteadOf(document.currentScript, undefined, {"innerHTML": atob(base64Data)});
		},
		/**
		 * Wrapper for $s.dom.scriptInsteadOf which adds a iFrame to the dom
		 *
		 * @typedef $s.dom.iframe
		 * @param url
		 * @param attributes
		 */
		iframe          : function (url, attributes)
		{
			attributes     = attributes || {};
			attributes.src = url;

			this.elementInsteadOf(document.currentScript, "iframe", attributes);
		},
		/**
		 * Wrapper for $s.dom.scriptInsteadOf which adds a img to the dom
		 *
		 * @typedef $s.dom.iframe
		 * @param url
		 * @param attributes
		 */
		image           : function (url, attributes)
		{
			attributes     = attributes || {};
			attributes.src = url;

			this.elementInsteadOf(document.currentScript, "img", attributes);
		},
		/**
		 * Wrapper for $s.dom.scriptInsteadOf which adds a embed to the dom
		 *
		 * @typedef $s.dom.iframe
		 * @param url
		 * @param attributes
		 */
		embed           : function (url, attributes)
		{
			attributes     = attributes || {};
			attributes.src = url;

			this.elementInsteadOf(document.currentScript, "embed", attributes);
		},
		/**
		 * Wrapper for $s.dom.scriptInsteadOf which uses document.currentScript for "that", automatically.
		 *
		 * @typedef $s.dom.script
		 */
		script          : function (urlOrCode, attributes)
		{
			attributes      = attributes || {};
			attributes.type = "text/javascript";
			if (urlOrCode.substring(0, 2) === "//" || urlOrCode.substring(0, 4) === "http") {
				attributes.src = urlOrCode;
			} else {
				attributes.textContent = urlOrCode;
			}

			this.elementInsteadOf(document.currentScript, "script", attributes);
		},
		/**
		 * Replaces a javascript tag (that) with another
		 * based on urlOrCode and optional attributes for the new tag
		 *
		 * @typedef $s.dom.scriptInsteadOf
		 */
		elementInsteadOf: function (that, newElementType, attributes)
		{
			//if we dont want a container to be inserted, than we need at least a working container
			let _newElementType = newElementType || "div";
			let nE              = document.createElement(_newElementType);

			if (typeof attributes === "object") {
				// add all attributes to the new node. for textContent, innerText and innerHTML we ned some special stuff
				for (let attributeName in attributes) {
					if (attributes.hasOwnProperty(attributeName)) {
						switch (attributeName) {
							case 'textContent':
								nE.textContent = attributes[attributeName];
								break;
							case 'innerText':
								nE.innerText = attributes[attributeName];
								break;
							case 'innerHTML':
								nE.innerHTML = attributes[attributeName];
								// for inner html we must exeute the script tags...
								let scripts  = nE.querySelectorAll('script');
								if (scripts !== null) {
									// each script will be recreated and readded to the dom
									scripts.forEach(function (defunctScript)
									{
										let scriptAttributes = {};
										for (let i = defunctScript.attributes.length - 1; i >= 0; i--) {
											if (['type', 'data-category'].indexOf(defunctScript.attributes[i].name) === -1) {
												scriptAttributes[defunctScript.attributes[i].name] = defunctScript.attributes[i].value;
											}
										}
										scriptAttributes.textContent = defunctScript.textContent;
										smd.dom.elementInsteadOf(defunctScript, "script", scriptAttributes);
									});
								}
								break;
							default:
								nE.setAttribute(attributeName, attributes[attributeName]);
						}
					}
				}
			}
			if (typeof that === "object" && that !== null) {
				if (newElementType === undefined) {
					// if we don't want a container, we just add every child to the dom before the running script
					for (let i = 0; i < nE.childNodes.length; i++) {
						that.parentNode.insertBefore(nE.childNodes[i].cloneNode(true), that);
					}
				} else {
					// if we want a container, just add the new node before the running script
					that.parentNode.insertBefore(nE, that);
				}
				// we dont need the script anymore
				that.parentNode.removeChild(that);
			} else {
				// no node to replace? just add to the body
				document.body.appendChild(nE);
			}
		},

		/**
		 * @typedef $s.dom.getParentOfType
		 * @param element
		 * @param parentType
		 * @returns {*}
		 */
		getParentOfType: function (element, parentType)
		{
			var parent = element.parentNode;
			while (parent.nodeName != parentType) {
				parent = parent.parentNode;
			}
			return parent;
		},

		/**
		 * @typedef $s.dom.getParentOfClass
		 * @param element
		 * @param parentClass
		 * @returns {*}
		 */
		getParentOfClass: function (element, parentClass)
		{
			var parent = element.parentNode;
			while (!parent.classList.contains(parentClass)) {
				parent = parent.parentNode;
			}
			return parent;
		},

		/**
		 * @typedef $s.dom.getNextSibling
		 * @param element
		 * @returns {HTMLElement}
		 */
		getNextSibling: function (element)
		{
			var sibling = element.nextSibling;
			while (!(sibling instanceof HTMLElement)) {
				sibling = sibling.nextSibling;
			}
			return sibling;
		},
	}
});