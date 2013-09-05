/******************************************
* Claimer Contact Model
*/
app.Models.ClaimerContact = app.Models.GenericModel.extend({

	urlRoot : "/api/open_object/partner_addresses",


	getInformations: function () {
		return this.getName();
	}
});