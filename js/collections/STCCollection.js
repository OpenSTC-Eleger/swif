/******************************************
* STC Collection
*/
app.Collections.STCCollection = Backbone.Collection.extend({
    
    cpt : 0,    
    
	
	/** count all models without restricts ( openerp search_count method call select count(*) request)
	*/
	count: function() {
		var self = this;

		return app.callObjectMethodOE([[]], this.model_name, 'search_count', app.models.user.getSessionID(), {
			success: function(data){
				self.cpt = data.result;
			}
		});
	}

});
