/******************************************
* Category Task Model
*/
app.Models.CategoryTask = Backbone.Model.extend({


	fields  : ['id', 'name', 'code', 'parent_id', 'service_names', 'actions'],
	
	urlRoot : '/api/openstc/task_categories',


	defaults:{
		id : null,
	},


	searchable_fields: [
		{
			key  : 'name', 
			type : 'text'
		},
		{
			key  : 'code', 
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

	getCompleteName : function() {
		return _.titleize(this.get('complete_name').toLowerCase());
	},

	getCode : function() {
		return this.get('code');
	},
	setCode : function(value, silent) {
		this.set({ code : value }, {silent: silent});
	},

	getParentCat : function(type) {

		// Check if the place have a parent place //
		if(this.get('parent_id')){
			var id = this.get('parent_id')[0];
			var name = _.titleize(this.get('parent_id')[1].toLowerCase());
		}
		else{
			var id, name = '';
		}

		switch (type){ 
			case 'id': 
				return id;
			break;
			case 'all':
				return this.get('parent_id');
			break;
			case 'json':
				return {id: id, name: name};
			break;
			default: 
				return name;
		}
	},
	setParentCat : function(value, silent) {
		this.set({ parent_id : value }, {silent: silent});
	},

	getServices : function(type){

		var placeServices = [];

		_.each(this.get('service_names'), function(s){
			switch (type){
				case 'id': 
					placeServices.push(s[0]);
				break;
				case 'json': 
					placeServices.push({id: s[0], name: s[1]});
				break;
				default:
					placeServices.push(s[1]);
			}
		});

		if(type == 'string'){
			return _.toSentence(placeServices, ', ', ' '+app.lang.and+' ')
		}
		else{
			return placeServices;
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

		if(!_.isEmpty(this.getCode())){
			informations.infos = {};
			informations.infos.key = _.capitalize(app.lang.code);
			informations.infos.value = this.getCode();
		}

		return informations;
	},

	getActions : function(){
		return this.get('actions');
	}

});