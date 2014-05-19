/*!
 * SWIF-OpenSTC
 *
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers'

], function(app, AppHelpers){

	'use strict';


	/******************************************
	* Row Intervention View
	*/
	var ItemBudgetView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML : '/templates/items/itemBudget.html',


		// The DOM events //
		events       : {
			'click a.accordion-object' : 'tableAccordion'
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			//this.detailedView = this.options.detailedView;
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
			$.get(app.menus.openachatsstocks+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang     : app.lang,
					budget   : self.model
				});

				$(self.el).html(template);

				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

			});

			$(this.el).hide().fadeIn('slow');
			return this;
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
		}

	});

	return ItemBudgetView;
});