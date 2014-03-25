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
		
		urlRoot: '/api/openpatrimoine/contract_lines',

		fields: ['id', 'name', 'is_team', 'agent_id', 'team_id', 'internal_inter', 'technical_service_id', 'planned_hours', 'task_categ_id' ,'supplier_cost', "recur_periodicity" ,"recur_week_monday" ,"recur_week_tuesday", "recur_week_wednesday", "recur_week_thursday", "recur_week_friday" ,"recur_week_saturday" ,"recur_week_sunday", "recur_month_type", "recur_month_absolute", "recur_month_relative_weight", "recur_month_relative_day", "recur_type date_start", "recur_length_type", "date_end recur_occurrence_nb", "occurrence_ids"],

		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric'
			},
			{
				key  : 'name',
				type : 'text'
			}
			
		],
		readonlyFields: ['internal_inter', 'id'],
		relatedFields: ['technical_service_id', 'supplier_id', 'internal_inter'],
		
		getUserMainAction: function(){
			var ret = '';
			switch(this.getAttribute('state','')){
			case 'draft':
				ret = 'confirm';
				break;
			case 'confirm':
				ret = 'done';
				break;
			case 'done':
				ret = 'extend';
				break;
			default:
				ret = 'confirm';
			}
			return ret;
		},
		/**
		 * Method used to compute actions authorized for user, and compute the mainAction to display on itemListViews
		 */
		getUserActions: function(){
			var actions = this.getAttribute('actions',[]);
			var mainAction = this.getUserMainAction();
			return {mainAction: mainAction, otherActions: _.without(actions, mainAction)};
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
		
		getId: function(){
			return this.get('id');
		},
		
		getName: function(){
			return this.get('name');
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
		
		/**
		 * Copy all related data from parentModel to this model
		 */
		bubbleData: function(model){
			var vals = {};
			_.each(this.relatedFields, function(field){
				vals[field] = model.getAttribute(field, false);
			});
			this.set(vals);
		},
		
		/** Model Initialization
		 * if some related fields are declared, retrieve there data and add them to the model attribute
		 * Add a listener to always keep its related data up-to-date
		*/
		initialize: function(vals, options){
			var self = this;
			if(options.parentModel){
				this.parentModel = options.parentModel;
				this.listenTo(this.parentModel, 'change', self.bubbleData);
				this.bubbleData(this.parentModel);
			}
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
			
			foo: {
				key					: 'foo',
				icon				: 'fa-ban-circle',
				translation			: 'bar'
			}

		}
	});
});