/******************************************
* STC Collection
*/
app.Collections.GenericCollection = Backbone.Collection.extend({

	cpt         : 0,

	default_sort: { by: 'id', order: 'DESC' },


	/** count all models without restricts ( openerp search_count method call select count(*) request)
	*/
	count: function(options) {
		var self = this;


		var paramFilter = {};
		// Check if a search are perform //
		//Test if data is present in options and if filters is present is data
		if(!_.isUndefined(options)){
			if(!_.isUndefined(options.data.filters)){
				paramFilter.filters = options.data.filters;
			}
		}

		return $.ajax({
			url      : this.url,
			method   : 'HEAD',
			dataType : 'text',
			data     : paramFilter,
			success  : function(data,status,request){
				var contentRange = request.getResponseHeader("Content-Range")
				self.cpt = contentRange.match(/\d+$/);
			}
		});
	},



	/** Collection Sync
	*/
	sync: function(method, model, options){

		if(_.isUndefined(options.data)) {
			options.data = {};
		}
		options.data.fields = this.fields;

		return $.when(this.count(options), Backbone.sync.call(this, method, this, options));
	},

});