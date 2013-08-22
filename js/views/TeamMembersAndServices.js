/******************************************
* Place Modal View
*/
app.Views.TeamMembersAndServices = Backbone.View.extend({


	templateHTML : 'teamMembersAndServices',



	// The DOM events //
	events: function(){
		return _.defaults({
			'change #searchMembers, #searchServices' : 'change',
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {
		var self = this;


		// Check if the model is loaded
		if(_.isObject(this.model)){
			this.render();
		}
		else{
			var id = this.model;
			this.model = new app.Models.Team();
			this.model.setId(id);
			
			this.model.fetch().done(function(){
				self.render();		
			}).fail(function(){
				console.error('Unable to load the team');
			})
		}
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang  : app.lang,
				team : self.model
			});

			$(self.el).html(template);


			// Advance Select List View //
			app.views.advancedSelectBoxTeamMembersView = new app.Views.AdvancedSelectBoxView({el: $("#searchMembers"), collection_url: app.Collections.Officers.prototype.url })
			app.views.advancedSelectBoxTeamMembersView.render();

			app.views.advancedSelectBoxPlaceParentView = new app.Views.AdvancedSelectBoxView({el: $("#searchServices"), collection_url: app.Collections.ClaimersServices.prototype.url })
			app.views.advancedSelectBoxPlaceParentView.render();
		});

		return this;
	},



	/* Save the model when a service or a member is set, remove 
	*/
	change: function(e){

		this.model.setMembers(app.views.advancedSelectBoxTeamMembersView.getSelectedItems(), true);
		this.model.setServices(app.views.advancedSelectBoxPlaceParentView.getSelectedItems(), true);
		this.model.setManager(this.model.getManager('id'), true);


		this.model.save({silent: true})
			.done(function(data) {
				console.log('okiiiiiiiiiiiii');
			})
			.fail(function (e) {
				console.log(e);
			})

	},


	/* Hide the view
	*/
	hide: function(){
		$(this.el).addClass('hide');
	}

});