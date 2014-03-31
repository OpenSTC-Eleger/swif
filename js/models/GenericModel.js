/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'backbone',

], function(Backbone){

	'use strict';

	/******************************************
	* Generic Model
	*/
	var GenericModel = Backbone.Model.extend({


		defaults:{
			id : null,
		},


		searchable_fields: [
			{ key: 'name',  type: 'text' }
		],


		getId : function() {
			return this.get('id');
		},
		setId : function(value, silent) {
			this.set({ id: value }, {silent: silent});
		},

		getName : function() {
			return _.titleize(this.get('name').toLowerCase());
		},
		setName : function(value, silent) {
			this.set({ name: value }, {silent: silent});
		},

		getActions : function(){
			return this.get('actions');
		},
		
		//method to retrieve attribute with standard return form
		getAttribute: function(key,default_value){
			var val = this.get(key);
			if(_.isUndefined(default_value)){
				default_value = false;
			}
			if(!_.isUndefined(val) && val !== '' && val !== false && val !== null){
				return val;
			}
			else{
				return default_value;
			}
		},
		
		/**
		 * to move to GenericCollection
		 */
		getSaveVals: function(){
			var ret = {};
			var self = this;
			if(!_.isUndefined(this.collection)){
				_.map(this.collection.fieldsMetadata, function(fieldDefinition, fieldName){
					if(!_.contains(self.readonlyFields, fieldName)){
						if(fieldDefinition.type == 'many2one'){
							ret[fieldName] = self.getAttribute(fieldName, [false,''])[0];
						}
						else{
							ret[fieldName] = self.getAttribute(fieldName, false);
						}
					}
				});
			}
			else{
				console.warning('Swif error: Could not save model because not any collection is linked with, and so can not retrieve metadata fields.');
			}
			return ret;
		},
		
	});

	return GenericModel;

});