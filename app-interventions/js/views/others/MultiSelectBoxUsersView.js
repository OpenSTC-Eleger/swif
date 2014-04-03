/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'advancedSelectBoxView',

	'officersCollection',
	'teamsCollection',
	'claimersCollection'


], function(app, AdvancedSelectBoxView, OfficersCollection, TeamsCollection, ClaimersCollection){

	'use strict';


	/******************************************
	* MultiSelectBoxUsersView - To select Users-Teams-ServiceProvider
	*/
	var MultiSelectBoxUsersView = Backbone.View.extend({

		templateHTML: '/templates/others/multiSelectBoxUsersView.html',

		userTypes : {
			officer: {
				key        : 'officer',
				label      : app.lang.agent,
				logo       : 'fa-user',
				placeholder: app.lang.actions.selectAAgent,
				url        : OfficersCollection.prototype.url
			},
			team: {
				key        : 'team',
				label      : app.lang.team,
				logo       : 'fa-users',
				placeholder: app.lang.actions.selectATeam,
				url        : TeamsCollection.prototype.url
			},
			provider: {
				key        : 'provider',
				label      : app.lang.provider,
				logo       : 'fa-truck',
				placeholder: app.lang.actions.selectAProvider,
				url        : ClaimersCollection.prototype.url
			}
		},

		userTypesSelected : '',


		// The DOM events //
		events: {
			'click .dropdown-menu li'  : 'changeUserType'
		},



		/** View Initialization
		*/
		initialize: function() {

			// Set the default user type //
			this.userTypesSelected = this.userTypes.officer;

			this.render();
		},




		/** Display the view
		*/
		render: function () {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang             : app.lang,
					userTypes        : self.userTypes,
					userTypesSelected: self.userTypesSelected
				});

				$(self.el).html(template);

				self.selectView = new AdvancedSelectBoxView({el: '#selectUsers', url: self.userTypesSelected.url, placeholder: self.userTypesSelected.placeholder });
				self.selectView.render();

				// Display the default value on the button //
				self.setSelectedUser();

			});

			return this;
		},



		/** Get the use type {type: value, value: value}
		*/
		getUserType: function(){
			return {type: this.userTypesSelected.key, value: this.selectView.getSelectedItem()};
		},



		/** Change the user Type
		*/
		changeUserType: function(e){
			e.preventDefault();

			var link = $(e.currentTarget);


			// Set selected liste active //
			$(this.el).find('.dropdown-menu li').removeClass('active');
			link.addClass('active');

			var sl = link.data('type');

			this.userTypesSelected = this.userTypes[sl];
			this.setSelectedUser();

			this.selectView.open();
		},



		/** Select the new user type
		*/
		setSelectedUser: function(){

			this.selectView.setUrl(this.userTypesSelected.url);
			this.selectView.setPlaceholder(this.userTypesSelected.placeholder);
			this.selectView.reset();
			this.selectView.render();


			var s = '<i class="fa '+this.userTypesSelected.logo+' fa-fw"></i>&nbsp; <span class="fa fa-caret-down"></span>';
			$(this.el).find('.dropdown-toggle').html(s);
		}

	});


	return MultiSelectBoxUsersView;
});