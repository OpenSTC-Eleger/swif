/*!
 * SWIF-OpenSTC
 *
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'interventionModel',
	'taskModel',
	'requestModel',
	'modalInterventionView',
	'modalCancelInterventionView',
	'moment',
	'printElement',

], function(app, AppHelpers, InterventionModel, TaskModel, RequestModel, ModalInterventionView, ModalCancelInterventionView,moment){

	'use strict';


	/******************************************
	* Row Intervention View
	*/
	var ItemInterventionView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML : '/templates/items/itemIntervention.html',

		className   : function(){
			this.classColor = InterventionModel.status[this.model.getState()].color;
			return 'row-item border-emphasize border-emphasize-' + this.classColor;
		},

		// The DOM events //
		events       : {
			'click a.printInter'       : 'print',
			'click a.buttonCancelInter': 'displayModalCancelInter',
			'click a.accordion-object' : 'tableAccordion',
			'click a.modalSaveInter'   : 'displayModalSaveInter',
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.detailedView = this.options.detailedView;
			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
		},



		/** When the model ara updated //
		*/
		change: function(){
			var self = this;
			self.render();

			// Highlight the Row and recalculate the className //
			AppHelpers.highlight($(self.el)).done(function(){
			});

			app.notify('', 'success', app.lang.infoMessages.information, self.model.getName()+' : '+ app.lang.infoMessages.interventionUpdateOK);

			// Partial Render //
			app.views.interventions.partialRender();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang                   : app.lang,
					interventionsState     : InterventionModel.status,
					intervention          : self.model,
				});

				$(self.el).html(template);

				// Set the Tooltip / Popover //$(self.el).html(template);
				$('*[data-toggle="tooltip"]').tooltip();
				$('*[data-toggle="popover"]').popover({trigger: 'hover'});

				// Set the focus to the first input of the form //
				$('#modalCancelInter').on('shown', function() {
					$(this).find('input, textarea').first().focus();
				});
				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

			});
			$(this.el).hide().fadeIn('slow');
			return this;
		},

		/** Print a Task or an Intervention
		*/
		print: function(e){
			e.preventDefault();

			var self = this;
			var interJSON = this.model.toJSON();

			// Hide the print Inter section //
			$('#printTask div.forTask').hide();
			$('#printTask div.forInter').show();
			$('#tableTasks tbody').empty();


			this.detailedView.fetchData().done(function () {
				// Display all the tasks of the inter //
				_.each(self.detailedView.tasksCollection.models, function(task){
					var taskJSON = task.toJSON();

					var doneBy = '';
					var dateStart = '';
					var dateEnd = '';
					var equipment = '';

					// User who made the Task //
					if(task.getState() == TaskModel.status.done.key){
						if(task.affectedOnTeam()){
							doneBy = task.getTeam();
						}
						else{
							doneBy = task.getUser();
						}
						dateStart = moment(task.getDateStart()).format('LLL');
						dateEnd = moment(task.getDateEnd()).format('LLL');
						equipment = task.getEquipments();
					}
					$('#tableTasks tbody').append('<tr style="height: 70px;"><td>'+taskJSON.name+'</td><td>'+AppHelpers.decimalNumberToTime(taskJSON.planned_hours, 'human')+'</td><td class="toFill">'+doneBy+'</td><td class="toFill">'+dateStart+'</td><td class="toFill">'+dateEnd+'</td><td class="toFill">'+equipment+'</td><td class="toFill"></td><td class="toFill"></td></tr>');
				});

				var deferred = $.Deferred();
				deferred.always(function(){
					$('#interName').html(interJSON.name);
					$('#interDescription').html(interJSON.description);
					$('#interService').html(!interJSON.service_id?'':interJSON.service_id[1]);

					if(interJSON.has_equipment){
						$('#interPlace').css({display:'inline-block'});
						//fill data with equipment and location
						$('#interPlaceOrEquipment').html(interJSON.equipment_id[1]);
						$('#interPlace').html(interJSON.site1[1]);
					}
					else{
						$('#interPlace').css({display:'none'});
						//fill data of site1
						$('#interPlaceOrEquipment').html(interJSON.site1[1]);
					}
					$('#interPlaceMore').html(interJSON.site_details);

					$('#printTask').printElement({
						leaveOpen	: true,
						printMode	: 'popup',
						overrideElementCSS:[
							{ href:'css/vendors/print_table.css', media: 'all'}
						]
					});
				});

				if(!interJSON.ask_id){

					$('#claimentName').html(interJSON.create_uid[1]);
					deferred.resolve();
				}else{
					//retrieve ask associated, if exist
					var ask = new RequestModel();
					ask.setId(interJSON.ask_id[0]);
					ask.fetch().done(function(){
						var askJSON = ask.toJSON();
						if(askJSON.partner_id !== false){
							$('#claimentName').html(askJSON.partner_id[1]+' - '+ !askJSON.partner_address?'':askJSON.partner_address[1]);
							$('#claimentPhone').html(askJSON.partner_phone);

						}
						else{
							$('#claimentName').html(askJSON.people_name);
							$('#claimentPhone').html(askJSON.people_phone);
						}
						if(!_.isUndefined(askJSON.partner_type) && askJSON.partner_type !== false){
							$('#claimentType').html(askJSON.partner_type[1]);
						}
						deferred.resolve();
					})
					.fail(function(e){
						console.log('An error occured');
						console.log(e);
						deferred.reject();
					});
				}
			});
		},

		expendAccordion: function(){
			var self = this;
			// Retrieve the intervention ID //

			var id = this.model.toJSON().id.toString();
			var isExpend = $('#collapse_'+id).hasClass('expend');

			// Reset the default visibility //
			$('tr.expend').css({ display: 'none' }).removeClass('expend');
			$('tr.row-object').css({ opacity: '0.45'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});

			// If the table row isn't already expend //
			if(!isExpend){
				// Fetch tasks
				if(!_.isUndefined(this.detailedView)){
					this.detailedView.fetchData().done(function () {
						self.detailedView.render();
					});
				}
				// Set the new visibility to the selected intervention //
				$('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
				$(this.el).parents('tr.row-object').css({ opacity: '1'});
				$(this.el).parents('tr.row-object').children('td').css({ backgroundColor: '#F5F5F5' });
			}
			else{
				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
			}
		},


		tableAccordion: function(e){
			e.preventDefault();
			//fold up current accordion and expand
			this.expendAccordion();
		},

		/** Display the form to add / update an intervention
		*/
		displayModalSaveInter: function(e){
			e.preventDefault();
			var params = {el:'#modalInter'};
			params.model = this.model;
			new ModalInterventionView(params);
		},


		/** Display the form to cancel an intervention
		*/
		displayModalCancelInter: function(e) {
			e.preventDefault();
			new ModalCancelInterventionView({el: '#modalCancelInter', model: this.model});
		}

	});

	return ItemInterventionView;
});