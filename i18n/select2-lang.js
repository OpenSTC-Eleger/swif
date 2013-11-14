/******************************************
* Select2 lang
*/
define('select2-lang', [
	'app'
], function(app) {

	$.getScript('i18n/'+app.config.lang+'/select2-lang.js');

});
