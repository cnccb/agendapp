/** *
 * ENTETE
 */

Template.entete.events({
    'click #logotitre': function(e) {
        displayView('listeEvt');
        location.hash = '';
    }
});
 