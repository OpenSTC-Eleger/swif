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

			
			self.off(self.events());
			self.delegateEvents(self.events());
			
			// Advance Select List View //
			app.views.advancedSelectBoxTeamMembersView = new app.Views.AdvancedSelectBoxView({el: $("#searchMembers"), collection: app.Collections.Officers.prototype })
			app.views.advancedSelectBoxTeamMembersView.render();

			app.views.advancedSelectBoxPlaceParentView = new app.Views.AdvancedSelectBoxView({el: $("#searchServices"), collection: app.Collections.ClaimersServices.prototype })
			app.views.advancedSelectBoxPlaceParentView.render();
		});

		return this;
	},



	/** Partial Render of the view
	*/
	partialRender: function(){
		$('#nbMembers').html(_.size(this.model.getMembers()));
		$('#nbServices').html(_.size(this.model.getServices()));
	},



	/* Save the model when a service or a member is set, remove 
	*/
	change: function(e){
		var self = this;

		var params = {
			user_ids   : [[6, 0, app.views.advancedSelectBoxTeamMembersView.getSelectedItems()]],
			service_ids: [[6, 0, app.views.advancedSelectBoxPlaceParentView.getSelectedItems()]]
		}

		this.model.save(params, {patch: true, silent: true})
			.done(function(data) {
				self.model.fetch({ data : {fields : self.model.fields}, silent: true }).done(function(){
					self.partialRender();
				});
			})
			.fail(function (e) {
				console.error('Unable to save');
			})
	},


	/* Hide the view
	*/
	hide: function(){
		$(this.el).addClass('hide');
	}

});