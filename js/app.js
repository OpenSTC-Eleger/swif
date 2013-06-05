/******************************************
* APPLICATION NAMESPACE
*/

var app = {

	
	//test	
	// Global variables app //
	appVersion      : '1.0.0-alpha',
	userBDD         : 'pontlabbe2',
	uniq_id_counter : 0,	
	
	startLunchTime	: 12.0,
	stopLunchTime	: 14.0,
	

//    urlOE                       : 'http://localhost:8069',
//    urlGEO_OWS                  : 'http://localhost:8080/geoserver/ows',
//    urlGEO_WFS                  : 'http://localhost:8080/geoserver/wfs',
//    urlGEO_NS                   : 'http://localhost:8080/openstc',
//    geoportail_key				: 'c5r5vzh6cxavj6wm90kz09i5',
	


	urlGEO_OWS                  : 'http://octm-dev.siclic.fr:8080/geoserver/ows',
	urlGEO_WFS                  : 'http://octm-dev.siclic.fr:8080/geoserver/wfs',
	urlGEO_NS                   : 'http://octm-dev.siclic.fr:8080/openstc',
	urlOE                       : 'http://octm-dev.siclic.fr:8069', 
	geoportail_key				: '67pp504oivujlyi0l893925n',


	/*urlOE                     : 'http://46.105.77.18:8069',
	urlGEO_OWS                  : 'http://46.105.77.18:8080/geoserver/ows',
	urlGEO_WFS                  : 'http://46.105.77.18:8080/geoserver/wfs',
	urlGEO_NS                   : 'http://46.105.77.18:8080/openstc',
	geoportail_key				: '67pp504oivujlyi0l893925n', */


	urlOE_authentication        : '/web/session/authenticate',
	urlOE_versionServer         : '/web/webclient/version_info',
	urlOE_sessionDestroy        : '/web/session/destroy',
	urlOE_sessionInformation    : '/web/session/get_session_info',
	urlOE_menuUser              : '/web/menu/load',
	urlOE_retrieveListe         : '/web/dataset/search_read',
	urlOE_readObject            : '/web/dataset/get',
	urlOE_createObject          : '/web/dataset/create',
	urlOE_updateObject          : '/web/dataset/save',
	urlOE_deleteObject          : '/web/dataset/call',
	urlOE_object          		: '/web/dataset/call',



	// Classes //
	Collections     : {},
	Models          : {},
	Views           : {},

	// Instances //
	collections     : {},
	models          : {},
	views           : {},
	lang            : {},
	templates       : {},



	/** Application initialization
	*/
	init: function (lang) {

		// Tell OpenLayers where the control images are //remember the trailing slash //fn
		OpenLayers.ImgPath = 'css/vendors/openlayers/img/';

		// Retrieve Application language //
		$.ajax({
			type: 'GET', url: 'i18n/'+lang+'/app-lang.json', dataType: 'json',
			success: function(data, textStatus, jqXHR) {
				
				app.lang = data;


				// Load internationalization scripts //
				app.loadI18nScripts(lang);


				// Instantiation Collections users  et user //
				app.collections.users = new app.Collections.Users();
				app.collections.users.fetch();
				app.models.user = new app.Models.User();
				//app.models.team = new app.Models.Team();
				app.models.task = new app.Models.Task();
				app.models.taskWork = new app.Models.TaskWork();
				app.models.intervention = new app.Models.Intervention();
				app.models.request = new app.Models.Request();
				app.models.place = new app.Models.Place();
				app.models.service = new app.Models.ClaimerService();
				app.models.categoryTask = new app.Models.CategoryTask();
				app.models.categoryIntervention = new app.Models.CategoryIntervention();
				app.models.claimerContact = new app.Models.ClaimerContact();
				app.models.claimerType = new app.Models.ClaimerType();

				// Router initialization //
				app.router = new app.Router();
				// Listen url changes //
				Backbone.history.start();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Error: JSON value');
			}
		});

	},
	

	/** Load internationalization scripts
	*/
	loadI18nScripts: function (lang) {
		
		if(lang != 'en'){

			var script = document.createElement('script');
			script.type = 'text/javascript'; script.src = 'i18n/'+lang+'/moment-lang.js';
			$("#app").append(script);

			var script = document.createElement('script');
			script.type = 'text/javascript'; script.src = 'i18n/'+lang+'/bootstrap-datepicker-lang.js';
			$("#app").append(script);

			// I18N Moment JS //
			moment.lang(lang);
		}
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
			type: "GET",
			dataType: 'jsonp',
			jsonp: 'jsonp',
			//async: false,
			cache: false,
			data: data,
			url: url
		}, options);


		var payload_str = JSON.stringify(payload);
		console.debug(payload);

		var payload_url = $.param({r: payload_str});

		if (payload_url.length > 2000) {
			throw new Error("Payload is too big.");
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
		this.json(this.urlOE + this.urlOE_readObject, {
			'model'     : model,
			'fields'    : fields, 
			'ids'       : ids,
			'session_id': session_id
		}, options)

	},


	/** Retrieve a list from OpenERP
	*/
	readOE : function (model, session_id, options) {
		this.json(this.urlOE + this.urlOE_retrieveListe, {
			'model'     : model,
			'fields'    : [],
			'session_id': session_id
		}, options)
	},


	/** Delete object from OpenERP
	*/
	deleteOE : function (args,model,session_id,options) {
		this.json(this.urlOE + this.urlOE_deleteObject, {
			'method'    : "unlink",
			'args'      : args, 
			'model'     : model,
			'session_id': session_id      
	   }, options);  
	},
		

	/** Save object in OpenERP
	*/
	saveOE : function (id, data, model, session_id, options) {
		if(id)
			this.json(this.urlOE + this.urlOE_updateObject, {
				'data'      : data, 
				'model'     : model, 
				'id'        : id,
				'session_id': session_id      
		   },options);
		else
			this.json(this.urlOE + this.urlOE_createObject, {
					'data'      : data, 
					'model'     : model,                 
					'session_id': session_id      
		   }, options);      
	},
	
	/** call object method from OpenERP
	*/
	callObjectMethodOE : function (args,model,method,session_id,options) {
		this.json(this.urlOE + this.urlOE_object, {
			'method'    : method,
			'args'      : args, 
			'model'     : model,
			'session_id': session_id      
	   }, options);  
	},

/*
	loadTemplate : function(id, callback){


		var template = app.templates[id];

		if (template) {
		  callback(template);
		}
		else {
 

		// Retrieve Application language //
		$.ajax({
			type: 'GET', url: 'templates/' + id + '.html',
			success: function(data, textStatus, jqXHR) {
				var $tmpl = $(template);
				app.templates[id] = $tmpl;
				callback($tmpl);
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert('Unable to retrieve template');
			}
		});

	   }
	},

*/

	/** Page Loader
	*/
	loader: function(action){

		switch(action){
			case 'display':
				$('#loader, #modal-block').fadeIn();
			break;

			case 'hide':
				$('#loader, #modal-block').delay(250).fadeOut('slow');
			break;
		}
	},



	/** Transform Decimal number to hour:minute
	* Type: human or default
	*/
	decimalNumberToTime: function(decimalNumber, type){

		// HUMAN DATE //
		if(type == 'human'){
			var separator = 'h';
			var separatorLeft = '';
			var separatorRight = 'h';
		}
		// COMPUTER DATE //
		else{
			var separator = ':';
			var separatorLeft = '00:';
			var separatorRight = ':00';
		}


		// Check if the number is decimal //
		if(_.str.include(decimalNumber, '.')){
			var minutes = _.lpad(((_.rpad(_(decimalNumber).strRight('.'), 2, '0') / 100) * 60), 2, '0');
			var hour = _(decimalNumber).strLeft('.');

			if(hour == 0){
				var date = separatorLeft+_(minutes).toNumber()+app.lang.minuteShort;
			}
			else{
				var date = hour+separator+_(minutes).toNumber();    
			}
		}
		else{
			var date = decimalNumber+separatorRight;
		}
		
		return date;
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


