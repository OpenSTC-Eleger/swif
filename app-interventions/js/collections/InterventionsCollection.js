/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

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

		model  : InterventionModel,

		url    : '/api/openstc/interventions',

		fields : ['id', 'name', 'description', 'tasks', 'state', 'service_id', 'site1', 'date_deadline', 'planned_hours', 'effective_hours', 'total_hours', 'tooltip', 'progress_rate', 'overPourcent', 'actions','create_uid', 'create_date', 'ask_id', 'equipment_id', 'has_equipment'],

		advanced_searchable_fields: [
			{ key: 'site1',         label: app.lang.place },
			{ key: 'equipment_id',  label: app.lang.equipment },
			{ key: 'service_id',    label: app.lang.service },
			{ key: 'create_date',   label: app.lang.createDate },
			{ key: 'date_deadline', label: app.lang.date_deadline },
			{ key: 'state',         label: app.lang.status }
		],

		pendingInterventions: 0,
		plannedInterventions: 0,


		/** Collection Initialization
		*/
		initialize: function () {
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
					var contentRange = request.getResponseHeader('Content-Range');
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
					var contentRange = request.getResponseHeader('Content-Range');
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