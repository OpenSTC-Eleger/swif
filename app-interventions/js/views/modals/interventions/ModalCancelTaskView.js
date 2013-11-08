/******************************************
 * Intervention Details View
 */
app.Views.ModalCancelTaskView = app.Views.GenericModalView.extend({

	//el : '#rowContainer',
	
	templateHTML: 'modals/interventions/modalCancelTask',

	
	// The DOM events //
	events: function() {
		return _.defaults({
		'submit #formCancelTask' 			: 'cancelTask',
		},
		app.Views.GenericModalView.prototype.events);
		
	},

	/** View Initialization
	 */
	initialize: function () {
	    var self = this;
	    console.log("Cancel Intervention view intialization")
	    this.modal = $(this.el);
    	self.render();    
    },

    /** Display the view
     */
    render: function () {
		
		
		var self = this;
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			
			var template = _.template(templateData, {lang: app.lang, task: self.model.toJSON()});
			
			self.modal.html(template);
			self.modal.modal('show');
		});
 
		return this;
    },



	/** Cancel Task
	*/
	cancelTask: function(e){
		e.preventDefault();
		var self = this;
		this.model.cancel($('#motifCancelTask').val())
			.done(function(){
				$.when(self.model.fetch({wait: true}))
				.fail(function(e){
					console.log(e)}
				);
				if(!_.isUndefined(self.options.inter)){
					self.options.inter.fetch().fail(function(e){console.log(e)});
				}
				self.modal.modal('hide');
			})
			.fail(function(e){
				console.log(e)
			});
		
		//alert("Merci de laisser du temps pour pouvoir développer cette fonctionnalité");
	},



});

