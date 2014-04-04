/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'officersCollection',
	'teamsCollection',
	'tabHeadView',
	'tabContentView',
	'claimersCollection',

], function(app, AppHelpers, OfficersCollection, TeamsCollection, TabHeadView, TabContentView, ClaimersCollection){

	'use strict';


	/******************************************
	* Tab container View
	* Cointains all tab headers
	* and tab selected and href selected in tab from url context
	*/
	var tabsContainerView = Backbone.View.extend({
		
		
		//template name
		templateHTML: 'templates/tabs/tabsContainer.html',
				
		
		// Tabs types : describes all the necessary infomramtions to siplay tabs 
		tabTypes : {
			officer: {
				key         : 'officer',
				label       : app.lang.agent,
				logo        : 'fa-user',
				placeholder	: app.lang.actions.selectAAgent,
				//not directly collection url but url to access backend method
				url         : app.current_user.getUrlManageableOfficers(),
			},
			team: {
				key         : 'team',
				label       : app.lang.team,
				logo        : 'fa-users',
				placeholder	: app.lang.actions.selectATeam,
				//not directly collection url but url to access backend method
				url         : app.current_user.getUrlManageableTeams(),
			},
			partner: {
				key        : 'partner',
				label      : app.lang.provider,
				logo       : 'fa-truck',
				placeholder: app.lang.actions.selectAProvider,
				//Collection url
				url        : ClaimersCollection.prototype.url,
			}
		},
		
		//Current tab selected
		tabTypesSelected : '',


		events: {
			'keyup #searchOfficerOrTeam'    : 'search',
			'click li a[data-toggle="tab"]'		: 'changeTabType',
		},
		


		/**
		* Initialize calendar view
		*/
		initialize: function(params){
			var self = this;
			this.options = params.options;
				
			// Set the tab to display
			this.tabTypesSelected = this.getTabSelected();
			
			this.initCollection().done(function(){
				self.render();
			});
			
		},

		/**
		 * Init tab collection
		 */
		initCollection: function() {
			var self = this;
			var user = app.current_user;
			return $.when($.ajax({
				async: true,
				url: self.tabTypesSelected.url,
				headers: {Authorization: 'Token token=' + user.get('authToken')},
				success: function (data) {
					self.postRender(data);
					//Set href selected
					self.hrefSelected = self.getItem(parseInt(self.modelId));
				}
			}));

		},

		/**
		 * Build hrefs in tab
		 */
		postRender: function(data) {
			
			this.hrefList = [];
			var self = this;

			_.each(data, function(model){
				var modelJSON = {};
				modelJSON.name  = (_.isUndefined(model.complete_name) ? model.name : model.complete_name);
				modelJSON.id = model.id;
				// Displays members popup on href hovering : used in particular for members team
				if( !_.isUndefined(model.members) ) {
					modelJSON.dataOriginalTitle = _.capitalize(self.label);
					modelJSON.dataContent = "<ul class='list-unstyled'>";
					_.each(model.members,function( member ) {
						modelJSON.dataContent += "<li><i class='fa fa-user'></i>" +
								(member.firstname !== false ? member.firstname.replace(' ', '&nbsp;') : '') +
								"&nbsp;"+ member.name.toUpperCase().replace(' ', '&nbsp;')  + "</li>";
					});
					modelJSON.dataContent +=	"</ul>";
					modelJSON.dataToggle = "popover";
					modelJSON.dataHtml = "true";
					modelJSON.dataPlacement = "left";
				}
				modelJSON.dataName = modelJSON.name.toLowerCase();
				modelJSON.content =  model.name.toUpperCase() + '&nbsp;' + (_.isUndefined(model.firstname) ? '': model.firstname );
				
				//add href in list
				self.hrefList.push(modelJSON);
			});
						
		},
		


		/** Display the view
		*/
		render: function() {
			var self = this;

			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang      : app.lang,
				});

				self.$el.html(template);
				
				//focus on search input field
				$('#searchOfficerOrTeam').focus();
				
				//load officer header Tab
				var officerTabView = new TabHeadView({ tabType: self.tabTypes.officer, counter: _.size( app.current_user.getOfficers() ), active:true  });
				$("#allTabs").append( officerTabView.el );
				
				//load team header Tab
				var teamTabView = new TabHeadView({ tabType: self.tabTypes.team , counter: _.size( app.current_user.getTeams() )});
				$("#allTabs").append ( teamTabView.el );
				
				//load partner header Tab
				var partnerTabView = new TabHeadView({ tabType: self.tabTypes.partner });
				$("#allTabs").append ( partnerTabView.el );
				
				self.selectTabView = new TabContentView({el: '#tab-content', hrefList : self.hrefList, hrefSelected: self.hrefSelected,
				tabTypes : self.tabTypes,	tabTypesSelected : self.tabTypesSelected  });
				
				self.selectTabView.render();
				
			});
			

			return this;
		},
		
		/**
		 * Get Tab selected from options in url 
		 */
		getTabSelected:function(){
			var self = this;
			var tabSelected = 'undefined';
			_.any(this.options, function(value,key){
				tabSelected = _.find(self.tabTypes,function(tab){
					return tab.key == key;
				});
				if( !_.isUndefined(tabSelected) ) {
					self.modelId = value;
					return true;
				}
				
			});
			return _.isUndefined(tabSelected)?this.tabTypes.officer:tabSelected;
		},
		
		/**
		 * Get selected href from list
		 */
		getItem: function(index){
			return _.find(this.hrefList, function (o) {
				return o.id == index;
			});
		},
		
		/**
		 * Get selected model corresponding to href selected
		 */
		getSelectedModel: function() {
			return this.getItem(this.options[this.tabTypesSelected.key]);
		},
		
		/** Change the tab Type
		*/
		changeTabType: function(e){
			e.preventDefault();
			var self = this;
			
			//reset search
			$('#searchOfficerOrTeam').val('');

			var link = $(e.currentTarget);


			// Set selected liste active //
			$(this.el).find('.tab-header li').removeClass('active');
			
			link.addClass('active');

			var sl = link.data('type');

			this.tabTypesSelected = this.tabTypes[sl];
			this.hrefSelected = null;
			//delete parameters (officer/team/partner) from options
			AppHelpers.deleteOptions(this.options, this.tabTypes);

			//Reload collection and rebuild Tab content view
			this.initCollection().done(function(){
				self.selectTabView.setKey(self.tabTypesSelected.key);
				self.selectTabView.setHrefList(self.hrefList);
				self.selectTabView.setHrefSelected(self.hrefList[0]);
				self.selectTabView.render();
			});
		},

		/** Search in tab //
		*/
		search: function(){

			var search = $('#searchOfficerOrTeam').val().toLowerCase();
			
			// If the term is not empty //
			if(!_.isEmpty(search)){
				_.each($('#list-' + this.tabTypesSelected.key + ' li'), function(a){
					//Hide or display href in tab
					if(!_.str.include($(a).data('name'), search)){
						$(a).fadeOut('fast').addClass('thide');
					}
					else{
						$(a).fadeIn('fast').removeClass('thide');
					}
				});
				//TODO				
//                _.each($('[id^=list-' + this.tabTypesSelected.key + '] li'), function(a){
//
//                        if(!_.str.include($(a).data('name'), search)){
//                                $(a).fadeOut('fast').addClass('thide');
//                        }
//                        else{  
//                                $(a).fadeIn('fast').removeClass('thide');
//                        }
//                });

			}
			else{
				//Display all href in tab when search is empty
				$('#list-' + this.tabTypesSelected.key + ' li').fadeIn().removeClass('thide');
			}
			//Update counter 
			$('#counter-' + this.tabTypesSelected.key).html($('#list-' + this.tabTypesSelected.key +' li:not(.thide)').size());
		},
		
		getTabTypes: function(){
			return this.tabTypes;
		},

	});

	return tabsContainerView;

});