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

		userTypesDefault : {
			officer: {
				label      : app.lang.agent,
				collection : OfficersCollection.prototype,
				placeholder: app.lang.actions.selectAAgent,
			},
			team: {
				label      : app.lang.team,
				collection : TeamsCollection.prototype,
				placeholder: app.lang.actions.selectATeam,
			},
			provider: {
				label      : app.lang.provider,
				collection : ClaimersCollection.prototype,
				placeholder: app.lang.actions.selectAProvider,
			}
		},

		userTypesSelected : '',

		serviceID: '',
		
		


		// The DOM events //
		events: {
			'click .dropdown-menu li'  : 'changeUserType'
		},



		/** View Initialization
		*/
		initialize: function(options) {
			this.userTypes = _.clone(this.userTypesDefault);

			this.userTypes.officer.domain = [];
			this.userTypes.team.domain = [];
			this.userTypes.provider.domain = [{ field: 'type_id.code', operator: '=', value: 'PRESTATAIRE' }];

			// Set the default user type //
			if(!_.isUndefined(options.userTypeSelected)){
				this.userTypesSelected = this.userTypes[options.userTypeSelected];
				if(!_.isUndefined(options.userIdSelected)){
					this.userIdSelected = options.userIdSelected;
				}
			}
			else{
				this.userTypesSelected = this.userTypes.officer;
			}
			

			// Check if an intervention id is pass in parameter //
			if(!_.isUndefined(options.serviceID) && _.isEmpty(this.userTypesSelected.domain)){

				// Set the domain //
				var domain = { field: 'service_ids.id', operator: '=', value: options.serviceID };
				this.userTypes.officer.domain.push(domain);
				this.userTypes.team.domain.push(domain);

				this.userTypes.provider.domain.push({ field: 'technical_service_id.id', operator: '=', value: options.serviceID });
			}
			
			//Get label
			this.label = _.isUndefined(options.label)?_.capitalize(app.lang.carryOutBy):_.capitalize(options.label);
	

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
					userTypesSelected: self.userTypesSelected,
					label            : self.label
				});

				$(self.el).html(template);

				self.selectView = new AdvancedSelectBoxView({el: '#selectUsers', url: self.userTypesSelected.collection.url, placeholder: self.userTypesSelected.placeholder, minimumInputLength: 1 });
				self.applyDomain();

				

				self.selectView.render();
				
				self.trigger('select-init');

				// Display the default value on the button //
				self.setSelectedUser();
				
				if(!_.isUndefined(self.userIdSelected)){
					self.selectView.setSelectedItem(self.userIdSelected);
				}

			});

			return this;
		},



		/** Get the use type {type: value, value: value}
		*/
		getUserType: function(){
			return {type: this.userTypesSelected.collection.key, value: this.selectView.getSelectedItem()};
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

			this.applyDomain();

			this.selectView.open();

			this.trigger('userType-change');
		},



		/** Select the new user type
		*/
		setSelectedUser: function(){

			this.selectView.setUrl(this.userTypesSelected.collection.url);
			this.selectView.setPlaceholder(this.userTypesSelected.placeholder);
			this.selectView.reset();
			this.selectView.render();


			var s = '<i class="fa '+this.userTypesSelected.collection.logo+' fa-fw"></i>&nbsp; <span class="fa fa-caret-down"></span>';
			$(this.el).find('.dropdown-toggle').html(s);
		},



		/** Set search params
		*/
		applyDomain: function() {
			var self = this;

			// Reset the search params //
			this.selectView.resetSearchParams();

			if(!_.isEmpty(this.userTypesSelected.domain)){
				_.each(this.userTypesSelected.domain, function(domain){
					self.selectView.setSearchParam(domain);
				});
			}
		}

	});


	return MultiSelectBoxUsersView;
});