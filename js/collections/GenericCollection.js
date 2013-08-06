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


		var paramFilter = {};
		// Check if a search are perform //
		//Test if data is present in options and if filters is present is data
		if(!_.isUndefined(options.data)){
			if(!_.isUndefined(options.data.filters)){
				paramFilter.filters = options.data.filters;
			}
		}

		return $.ajax({
			url    : this.url,
			method : "HEAD",
			data   : paramFilter,
			success: function(data,status,request){
				var contentRange = request.getResponseHeader("Content-Range")
				self.cpt = contentRange.match(/\d+$/);
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


});
