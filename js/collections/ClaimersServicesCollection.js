/******************************************
* Claimers Services Collection
*/
app.Collections.ClaimersServices = Backbone.Collection.extend({

    model : app.Models.ClaimerService,

    // Model name in the database //
    model_name : 'openstc.service',

    url: 'demandeurs-services',
    


    /** Collection Initialization
    */
    initialize : function() {
        console.log('Claimer Service collection initialize');
        this.count();
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {
    	app.readOE(this.model_name, app.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) {
        return response.result.records;
    },
    


    /** Comparator for ordering collection
    */
    comparator: function(item) {
	   return item.get('name');
	},
	
	/** count all models without restricts ( openerp search_count method call select count(*) request)
	*/	
	count: function() {
		var self = this;
		app.callObjectMethodOE([[]], this.model_name, "search_count", app.models.user.getSessionID(), {
			success: function(data){
				self.cpt = data.result;
			}
		});
	},

});
