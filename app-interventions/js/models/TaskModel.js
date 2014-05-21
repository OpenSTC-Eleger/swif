/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

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

				var returnVal;
				switch(type){
					case 'id':
						returnVal = this.get('project_id')[0];
						break;
					case 'json':
						returnVal = {id: this.get('project_id')[0], name: this.get('project_id')[1]};
						break;
					default:
						returnVal = this.get('project_id')[1];
				}

				return returnVal;
			}
			else{
				return false;
			}
		},

		getEquipments : function(type) {

			if(this.get('equipment_names')){
				var equipments = [];

				switch(type){
					case 'id':
						_.each(this.get('equipment_names'),function(equipment){
							equipments.push(equipment[0]);
						});
						break;
					case 'json':
						_.each(this.get('equipment_names'),function(equipment){
							equipments.push({id: equipment[0], name:equipment[1]});
						});
						break;
					default:
						_.each(this.get('equipment_names'),function(equipment){
							equipments.push(equipment[1]);
						});
				}

				return equipments;
			}
			else{
				return false;
			}
		},


		getConsumables : function(type) {

			if(this.get('consumable_names')){
				var consumables = [];

				switch(type){
					case 'id':
						_.each(this.get('consumable_names'),function(consum){
							consumables.push(consum[0]);
						});
						break;
					case 'json':
						_.each(this.get('consumable_names'),function(consum){
							consumables.push({id: consum[0], name:consum[1]});
						});
						break;
					default:
						_.each(this.get('consumable_names'),function(consum){
							consumables.push(consum[1]);
						});
				}

				return consumables;
			}
			else{
				return false;
			}
		},

		getInterEquipment : function(type) {
			if(this.get('inter_equipment')){

				var returnVal;
				switch(type){
					case 'id':
						returnVal = this.get('inter_equipment')[0];
						break;
					default:
						returnVal = _.titleize(this.get('inter_equipment')[1].toLowerCase());
				}

				return returnVal;
			}
			else{
				return false;
			}
		},

		getSite : function(type) {
			if(this.get('site1')){

				var returnVal;
				switch(type){
					case 'id':
						returnVal = this.get('site1')[0];
						break;
					case 'json':
						returnVal = {id: this.get('site1')[0], name: this.get('site1')[1]};
						break;
					default:
						returnVal = this.get('site1')[1];
				}

				return returnVal;
			}
			else{
				return false;
			}
		},

		setIntervention : function(value, silent) {
			this.set({ state : value }, {silent: silent});
		},


		affectedTo: function(type){

			if(this.get('user_id') !== false){
				return this.getUser(type);
			}
			else if(this.get('team_id') !== false){
				return this.getTeam(type);
			}
			else if(this.get('partner_id') !== false){
				return this.getProvider(type);
			}
			else{
				return false;
			}
		},


		getUser : function(type) {
			if(this.get('user_id')){

				var returnVal;
				switch(type){
					case 'id':
						returnVal = this.get('user_id')[0];
						break;
					case 'json':
						returnVal = {id: this.get('user_id')[0], name: this.get('user_id')[1]};
						break;
					case 'logo':
						returnVal = 'fa-user';
						break;
					default:
						returnVal = this.get('user_id')[1];
				}

				return returnVal;
			}
			else{
				return false;
			}
		},
		setUser : function(value, silent) {
			this.set({ state : value }, {silent: silent});
		},

		getTeam : function(type) {
			if(this.get('team_id')){
				var returnVal;

				switch(type){
					case 'id':
						returnVal = this.get('team_id')[0];
						break;
					case 'json':
						returnVal = {id: this.get('team_id')[0], name: this.get('team_id')[1]};
						break;
					case 'logo':
						returnVal = 'fa-users';
						break;
					default:
						returnVal = this.get('team_id')[1];
				}

				return returnVal;
			}
			else{
				return false;
			}
		},
		setTeam : function(value, silent) {
			this.set({ state : value }, {silent: silent});
		},


		getProvider : function(type) {
			if(this.get('partner_id')){
				var returnVal;

				switch(type){
					case 'id':
						returnVal = this.get('partner_id')[0];
						break;
					case 'json':
						returnVal = {id: this.get('partner_id')[0], name: this.get('partner_id')[1]};
						break;
					case 'logo':
						returnVal = 'fa-truck';
						break;
					default:
						returnVal = this.get('partner_id')[1];
				}

				return returnVal;
			}
			else{
				return false;
			}
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
		
//		getDateStart: function(type, format){
//			if(this.get('date_start') !== false){
//		
//				var returnVal;
//				switch(type){
//					case 'human':
//						returnVal = moment(this.get('date_start')).format(format);
//						break;
//					default:
//						returnVal = this.get('date_start');
//						break;
//				}
//		
//				return returnVal;
//			}
//			else{
//				return '';
//			}
//		},		

		setDateStart : function(value, silent) {
			this.set({ date_start : value }, {silent: silent});
		},

		getRemainingHours : function() {
			return this.get('remaining_hours');
		},
		setRemainingHours : function(value, silent) {
			this.set({ remaining_hours : value }, {silent: silent});
		},

		getPlannedHours : function() {
			return this.get('planned_hours');
		},
		setPlannedHours : function(value, silent) {
			this.set({ planned_hours : value }, {silent: silent});
		},


		getEffectiveHours: function(){
			return this.get('effective_hours');
		},
		
		getUserTypeSelected: function(){
			if(this.getUser('id')!==false){
				return 'officer';
			}else if(this.getTeam('id')){
				return 'team';
			}else{
				return 'provider';
			}
		},
		
		getUserIdSelected: function(){
			if(this.getUser('json')!==false){
				return this.get('user_id');
			}else if(this.getTeam('json')){
				return this.get('team_id');
			}else{
				return this.get('partner_id');
			}
		},

		/** Get the cost of the task
		*/
		getCost: function(type, withSymbol) {
			var cost = 0;

			switch(type){
				case 'total':
					cost = parseFloat(this.get('cost'));
					break;
				case 'hr':
					cost = parseFloat(this.get('hr_cost'));
					break;
				case 'equipment':
					cost = parseFloat(this.get('equipment_cost'));
					break;
				case 'consumable':
					cost = parseFloat(this.get('consumable_cost'));
					break;
			}

			if(withSymbol) {
				cost = _.numberFormat(cost, 2, '.', ' ');
				return cost+='€';
			}
			else{
				return cost;
			}
		},


		/** Get the percentage cost
		*/
		getPercentageCost: function(type) {
			return _.toNumber(( (this.getCost(type, false) * 100) / this.getCost('total', false) ), 2);
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
		initialize: function () {
			//console.log('Task Model Initialization');
		},



		/** Report hours in backend
		*/
		cancel: function(cancel_reason) {
			var params = {};
			params.state = TaskModel.status.cancelled.key;
			params.cancel_reason = cancel_reason;

			return this.save(params, {silent: true, patch: true});
		},


	}, {

		// Task State Initialization //
		status:  {
			draft: {
				key         : 'draft', // To Schedule //
				color       : 'warning',
				translation : app.lang.toScheduled
			},
			open: {
				key         : 'open', // Scheduled //
				color       : 'info',
				translation : app.lang.planningFenced
			},
			done: {
				key         : 'done', // Finish //
				color       : 'success',
				translation : app.lang.finished
			},
			cancelled: {
				key         : 'cancelled', // cancel //
				color       : 'danger',
				translation : app.lang.cancelled
			},
			absent: {
				key         : 'absent', // Congé //
				color       : 'absent',
				translation : app.lang.away
			}
		}

	});

	return TaskModel;

});