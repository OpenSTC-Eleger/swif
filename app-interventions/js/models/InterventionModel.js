define([
	'app',
	'appHelpers',
	'genericModel',
	'moment'

], function(app, AppHelpers, GenericModel, moment){

	'use strict';


	/******************************************
	* Intervention Model
	*/
	var InterventionModel = GenericModel.extend({
		
		urlRoot: "/api/openstc/interventions",
		
		fields : ['id', 'name', 'description', 'tasks', 'state', 'service_id', 'site1', 'date_deadline', 'planned_hours', 'effective_hours', 'total_hours', 'tooltip', 'progress_rate', 'overPourcent', 'actions','create_uid', 'create_date', 'ask_id'],


		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric'
			},
			{
				key  : 'site1.complete_name',
				type : 'text'
			},
			{
				key  : 'name', 
				type : 'text'
			}
		],

		getId: function(){
			return this.get('id');
		},

		getName: function(){
			return this.get('name');
		},
		
		getDateDeadline: function(type){
			if(this.get('date_deadline') != false){
				switch(type){
					case 'human':	
						return moment(this.get('date_deadline')).format('LL');
					break;
					default:
						return this.get('date_deadline');
					break;
				}
			}
			else{
				return '';
			}
		},
		
		getPlannedHours: function(type){
			if(this.get('planned_hours') != false){
				switch(type){
					case 'human':
						return AppHelpers.decimalNumberToTime(this.get('planned_hours'), 'human');
					break;
					default:
						return this.get('planned_hours');
					break;
				}
			}
			else{
				return '';
			}
		},
		
		getEffectiveHours: function(type){
			if(this.get('effective_hours') != false){
				switch(type){
					case 'human':
						return AppHelpers.decimalNumberToTime(this.get('effective_hours'), 'human');
					break;
					default:
						return this.get('effective_hours');
					break;
				}
			}
			else{
				return '';
			}
		},
		
		getTooltip: function(){
			return this.get('tooltip');
		},

		getDescription: function(){
			return _(this.get('description')).escapeHTML();
		},
		
		getProgressRate: function(){
			return this.get('progress_rate');
		},
		
		getOverPourcent: function(){
			return this.get('overPourcent');
		},
		
		getState : function() {
			return this.get('state');
		},
		setState : function(value, silent) {
			this.set({ state : value }, {silent: silent});
		},
		
		getCancelReason : function() {
			return this.get('cancel_reason');
		},
		setCancelReason : function(value, silent) {
			this.set({ cancel_reason : value }, {silent: silent});
		},
		
		getSite : function(type) {
			if(this.get('site1')){
				switch(type){
					case 'id': 
						return this.get('site1')[0];
					break;
					default:
						return _.titleize(this.get('site1')[1].toLowerCase());
				}
			}
		},
		
		getEquipment : function(type) {

			if(this.onEquipment()){
				switch(type){
					case 'id': 
						return this.get('equipment_id')[0];
					break;
					default:
						return _.titleize(this.get('equipment_id')[1].toLowerCase());
				}
			}
			else{
				return false;
			}
		},
		setEquipment : function(value, silent) {
			this.set({ equipment_id : value }, {silent: silent});
		},
		
		onEquipment: function(){
			return this.get('has_equipment');
		},

		getActions: function(){
			return this.get('actions');
		},
		
		hasActions: function(action){
			return this.getActions().indexOf(action) > -1;
		},
		
		/** Model Initialization
		*/
		initialize: function(){
			//console.log('Intervention Model initialization');
		},

			
		cancel: function(cancel_reason, options) {
			var params = {}
			params.state = InterventionModel.status.cancelled.key;
			//params.email_text = InterventionModel.status.cancelled.translation;
			params.cancel_reason = cancel_reason;

			return this.save(params,{patch:true, wait: true})
		}


	}, {

		// Request State Initialization //
		status : {
			open: {
				key                 : 'open',
				color               : 'warning',
				translation         : app.lang.toScheduled
			},
			scheduled: {
				key                 : 'scheduled',
				color               : 'info',
				translation         : app.lang.planningFenced
			},
			closed: {
				key                 : 'closed',
				color               : 'success',
				translation         : app.lang.closed
			},
			pending: {
				key                 : 'pending',
				color               : 'default',
				translation         : app.lang.pending
			},
			cancelled: {
				key                 : 'cancelled',
				color               : 'danger',
				translation         : app.lang.cancelled
			},
			template: {
				key               	: 'template',
				color               : 'template',
				translation         : 'template'
			}
		}

	});

return InterventionModel;

});