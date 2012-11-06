/******************************************
* APPLICATION NAMESPACE
*/

var openstm = {

    // Global variables //
    versionOpenSTM  : '0.1 alpha',
    userBDD         : 'pontlabbe',
    uniq_id_counter : 0,
    
    urlOE                       : 'http://octm-dev.siclic.fr:8069',
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

        // Retrieve Application language //
        $.ajax({
            type: 'GET', url: 'i18n/'+lang+'/openstm-lang.json', dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                
                openstm.lang = data;

                // Load internationalization script //
                openstm.loadI18nScript(lang);

                // Instantiation Collections users  et user //
                openstm.collections.users = new openstm.Collections.Users();
                openstm.collections.users.fetch();
                openstm.models.user = new openstm.Models.User();

                // Router initialization //
                openstm.router = new openstm.Router();
                // Listen url changes //
                Backbone.history.start();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Error: JSON value');
            }
        });

    },



    /** Load internationalization scripy
    */
    loadI18nScript: function (lang) {
        var script = document.createElement( 'script' );
        script.type = 'text/javascript'; script.src = 'i18n/'+lang+'/moment-lang.js';
        $("#openstm").append( script );


        // I18N Moment JS //
        moment.lang(lang);
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

        openstm.uniq_id_counter += 1;
        var payload = {
            'jsonrpc' : '2.0',
            'method'  : 'call',
            'params'  : params,
            'id'      : ("r" + openstm.uniq_id_counter)
        };

        openstm.rpc_jsonp(url, payload, options).then(function (data, textStatus, jqXHR) {
            if (data.error) {
                deferred.reject(data.error);
            }
            deferred.resolve(data.result, textStatus, jqXHR);
        });

        return deferred;
    },


    /** Retrieve an object from OpenERP
    */
    getOE : function (model, ids, session_id, options) {
        this.json(this.urlOE + this.urlOE_readObject, {
            'model'     : model,
            'fields'    : [],
            'ids'       : [ids],
            'session_id': session_id
        },options)
    },


    /** Retrieve a list from OpenERP
    */
    readOE : function (model, session_id, options) {
        this.json(this.urlOE + this.urlOE_retrieveListe, {
            'model'     : model,
            'fields'    : [],
            'session_id': session_id
        },options)
    },
    

    /** Delete object from OpenERP
    */
    deleteOE : function (args,model,session_id,options) {
        this.json(this.urlOE + this.urlOE_deleteObject, {
            'method'    : this.methodOE_delete,
            'args'      : args, 
            'model'     : model,
            'session_id': session_id      
       },options);  
    },
        

    /** Save object in OpenERP
    */
    saveOE : function (data, id, model, session_id, options) {
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
           },options);      
    },

/*
    loadTemplate : function(id, callback){


        var template = openstm.templates[id];

        if (template) {
          callback(template);
        }
        else {
 

        // Retrieve Application language //
        $.ajax({
            type: 'GET', url: 'templates/' + id + '.html',
            success: function(data, textStatus, jqXHR) {
                var $tmpl = $(template);
                openstm.templates[id] = $tmpl;
                callback($tmpl);
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('Unable to retrieve template');
            }
        });

       }
    },

*/





    /** Error Notification
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
            opacity: .8,
            icon: true,
            animation: "slide",
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
	
    openstm.init('fr');
    

    
});


