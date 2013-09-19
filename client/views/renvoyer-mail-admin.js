Template.renvoyerMailAdmin.evenement = function(){
	return getOneEvt(Session.get('evtEnCours'));
}

Template.renvoyerMailAdmin.events({
	'click #sendMail': function(e) {
		e.preventDefault();
		Meteor.call("renvoyerEmailAdmin",Session.get('evtEnCours'),$('#emailAdmin').val(), function(error, result){
			if(error){
				flash("Une erreur est survenue ou le mail indiqué n'est pas le bon : merci de réessayer", "error");								
			}
			if(result){
				flash("Le mail a été renvoyé correctement", "success");
				page("/event/"+Session.get('evtEnCours'));
			}
		} );
	}
});