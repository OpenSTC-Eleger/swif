/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'interventionModel',
	'modalAbsentTypeView',
	'modalInterventionView',
	'modalCancelInterventionView'


], function(app, AppHelpers, InterventionModel, ModalAbsentTypeView, ModalInterventionView, ModalCancelInterventionView){

	'use strict';


	/******************************************
	* Row Intervention View
	*/
	var itemPlanningInterView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML: '/templates/items/itemPlanningInter.html',


		className   : function(){
			this.classColor = InterventionModel.status[this.model.getState()].color;
			return 'row-item border-emphasize border-emphasize-' + this.classColor;
		},

		// The DOM events //
		events       : {
			'click a.accordion-object' : 'tableAccordion',
			'click a.modalSaveInter'   : 'displayModalSaveInter',
			'click a.buttonCancelInter': 'displayModalCancelInter',
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
		change: function(model){

			var self = this;

			self.detailedView.model = self.model;
			if(	this.itemIsToRemove( model ) ) {
				//Unexpend inter
				$('tr.expend').css({ display: 'none' }).removeClass('expend');
				//remove inter
				self.remove();
				self.detailedView.remove();
			}
			else {
				self.$el.removeAttr('class').addClass(self.className());
				self.render();
				if(!_.isUndefined(self.detailedView)){
					self.detailedView.fetchData().done(function () {
						self.detailedView.render();
					});
				}
				AppHelpers.highlight($(self.el));
			}
			app.notify('', 'success', app.lang.infoMessages.information, self.model.getName()+' : '+ app.lang.infoMessages.interventionUpdateOK);

		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){

				var modelJSON = self.model.toJSON();
				var informationHour = '';

				if( modelJSON.state != InterventionModel.status.template.key  ){
					informationHour = (modelJSON.planned_hours !== false ? AppHelpers.decimalNumberToTime(modelJSON.planned_hours, 'human') : '');
				}
				else{
					informationHour = (modelJSON.total_hours !== false ? AppHelpers.decimalNumberToTime(modelJSON.total_hours, 'human') : '');
				}

				var template = _.template(templateData, {
					lang               : app.lang,
					interventionsState : InterventionModel.status,
					intervention       : modelJSON,
					informationHour    : informationHour,
					classColor         : self.classColor
				});

				$(self.el).html(template);

				// Set the Tooltip / Popover //$(self.el).html(template);
				$('*[data-toggle="tooltip"]').tooltip();
				$('*[rel="popover"]').popover({trigger: 'hover'});

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



		/** Remove item in term of status filter
		*/
		itemIsToRemove: function(model){
			var state = model.toJSON().state;
			if( !_.isUndefined( app.views.planningInterListView.filter ) ){
				var filter = app.views.planningInterListView.filter[0].value;
				if( state !== filter )	{
					if (state === InterventionModel.status.cancelled.key || state===InterventionModel.status.scheduled.key || state===InterventionModel.status.open.key ){
						return true;
					}
				}
			}
			return false;
		},



		/** Process Table accordion event
		*/
		tableAccordion: function(e){
			e.preventDefault();
			//fold up current accordion and expand
			this.expendAccordion();
		},



		/** Expan accordion
		*/
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
					this.detailedView.fetchData().done(function() {
						self.detailedView.render();
					});
				}

				// Set the new visibility to the selected intervention //
				$('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
				$(this.el).parents('tr.row-object').css({ opacity: '1'});
				$(this.el).parents('tr.row-object').children('td').css({ backgroundColor: '#F5F5F5' });
			}
			else {
				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
			}
		},


		/** Display the form to add / update an intervention
		*/
		displayModalSaveInter: function(e){
			e.preventDefault();
			var params = {el:'#modalSaveInter'};
			params.model = this.model;
			new ModalInterventionView(params);
		},



		/** Display the form to cancel intervention
		*/
		displayModalCancelInter: function(e) {
			e.preventDefault();
			new ModalCancelInterventionView({el: '#modalCancelInter', model: this.model });
		}


	});

	return itemPlanningInterView;
});