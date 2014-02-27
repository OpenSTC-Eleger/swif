/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericModel',

], function(app, GenericModel){

	'use strict';


	/******************************************
	* Team Model
	*/
	var TeamModel = GenericModel.extend({


		fields     : ['id', 'name', 'manager_id', 'actions', 'service_names', 'user_names'],

		urlRoot    : '/api/openstc/teams',



		getManager : function(type) {

			var returnVal;

			switch (type){
				case 'id':
					returnVal = this.get('manager_id')[0];
					break;
				case 'json':
					returnVal = {id: this.get('manager_id')[0], name: this.get('manager_id')[1]};
					break;
				default:
					returnVal = this.get('manager_id')[1];
			}

			return returnVal;
		},
		setManager : function(value, silent) {
			this.set({ manager_id : value }, {silent: silent});
		},

		getMembers: function(type) {
			var teamMembers = [];

			_.each(this.get('user_names'), function(s){
				switch (type){
					case 'id':
						teamMembers.push(s[0]);
						break;
					case 'json':
						teamMembers.push({id: s[0], name: s[1]});
						break;
					default:
						teamMembers.push(s[1]);
				}
			});

			if(type == 'string'){
				return _.toSentence(teamMembers, ', ', ' '+app.lang.and+' ');
			}
			else{
				return teamMembers;
			}
		},
		setMembers : function(value, silent) {
			this.set({ user_ids : [[6, 0, value]] }, {silent: silent});
		},


		// Team services ID //
		getServices: function(type) {
			var teamServices = [];

			_.each(this.get('service_names'), function(s){
				switch (type){
					case 'id':
						teamServices.push(s[0]);
						break;
					case 'json':
						teamServices.push({id: s[0], name: s[1]});
						break;
					default:
						teamServices.push(s[1]);
				}
			});

			if(type == 'string'){
				return _.toSentence(teamServices, ', ', ' '+app.lang.and+' ');
			}
			else{
				return teamServices;
			}
		},
		setServices : function(value, silent) {
			this.set({ service_ids : [[6, 0, value]] }, {silent: silent});
		},


		/** Get Informations of the model
		*/
		getInformations : function(){
			var informations = {};

			informations.name = this.getName();

			informations.infos = {};
			informations.infos.key = _.capitalize(app.lang.foreman);
			informations.infos.value = this.getManager();

			return informations;
		}

	});

	return TeamModel;

});