Template.thanks.evt = function() {
	evtId = Session.get('evtEnCours');
    if (!evtId)
    {
        return null;    	
    }
    evt = getOneEvt(evtId);

    Session.get('titreEncours', evt.nom);
    evt.permalink = Meteor.absoluteUrl("event/"+evtId);
    return evt;
};