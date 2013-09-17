/******************************************
* Task Model
*/
app.Models.Task = app.Models.GenericModel.extend({
	
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

		// Initialization Traduction task state //
		app.Models.Task.status.draft.translation = app.lang.toScheduled;
		app.Models.Task.status.open.translation = app.lang.planningFenced;
		app.Models.Task.status.done.translation = app.lang.finished;
		app.Models.Task.status.cancelled.translation = app.lang.cancelled;
		app.Models.Task.status.absent.translation = app.lang.away;
	},



	/** Report hours in backend
	*/	
	cancel: function(cancel_reason, options) {
		var params = {}
		params.state = app.Models.Task.status.cancelled.key;
		params.cancel_reason = cancel_reason;
		//app.callObjectMethodOE([[this.get("id")],params], this.model_name, "cancel", app.models.user.getSessionID(), options);
		return this.save(params, {silent: true, patch: true})
	},


}, {

	// Task State Initialization //
	status:  {
		draft: {
			key 			: 'draft', // To Schedule //
			color 			: 'warning',
			translation  	: ''
		},
		open: {
			key				: 'open', // Scheduled //
			color 			: 'info',
			translation 	: ''
		},
		done: {
			key 			: 'done', // Finish //
			color 			: 'success',
			translation 	: ''
		},
		cancelled: {
			key 			: 'cancelled', // cancel //
			color 			: 'important',
			translation 	: ''
		},
		absent: {
			key 			: 'absent', // Congé //
			color 			: 'absent',
			translation 	: ''
		}
	}

});