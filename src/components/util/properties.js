module.exports = properties;


function properties (instance, init_params, props) {

	init_params = init_params || {};
	if (init_params === true) {
		init_params = {};
	}

	var is_initialized = false;

	/*	Define them all
	------------------------------------------*/
		_.forEach(props, function (params, property) {

			var prop_key = _.snakeCase(property),
				set_method_key = _.camelCase('set ' + property),
				get_method_key = _.camelCase('get ' + property),
				toggle_method_key = _.camelCase('toggle ' + property),
				is_required = !! params.required;

			if (is_required && ! (prop_key in init_params)) {
				throw new Error('Cannot construct `' + instance.constructor.name + '`, the required parameter `' + prop_key + '` is missing.');
			}

			/*	Update for special cases
			------------------------------------------*/
				if (properties.special_cases[property]) {
					prop_key = properties.special_cases[property].prop_key;
					set_method_key = properties.special_cases[property].set;
					get_method_key = properties.special_cases[property].get;
					toggle_method_key = properties.special_cases[property].toggle;
				}


			/*	Maybe create "set" method
			------------------------------------------*/
				if ( ! (set_method_key in instance.constructor.prototype)) {

					instance.constructor.prototype[set_method_key] = function (new_val, _silent) {
						var this_instance = this,
							old_val = this_instance[prop_key];


						/*	New & Old are equal - Stop here
						------------------------------------------*/
							if (_.isEqual(this_instance[prop_key], new_val)) {
								return this_instance;
							}


						/*	Maybe call `prep`
						------------------------------------------*/
							if (params.prep) {
								new_val = params.prep.call(this, new_val);
							}


						/*	Validate typeof value
						------------------------------------------*/
							if (params.types) {
								switch (typeof new_val) {
									case 'undefined':
										throw new Error(set_method_key + ' does not accept a value of type ' + typeof(new_val));

									case 'object':
										if (new_val === null) {
											if ( ! _.contains(params.types, 'null')) {
												throw new Error(set_method_key + ' does not accept a value of type null');
											}
										} else if (new_val instanceof Date) {
											if ( ! _.contains(params.types, 'date')) {
												throw new Error(set_method_key + ' does not accept a value of type date');
											}
										} else if (_.isArray(new_val)) {
											 if( ! _.contains(params.types, 'array')) {
												throw new Error(set_method_key + ' does not accept a value of type array');
											}
										} else {
											if ( ! _.contains(params.types, 'object')) {
												throw new Error(set_method_key + ' does not accept a value of type object');
											}
										}
										break;

									case 'string':
									case 'number':
									case 'boolean':
										if ( ! _.contains(params.types, typeof new_val)) {
											throw new Error(set_method_key + ' does not accept a value of type ' + typeof(new_val));
										}
										break;
								}
							}


						/*	Maybe call `validator`
						------------------------------------------*/
							if (params.validator) {
								if (params.validator.call(this, new_val, old_val) === false) {
									throw new Error('Cannot set `' + prop_key + '` to the invalid value `' + new_val + '`.');
								}
							}


						/*	We made it this far... so update it
						------------------------------------------*/
							this_instance[prop_key] = new_val;


						/*	If a function, set value to response
						------------------------------------------*/
							if (typeof(this_instance[prop_key]) == "function") {
								this_instance[prop_key] = this_instance[prop_key].call(this_instance);
							}


						/*	Maybe call `handler`
						------------------------------------------*/
							if (params.handler) {
								params.handler.call(this_instance, new_val, old_val, _silent);
							}


						/*	If rendered, maybe call `renderHandler`
						------------------------------------------*/
							if (params.renderHandler && this_instance.$el) {
								params.renderHandler.call(this_instance, new_val, old_val);
							}


						/*	Maybe fire change events
						------------------------------------------*/
						if ( ! _silent && is_initialized) {
							this_instance.triggerHandler('change', [prop_key, new_val, old_val]);
							this_instance.triggerHandler('change:' + prop_key, [new_val,old_val]);
						}

						// Return self -- Chainable!
						return this_instance;
					};
				}


			/*	Maybe create "toggle" method
			------------------------------------------*/
				if (params.toggleable === true) {
					if ( ! (toggle_method_key in instance.constructor.prototype)) {
						instance.constructor.prototype[toggle_method_key] = function () {
							return this[set_method_key]( ! this[prop_key]);
						};
					}
				}


			/*	Maybe create "get" method
			------------------------------------------*/
				if (params.getter === true) {
					if ( ! (get_method_key in instance.constructor.prototype)) {
						instance.constructor.prototype[get_method_key] = function () {
							return this[prop_key];
						};
					}
				}
		});


	/*	The initial, first call
	------------------------------------------*/
		_.forEach(props, function (params, property) {
			var prop_key = _.snakeCase(property),
				set_method_key = _.camelCase('set ' + property);

			/*	Update for special cases
			------------------------------------------*/
				if (properties.special_cases[property]) {
					prop_key = properties.special_cases[property].prop_key;
					set_method_key = properties.special_cases[property].set;
				}

			var new_value = (prop_key in init_params) ? init_params[prop_key] : params.default;

			instance[set_method_key](new_value);

			if (params.renderHandler) {
				instance.on('render', function () {
					params.renderHandler.call(instance, instance[prop_key]);
				});
			}
		});

	is_initialized = true;
}

/*	Static properties
------------------------------------------*/
	properties.special_cases = {};
