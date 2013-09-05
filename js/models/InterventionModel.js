/******************************************
* Intervention Model
*/
app.Models.Intervention = app.Models.GenericModel.extend({
	
	urlRoot: "/api/openstc/interventions",
	
	fields : ['id', 'name', 'description', 'tasks', 'state', 'service_id', 'site1', 'date_deadline', 'planned_hours', 'effective_hours', 'total_hours', 'tooltip', 'progress_rate', 'overPourcent', 'actions','create_uid','ask_id'],


	searchable_fields: [
		{
			key  : 'site1.complete_name',
			type : 'text'
		}
		,
		{
			key  : 'service_id.name',
			type : 'text'
		},
		{
			key  : 'name', 
			type : 'text'
		}
	],
	

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


	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Intervention Model initialization');
		//this.fetchRelated('tasks');

		app.Models.Intervention.status.scheduled.translation = app.lang.planningFenced;
		app.Models.Intervention.status.open.translation = app.lang.toScheduled;	
		app.Models.Intervention.status.closed.translation = app.lang.closed;
		app.Models.Intervention.status.pending.translation = app.lang.pending;
		app.Models.Intervention.status.cancelled.translation = app.lang.cancelled;
		app.Models.Intervention.status.template.translation = "template"; //'app.lang.template';
	},

		
	cancel: function(cancel_reason, options) {
		var params = {}
		params.state = app.Models.Intervention.status.cancelled.key;
		//params.email_text = app.Models.Intervention.status.cancelled.translation;
		params.cancel_reason = cancel_reason;
		//app.callObjectMethodOE([[this.get("id")],params], this.model_name, "cancel", app.models.user.getSessionID(), options);
		return this.save(params,{patch:true, wait: true})
	}


}, {

	// Request State Initialization //
	status : {
		open: {
			key                 : 'open',
			color               : 'warning',
			htmlColor           : '#F89406',
			translation         : ''
		},
		scheduled: {
			key                 : 'scheduled',
			color               : 'info',
			htmlColor           : '#3A87AD',
			translation         : ''
		},
		closed: {
			key                 : 'closed',
			color               : 'success',
			htmlColor           : '#468847',
			translation         : ''
		},
		pending: {
			key                 : 'pending',
			color               : 'muted',
			htmlColor           : '#999999',
			translation         : ''
		},
		cancelled: {
			key                 : 'cancelled',
			color               : 'important',
			htmlColor           : '#B94A48',
			translation         : ''
		},
		template: {
			key               	: 'template',
			color               : 'template',
			htmlColor           : '#FFC40D',
			translation         : ''
		}
	}

});