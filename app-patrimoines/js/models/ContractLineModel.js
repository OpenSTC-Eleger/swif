define([
	'app',
	'appHelpers',
	'genericRecurrenceModel',
	'moment'


], function(app, AppHelpers, GenericRecurrenceModel){

	'use strict';
	
	/******************************************
	* ContractLine Model
	*/
	return GenericRecurrenceModel.extend({
		
		urlRoot: '/api/openpatrimoine/contract_lines',

		fields: ['id', 'name', 'is_team', 'agent_id', 'team_id', 'internal_inter', 'technical_service_id', 'planned_hours', 'task_categ_id' ,'supplier_cost', 'recur_periodicity' ,'recur_week_monday' ,'recur_week_tuesday', 'recur_week_wednesday', 'recur_week_thursday', 'recur_week_friday' ,'recur_week_saturday' ,'recur_week_sunday', 'recur_month_type', 'recur_month_absolute', 'recur_month_relative_weight', 'recur_month_relative_day', 'recur_type', 'date_start', 'recur_length_type', 'date_end recur_occurrence_nb', 'occurrence_ids', 'partner_id', 'plan_task'],

		urlRecurrenceResource: '/api/openpatrimoine/contract_lines',
		
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
		readonlyFields: ['id'],
		
		relatedFields: {
			technical_service_id:'technical_service_id',
			partner_id:'supplier_id',
			internal_inter:'internal_inter',
			date_end:'date_end_order'
		},
		
		getId: function(){
			return this.get('id');
		},
		
		getName: function(){
			return this.get('name');
		},
		
		/**
		 * Copy all related data from parentModel to this model
		 */
		bubbleData: function(model){
			var vals = {};
			_.map(this.relatedFields, function(parentField, field){
				vals[field] = model.getAttribute(parentField, false);
			});
			this.set(vals);
			this.trigger('related',this);
		},
		
		/** Model Initialization
		 * if some related fields are declared, retrieve there data and add them to the model attribute
		 * Add a listener to always keep its related data up-to-date
		*/
		initialize: function(vals, options){
			var self = this;
			if(options.parentModel){
				this.parentModel = options.parentModel;
				if(!this.getAttribute('date_start',false)){
					this.set({date_start:this.parentModel.getDatetime('date_start_order')});
				}
				this.listenTo(this.parentModel, 'change', self.bubbleData);
				this.bubbleData(this.parentModel);
			}
			GenericRecurrenceModel.prototype.initialize.apply(this, arguments);
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