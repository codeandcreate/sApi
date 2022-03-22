/**
 * $s-API
 *
 * @version 202203.01
 */
(function (w, d, pvn)
{
	/**
	 * @typedef $s
	 * @type {{extend: extend, onApiReady: onApiReady}}
	 */
	let $s = {

		//readyFunctions are deleted after execution
		_rF: [],

		//placeholder
		_includeModulesPlaceHolder: {},

		//to check which version of the api is running
		version: 202203.01,

		/**
		 * extends smdApi with object
		 *
		 * @typedef $s.extend
		 * @param object
		 */
		extend: function(object)
		{
			let completeNewApiName = [];

			/**
			 * Goes through smd or a subobject and adds newObjectToAdd to it.
			 *
			 * @param objectToParse
			 * @param newObjectToAdd
			 * @param completeNewApiName
			 * @private
			 */
			function _parseSObject(objectToParse, newObjectToAdd, completeNewApiName) {
				for (let i in newObjectToAdd) {
					completeNewApiName.push(i);
					if (typeof objectToParse[i] === "undefined") {
						objectToParse[i] = newObjectToAdd[i];
						$s.ready(function() {
							$s._isapi(objectToParse, i, completeNewApiName);
						});
					} else if (typeof newObjectToAdd[i] === "object" && Object.keys(newObjectToAdd[i]).length > 0) {
						_parseSObject(objectToParse[i], newObjectToAdd[i], completeNewApiName);
					}
				}
			}

			_parseSObject($s, object, completeNewApiName);
		},

		/**
		 * Workaround if body not fully loaded...
		 *
		 * @param event
		 * @returns {boolean}
		 * @private
		 */
		 _dispatchReadyEvent: function (event)
		{
			if (document.body !== null) {
				document.body.dispatchEvent(event);
			} else {
				$s.ready(function() {
					$s._dispatchReadyEvent(event);
				});
			}

			return true;
		},

		/**
		 * Initializes an api on $s or on a subobject of $s
		 *
		 * @param api
		 * @param apiName
		 * @param completeNewApiName
		 * @private
		 */
		_isapi: function(api, apiName, completeNewApiName)
		{
			let typeOfApiName = typeof api[apiName];
			if (typeOfApiName !== "undefined" && !(api[apiName] instanceof HTMLElement) && api[apiName].constructor !== Array) {

				/**
				 * creates an CustomEvent dispatch and calls _isapi on all sub elements
				 * @param _apiToSetReady
				 * @param _completeNewApiName
				 * @private
				 */
				var _readyFunction = function(_apiToSetReady, _completeNewApiName)
				{
					_apiToSetReady._objectReady = true;
					let event                 = new CustomEvent("$s." + _completeNewApiName.join(".") + "::ready");
					$s._dispatchReadyEvent(event);

					if (typeof _apiToSetReady === "object" && _apiToSetReady.constructor !== Array && Object.keys(_apiToSetReady).length > 0) {
						for (let i in _apiToSetReady) {
							//All done... execute the waiting functions...
							if (_apiToSetReady[i] !== null && i.substr(0,1) !== "_" && (typeof _apiToSetReady[i] === 'object' || typeof _apiToSetReady[i] === 'function')) {
								_completeNewApiName.push(i);
								/*
									timing fuckup in javascript ?! needs to be debugged;

									if there is no setTimeout here, subobject like smd.ui.loadMoreDatasets
									could not call smd.onApiReady or smd.userSettings.exec inside the init() function.
								 */
								setTimeout(function() { $s._isapi(_apiToSetReady, i, _completeNewApiName);},1);
							}
						}
					}
				};

				// must be var! let will not contain the right return of the init function in chrome
				var _makeAutoObjectReady = true;

				// just objects will get the possability to make a custom init function...
				// on functions we will automaticly generate a CustomEvent dispatch...
				if (typeOfApiName === "object") {
					if (typeof api[apiName]._objectReady === "undefined") {
						api[apiName]._objectReady = false;
					}

					if (api[apiName]._objectReady !== true) {
						if (typeof api[apiName].init === "function") {
							_makeAutoObjectReady = api[apiName].init();
							delete (api[apiName].init);
						}
					} else {
						_makeAutoObjectReady = false;
					}
				}

				// CustomEvents can only be dispatched if the dom is ready.
				// So if there is _readyFunction in the $s-Object,
				// the dom is not ready and the CustomEvent dispatch must wait...
				if (_makeAutoObjectReady !== false) {
					if (typeof $s._rF !== "undefined") {
						$s._rF.push(function ()
						{
							_readyFunction(api[apiName], completeNewApiName);
						});
					} else {
						_readyFunction(api[apiName], completeNewApiName);
					}
				}
			}
		},

		/**
		 * Checks if apiName (function or object) is registered and initialiszed and executes callback
		 *
		 * @typedef $s.onApiReady
		 * @param apiName
		 * @param callback
		 */
		onApiReady: function(apiName, callback)
		{
			let splittedApiName = apiName.split(".");

			// The real magic is done here.
			// This function goes deeper in each step of the api-chain.
			function _onApiReady(api, apiStackToCheck, apiName)
			{
				let apiToCheck = apiStackToCheck.splice(0, 1);
				// Are there any chain segements to go deeper?
				if (apiStackToCheck.length === 0) { // no, we must check at the current depth.
					if (
						(typeof api[apiToCheck] === "object" && api[apiToCheck]._objectReady === true) ||
						typeof api[apiToCheck] === "function"
					) {
						// there is a object or a function with this name (apiToCheck) and it is ready.
						callback();
					} else {
						// there isn't a function or an object or the object isn't ready => CustomEvent.
						if (typeof $s._rF !== "undefined") {
							$s._rF.push(function ()
							{
								document.body.addEventListener("$s." + apiName + "::ready", callback);
							});
						} else {
							document.body.addEventListener("$s." + apiName + "::ready", callback);
						}
					}
				}
				if (apiStackToCheck.length > 0) {
					// we must go deeper...
					if (typeof api[apiToCheck] === "object") {
						// the object is there... lets do deeper
						_onApiReady(api[apiToCheck], apiStackToCheck, apiName);
					} else if (typeof api[apiToCheck] === "undefined") {
						// the object isn't there => CustomEvent...
						document.body.addEventListener("$s." + apiName + "::ready", callback);
					}
				}
			}

			_onApiReady($s, splittedApiName, apiName);
		}
	};

	/**
	 * Initializes all ready functions of $s' subobjects.
	 */
	$s.ready(function()
	{
		for (let i in $s._rF) {
			if (!isNaN(i) && typeof $s._rF[i] === "function") {
				$s._rF[i]();
			}
		}
		delete($s._rF);
	});

	/**
	 * Initializes all subobjects of $s.
	 */
	for (let i in $s) {
		if (typeof $s[i] === "object" && i !== "_rF") {
			$s._isapi($s, i, [i]);
		}
	}

	// default name is $s
	w[pvn || "$s"] = $s;
}(window, document));
