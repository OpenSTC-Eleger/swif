/******************************************
* Team Model
*/
app.Models.Team = Backbone.Model.extend({


	fields     : ['id', 'name', 'manager_id', 'actions', 'service_ids', 'user_ids'],

	urlRoot    : '/api/openstc/teams',
	

	defaults: {
		id : null,
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

	getMembers: function(type) {
		var teamMembers = [];

		/*console.log(this.get('user_ids'));
		console.log('----------');*/

		_.each(this.get('user_ids'), function(s){
			switch (type){
				case 'id': 
					teamMembers.push(s[0]);
				break;
				case 'json': 
					teamMembers.push({id: s[0], name: s[1]});
				break;
				default:
					teamMembers.push(s[1]);
			}
		});

		if(type == 'string'){
			return _.toSentence(teamMembers, ', ', ' '+app.lang.and+' ')
		}
		else{
			return teamMembers;
		}
	},
    setMembers : function(value, silent) {
		this.set({ user_ids : [[6, 0, value]] }, {silent: silent});
	},


	// Team services ID //
	getServices: function() {
		return this.get('service_ids');
		var teamServices = [];

		/*console.log(this.get('user_ids'));
		console.log('----------');*/

		_.each(this.get('service_ids'), function(s){
			switch (type){
				case 'id': 
					teamServices.push(s[0]);
				break;
				case 'json': 
					teamServices.push({id: s[0], name: s[1]});
				break;
				default:
					teamServices.push(s[1]);
			}
		});

		if(type == 'string'){
			return _.toSentence(teamServices, ', ', ' '+app.lang.and+' ')
		}
		else{
			return teamServices;
		}
	},
	setServices : function(value, silent) {
		this.set({ service_ids : [[6, 0, value]] }, {silent: silent});
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