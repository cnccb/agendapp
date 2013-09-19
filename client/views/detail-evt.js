
/**
 * DETAILEVT
 */

Template.detailEvt.evenement = function() {
    if (!Session.get('evtEnCours'))
        return null;
    return getOneEvt(Session.get('evtEnCours'));
};

Template.detailEvt.rendered = function(){
    $('.label i').addClass('icon-white');
}