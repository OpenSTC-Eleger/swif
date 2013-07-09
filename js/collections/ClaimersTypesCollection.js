/******************************************
* Claimers Types Collection
*/
app.Collections.ClaimersTypes = app.Collections.STCCollection.extend({

    model: app.Models.ClaimerType,

    // Model name in the database //
    model_name : 'openstc.partner.type',

    url: 'type-demandeurs',


    /** Collection Initialization
    */
    initialize: function (options) {
    	//console.log('Claimer type collection Initialization');
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {
        var fields = ["claimers", "code", "id", "name"];

    	return app.readOE(this.model_name, app.models.user.getSessionID(), options, fields);
    },



	/** Collection Parse
	*/
	parse: function(response) { 
		return response.result.records;
//		return _.reject(response.result.records, function(record){
//			return record.code == "ADMINISTRE";
//		})
	},



	/** Comparator for ordering collection
    */
    comparator: function(item) {
 	  return item.get("name");
 	},


});
