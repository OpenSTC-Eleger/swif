/*
* GENERIC Namespace
*/
/*
$.globalNamespace = { 
   
    var urlOpenERP = 'http://ociv-dev.siclic.fr:8069';
    var urlOE_Authentification = '/web/session/authenticate';
    var urlOE_VersionServer = '/web/webclient/version_info';
    var urlOE_SessionInformation = '/web/session/get_session_info';

    var urlOE_LireObject = '/web/dataset/search_read';
    var urlOE_LireObject2 = '/web/dataset/get';
    var urlOE_CreerObject = '/web/dataset/create';
    var urlOE_UpdateObject = '/web/dataset/save';
    var urlOE_DeleteObject = '/web/dataset/call';


    var userLogin = 'admin';
    var userPassword = 's4cl4c';
    var userBDD = 'opencivil_dev';

    var session_id = "";
    var uniq_id_counter = 0;
}; 








/*
* GENERIC FUNCTION FOR JSON/AJAX
*/


/** Formats an AJAX response to wrap JSON.
*/
function rpc_jsonp(url, payload) {

    "use strict";

    // extracted from payload to set on the url
    var data = {
        session_id: session_id,
        id: payload.id
    };

    var ajax = {
        type: "GET",
        dataType: 'jsonp',
        jsonp: 'jsonp',
        //async: false,
        cache: false,
        data: data,
        url: url
    };

    

    var payload_str = JSON.stringify(payload);
    console.debug(payload);

    var payload_url = $.param({r: payload_str});
    console.log(payload_url);
   if (payload_url.length > 2000) {
        //console.debug(payload_url);
        //console.log('Payload is too big.');
        throw new Error("Payload is too big.");
    }
    // Direct jsonp request
    ajax.data.r = payload_str;
    return $.ajax(ajax);

}

/** Formats a standard json 2.0 call
*/
function json(url, params) {

    "use strict";

    var deferred = $.Deferred();

    uniq_id_counter += 1;
    var payload = {
        'jsonrpc': '2.0',
        'method': 'call',
        'params': params,
        'id': ("r" + uniq_id_counter)
    };

    rpc_jsonp(url, payload).then(function (data, textStatus, jqXHR) {
        if (data.error) {
            deferred.reject(data.error);
        }
        deferred.resolve(data.result, textStatus, jqXHR);
    });

    return deferred;
}


/*
* OpenERP functions
*/

function login(){

    "use strict";

    var deferred = $.Deferred();

    json(urlOpenERP+urlOE_Authentification, {
        'base_location': urlOpenERP,
        'db': userBDD,
        'login': userLogin,
        'password': userPassword,
        'session_id': session_id
    }).done(function (data) {
        session_id = data.session_id;
        $('#login').html("Login successfull (session: " + session_id + ")");
        deferred.resolve();
    });

   return deferred;


}



function getInformationUser(){

    'use strict';
    
    json(urlOpenERP+urlOE_SessionInformation, {
        'session_id': '3b41f1dd366a48db88cb7d36f2af6b49'
    }).then(function (data) {
        console.debug(data)
    }).fail(function (error) {
        alert('Impossible de récupérer les informations de l\'utilisateur');
        console.debug(error);
    });

}




function getOEVersion(){

    'use strict';

    var versionOE = '';
    
    json('http://ociv-dev.siclic.fr:8069/web/webclient/version_info', {
        'session_id': session_id
    }).then(function (data) {
        versionOE = data.version;
        $('#versionOE').html(versionOE);
        console.log(versionOE)
    }).fail(function (error) {
        alert('Impossible de récupérer la version d\'OpenERP');
    });

    //alert(versionOE);
    return versionOE;

}



function readOfficier(){

    'use strict';

    
    json('http://ociv-dev.siclic.fr:8069/web/dataset/get', {
        'fields': ['prenoms_officiels', 'nom_de_famille', 'enable'],
        'ids': [5, 6],
        'model': 'opencivil.officer',
        'session_id': '3b41f1dd366a48db88cb7d36f2af6b49'
    }).then(function (data) {
        console.debug(data)
    }).fail(function (error) {
        alert('Impossible de lire l\'Officier');
        console.debug(error);
    });

    console.log('Youpiii');
    //alert(versionOE);
    //return versionOE;

}



function createOfficier(){

	'use strict';

        
    // On récupère les informations //
    var nomFamille = $('#nomFamille').val();
    var prenomsOfficiels = $('#nomFamille').val();
    var actif = $('#actif').is(':checked');
    
    json('http://ociv-dev.siclic.fr:8069/web/dataset/create', {
        'data': {'nom_de_famille': nomFamille, 'prenoms_officiels': prenomsOfficiels, 'enable': actif},
        'model': 'opencivil.officer',
        'session_id': '3b41f1dd366a48db88cb7d36f2af6b49'
    }).then(function (data) {
        console.debug(data)
    }).fail(function (error) {
        alert('Impossible de créer l\'Officier');
        console.debug(error);
    });

    console.log('Youpiii');
    //alert(versionOE);
    //return versionOE;

}




function updateOfficier(){

    'use strict';

    
    json('http://ociv-dev.siclic.fr:8069/web/dataset/save', {
        'data': {'nom_de_famille': 'SuperModification', 'prenoms_officiels': 'SupeModificartion', 'enable': false},
        'id': 10,
        'model': 'opencivil.officer',
        'session_id': '3b41f1dd366a48db88cb7d36f2af6b49'
    }).then(function (data) {
        console.debug(data)
    }).fail(function (error) {
        alert('Impossible de créer l\'Officier');
        console.debug(error);
    });

    //console.log('Youpiii');
    //alert(versionOE);
    //return versionOE;

}



function deleteOfficier(){

    'use strict';

    
    json('http://ociv-dev.siclic.fr:8069/web/dataset/call', {
        'method': 'unlink',
        'context_id': 1,
        'args': [[13], { 'lang': "fr_FR", 'tz': false, 'uid': 1 } ],
        'model': 'opencivil.officer',
        'session_id': '3b41f1dd366a48db88cb7d36f2af6b49'
    }).then(function (data) {
        console.debug(data);
        console.log('Officier correctement supprimer');
    }).fail(function (error) {
        alert('Impossible de supprimer l\'Officier');
        console.debug(error);
    });


}



function do_fetch() {

    "use strict";

    json('http://ociv-dev.siclic.fr:8069/web/dataset/search_read', {
        'model': 'res.partner',
        'fields': ['name', 'city'],
        'session_id': session_id
    }).then(function (data) {
        var str = "<ul>";
        var o;
        for (o in data.records) {
            str += "<li>" + data.records[o].name + " - " + data.records[o].city + "</li>";
        }
        str += "</ul>";
        $('#fetch').html(str);
    }).fail(function (error) {
        $('#fetch').html("<b>" + error.message + "</b>" + "\n\n<pre>" + error.data.debug + "</pre>");
        $('#fetch').addClass("Error");
    });
}




// Après le chargement de la page //
$(document).ready(function () {

    "use strict";

    //login().then(do_fetch);
    //login().then(getSessionInfos);

    //getOEVersion();




    // Ajout d'un Officier //
    $('#addOfficier').submit(function(e){
  
        createOfficier();

        e.preventDefault();
        return false;
    });

    //getInformationUser();




    $('li.external-event').each(function() {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
        title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 9999,
            revert: true,
            revertDuration: 0,
            appendTo: 'div.container-fluid',
            opacity: 0.5  //  original position after the drag
        });

    });





    // Calendrier //
     $('div.calendar').fullCalendar({
       // height: 660,
        defaultView: 'agendaWeek',
        aspectRatio: 1.30,
        header: {
            left: 'infosUser',
            center: 'title',
            right: 'today,prev,next'
        },
        titleFormat:{
            //week: "d { [ MMM] '-' d} MMM yyyy",
            week: "'Semaine ' W '<small class=hidden-phone> du' d { [ MMM] 'au' d} MMM yyyy '</small>'",
        },
        allDayText: 'Journée entière',
        axisFormat: 'H:mm',
        timeFormat: 'H:mm',
        slotMinutes: 120,
        firstHour: 8,
        minTime: 8,
        maxTime: 18,
        defaultEventMinutes: 120,
        dragOpacity: 0.5,
        weekends: true,
        editable: true,
        droppable: true,
        disableResizing: true,
        eventColor: '#378006',
        eventRender: function(evt, element){
            console.debug(element);

 
            
        },
        drop: function(date, allDay) { // this function is called when something is dropped

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('.calendar').fullCalendar('renderEvent', copiedEventObject, true);

               $.pnotify({
        title: 'Tâche attribuée',
        text: 'La tâche a correctement été attribué à l\'agent.'
    });

            $(this).remove();
     
        }
    })





    // Animated Scroll //
    $('ul.nav li a[href^="#"]').click(function(){  
        var elementID = $(this).attr("href");  
        
        $('html, body').animate({  
            scrollTop:$(elementID).offset().top -5
        }, 'slow');
        
        return false;
    });


    
});



