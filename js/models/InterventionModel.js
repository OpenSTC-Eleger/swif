/******************************************
* Intervention Model
*/
app.Models.Intervention = Backbone.Model.extend({
	
	urlRoot: "/api/openstc/interventions",
	fields: ['id', 'name', 'description', 'tasks', 'state', 'service_id', 'site1', 'date_deadline', 'planned_hours', 'effective_hours', 'tooltip', 'progress_rate', 'overPourcent', 'actions','create_uid','ask_id'],

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
	
	defaults:{
		id:null,
		state: null,
		cancel_reason: null,
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
		return this.get('state');
	},
	setState : function(value) {
		if( value == 'undefined') return;
		this.set({ state : value });
	},
	
	getCancelReason : function() {
		return this.get('cancel_reason');
	},
	setCancelReason : function(value) {
		if( value == 'undefined') return;
		this.set({ cancel_reason : value });
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


	
	/** Model Parser
	*/
	parse: function(response) {    	
		return response;
	},



	update: function(params) {
		this.setState( params.state );
		this.setCancelReason( params.cancel_reason );
	},



	//save method with all redondant code
	saveAndRoute: function(id,data,closeModal, view, strRoute) {
		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), {
			beforeSend: function(){
				app.loader('display');
			},
			success: function (data) {
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					if( closeModal!= null )
						closeModal.modal('hide');
					if( view ) {
						if(app.collections.interventions == null ){
							app.collections.interventions = new app.Collections.Interventions();
						}		        		
						app.collections.interventions.fetch({
							success: function(){				 			
								if( strRoute ) {
									route = Backbone.history.fragment;
									Backbone.history.loadUrl(route);
								}
								else if (view){
									view.render();
								}

								app.loader('hide');
							}					 
						});					 	
					}
				}
			},
			error: function () {
				console.log('ERROR - Unable to save the Request - RequestView.js');
			}, 
		});
	},
	

	
	//When save intervention and just after save task (TaskListView L.187 et L.190) postgres send this error:
	//TransactionRollbackError: could not serialize access due to concurrent update
	//We must wait intervention save callback before save task
	saveWithCallback: function(id,data,options) { 
		app.saveOE(id, data, this.model_name, app.models.user.getSessionID(), options);
	},
	

	
	cancel: function(cancel_reason, options) {
		var params = {}
		params.state = app.Models.Intervention.status.cancelled.key;
		//params.email_text = app.Models.Intervention.status.cancelled.translation;
		params.cancel_reason = cancel_reason;
		//app.callObjectMethodOE([[this.get("id")],params], this.model_name, "cancel", app.models.user.getSessionID(), options);
		return this.save(params,{patch:true})
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
