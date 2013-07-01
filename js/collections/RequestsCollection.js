/******************************************
* Requests Collection
*/
app.Collections.Requests = Backbone.Collection.extend({

    model: app.Models.Request,

    // Model name in the database //
    model_name : 'openstc.ask',
    
    cpt : 0,

    
    
    /** Collection Initialization
    */
    initialize: function (options) {
    	//console.log('Requests collection Initialization');
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
        var mCreateDate = moment(item.get('create_date'))
        item.set({'create_date': mCreateDate});
        return -item.get('create_date');
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
