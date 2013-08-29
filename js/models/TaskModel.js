/******************************************
* Task Model
*/
app.Models.Task = Backbone.Model.extend({

	// Model name in the database //
	model_name : 'project.task',	
	
	urlRoot: '/api/openstc/tasks',


//	relations: [
//		{
//			type: Backbone.HasMany,
//			key: 'equipment_ids',
//			relatedModel: 'app.Models.Equipment',
//			collectionType: 'app.Collections.Equipments',
//			includeInJSON: ['id', 'name', 'complete_name', 'type'],
//		},	
//	],
	

	defaults:{
		id:null,
		name: null,
		effective_hours:0,
		total_hours: 0,
		remaining_hours: 0,
		state: null,
		user_id: null,
		team_id: null,
		date_end: null,
		date_start: null,
		currentTask: null,
	},
	
	getId : function() {
		return this.get('id');
	},
	setId: function(value) {
		if( value == 'undefined') return;
		this.set({ id : value });
	},

	getName : function() {
		return this.get('name');
	},
	setName: function(value) {
		if( value == 'undefined') return;
		this.set({ id : value });
	},

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



	parseDate: function(s) {
	  var re = /^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)$/;
	  var m = re.exec(s);
	  //PYF : using UTC time 
	  return m ? new Date(Date.UTC(parseInt(m[1],10), parseInt(m[2]-1,10), parseInt(m[3],10), 
		  parseInt(m[4],10), parseInt(m[5],10), parseInt(m[6],10))) : null;
	},



	/** Model Parser
	*/
	parse: function(response) {
		if(!_.isNull(response)){
			// Check if the date is a moment() //
			if(!moment.isMoment(response.date_start)){
				if(response.date_start) {
				//var user = app.models.user.toJSON();			
				response.date_start = moment(this.parseDate(response.date_start));
				}
			}
	
			// Check if the date is a moment() //
			if(!moment.isMoment(response.date_end)){
				if(response.date_end){
					response.date_end = moment(this.parseDate(response.date_end));
				}
			}
		}
		return response;
	},
	


	/** Save Model
	*/
//	save: function(id,data, options) {
//		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), options)
//		if( options==null ) {
//			app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), {         	
//				success: function(data){
//					if(!_.str.include(Backbone.history.fragment, 'planning/')){
//						Backbone.history.loadUrl(Backbone.history.fragment);
//					}
//					else{
//						app.router.navigate(app.routes.planning.url, {trigger: true, replace: true});
//					}
//				}
//			});
//		}
//		else {
//			app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), options);
//		}
//	},
	


	/** Save Model with backend method named saveTaskDone
	*/	
	saveTaskDone: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "saveTaskDone", app.models.user.getSessionID(), options);
	},


	/** Create orphan task in backend
	*/	
	createOrphan: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "createOrphan", app.models.user.getSessionID(), options);
	},
	
	/** Plan tasks in backend
	*/	
	planTasks: function(id, params, options) {		
		app.callObjectMethodOE([[id],params], this.model_name, "planTasks", app.models.user.getSessionID(), options);
	},


	
	/** Report hours in backend
	*/	
	reportHours: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "reportHours", app.models.user.getSessionID(), options);
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


	update: function(params) {
		this.setName( params.name );
		this.setPlannedHours( params.planned_hours );
		this.setRemainingHours( params.remaining_hours );
		this.setTeamId( params.team_id );
		this.setUserId( params.user_id );
		this.setDateEnd( params.date_end );
		this.setDateStart( params.date_start );
		this.setState( params.state );
		this.setInterventionId( params.project_id );
	},
	
	test: function() {
		this.setName( 'test' );
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