

Evenements = new Meteor.Collection('evenements');
/*
structure :
->evenement:
    Nom de l'évènement
    Mail pour l'administration
    Statut
    Echelle
    Nom de l'organisateur, 
    Contact (pour information)
    Date et horaires (avec alternatives si pas bordé)
    Date de forclusion
    Lieu / adresse
    Plan d’accès
    Public attendu (->cible)
    Conditions de participation
    Prix d'inscription
    Programme
    Options (buvette, offre de repas, etc.)
    Recommandations d’hébergement
    Recommandations restauration
    Recommandations visites
    Site web

*/

//init base
if (Meteor.isServer) {
  Meteor.startup(function () {
    if(Evenements.find({}).count()===0){
        Evenements.insert({
            admin:'philippe@canniste.org', //Mail pour l'administration
            permalink:'e4rYh',
            password:'test',
            nom: 'Internationaux de France 2013', //nom de l'évènement
            date: 20131213,// Date 
            forclusion: 20131110, //Date de forclusion
            horaires:'Samedi 10h00-19h00, Dimanche 10h00-17h00', //horaires (avec alternatives si pas bordé)
            echelle: 'Nationale', //Echelle (nationale, régionale, ...)
            cible:'des cannistes !', //Public attendu (->cible)
            prix:'30€', //Prix d'inscription
            orga: 'Julien Falconnet', //Nom de l'organisateur, 
            statut:'en cours', //Statut           
            contact:'webmaster@darkhan.net', //Contact (pour information)            
            lieu:'Gymnase de Reully, 75012 Paris', //Lieu / adresse
            plan:'http://goo.gl/maps/U6l2H', // Plan d’accès
            web:'http://www.internationaux2015.com',
            programme:'bla bla bla bla bla bla bla', // Programme
            options:['buvette','repas sur place'], //Options (buvette, offre de repas, etc.)
            conditions:'majeur et vacciné', //Conditions de participation
            hebergement:'non', //Recommandations d’hébergement
            restauration:'non', //Recommandations restauration
            visites:'bof' //Recommandations visites
        });
    }
    // code to run on server at startup
  });
}