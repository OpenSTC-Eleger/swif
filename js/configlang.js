/******************************************
* APPLICATION NAMESPACE
*/
define('select2-lang', [
	'app'
], function(app) {

	console.log(app.config.lang);

	$.getScript('lol/select2-lang.js');

});
