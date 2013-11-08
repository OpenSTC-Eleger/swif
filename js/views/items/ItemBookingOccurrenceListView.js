/******************************************
* Row Intervention Task List View
*/
app.Views.ItemBookingOccurrenceListView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemBookingOccurrenceList',

	// The DOM events //
	events       : {		
		
	},
	
	/** View Initialization
	*/
	initialize : function() {
	},


	/** When the model has updated //
	*/
	change: function(model){
		var self = this;
		//Update Inter model
		self.model.fetch();
		app.Helpers.Main.highlight($(this.el));
	},

	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			
			var template = _.template(templateData, {
				lang                   	: app.lang,
				booking			: self.model.toJSON(),
			});

			$(self.el).html(template);
			
			$('#switch-'+self.model.id).bootstrapSwitch();

			$(self.el).addClass('row-nested-objects-collapse').attr('id','collapse_' + self.model.toJSON().id);
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

			// Render tasks
			if (!_.isUndefined(self.occurences)) {
				$('#row-nested-objects').empty();
				_.each(self.occurences.models, function (occurence) {
					var itemBookingOccurrenceView = new app.Views.ItemBookingOccurrenceView({model: occurence});
					$(self.el).find('#row-nested-objects').append(itemBookingOccurrenceView.render().el);
					self.occurences.off();
					//self.listenTo(occurence, 'destroy', self.change);
					//self.listenTo(occurence, 'change', self.change);
				});
				
			};
		});
		return this;
	},

	/**
	 * Fetch tasks
	 */
	fetchData: function () {
		var self = this;
		var deferred = $.Deferred();
		self.occurences = new app.Collections.Bookings();
		if( self.model.get('recurrence_id')!= false ) {
			var domain = [{'field': 'recurrence_id.id', 'operator': '=', 'value': self.model.get('recurrence_id')[0]},
			              {'field':'id', 'operator': '!=', 'value': self.model.get('id')}]
			var fetchParams={
								silent : true,
								data   : {
									filters: app.objectifyFilters(domain)
								}
							};
			self.occurences.fetch(fetchParams).done(function(data){				
				deferred.resolve();
			});
		}
		return deferred;
	},	


});