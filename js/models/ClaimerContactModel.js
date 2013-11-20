define([
	'genericModel',

], function(GenericModel){

	'user strict';


	/******************************************
	* Claimer Contact Model
	*/
	var ClaimerContactModel = GenericModel.extend({

		urlRoot : "/api/open_object/partner_addresses",


		getInformations: function () {
			return this.getName();
		}

	});

return ClaimerContactModel;

});