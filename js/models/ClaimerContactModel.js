/******************************************
* Claimer Contact Model
*/
app.Models.ClaimerContact = Backbone.RelationalModel.extend({

	urlRoot: "/api/open_object/partner_addresses",

	/** Model Initialization
	 */
	initialize: function () {

	},

	getInformations: function () {
		return {name: this.get('name')};
	}
});
