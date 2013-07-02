/******************************************
* Request Model
*/
app.Models.Request = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'openstc.ask',	
	
	url: "/#demandes-dinterventions/:id",

	relations: [{
		type: Backbone.HasMany,
		key: 'intervention_ids',
		relatedModel: 'app.Models.Intervention',
		collectionType: 'app.Collections.Interventions',
		includeInJSON: true,
		reverseRelation: {
			type: Backbone.HasOne,
			key: 'ask',
			includeInJSON: ['id', 'manager_id', 'people_name', 'people_phone', 'people_email', 'partner_id', 'partner_type', 'partner_phone', 'partner_email', 'intervention_assignement_id'],
		}
	}],
	
	defaults: {
		id: 0,
		name: "",
		site1:"",
		state: "",
		description: "",
		belongsToAssignement: "",
		belongsToService: "",
		service_id: [],
		note: "",
		refusal_reason: "",
		test: "",
		intervention_ids : []
	},

	
	
	getId : function() {
		return this.get('id');
	},
	setName : function(value) {
		if( value == 'undefined') return;
		this.set({ id : value });
	},

	getName : function() {
		return this.get('name');
	},
	setName : function(value) {
		if( value == 'undefined') return;
		this.set({ name : value });
	},

	getSite1 : function() {
		return this.get('site1');
	},
	setSite1 : function(value) {
		if( value == 'undefined') return;
		this.set({ site1 : value });
	},

	getDescription : function() {
		return this.get('description');
	},
	setDescription : function(value) {
		if( value == 'undefined') return;
		this.set({ description : value });
	},
	
	setDescription : function(value) {
		if( value == 'undefined') return;
		this.set({ deadline_date : value });
	},
	
	getRefusalReason : function() {
		return this.get('refusal_reason');
	},
	setRefusalReason  : function(value) {
		if( value == 'undefined') return;
		this.set({ refusal_reason : value });
	},
	
	getState : function() {
		return this.get('state');
	},
	setState : function(value) {
		if( value == 'undefined') return;
		this.set({ state : value });
	},
	
	getNote : function() {
		return this.get('note');
	},
	setNote : function(value) {
		if( value == 'undefined') return;
		this.set({ note : value });
	},

	getService : function() {
		return this.get('service_id');
	},
	setService : function(value) {
		if( value == 'undefined') return;
		this.set({ service_id : value });
	},

	getInterventions : function() {
		return this.get('intervention_ids');
	},
	setInterventions : function(value) {
		if( value == 'undefined') return;
		this.set({ intervention_ids : value });
	},



	/** Model Initialization
	*/
	initialize: function (model) {
		//console.log("Request Model Initialization");

		// Set the translation for the states / actions //
		app.Models.Request.status.wait.translation = app.lang.wait;
		app.Models.Request.status.valid.translation = app.lang.valid;
		app.Models.Request.status.confirm.translation = app.lang.confirm;
		app.Models.Request.status.refused.translation = app.lang.refused;
		app.Models.Request.status.closed.translation = app.lang.finished;

		app.Models.Request.actions.valid.translation = app.lang.actions.validate;
		app.Models.Request.actions.confirm.translation = app.lang.actions.confirmChief;
		app.Models.Request.actions.refused.translation = app.lang.actions.refuse;

	},



	/** Model Parser
	*/
	parse: function(response) {
		return response;
	},



	/** Save Model
	*/
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(), options);
	},


	
	/** method not used
	*/
	sendEmail: function(data,options) {
		var params = {}
		params.state = this.get("state");
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "send_email", app.models.user.getSessionID(), options);
	},
	


	update: function(params) {
		this.setDescription( params.description );
		this.setState( params.state );
		this.setRefusalReason( params.refusal_reason );
		this.setNote( params.note );
	},



	/** Destroy Model
	*/
	destroy: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	},
	


	valid: function(params, options) {
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "valid", app.models.user.getSessionID(), options);
	},



}, {

	// Status of the requests //
	status : {
		wait: {
			key 		: 'wait',
			color 		: 'info',
			translation : ''
		},
		valid: {
			key 		: 'valid',
			color 		: 'success',
			translation : ''
		},
		confirm: {
			key 		: 'confirm',
			color 		: 'warning',
			translation : ''
		},
		refused: {
			key 		: 'refused',
			color 		: 'important',
			translation : ''
		},
		closed: {
			key 		: 'closed',
			color 		: 'muted',
			translation : ''
		}
	},

	
	// Actions of the requests //
	actions : {
		valid: {
			key 		: 'valid',
			color 		: 'success',
			icon 		: 'icon-ok',
			translation : ''
		},
		confirm: {
			key 		: 'confirm',
			color 		: 'warning',
			icon 		: 'icon-level-up',
			translation : ''
		},
		refused: {
			key 		: 'refused',
			color 		: 'danger',
			icon 		: 'icon-remove',
			translation : ''
		},
	}

});