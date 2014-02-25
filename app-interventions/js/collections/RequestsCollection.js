/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericCollection',
	'requestModel'

], function(app, GenericCollection, RequestModel){

	'use strict';


	/******************************************
	* Requests Collection
	*/
	var RequestsCollection = GenericCollection.extend({

		model        : RequestModel,

		url          : '/api/openstc/intervention_requests',

		fields       : ['id', 'name', 'actions', 'tooltip', 'create_date', 'create_uid', 'description', 'manager_id', 'partner_address', 'partner_id', 'partner_name', 'partner_service_id', 'partner_type', 'partner_type_code', 'people_name', 'service_id', 'site1', 'site_details', 'state', 'refusal_reason', 'has_equipment', 'equipment_id', 'is_citizen'],

		advanced_searchable_fields: [
			{ key: 'site1',         label : app.lang.place },
			{ key: 'equipment_id',  label : app.lang.equipment },
			{ key: 'service_id',    label : app.lang.service },
			{ key: 'partner_id',  label : app.lang.claiment },
			{ key: 'create_date',   label : app.lang.createDate },
			{ key: 'date_deadline', label : app.lang.date_deadline },
			{ key: 'intervention_assignement_id', label: app.lang.category },
			{ key: 'state',         label : app.lang.status }
		],

		default_sort : { by: 'id', order: 'DESC' },

		specialCpt : 0,



		/** Collection Initialization
		*/
		initialize: function () {
		},



		/** Get the number of Request that the user have to deal
		*/
		specialCount: function(){
			var self = this;

			var domain = [];
			// Construct a domain accrding to user group //
			if(app.current_user.isDST()){
				domain = [
					{ field : 'state', operator : '=', value : RequestModel.status.to_confirm.key }
				];
			}
			else if(app.current_user.isManager()){
				domain = [
					{ field : 'state', operator : '=', value : RequestModel.status.wait.key },
					{ field : 'service_id.id', operator : 'in', value : app.current_user.getServices() }
				];
			}

			return $.ajax({
				url      : this.url,
				method   : 'HEAD',
				dataType : 'text',
				data     : {filters: app.objectifyFilters(domain)},
				success  : function(data, status, request){
					var contentRange = request.getResponseHeader("Content-Range");
					self.specialCpt = contentRange.match(/\d+$/);
				}
			});

		},


		/** Collection Sync
		*/
		sync: function(method, model, options){

			options.data.fields = this.fields;

			return $.when(
				this.count(options),
				(app.current_user.isDST() || app.current_user.isManager() ? this.specialCount() : ''),
				Backbone.sync.call(this,method,this,options)
			);
		}

	});

	return RequestsCollection;

});