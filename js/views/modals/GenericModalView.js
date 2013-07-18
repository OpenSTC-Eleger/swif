/******************************************
* Generic Modal View
*/
app.Views.GenericModalView = Backbone.View.extend({

	modal : null,

	
	// The DOM events //
	events: {
		'show'   : 'show',
		'shown'  : 'shown',
		'hide'   : 'hide',
		'hidden' : 'hidden',
	},



	/** Trigger when the modal is show
	*/
	show: function(){
		this.delegateEvents(this.events());
	},


	/** Trigger when the modal is hidden
	*/
	hidden: function(){
		this.undelegateEvents(this.events());
	},

});