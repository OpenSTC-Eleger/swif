/******************************************
* Requests Collection
*/
app.Collections.Requests = app.Collections.GenericCollection.extend({

	model        : app.Models.Request,

	url          : '/api/openstc/intervention_requests',

	fields       : ['id', 'name', 'actions', 'tooltip', 'create_date', 'create_uid', 'date_deadline', 'description', 'manager_id', 'note', 'partner_address', 'partner_id', 'partner_service_id', 'partner_type', 'partner_type_code', 'people_name', 'refusal_reason', 'service_id', 'site1', 'site_details', 'state'],

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

		//construct a domain accrding to user group
		var domain = { field : 'state', operator : '=' };
		if(app.models.user.isDST()){
			domain.value = app.Models.Request.status.confirm.key;
		}
		else if(app.models.user.isManager()){
			domain.value = app.Models.Request.status.wait.key;
		}


		return $.ajax({
			url      : this.url,
			method   : 'HEAD',
			dataType : 'text',
			data     : {filters: {0: domain}},
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