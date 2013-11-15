define([
	'app',
	'genericModel'

], function(app, GenericModel){

	'use strict';


	/******************************************
	* Task Model
	*/
	var TaskModel = GenericModel.extend({
		
		urlRoot: '/api/openstc/tasks',

		getState : function() {
			return this.get('state');
		},
		setState : function(value, silent) {
			this.set({ state : value }, {silent: silent});
		},

		getIntervention : function(type) {
			if(this.get('project_id')){
				switch(type){
				case 'id':
					return this.get('project_id')[0];
				break;
				case 'json':
					return {id: this.get('project_id')[0], name: this.get('project_id')[1]} 
				break;
				default:
					return this.get('project_id')[1];
				}
			}
			else{
				return false;
			}
		},
		
		getEquipments : function(type) {
			var self = this;
			if(this.get('equipment_names')){
				var equipments = []
				switch(type){
					case 'id':
						_.each(this.get('equipment_names'),function(equipment){
							equipments.push(equipment[0])
						});
						return equipments;
					break;
					case 'json':
						_.each(this.get('equipment_names'),function(equipment){
							equipments.push({id: equipment[0], name:equipment[1]} )
						});
						return equipments;
					break;
					default:
						_.each(this.get('equipment_names'),function(equipment){
							equipments.push(equipment[1]);
						});
						return equipments;
				}
			}
			else{
				return false;
			}
		},
		
		getInterEquipment : function(type) {
			if(this.get('inter_equipment')){
				switch(type){
					case 'id': 
						return this.get('inter_equipment')[0];
					break;
					default:
						return _.titleize(this.get('inter_equipment')[1].toLowerCase());
				}
			}
			else{
				return false;
			}
		},
		
		getSite : function(type) {
			if(this.get('site1')){
				switch(type){
				case 'id':
					return this.get('site1')[0];
				break;
				case 'json':
					return {id: this.get('site1')[0], name: this.get('site1')[1]} 
				break;
				default:
					return this.get('site1')[1];
				}
			}
			else{
				return false;
			}
		},
		
		setIntervention : function(value) {
			this.set({ state : project_id }, {silent: silent});
		},


		affectedOnTeam: function(){
			if(this.get('team_id') == false){
				return false;
			}else{
				return true;
			}
		},


		getUser : function(type) {
			if(this.get('user_id')){
				switch(type){
				case 'id':
					return this.get('user_id')[0];
				break;
				case 'json':
					return {id: this.get('user_id')[0], name: this.get('user_id')[1]} 
				break;
				default:
					return this.get('user_id')[1];
				}
			}
			else{
				return false;	
			}
		},
		setUser : function(value) {
			this.set({ state : user_id }, {silent: silent});
		},

		getTeam : function(type) {
			if(this.get('team_id')){
				switch(type){
				case 'id':
					return this.get('team_id')[0];
				break;
				case 'json':
					return {id: this.get('team_id')[0], name: this.get('team_id')[1]} 
				break;
				default:
					return this.get('team_id')[1];	
				}
			}
			else{
				return false;
			}
		},
		setTeam : function(value, silent) {
			this.set({ state : team_id }, {silent: silent});
		},



		getDateEnd : function() {
			return this.get('date_end');
		},
		setDateEnd : function(value, silent) {
			this.set({ date_end : value }, {silent: silent});
		},

		getDateStart : function() {
			return this.get('date_start');
		},
		setDateStart : function(value, silent) {
			this.set({ date_start : value }, {silent: silent});
		},

		getRemainingHours : function() {
			return this.get('remaining_hours');
		},
		setRemainingHours : function(value, silent) {
			this.set({ remaining_hours : team_id }, {silent: silent});
		},

		getPlannedHours : function() {
			return this.get('planned_hours');
		},
		setPlannedHours : function(value, silent) {
			this.set({ planned_hours : team_id }, {silent: silent});
		},



		/** Get Informations of the model
		*/
		getInformations : function(){
			var informations = {};

			informations.name = this.getName();

			if(!_.isEmpty(this.getIntervention())){
				informations.infos = {};
				informations.infos.key = _.capitalize(app.lang.intervention);
				informations.infos.value = this.getIntervention();
			}

			return informations;
		},



		/** Model Initialization
		*/
		initialize: function (model) {
			//console.log('Task Model Initialization');
		},



		/** Report hours in backend
		*/	
		cancel: function(cancel_reason, options) {
			var params = {}
			params.state = TaskModel.status.cancelled.key;
			params.cancel_reason = cancel_reason;
			return this.save(params, {silent: true, patch: true})
		},


	}, {

		// Task State Initialization //
		status:  {
			draft: {
				key 			: 'draft', // To Schedule //
				color 			: 'warning',
				translation  	: app.lang.toScheduled
			},
			open: {
				key				: 'open', // Scheduled //
				color 			: 'info',
				translation 	: app.lang.planningFenced
			},
			done: {
				key 			: 'done', // Finish //
				color 			: 'success',
				translation 	: app.lang.finished
			},
			cancelled: {
				key 			: 'cancelled', // cancel //
				color 			: 'danger',
				translation 	: app.lang.cancelled
			},
			absent: {
				key 			: 'absent', // Congé //
				color 			: 'absent',
				translation 	: app.lang.away
			}
		}

	});

return TaskModel;

});