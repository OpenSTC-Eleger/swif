define([
	'app', 

	'genericCollection',
	'requestModel'

], function(app, GenericCollection, RequestModel){

	'use strict';


	/******************************************
	* Requests Collection
	*/
	var RequestsCollection = GenericCollection.extend({

		model        : RequestModel,

		url          : '/api/openstc/intervention_requests',

		fields       : ['id', 'name', 'actions', 'tooltip', 'create_date', 'create_uid', 'description', 'manager_id', 'partner_address', 'partner_id', 'partner_name', 'partner_service_id', 'partner_type', 'partner_type_code', 'people_name', 'service_id', 'site1', 'site_details', 'state', 'refusal_reason', 'has_equipment', 'equipment_id', 'is_citizen'],

		default_sort : { by: 'id', order: 'DESC' },

		specialCpt : 0,



		/** Collection Initialization
		*/
		initialize: function (options) {
			//console.log('Requests collection Initialization');
		},


		
		/** Get the number of Request that the user have to deal
		*/
		specialCount: function(){
			var self = this;

			// Construct a domain accrding to user group //
			if(app.models.user.isDST()){
				var domain = [
					{ field : 'state', operator : '=', value : RequestModel.status.confirm.key }
				];
			}
			else if(app.models.user.isManager()){
				var domain = [
					{ field : 'state', operator : '=', value : RequestModel.status.wait.key },
					{ field : 'service_id.id', operator : 'in', value : app.models.user.getServices() }
				];
			}

			return $.ajax({
				url      : this.url,
				method   : 'HEAD',
				dataType : 'text',
				data     : {filters: app.objectifyFilters(domain)},
				success  : function(data, status, request){
					var contentRange = request.getResponseHeader("Content-Range")
					self.specialCpt = contentRange.match(/\d+$/);
				}
			});
			
		},
		


		/** Collection Sync
		*/
		sync: function(method, model, options){

			options.data.fields = this.fields;

			return $.when(
				this.count(options),
				(app.models.user.isDST() || app.models.user.isManager() ? this.specialCount() : ''),
				Backbone.sync.call(this,method,this,options)
			);
		}

	});

return RequestsCollection;

});