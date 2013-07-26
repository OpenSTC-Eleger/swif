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
		var search = null;
		if(_.isUndefined(options.search)){
			search = [[]];
		}
		else{
			search = [options.search]
		}

		return $.ajax({
			url: this.url,
			method: "HEAD",
			data: {filters: search},
			success: function(data,status,request){
				var contentRange = request.getResponseHeader("Content-Range")
				self.cpt = contentRange.match(/\d+$/);
			}
		});
	}


});
