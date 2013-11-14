/******************************************
* Select2 lang
*/
define('bsDatepicker-lang', [
	'app'
], function(app) {

	$.getScript('i18n/'+app.config.lang+'/bootstrap-datepicker-lang.js');

});
