/******************************************
* Task Model
*/
app.Models.Task = app.Models.GenericModel.extend({
	
	urlRoot: '/api/openstc/tasks',


	getState : function() {
		return this.get('name');
	},
	setState : function(value) {
		if( value == 'undefined') return;
		this.set({ state : value });
	},

	getInterventionId : function(type) {
		if(this.get('project_id')){
			switch(type){
			case 'id':
				return this.get('project_id')[0]
			break;
			case 'json':
				return {id: this.get('project_id')[0], name: this.get('project_id')[1]} 
			break;
			default:
				return this.get('project_id')[1];
			}
		}
		else{
			return '';
		}
	},
	setInterventionId : function(value) {
		if( value == 'undefined') return;
		this.set({ project_id : value });
	},

	getInterventionName : function() {
		if(this.get('project_id') != false){
			return this.get('project_id')[1];
		}
		else{
			return '';
		}
	},

	getUserId : function(type) {
		if(this.get('user_id')){
			switch(type){
			case 'id':
				return this.get('user_id')[0]
			break;
			case 'json':
				return {id: this.get('user_id')[0], name: this.get('user_id')[1]} 
			break;
			default:
				return this.get('user_id')[1];
			}
		}
		return false;
	},
	setUserId : function(value) {
		if( value == 'undefined') return;
		this.set({ user_id : value });
	},
	getUserName : function() {
		return this.get('user_id')[1];
	},

	getTeamId : function() {
		if(this.get('team_id')){
			switch(type){
			case 'id':
				return this.get('user_id')[0]
			break;
			case 'json':
				return {id: this.get('user_id')[0], name: this.get('user_id')[1]} 
			break;
			default:
				return this.get('user_id')[1];	
			}
		}
		return false;
	},
	setTeamId : function(value) {
		if( value == 'undefined') return;
		this.set({ team_id : value });
	},

	getTeamName : function() {
		return this.get('team_id')[1];
	},

	getDateEnd : function() {
		return this.get('date_end');
	},
	setDateEnd : function(value) {
		if( value == 'undefined') return;
		this.set({ date_end : value });
	},

	getDateStart : function() {
		return this.get('date_start');
	},
	setDateStart : function(value) {
		if( value == 'undefined') return;
		this.set({ date_start : value });
	},

	getRemainingHours : function() {
		return this.get('remaining_hours');
	},
	setRemainingHours : function(value) {
		if( value == 'undefined') return;
		this.set({ remaining_hours : value });
	},

	getPlannedHours : function() {
		return this.get('planned_hours');
	},
	setPlannedHours : function(value) {
		if( value == 'undefined') return;
		this.set({ planned_hours : value });
	},

	getStartEndDateInformations : function(){
		return "Du " + this.getDateStart().format('LLL') + " au " + this.getDateEnd().format('LLL');
	},
	getState : function() {
		return this.get('state');
	},

	getInformations: function(){
		var ret = {};
		ret.name = this.getName();
		ret.infos = {};
		ret.infos.key = app.lang.associatedPlace;
		if(!_.isUndefined(this.site1)){
			ret.infos.value = this.site1[1];
		}
		else{
			ret.infos.value = '';
		}
		
		return ret;
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