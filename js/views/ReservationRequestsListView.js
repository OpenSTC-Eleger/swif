/******************************************
* Reservation Requests
*/
app.Views.ReservationRequestsListView = Backbone.View.extend({

    el : '#rowContainer',

    templateHTML: 'reservationRequestsList',

    
    // The DOM events //
    events: {
        'click li.active'               : 'preventDefault',
        'click li.disabled'             : 'preventDefault',
        'click ul.sortable li'          : 'preventDefault',

        'click a.reservation'           : 'displayResaInfos'
    },



    /** View Initialization
    */
    initialize : function(user) {
        //this.render();
   },



    /** Display the view
    */
    render : function() {
        var self = this;

        // Change the page title //
        app.router.setPageTitle('Demandes de réservations');

        // Change the active menu item //
        app.views.headerView.selectMenuItem('prets-locations');

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


        // Retrieve the Login template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
         
            var template = _.template(templateData, {
                lang: app.lang,
                nbReservations: 6,
                startPos: 0, endPos: 6,
                page: 1,
                pageCount: 1
            });

            $(self.el).html(template);


            $('#materialsReserved, #materialsList, #hallsList').sortable({
                connectWith: 'ul.sortableList',
                dropOnEmpty: true,
                forcePlaceholderSize: false,
                forceHelperSize: true,
                placeholder: 'sortablePlaceHold',
                containment: '#resaMaterialsHalls',
                cursor: 'move',
                opacity: '.8',
                revert: 300,
                items: "> li:not(.disabled)",
                receive: function(event, ui){
                    //self.saveServicesOfficersTeam();
                }
            });


            $('input.slider').slider()
                .on('slide', function(ev){
                    $('#amount').html(ev.value);
                });

            $('.datepicker').datepicker({ format: 'dd/mm/yyyy', weekStart: 1, autoclose: true, language: 'fr' });
            $('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});

        });

		$(this.el).hide().fadeIn('slow');
        return this;


    },


    /** Display Reservation informations
    */
    displayResaInfos: function(e){
        e.preventDefault();

        var link = $(e.target);

        $('#resaMaterialsHalls').removeClass('hide');

        $('table.reservationsTable tr.info').removeClass('info');
        link.parents('tr').addClass('info');

        $('#resaTitle').html('<i class="icon-tag"></i> '+link.text());

    },



    /** Display the view
    */
    preventDefault: function(event){
        event.preventDefault();
    },



  
});




