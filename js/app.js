/******************************************
* APPLICATION NAMESPACE
*/

var app = {


	// Global variables app //
	uniq_id_counter: 0,

	url_authentication     	 : '/sessions',
	urlOE_versionServer      : '/web/webclient/version_info',
	urlOE_sessionDestroy     : '/web/session/destroy',
	urlOE_sessionInformation : '/web/session/get_session_info',
	urlOE_menuUser           : '/web/menu/load',
	urlOE_retrieveListe      : '/web/dataset/search_read',
	urlOE_readObject         : '/web/dataset/get',
	urlOE_createObject       : '/web/dataset/create',
	urlOE_updateObject       : '/web/dataset/save',
	urlOE_deleteObject       : '/web/dataset/call',
	urlOE_object             : '/web/dataset/call',


	// Classes //
	Collections     : {},
	Models          : {},
	Views           : {},

	// Instances //
	properties      : {},
	routes          : {},
	configuration   : {},
	lang            : {},
	collections     : {},
	models          : {},
	views           : {},
	templates       : {},



	/** Application initialization
	*/
	init: function (lang) {
		var self = this;


		// Retrieve App properties, configuration and language //
		$.when(app.loadStaticFile('properties.json'), app.loadStaticFile('config/configuration.json'), app.loadStaticFile('config/routes.json'), app.loadI18nScripts(lang))
			.done(function (properties_data, configuration_data, routes_data, lang_data) {

				// Set the app properties configuration and language //
				app.properties    = properties_data[0];
				app.config 		  = configuration_data[0];
				app.routes        = routes_data[0];
				app.lang          = lang_data[0];


				// Instantiation of UsersCollections & UserModel //
				app.collections.users           = new app.Collections.Users();
				app.collections.users.fetch();
				app.models.user                 = new app.Models.User();


				//app.models.team               = new app.Models.Team();
				app.models.task                 = new app.Models.Task();
				app.models.intervention         = new app.Models.Intervention();
				app.models.request              = new app.Models.Request();
				app.models.place                = new app.Models.Place();
				app.models.service              = new app.Models.ClaimerService();
				app.models.categoryTask         = new app.Models.CategoryTask();
				app.models.categoryIntervention = new app.Models.CategoryIntervention();
				app.models.claimerContact       = new app.Models.ClaimerContact();
				app.models.claimerType          = new app.Models.ClaimerType();


				// Set the Ajax Setup //
				self.setAjaxSetup();

				// Router initialization //
				app.router = new app.Router();

				// Listen url changes //
				Backbone.history.start({pushState: false});
			})
			.fail(function(){
				console.error('Unable to init the app');
			});

	},



	/** Load internationalization scripts
	*/
	loadI18nScripts: function (lang) {

		var langFiles = ['moment-lang.js', 'bootstrap-datepicker-lang.js', 'select2-lang.js'];
		
		return $.getJSON('i18n/'+lang+'/app-lang.json')
			.success(function(data) {
			
				_.each(langFiles, function(file){
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = 'i18n/' + lang + '/' + file;
					$('#app').append(script);
				});

				// I18N Moment JS //
				moment.lang(lang);

			})
			.fail(function(){
				alert('Impossible de charger les fichiers de langues');
			});
	},



	/** Load Static file
	*/
	loadStaticFile: function (url) {
		return $.getJSON(url)
			.success(function (data) {
			})
			.fail(function () {
				alert('Impossible de charger le fichier') + url;
			});
	},



	setAjaxSetup: function(){

		// Set The Ajax Config //
		$.ajaxSetup({
			contentType: "application/json",
			headers: {Authorization: 'Token token=' + app.models.user.getAuthToken()},
			statusCode: {
				401: function () {
					console.error('---> Ajax Setp Up 401, redirect to the home page <---');
					// Redirect the to the login page //
					app.router.navigate(app.routes.login.url, {trigger: true, replace: true});
				},
				502: function(){
					app.notify('large', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);
				}
			}
		});

	},



	/******************************************
	* GENERIC FUNCTION FOR JSON/AJAX
	*/

	/** Formats an AJAX response to wrap JSON.
	*/
	rpc_jsonp: function(url, payload, options) {

		"use strict";

		// Extracted from payload to set on the url //
		var data = {
			session_id: '',
			id: payload.id
		};

		var ajax = _.extend({
			type: 'GET',
			dataType: 'jsonp',
			jsonp: 'jsonp',
			cache: false,
			data: data,
			url: url
		}, options);


		var payload_str = JSON.stringify(payload);
		console.debug(payload);

		var payload_url = $.param({r: payload_str});

		if (payload_url.length > 2000) {
			throw new Error('Payload is too big.');
		}
		// Direct jsonp request
		ajax.data.r = payload_str;
		return $.ajax(ajax);

	},



	/** Formats a standard JSON 2.0 call
	*/
	json: function (url, params, options) {

		"use strict";

		var deferred = $.Deferred();

		app.uniq_id_counter += 1;
		var payload = {
			'jsonrpc' : '2.0',
			'method'  : 'call',
			'params'  : params,
			'id'      : ("r" + app.uniq_id_counter)
		};

		app.rpc_jsonp(url, payload, options).then(function (data, textStatus, jqXHR) {
			if (data.error) {
				deferred.reject(data.error);
			}
			deferred.resolve(data.result, textStatus, jqXHR);
		});

		return deferred;
	},



	/** Retrieve an object from OpenERP
	*/
	getOE : function (model, fields, ids, session_id, options) {
		return this.json(app.config.openerp.url + this.urlOE_readObject, {
			'model'     : model,
			'fields'    : fields, 
			'ids'       : ids
		}, options
	)},



	/** Retrieve a list from OpenERP
	*/
	readOE : function (model, session_id, options, fields) {

		var params = {
			'model'     : model,
			'session_id': session_id
		}

		// Limit - Offset //
		if(!_.isUndefined(options.limitOffset)){
		 	params.limit = options.limitOffset.limit;
		 	params.offset = options.limitOffset.offset;
		}


		// args - domain //
		if(!_.isUndefined(options.search)){
			params.domain = options.search;
		}


		// Sort by / Order //
		if(!_.isUndefined(options.sortBy)){
			params.sort = options.sortBy;
		}


		// Fields //
		if(_.isUndefined(fields)){ 
			params.fields = [];
		}else{
			params.fields = fields;
		}


		return this.json(app.config.openerp.url + this.urlOE_retrieveListe, params, options)
	},


	/** Delete object from OpenERP
	*/
	deleteOE : function (args,model,session_id,options) {
		this.json(app.config.openerp.url + this.urlOE_deleteObject, {
			'method'    : 'unlink',
			'args'      : args, 
			'model'     : model,
			'session_id': session_id
		}, options);  
	},


	/** Save object in OpenERP
	*/
	saveOE : function (id, data, model, session_id, options) {
		if(id)
			this.json(app.config.openerp.url + this.urlOE_updateObject, {
				'data'      : data, 
				'model'     : model, 
				'id'        : id,
				'session_id': session_id      
		   },options);
		else
			this.json(app.config.openerp.url + this.urlOE_createObject, {
					'data'      : data, 
					'model'     : model,                 
					'session_id': session_id      
		   }, options);      
	},


	/** call object method from OpenERP
	*/
	callObjectMethodOE : function (args, model, method, session_id, options) {
		return this.json(app.config.openerp.url + this.urlOE_object, {
			'method'    : method,
			'args'      : args, 
			'model'     : model,
			'session_id': session_id      
	   }, options);  
	},


	/** Page Loader
	*/
	loader: function(action){

		var deferred = $.Deferred();

		switch(action){
			case 'display':
				$('#loader, #modal-block').fadeIn(250, deferred.resolve);
			break;

			case 'hide':
				$('#loader, #modal-block').fadeOut(450, deferred.resolve);
			break;
		}

		return deferred.promise();
	},


	/** Transform Decimal number to hour:minute
	*/
	decimalNumberToTime: function(decimalNumber){

		// Check if the number is decimal //
		if(_.str.include(decimalNumber, '.')){
			var minutes = _.lpad(((_.rpad(_(decimalNumber).strRight('.'), 2, '0') / 100) * 60), 2, '0');
			var hour = _(decimalNumber).strLeft('.');

			if(hour == 0){
				var date = _(minutes).toNumber()+app.lang.minuteShort;
			}
			else{
				var date = hour+'h'+_(minutes).toNumber();    
			}
		}
		else{
			var date = decimalNumber+'h';
		}
		
		return date;
	},



	/** Calcul the page and the offset
	*/
	calculPageOffset: function(page){

		var paginate = {};

		if(_.isUndefined(page)){
			paginate.page = 1;
			paginate.offset = 0;
		}
		else{
			paginate.page = parseInt(page, 10);
			paginate.offset = (paginate.page - 1) * app.config.itemsPerPage;
		}

		return paginate;
	},


	/** Calcul the sort By column and the order
	*/
	calculPageSort: function(sort){

		var sorter = {};

		sorter.by = _(sort).strLeft('-');
		sorter.order = _(sort).strRight('-');

		return sorter;
	},

	objectifyFilters: function (filterArray) {
		return $.extend({},filterArray);
	},


	/** Calcul the Filter By
	*/
	calculPageFilter: function(filter){

		var filt = {};

		filt.by = _(filter).strLeft('-');
		filt.value = _(filter).strRight('-');

		return filt;
	},


	/** Calcul the search argument of the page
	 */
	calculSearch: function (searchQuery, searchableFields) {

		//['|', ["name", "ilike", searchQuery], ["surface", "=", _(searchQuery).toNumber()]];
		//['&', ["state", "ilike", 'valid'], '|', ["name", "ilike", 'demande'], ["id", "=", _('demande').toNumber()]];

		var search = [];

		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		};

		function convertFieldFilters(fieldsFilters) {
			var convertedFilters = [];

			function convertFilter(filter, operator) {
				return {key:filter.key, type: operator};
			};

			_.each(fieldsFilters, function (filter, index) {
				switch (filter.type) {
					case 'numeric':
						if (isNumber(searchQuery.search)) {
							convertedFilters.push(convertFilter(filter, '='));
						}
						break;
					case 'text':
						convertedFilters.push(convertFilter(filter, 'ilike'));
						break;
				}
			});
			return convertedFilters;
		};

		var filteredAndConvertedFilters = convertFieldFilters(searchableFields);

		function buildFilterObject(field,operator,value) {
			return {field: field, operator:operator, value:value}
		};

		// Check if there is a filter //
		if (!_.isUndefined(searchQuery.filter)) {
			if (!_.isUndefined(searchQuery.search)) {
				search.push('&');
			}
			search.push( buildFilterObject(searchQuery.filter.by,'ilike',searchQuery.filter.value));
		}

		// Check if there is a Search //
		if (!_.isUndefined(searchQuery.search)) {
			// Search on several fields //
			if (_.size(filteredAndConvertedFilters) > 1) {
				search.push('|');
				_.each(filteredAndConvertedFilters, function (item, index) {
					if (item.type == '=' && isNumber(searchQuery.search)) {
						var term = _(searchQuery.search).toNumber();
					} else {
						var term = searchQuery.search;

					}
					search.push(buildFilterObject(item.key,item.type,term));
				});
			}
			else {
				search.push( buildFilterObject(filteredAndConvertedFilters[0].key,filteredAndConvertedFilters[0].type,searchQuery.search));
			}
		}

		return app.objectifyFilters(search);
	},



	/** Notification Message
	*/
	notify: function(notifyModel, type, title, message) {

		"use strict";

		switch(notifyModel){
			case 'large' :
				var addClass = 'stack-bar-top big-icon';
				var width = '50%';
				var delay = 4500;
				var hide = true;
			break;

			default:
				var addClass = '';
				var width = '320px';
				var delay = 4500;
				var hide = true;
			break;

		}

		$.pnotify({
			title: title,
			text: message,
			addclass: addClass,
			width: width,
			type: type,
			hide: hide,
			animate_speed: 'normal',
			opacity: .9,
			icon: true,
			animation: 'slide',
			closer: true,
			closer_hover: false,
			delay: delay
		});
	}


};



// No conflict between Underscore && Underscore String //
_.mixin(_.str.exports());


/******************************************
* AFTER THE LOADING OF THE PAGE
*/
$(document).ready(function () {
	app.init('fr');
});
