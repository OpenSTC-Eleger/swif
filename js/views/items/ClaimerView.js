define(['app', 'appHelpers', 'modalClaimerEdit', 'modalDeleteView'

], function (app, AppHelpers, ModalClaimerEdit, ModalDeleteView) {

    'use strict';

    return Backbone.View.extend({

        tagName      : 'tr',

        className    : 'row-item',

        templateHTML : 'items/claimer',

        events: {
            'click a.accordion-object'  : 'toggleAccordion',
            'click a.modalEditClaimer' : 'showEditModal'
        },

        /** View Initialization
         */
        initialize : function() {
            this.model.off();

            // When the model are updated //
            this.listenTo(this.model, 'change', this.change);

            // When the model are destroy //
            this.listenTo(this.model,'destroy', this.destroy);
        },

        toggleAccordion: function(e){
            e.preventDefault();
            var id = _($(e.target).attr('href')).strRightBack('_');
            this.selectedClaimer = id;
            var self = this;

            var isExpend = $('#collapse_'+id).hasClass('expend');

            // Reset the default visibility //
            $('tr.expend').css({ display: 'none' }).removeClass('expend');
            $('tr.row-object').css({ opacity: '0.5'});
            $('tr.row-object > td').css({ backgroundColor: '#FFF'});

            // If the table row isn't already expend //
            if(!isExpend){
                // Set the new visibility to the selected intervention //
                this.detailedView.fetchData().done(function () {
                    self.detailedView.render();
                });

                $('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
                $(e.target).parents('tr.row-object').css({ opacity: '1'});
                $(e.target).parents('tr.row-object').children('td').css({ backgroundColor: '#F5F5F5'});
            }
            else{
                $('tr.row-object').css({ opacity: '1'});
                $('tr.row-object > td').css({ backgroundColor: '#FFF'});
                $('tr.row-object:nth-child(4n+1) > td').css({ backgroundColor: '#F9F9F9'});
            }

        },

        render : function() {
            var self = this;
            $.get("templates/" + this.templateHTML + ".html", function(templateData){
                var template = _.template(templateData, {
                    lang  : app.lang,
                    claimer : self.model.toJSON()
                })
                $(self.el).html(template);
                $('*[data-toggle="tooltip"]').tooltip();
            });
            return this;
        },


        /** When the model is updated //
         */
        change: function(e){
            this.render();
            AppHelpers.highlight($(this.el))
            app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.claimerUpdateOk);
        },

        /** When the model is destroy //
         */
        destroy: function(e){
            var self = this;

            AppHelpers.highlight($(this.el)).done(function(){
                self.remove();
            });

            app.notify('', 'success', app.lang.infoMessages.information, e.getCompleteName()+' : '+app.lang.infoMessages.claimerDeleteOk);
            app.views.claimersListView.collection.cpt--;
            app.views.claimersListView.partialRender();
        },

        /** Display Modal form to add/sav a new claimer
         */
        showEditModal: function(e){
            e.preventDefault(); e.stopPropagation();

            app.views.modalClaimerEdit = new ModalClaimerEdit({
                el      : '#modalEditClaimer',
                model   : this.model,
                elFocus : $(e.target).data('form-id')
            });
        },

        /** Modal to remove a claimer
         */
        modalDeleteClaimer: function(e){
            e.preventDefault(); e.stopPropagation();

            app.views.modalDeleteView = new ModalDeleteView({
                el         : '#modalDeleteClaimer',
                model      : this.model
            });
        }

    });
});

