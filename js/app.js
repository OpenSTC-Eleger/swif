/******************************************
* APPLICATION NAMESPACE
*/

var app = {


	// Global variables app //
	url_authentication     	 : '/sessions',


	// Classes //
	Collections     : {},
	Models          : {},
	Views           : {},
	Helpers         : {},

	// Instances //
	properties      : {},
	routes          : {},
	configuration   : {},
	lang            : {},
	collections     : {},
	models          : {},
	views           : {},



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
				
				if(_.isEmpty(app.collections.users.models)){
					app.models.user = new app.Models.User();
					app.collections.users.add(app.models.user);
				}
				else{
					app.models.user = app.collections.users.at(0);	
				}
				

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
					console.error('---> Ajax Setp Up 401, redirect to the login page <---');
					// Redirect the to the login page //
					app.router.navigate(app.routes.login.url, {trigger: true, replace: true});
				},
				500: function(){
					// Server unreachable //
					app.notify('large', 'error', app.lang.errorMessages.serverError, '');
				},
				502: function(){
					// Server unreachable //
					app.notify('large', 'error', app.lang.errorMessages.connectionError, app.lang.errorMessages.serverUnreachable);
				}
			}
		});

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
	calculPageOffset: function(page, itemsPerPage){

		var paginate = {};

		if(_.isUndefined(page)){
			paginate.page = 1;
			paginate.offset = 0;
		}
		else{
			paginate.page = parseInt(page, 10);
			paginate.offset = (paginate.page - 1) * (!_.isUndefined(itemsPerPage) ? itemsPerPage : app.config.itemsPerPage);
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

		// Is Number //
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		};

		
		// Convert Field Filters //
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
			for(var i=1;i < _.size(filteredAndConvertedFilters);i++){
				search.push('|');
			}

			if (_.size(filteredAndConvertedFilters) > 1) {
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
				var width    = '50%';
				var delay    = 4500;
				var hide     = true;
			break;

			default:
				var addClass = '';
				var width    = '320px';
				var delay    = 4500;
				var hide     = true;
			break;

		}

		$.pnotify({
			title        : title,
			text         : message,
			addclass     : addClass,
			width        : width,
			type         : type,
			hide         : hide,
			animate_speed: 'normal',
			opacity      : .9,
			icon         : true,
			animation    : 'slide',
			closer       : true,
			closer_hover : false,
			delay        : delay
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