/******************************************
* Places Collection
*/
app.Collections.Places = Backbone.Collection.extend({

    model: app.Models.Place,

    // Model name in the database //
    model_name : 'openstc.site',

   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Place collection Initialization');
    	this.count();
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {
    	app.readOE( this.model_name, app.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) {
        return response.result.records;
    },
    
    

    /** Comparator for ordering collection
    */
    comparator: function(item) {
	  return _.titleize( item.get('name').toLowerCase() ) ;
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
