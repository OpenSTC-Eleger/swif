/******************************************
* Team Model
*/
app.Models.Team = Backbone.RelationalModel.extend({


	fields     : ['id', 'name', 'manager_id'],

	urlRoot    : '/api/openstc/sites',
	

	defaults:{
		id :null,
	},


	searchable_fields: [
		{
			key  : 'name', 
			type : 'text'
		}
	],


	getId : function() {
		return this.get('id');
	},
	setId : function(value, silent) {
		this.set({ id : value }, {silent: silent});
	},

	getName : function() {
		return _.titleize(this.get('name').toLowerCase());
	},
	setName : function(value, silent) {
		this.set({ name : value }, {silent: silent});
	},

	getManager : function(type) {
		switch (type){ 
			case 'id': 
				return this.get('manager_id')[0];
			break;
			case 'json':
				return {id: this.get('manager_id')[0], name: this.get('manager_id')[1]};
			break;
			default:
				return this.get('manager_id')[1];
		}
	},
	setManager : function(value, silent) {
		this.set({ manager_id : value }, {silent: silent});
	},
    
	// Team service ID //
	getServiceId : function() {
		return this.get('service_ids');
	},
	setServiceID : function(value) {
		if( value == 'undefined') return;
		this.set({ service_ids : value });
	},


    // Team services ID //
    getServicesId: function() {
        return this.get('service_ids');
    },
    setServicesID : function(value) {
		if( value == 'undefined') return;
		this.set({ service_ids : value });
	},

	// Team members ID //
    getMembersId: function() {
        return this.get('user_ids');
    },
    setMembersID : function(value) {
		if( value == 'undefined') return;
		this.set({ user_ids : value });
	},
	
	// Team not members ID //
    getFreeMembersId: function() {
        return this.get('free_user_ids');
    },
    setFreeMembersID : function(value) {
		if( value == 'undefined') return;
		this.set({ free_user_ids : value });
	},

	
	/** Get Informations of the model
	*/
	getInformations : function(){
		var informations = {};

		informations.name = this.getName();

		informations.infos = {};
		informations.infos.key = _.capitalize(app.lang.foreman);
		informations.infos.value = this.getManager();

		return informations;
	},

	getActions : function(){
		return this.get('actions');
	}

});