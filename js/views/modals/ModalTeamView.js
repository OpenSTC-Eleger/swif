/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'teamModel',
	'teamsCollection',
	'officersCollection',

	'genericModalView',
	'advancedSelectBoxView'


], function(app, TeamModel, TeamsCollection, OfficersCollection, GenericModalView, AdvancedSelectBoxView){

	'use strict';


	/******************************************
	* Team Modal View
	*/
	var ModalTeamView = GenericModalView.extend({


		templateHTML : 'templates/modals/modalTeam.html',



		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formSaveTeam'   : 'saveTeam'
			},
				GenericModalView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.modal = $(this.el);


			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){
				this.model = new TeamModel();
			}

			this.render();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					team  : self.model
				});


				self.modal.html(template);

				// Advance Select List View //
				app.views.advancedSelectBoxForemanView = new AdvancedSelectBoxView({el: $('#teamForeman'), url: OfficersCollection.prototype.url });

				// Retrieve only Officer //
				app.views.advancedSelectBoxForemanView.setSearchParam({field:'service_ids', operator:'!=', value: 'false'}, true);
				app.views.advancedSelectBoxForemanView.render();

				self.modal.modal('show');
			});

			return this;
		},



		/** Delete the model pass in the view
		*/
		saveTeam: function(e){
			e.preventDefault();

			var self = this;

			// Set the button in loading State //
			$(this.el).find('button[type=submit]').button('loading');


			// Set the properties of the model //
			this.model.setName(this.$('#teamName').val(), true);
			this.model.setManager(app.views.advancedSelectBoxForemanView.getSelectedItem(), true);


			this.model.save()
				.done(function(data) {
					self.modal.modal('hide');

					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : TeamsCollection.prototype.fields} }).done(function(){
							app.views.teamsListView.collection.add(self.model);
						});
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
				})
				.fail(function (e) {
					console.log(e);
				})
				.always(function () {
					$(self.el).find('button[type=submit]').button('reset');
				});
		},

	});

	return ModalTeamView;

});