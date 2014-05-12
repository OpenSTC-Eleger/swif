/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModalView',

	'interventionModel',
	'tasksCollection'


], function(app, GenericModalView, InterventionModel, TasksCollection){


	'use strict';



	/******************************************
	* Inter Detail Cost View
	*/
	var modalDetailCostInterView = GenericModalView.extend({


		templateHTML : '/templates/modals/interventions/modalInterDetailCost.html',



		// The DOM events //
		events: function() {
			return	GenericModalView.prototype.events;
		},



		/** View Initialization
		*/
		initialize : function(params) {
			var self = this;
			this.options = params;
			this.modal = $(this.el);

			// Check if it's a create or an update //
			if(_.isUndefined(this.tasksCollection)){
				this.render(true);
				this.fetchTasks().done(function(){
					self.render();
				});
			}
		},



		/** Display the view
		*/
		render : function(loader) {
			var self = this;

			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang              : app.lang,
					inter             : self.model,
					interventionsState: InterventionModel.status,
					loader            : loader,
					infos             : self.getInformationsAboutTasks()
				});

				self.modal.html(template);
				self.modal.modal('show');

				$('*[data-toggle="tooltip"]').tooltip();

			});

			return this;
		},



		/** Fetch all tasks in the interventions
		*/
		fetchTasks: function(){
			var deferred = $.Deferred();

			this.tasksCollection = new TasksCollection();


			if( this.model.get('tasks')!== false && _.size(this.model.get('tasks'))>0 ) {

				this.tasksCollection.fetch({
					silent: true,
					data: {filters: {0: {'field': 'id', 'operator': 'in', 'value': this.model.get('tasks')}}}

				}).done(function(){
					deferred.resolve();
				});
			}

			return deferred;
		},



		/** Get informations about the tasks collections (equipments, HR, consumables)
		*/
		getInformationsAboutTasks: function(){

			var hr         = [];
			var equipments = [];
			var consumables= [];


			if(!_.isUndefined(this.tasksCollection)){
				// Iterate over the tasks collection //
				_.each(this.tasksCollection.models, function(t) {

					// Iterate over the equipments of the tasks //
					_.each(t.getEquipments('json'), function(equip) {
						equipments.push(equip);
					});

					// Iterate over the consumable of the tasks //
					_.each(t.getConsumables('json'), function(equip) {
						consumables.push(equip);
					});


					if(t.affectedTo('json') !== false){
						hr.push({type: t.affectedTo('json'), logo: t.affectedTo('logo')});
					}
				});


				// Remove duplicate hr //
				hr = _.uniq(hr, function(item){ return item.logo+item.type.id; });

				// Remove duplicate equipments //
				equipments = _.uniq(equipments, function(item){ return item.id; });

				// Remove duplicate consumables //
				consumables = _.uniq(consumables, function(item){ return item.id; });
			}

			return {hr: hr, equipments: equipments, consumables: consumables};
		}


	});


	return modalDetailCostInterView;

});