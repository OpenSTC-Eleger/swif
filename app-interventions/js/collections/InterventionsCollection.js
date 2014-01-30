define([
	'app', 

	'genericCollection',
	'interventionModel'

], function(app, GenericCollection, InterventionModel){

	'use strict';


	/******************************************
	* Interventions Collection
	*/
	var InterventionsCollection = GenericCollection.extend({

		model : InterventionModel,
		
		url   : "/api/openstc/interventions",
		
		fields: ['id', 'name', 'description', 'tasks', 'state', 'service_id', 'site1', 'date_deadline', 'planned_hours', 'effective_hours', 'total_hours', 'tooltip', 'progress_rate', 'overPourcent', 'actions','create_uid', 'create_date', 'ask_id', 'equipment_id', 'has_equipment'],

		advanced_searchable_fields: [ 
		    {
		    	key : 'name'
		    },
		    {
		    	key : 'description'
		    },
		    {
		    	key : 'state'
		    },
		    {
		    	key : 'site1'
		    },
		    {
		    	key : 'equipment_id'
		    },
		    {
		    	key : 'service_id'
		    },
		    {
		    	key : 'create_date'
		    },
		    {
		    	key : 'date_deadline'
		    }
		],

		pendingInterventions: 0,
		plannedInterventions: 0,

	
		/** Collection Initialization
		*/
		initialize: function (options) {
		},


		/** Retrieve the number of Pending Intervention
		*/
		pendingInterventionsCount: function(){
			var self = this;

			var domain = [ { field : 'state', operator : '=', value : InterventionModel.status.pending.key } ];

			return $.ajax({
				url      : this.url,
				method   : 'HEAD',
				dataType : 'text',
				data     : {filters: app.objectifyFilters(domain)},
				success  : function(data,status,request){
					var contentRange = request.getResponseHeader("Content-Range")
					self.pendingInterventions = contentRange.match(/\d+$/);
				}
			});
		},


		
		/** Retrieve the number of Planned Intervention
		*/
		plannedInterventionsCount: function(){
			var self = this;

			var domain = [ { field : 'state', operator : '=', value : InterventionModel.status.scheduled.key } ];

			return $.ajax({
				url      : this.url,
				method   : 'HEAD',
				dataType : 'text',
				data     : {filters: app.objectifyFilters(domain)},
				success  : function(data,status,request){
					var contentRange = request.getResponseHeader("Content-Range")
					self.plannedInterventions = contentRange.match(/\d+$/);
				}
			});
		},


		/** Collection Sync
		*/
		sync: function(method, model, options){

			options.data.fields = this.fields;

			return $.when(this.count(options), this.pendingInterventionsCount(), this.plannedInterventionsCount(), Backbone.sync.call(this,method,this,options));
		}

	});

return InterventionsCollection;

});