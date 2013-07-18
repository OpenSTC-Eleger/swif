/******************************************
* Place Model
*/
app.Models.Place = Backbone.RelationalModel.extend({
	
	model_name : 'openstc.site',
	
	url: "/#places/:id",
	

	defaults:{
		id             : 0,
		name           : null,
		type           : 0,
		site_parent_id : 0,
		width          : 0,
		lenght         : 0,
		surface        : 0,
	},


	getId : function() {
		return this.get('id');
	},
	setId : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ id : value });
	},

	getName : function() {
		return _.titleize(this.get('name').toLowerCase());
	},
	setName : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ name : value });
	},

	getCompleteName : function() {
		return _.titleize(this.get('complete_name').toLowerCase());
	},
	setCompleteName : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ complete_name : value });
	},

	getParentPlace : function(type) {

		// Check if the place have a parent place //
		if(this.get('site_parent_id')){
			var id = this.get('site_parent_id')[0];
			var name = _.titleize(this.get('site_parent_id')[1].toLowerCase());
		}
		else{
			var id, name = '';
		}

		switch (type){ 
			case 'id': 
				return id;
			break;
			case 'all':
				return this.get('site_parent_id');
			break;
			case 'json':
				return {id: id, name: name};
			break;
			default: 
				return name;
		}
	},
	setParentPlace : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ site_parent_id : value });
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
	setServices : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ service_ids : value });
	},

	getType : function(type) {
		switch (type){ 
			case 'id': 
				return this.get('type')[0];
			break;
			case 'json':
				return {id: this.get('type')[0], name: this.get('type')[1]};
			break;
			default:
				return this.get('type')[1];
		}
	},
	setType : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ type : value });
	},

	getLenght : function() {
		return this.get('lenght');
	},
	setLenght : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ lenght : value });
	},  
	
	getWidth : function() {
		return this.get('width');
	},
	setWidth : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ width : value });
	},

	getSurface : function(human) {
		if(human){
			return (this.get('surface') != 0 ? _.numberFormat(this.get('surface'), 0, ',', ' ') +' m²' : '');
		}
		else{
			return this.get('surface');
		}
	},
	setSurface : function(value) {
		if(_.isUndefined(value)) return;
		this.set({ surface : value });
	},

	/** Get Informations of the model
	*/
	getInformations : function(){
		return [this.getName(), this.getType()];
	},



	/** Model Initialization
	*/
	initialize: function(){

	},



	/** Model Parser 
	*/
	parse: function(response) {
		response.complete_name = _.titleize(response.complete_name.toLowerCase());

		return response;
	},
	


	update: function(params) {
		this.setName( params.name );
		this.setType( params.type );
		this.setService( params.service );
		this.setParent( params.site_parent_id );
		this.setWidth( params.width );
		this.setLenght( params.lenght );
		this.setSurface( params.surface );
	},



	/** Save Model
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(), options);
	},



	/** Delete place
	*/
	delete: function (options) {
		app.deleteOE( 
			[[this.get('id')]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	}


});