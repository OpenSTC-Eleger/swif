/******************************************
* STC Collection
*/
app.Collections.STCCollection = Backbone.Collection.extend({
    
    cpt : 0,    
    
	
	/** count all models without restricts ( openerp search_count method call select count(*) request)
	*/
	count: function(options) {
		var self = this;

		// Check if a search are perform //
		var domain = null;
		if(_.isUndefined(options.domain)){
			domain = [[]];
		}
		else{
			domain = [options.domain]
		}


		return app.callObjectMethodOE(domain, this.model_name, 'search_count', app.models.user.getSessionID(), {
			success: function(data){
				console.log(data);
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
