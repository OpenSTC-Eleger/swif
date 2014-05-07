/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'backbone',

], function(Backbone){

	'use strict';


	/******************************************
	* Generic Modal View
	*/
	var GenericModalView = Backbone.View.extend({

		modal : null,


		// The DOM events //
		events: {
			'show.bs.modal'  : 'show',
			'shown.bs.modal' : 'shown',
			'hide.bs.modal' : 'hide',
			'hidden.bs.modal': 'hidden',

			'click [data-action="zenmode"]': 'toggleZenmode'
		},



		/** Trigger when the modal is show
		*/
		show: function(){
			this.delegateEvents(this.events());
		},


		/** Trigger when the modal begin to hide
		*/
		hide: function(){
			$('.modal-backdrop').removeClass('zenmode');
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
		},



		/** Toggle fullscreen mode
		*/
		toggleZenmode: function(){

			$(this.el).find('.modal-dialog').toggleClass('modal-zenmode');
			$('.modal-backdrop').toggleClass('zenmode');
		}

	});

	return GenericModalView;

});