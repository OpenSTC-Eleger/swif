/******************************************
* STC Collection
*/
app.Collections.STCCollection = Backbone.Collection.extend({
    
    cpt : 0,    
    
	/** Collection Initialization
	*/
	/*initialize: function (options) {
		console.log('Interventions collection Initialization');		
		this.count();
	},*/

	
	/** count all models without restricts ( openerp search_count method call select count(*) request)
	*/
	count: function() {
		var self = this;
		app.callObjectMethodOE([[]], this.model_name, 'search_count', app.models.user.getSessionID(), {
			success: function(data){
				self.cpt = data.result;
			}
		});
	}

});
