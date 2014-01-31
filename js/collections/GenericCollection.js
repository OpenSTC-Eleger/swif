define([
	'backbone'

], function(Backbone){

	'use strict';


	/******************************************
	* STC Collection
	*/
	var GenericCollection = Backbone.Collection.extend({

		cpt         : 0,

		default_sort: { by: 'id', order: 'DESC' },
		

		
		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric'
			},
		],

		
		/** count all models without restricts ( openerp search_count method call select count(*) request)
		*/
		count: function(options) {
			var self = this;


			var paramFilter = {};
			// Check if a search are perform //
			//Test if data is present in options and if filters is present is data
			if(!_.isUndefined(options)){
				if(_.isUndefined(options.data)) {
					options.data = {};
				}
				else if(!_.isUndefined(options.data.filters)){
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
					
					//Set advanced filters for collection with metadatas
					var fieldsMetadata = JSON.parse(request.getResponseHeader("Model-Fields"));


					_.each(self.advanced_searchable_fields, function(fieldToKeep){
						var field = _.find(fieldsMetadata,function(value,key){ 
							return fieldToKeep.key == key; 
						});
						_.extend(fieldToKeep, field);
					});
				}
			});
		},
		

		sync: function(method, model, options){

			if(_.isUndefined(options.data)) {
				options.data = {};
			}
			if(_.isUndefined(options.data.fields)){
				options.data.fields = this.fields;
			}

			return $.when(this.count(options), Backbone.sync.call(this, method, this, options));
		},


	});

return GenericCollection;

});