/******************************************
* Row Intervention View
*/
app.Views.ItemTaskDayView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemTaskDay',

	// The DOM events //
	events       : {
		

	},



	/** View Initialization
	*/
	initialize : function() {

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);
	},

	change: function(model){
		this.highlight();
	},
	
	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

		 
			var template = _.template(templateData, {
				lang                   : app.lang,
				task					: self.model.toJSON()
			});
			$(self.el).attr('id', self.model.toJSON().id);
			$(self.el).html(template);

			
		});
		//$(this.el).hide().fadeIn('slow'); 
		return this;
	},

	/** Highlight the row item
	*/
	highlight: function(){
		var self = this;

		$(this.el).addClass('highlight');

		var deferred = $.Deferred();

		// Once the CSS3 animation are end the class are removed //
		$(this.el).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
			function(e) {
				$(self.el).removeClass('highlight');
				deferred.resolve();
		});

		return deferred;
	}


});