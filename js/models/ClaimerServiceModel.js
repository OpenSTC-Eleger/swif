define([
	'app',

	'genericModel',

], function(app, GenericModel){

	'user strict';


	/******************************************
	* Claimer Service Model
	*/
	var ClaimerServiceModel = GenericModel.extend({
	 

		fields       : ['id', 'name', 'code', 'manager_id', 'service_id', 'technical', 'user_ids', 'actions'],
		
		urlRoot      : '/api/openstc/departments',


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

		

	    /** Check if the Service is a technical service
	    */
	    isTechnical: function() {
	        return this.get('technical');
	    },

		getCode: function(){
			return this.get('code');
		},

	    getParentService : function(type) {

			// Check if the place have a parent place //
			if(this.get('service_id')){
				var id = this.get('service_id')[0];
				var name = _.titleize(this.get('service_id')[1].toLowerCase());
			}
			else{
				var id, name = '';
			}

			switch (type){ 
				case 'id': 
					return id;
				break;
				case 'all':
					return this.get('service_id');
				break;
				case 'json':
					return {id: id, name: name};
				break;
				default: 
					return name;
			}
		},

		getManager: function(type) {

			// Check if the place have a parent place //
			if(this.get('manager_id')){
				var id = this.get('manager_id')[0];
				var name = _.titleize(this.get('manager_id')[1].toLowerCase());
			}
			else{
				var id, name = '';
			}

			switch (type){ 
				case 'id': 
					return id;
				break;
				case 'all':
					return this.get('manager_id');
				break;
				case 'json':
					return {id: id, name: name};
				break;
				default: 
					return name;
			}
		},


	    getUsersId: function(){
			return this.get('user_ids');
		},


	    getActions: function(){
			return this.get('actions');
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
		}

	});

return ClaimerServiceModel;

});