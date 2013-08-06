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
			domain = {};
		}
		else{
			domain = options.search
		}

		return $.ajax({
			url: this.url,
			method: "HEAD",
			data: {filters: domain},
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
