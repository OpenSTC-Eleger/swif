define([
	'app',

	'genericModel',

], function(app, GenericModel){

	'user strict';



	/******************************************
	* Place Model
	*/
	var PlaceModel = GenericModel.extend({


		fields     : ['id', 'name', 'complete_name', 'type', 'service_names', 'site_parent_id', 'width', 'length', 'surface'],

		urlRoot    : '/api/openstc/sites',


		searchable_fields: [
			{
				key  : 'surface',
				type : 'numeric'
			},
			{
				key  : 'complete_name', 
				type : 'text'
			}
		],


		getCompleteName : function() {
			return _.titleize(this.get('complete_name').toLowerCase());
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
		setParentPlace : function(value, silent) {
			this.set({ site_parent_id : value }, {silent: silent});
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
		setType : function(value, silent) {
			this.set({ type : value }, {silent: silent});
		},

		getLength : function() {
			return this.get('length');
		},
		setLength : function(value, silent) {
			this.set({ length : value }, {silent: silent});
		},  
		
		getWidth : function() {
			return this.get('width');
		},
		setWidth : function(value, silent) {
			this.set({ width : value }, {silent: silent});
		},

		getSurface : function(human) {
			if(human){
				return (this.get('surface') != 0 ? _.numberFormat(this.get('surface'), 0, ',', ' ') +' m²' : '');
			}
			else{
				return this.get('surface');
			}
		},
		setSurface : function(value, silent) {
			this.set({ surface : value }, {silent: silent});
		},

		/** Get Informations of the model
		*/
		getInformations : function(){
			var informations = {};

			informations.name = this.getCompleteName();

			if(!_.isEmpty(this.getServices())){
				informations.infos = {};
				informations.infos.key = _.capitalize(app.lang.associatedServices);
				informations.infos.value = this.getServices();
			}

			return informations;
		}

	});

return PlaceModel;

});