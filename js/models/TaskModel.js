/******************************************
* Task Model
*/
app.Models.Task = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'project.task',	
	
	url: '/#taches/:id',


	relations: [
	   {
			type: Backbone.HasMany,
			key: 'equipment_ids',
			relatedModel: 'app.Models.Equipment',
			collectionType: 'app.Collections.Equipments',
			includeInJSON: ['id','name', 'complete_name', 'type'],
		},	
	  ],
	

	defaults:{
		id:0,
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

	getInterventionId : function() {
		if(this.get('project_id')){
			return this.get('project_id');
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

	getUserId : function() {
		return this.get('user_id');
	},
	setUserId : function(value) {
		if( value == 'undefined') return;
		this.set({ user_id : value });
	},
	getUserName : function() {
		return this.get('user_id')[1];
	},

	getTeamId : function() {
		return this.get('team_id');
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



	/** Model Initialization
	*/
	initialize: function (model) {
		console.log('Task Model Initialization');

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

		return response;
	},
	


	/** Save Model
	*/
	save: function(id,data, options) { 
		if( options==null ) {
			app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), {         	
				success: function(data){
					if(!_.str.include(Backbone.history.fragment, 'planning/')){
						Backbone.history.loadUrl(Backbone.history.fragment);
					}
					else{
						app.router.navigate(app.routes.planning.url, {trigger: true, replace: true});
					}
				}
			});
		}
		else {
			app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), options);
		}
	},
	


	/** Save Model with backend method named saveTaskDone
	*/	
	saveTaskDone: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "saveTaskDone", app.models.user.getSessionID(), options);
	},

	/** get officers to filter on it
	*/	
	getOfficers: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "getOfficers", app.models.user.getSessionID(), options);
	},

	/** Create orphan task in backend
	*/	
	createOrphan: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "createOrphan", app.models.user.getSessionID(), options);
	},


	
	/** Report hours in backend
	*/	
	reportHours: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "reportHours", app.models.user.getSessionID(), options);
	},


	update: function(params) {
		this.setName( params.name );
		this.setProjectId( params.project_id );
		this.setState( params.state );
		this.setRemainingHours( params.remaining_hours );
		this.setPlannedHours( params.planned_hours );
		this.setUserId( params.user_id );
		this.setTeamId( params.team_id );
		this.setDateEnd( params.date_end );
		this.setDateStart( params.date_start );
	},
	


	destroy: function (options) {
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
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