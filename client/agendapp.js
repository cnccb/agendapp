//insert the new event
  
  Template.listeEvt.evenements = function () {
    return Evenements.find();
  };

  Template.nouvelEvt.events({
    'click #submitevt' : function (e) {
      e.preventDefault();
      var newId = _.uniqueId();


      var newEvent = 
      {
             admin: admin.value, //Mail pour l'administration
             permalink: newId,
            // password:'test',
             nom: nom.value, //nom de l'évènement
             date: date.value,// Date 
            // forclusion: 20131110, //Date de forclusion
            // horaires:'Samedi 10h00-19h00, Dimanche 10h00-17h00', //horaires (avec alternatives si pas bordé)
            // echelle: 'Nationale', //Echelle (nationale, régionale, ...)
            // cible:'des cannistes !', //Public attendu (->cible)
            // prix:'30€', //Prix d'inscription
            // orga: 'Julien Falconnet', //Nom de l'organisateur, 
            // statut:'en cours', //Statut           
            // contact:'webmaster@darkhan.net', //Contact (pour information)            
             lieu: lieu.value, //Lieu / adresse
            // plan:'http://goo.gl/maps/U6l2H', // Plan d’accès
            // url:'http://www.internationaux2015.com',
            // programme:'bla bla bla bla bla bla bla', // Programme
            // options:['buvette','repas sur place'], //Options (buvette, offre de repas, etc.)
            // conditions:'majeur et vacciné', //Conditions de participation
            // hebergement:'non', //Recommandations d’hébergement
            // restauration:'non', //Recommandations restauration
            // visites:'bof' //Recommandations visites
        };
        console.log("nouvel evènement");
        console.log(newEvent);
        Evenements.insert(newEvent);

    },
    'submit' : function(e){
      console.log('form submit');
      e.preventDefault();
    }
  });
