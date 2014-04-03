define([
	'app',
	'appHelpers',
	'genericModel',
	'moment'


], function(app, AppHelpers, GenericModel){

	'use strict';
	
	/******************************************
	* Booking Model
	*/
	return GenericModel.extend({
		
		urlRoot: '/api/openpatrimoine/contract_types',

		fields: ['id', 'name', 'code', 'parent_id', 'actions'],
		
		readonlyFields: ['id'],
		
		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric',
				label: 'N°'
			},
			{
				key  : 'name',
				type : 'text',
				label: 'Libellé'
			}
		],
		
		getId: function(){
			return this.get('id');
		},
		
		getName: function(){
			return this.get('name');
		},
		
		getInformations: function(){
			var ret = {};
			ret.name = this.getAttribute('name','');
			ret.infos = {key:app.lang.description, value:this.getAttribute('description','')};
			return ret;
		},
				
		saveToBackend: function(){
			var self = this;
			var vals = this.getSaveVals();
			var ret = this.save(vals,{patch:!this.isNew(), wait:true}).then(function(data){
				if(self.isNew()){
					self.set({id:data});
				}
				return self.fetch();
			});
			return ret;
		},
		
		/** Model Initialization
		*/
		initialize: function(){

		},
	
	
	}, {
		// Request State Initialization //
		status : {
		
		},
		
			// Actions of the requests //
		actions : {
			update: {
				key					: 'update',
				icon				: 'fa-pencil',
				translation			: app.lang.actions.update
			},
			delete: {
				key					: 'delete',
				icon				: 'fa-trash-o',
				translation			: app.lang.actions.delete
			},
		}
	});
});