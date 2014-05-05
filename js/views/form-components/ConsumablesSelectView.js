/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'advancedSelectBoxView',

	'consumablesCollection',
	'consumableModel'

], function(app, AdvancedSelectBoxView, ConsumablesCollection, ConsumableModel){


	'use strict';


	/******************************************
	* ConsumablesSelectView form
	*/
	var ConsumablesSelectView = Backbone.View.extend({


		templateHTML : 'templates/form-components/consumablesSelect.html',


		selectedConsumables: [],

		events: {
			'click a[data-action="remove"]'    : 'removeRow',
			'click a[data-action="duplicate"]' : 'duplicateRow'
		},


		// Row template //
		rowTemplate :
			'<tr data-id="<%= c.getId() %>" data-text="<%= c.getName() %>" class="row-item"> \
				<td class="col-sm-4"> \
					<span><%= c.getName() %></span> \
					<p class="row-actions invisible"> \
						<a href="#" data-action="duplicate" data-toggle="tooltip" data-original-title="'+_.capitalize(app.lang.actions.duplicate)+'"> <i class="fa fa-files-o fa-fw fa-lg"></i> </a> \
						<a href="#" data-action="remove" data-toggle="tooltip" data-original-title="'+_.capitalize(app.lang.actions.delete)+'"> <i class="fa fa-trash-o fa-fw fa-lg"></i> </a> \
					</p> \
				</td> \
				<td class="col-sm-4"><input type="text" class="fieldDQE form-control input-sm"></td> \
				<td class="col-sm-2"><input type="number" step="1" min="1" class="fieldQuantity form-control input-sm" value="1"></td> \
				<td class="col-sm-2"> \
					<div class="input-group input-group-sm"> \
						<input type="text" value="<%= c.getPrice() %>" class="fieldUnitPrice form-control input-sm"> \
						<span class="input-group-addon"><i class="fa fa-eur"></i></span> \
					</div> \
				</td> \
			</tr>',


		/** View Initialization
		*/
		initialize: function(options){

			this.serviceID = options.serviceID;

			this.render();
		},



		/** View Render
		*/
		render: function(){
			var self = this;

			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang: app.lang
				});

				$(self.el).html(template);


				// Create the advance selectBox view and listen the change event //
				self.advancedSelectBoxCatConsumables = new AdvancedSelectBoxView({el: $('#field_consumables'), url: ConsumablesCollection.prototype.url });
				self.advancedSelectBoxCatConsumables.setSearchParam({field:'type_id.service_ids', operator:'in', value:[self.serviceID]}, true);
				self.advancedSelectBoxCatConsumables.render();
				self.advancedSelectBoxCatConsumables.select2.off().on('select2-selecting', function(e){ self.addConsumable(e); } );

			});

			return this;
		},



		/** Function to add consumables inside the <table>
		*/
		addConsumable: function(e){
			var self = this;

			$(this.el).find('.tableConsumables.hide').removeClass('hide');

			var consumable = new ConsumableModel({ id: e.object.id });

			// Fetch information about the Consumable //
			consumable.fetch({ data : {fields : ConsumableModel.prototype.fields} })
			.done(function(){
				$(self.el).find('.consumablesRows').append(_.template(self.rowTemplate, {c: consumable}));
				$(self.el).find('*[data-toggle="tooltip"]').tooltip({ delay: { show: 250, hide: 0 }});
			});
		},



		/** Function to get all the consumables inside the <table>
		*/
		getConsumables: function(){
			var self = this;

			_.each($(this.el).find('.consumablesRows tr'), function(row){

				var consum = {
					id        : $(row).data('id'),
					dqe       : $(row).find('input.fieldDQE').val(),
					quantity  : $(row).find('input.fieldQuantity').val(),
					unit_price: $(row).find('input.fieldUnitPrice').val()
				};

				self.selectedConsumables.push(consum);
			});

			return self.selectedConsumables;
		},



		/** Delete a row from the <table>
		*/
		removeRow: function(e){
			e.preventDefault();

			// Remove the row //
			$(e.currentTarget).parents('tr').remove();

			// check if there are still rows in the table //
			if($(this.el).find('.consumablesRows tr').size() === 0){
				$(this.el).find('.tableConsumables').addClass('hide');
			}

		},



		/** Duplicate the row from the <table>
		*/
		duplicateRow: function(e){
			e.preventDefault();

			// Retrieve the id of the clicked row //
			var id = $(e.currentTarget).parents('tr').data('id');
			var text = $(e.currentTarget).parents('tr').data('text');

			var obj = {object: {id: id, text: text}};

			this.addConsumable(obj);
		}


	});

	return ConsumablesSelectView;

});