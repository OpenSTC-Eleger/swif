/******************************************
* Interventions Collection
*/
app.Collections.Interventions = app.Collections.GenericCollection.extend({

	model: app.Models.Intervention,

	// Model name in the database //
	model_name : 'project.project',
	
	url: "/api/openstc/interventions",

<<<<<<< HEAD
	fields: ['id', 'name', 'description', 'tasks', 'state', 'service_id', 'site1', 'date_deadline', 'planned_hours', 'effective_hours', 'tooltip', 'progress_rate', 'overPourcent', 'actions','create_uid','ask_id'],
=======
	fieldsOE: ['id', 'name', 'description', 'tasks', 'state', 'service_id', 'site1', 'date_deadline', 'planned_hours', 'effective_hours', 'total_hours', 'tooltip', 'progress_rate', 'overPourcent', 'actions','create_uid','ask_id'],
>>>>>>> décomposition des vues et des templates pour le bandeau de gauche des inter dans le planning
	default_sort : { by: 'id', order: 'DESC' },
	
	pendingInterventions: 0,
	plannedInterventions: 0,

	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Interventions collection Initialization');
	},

	pendingInterventionsCount: function(){
		var self = this;
		$.when(
			self.count({data: {filters: app.objectifyFilters([{'field':'state','operator':'=','value':'pending'}])}})
		)
		.done(function(data){
			self.pendingInterventions = parseInt(self.cpt)
		})
	},
	
	plannedInterventionsCount: function(){
		var self = this;
		$.when(
			self.count({data: {filters: app.objectifyFilters([{'field':'state','operator':'=','value':'scheduled'}])}})
		)
		.done(function(data){
			self.plannedInterventions = parseInt(self.cpt)
		})
	},

	/** Collection Sync
	*/
		sync: function(method, model, options){
			var self = this;
			var deferred = $.Deferred();
			$.when(this.pendingInterventionsCount(), this.plannedInterventionsCount(), Backbone.sync.call(this,method,this,options))
			.done(function(){
				$.when(self.count(options)).done(function(){
					deferred.resolve();
				})
			});
			return  deferred;
		},
});
