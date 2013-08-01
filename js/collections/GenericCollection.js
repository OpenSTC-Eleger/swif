/******************************************
* STC Collection
*/
app.Collections.GenericCollection = Backbone.Collection.extend({
    
	cpt        : 0,
	
	specialCpt : 0,
    
	
	/** count all models without restricts ( openerp search_count method call select count(*) request)
	*/
	count: function(options) {
		var self = this;

		// Check if a search are perform //
		var domain = null;
		if(_.isUndefined(options.search)){
			domain = [[]];
		}
		else{
			domain = [options.search]
		}


		return app.callObjectMethodOE(domain, this.model_name, 'search_count', app.models.user.getSessionID(), {
			success: function(data){
				self.cpt = data.result;
			}
		});
	},


	specialCount: function(modelName){
		var self = this;

		return app.callObjectMethodOE([[app.models.user.getUID()]], modelName, "getNbRequestsTodo", app.models.user.getSessionID(),{
    	
	    	//forme de data.result (dans le callback success) : {user_id: nbActions}
	    	success: function(data){

		        self.specialCpt = data.result[app.models.user.getUID()];
	    	}
		});
	}


	/** Comparator for ordering collection
	*/
	/*comparator: function(item) {
		return _.titleize( item.get('name').toLowerCase() ) ;
	},*/
});