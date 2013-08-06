/******************************************
* Requests Collection
*/
app.Collections.Requests = app.Collections.GenericCollection.extend({

	model        : app.Models.Request,

	url          : '/api/openstc/intervention_requests',

	fields       : ["id", "name", "actions", "tooltip", "create_date", "create_uid", "date_deadline", "description", "manager_id", "note", "partner_address", "partner_id", "partner_phone", "partner_service_id", "partner_type", "partner_type_code", "people_name", "people_email", "people_phone", "refusal_reason", "service_id", "site1", "site_details", "state"],

	// Model name in the database //
	model_name   : 'openstc.ask',

	default_sort : { by: 'id', order: 'DESC' },


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Requests collection Initialization');
	},
	
	//override to customize method for this collection
	specialCount: function(modelName){
		var self = this;
		
		//to keep value of cpt, because count method override this value at each call
		var cptSave = self.cpt;
		
		//construct a domain accrding to user group
		var domain = {};
		if(app.models.user.isDST()){
			domain = {'field':'state','operator':'=','value':'confirm'};
		}
		else if(app.models.user.isManager()){
			domain = {'field':'state','operator':'=','value':'wait'};
		}
		//use count method to retrieve values according to domain
		$.when(
			self.count({data: {filters: app.objectifyFilters([domain])}})
		)
		.done(function(){
			self.specialCpt = self.cpt;
			self.cpt = cptSave;
		})
		
	},
	
	/** Collection Sync
	*/
	sync: function(method, model, options){
		var deferred = $.Deferred();
		$.when(this.specialCount(model), this.count(options), Backbone.sync.call(this,method,this,options))
		.done(function(){
			deferred.resolve();
		});
		return  deferred;
	}

});