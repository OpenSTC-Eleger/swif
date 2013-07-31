/******************************************
* STC Collection
*/
app.Collections.GenericCollection = Backbone.Collection.extend({
    
    cpt : 0,    
    
	
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
	}


	/** Comparator for ordering collection
	*/
	/*comparator: function(item) {
		return _.titleize( item.get('name').toLowerCase() ) ;
	},*/


});
