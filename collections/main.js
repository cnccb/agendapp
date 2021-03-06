

Evenements = new Meteor.Collection('evenements');
Communes = new Meteor.Collection('Communes');
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
    Meteor.startup(function() {
        // if (Evenements.find({}).count() <= 3) {
        //     testEvt.forEach(function(item) {
        //         var id=Evenements.insert(item);
        //         console.log(item.nom+": "+"#"+item.codeedition+"#"+id);
        //     });
        // };
        if (Communes.find({}).count() == 0) {
            //console.log('insertions des communes : ', codesPostaux.length);
            _.each(codesPostaux,function(item) {
                var id=Communes.insert(item);                
                //if(!id) console.log("commune : ",item," problématique");
            });
            //console.log(Communes.find().count()+' communes insérées');
        };

        Meteor.publish("allEvents", function(){
            return Evenements.find({}, {fields: {codeedition: 0}});
        });
    });
}

if(Meteor.isClient){
    Meteor.startup(function(){
        Meteor.subscribe('allEvents');
        Meteor.subscribe('allCommunes');
    })
}

