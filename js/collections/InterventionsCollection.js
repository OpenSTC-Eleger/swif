/******************************************
* Interventions Collection
*/
app.Collections.Interventions = app.Collections.GenericCollection.extend({

	model: app.Models.Intervention,

	// Model name in the database //
	model_name : 'project.project',
	
	url: "/api/openstc/interventions",

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
		
//
//
//
//	/** Collection Parse
//	*/
//	parse: function(response) {    	
//		return response.result.records;
//	},



	/** Comparator for ordering collection
	*/
	comparator: function(item) {
		var mCreateDate = moment(item.get('create_date'))
		item.set({'create_date': mCreateDate});
		return -item.get('create_date');
	}


});
