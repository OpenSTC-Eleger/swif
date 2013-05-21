//test





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



