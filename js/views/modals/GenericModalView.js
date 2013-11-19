define([
	'backbone',

], function(Backbone){



	/******************************************
	* Generic Modal View
	*/
	var GenericModalView = Backbone.View.extend({

		modal : null,

		
		// The DOM events //
		events: {
			'show.bs.modal'  : 'show',
			'shown.bs.modal' : 'shown',
			'hidde.bs.modal' : 'hide',
			'hidden.bs.modal': 'hidden',
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



		/** Trigger when the modal is shown
		*/
		shown: function(){

			// Set the focus to the first input of the form if elFocus is undefined //
			if(_.isUndefined(this.options.elFocus)){
				this.modal.find('input, textarea').first().focus();
			}
			else{
				if($('#'+this.options.elFocus).hasClass('select2')){
					$('#'+this.options.elFocus).select2('open');	
				}
				else{
					this.modal.find('#'+this.options.elFocus).focus();	
				}
			}
		}

	});

return GenericModalView;

});