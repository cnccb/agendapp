//insert the new event
function getMonthIndex(key)
{
    var d = new Date(key);
    var nommois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    return nommois[d.getMonth()] + " " + d.getFullYear();

}

Template.listeEvt.evenements = function() {
    var liste = Evenements.find().fetch();
    var evenements = new Array();

    var lastindex = null;
    _.each(liste, function(value, key, list) {
        var index = getMonthIndex(value.datedeb);
        if (index !== lastindex)
        {
            evenements.push({"TitreIntermediaire": index});
            lastindex = index;
        }
        evenements.push(value);
    });
    console.log(evenements);
    return evenements;

};

Template.nouvelEvt.events({
    'click #submitevt': function(e) {
        e.preventDefault();
        var newId = _.uniqueId();


        var newEvent =
                {
                    admin: admin.value, //Mail pour l'administration
                    permalink: newId,
                    // password:'test',
                    nom: nom.value, //nom de l'évènement
                    datedeb: datedeb.value, // Date 
                    datefin: datefin.value, // Date 
                    forclusion: forclusion.value, //Date de forclusion
                    horaires: horaires.value, //horaires (avec alternatives si pas bordé)
                    echelle: echelle.value, //Echelle (nationale, régionale, ...)
                    cible: cible.value, //Public attendu (->cible)
                    prix: prix.value, //Prix d'inscription
                    orga: orga.value, //Nom de l'organisateur, 
                    statut: statut.value, //Statut           
                    contact: contact.value, //Contact (pour information)            
                    tel: tel.value, //tel orga
                    lieu: lieu.value, //Lieu / adresse
                    plan: plan.value, // Plan d’accès
                    url: url.value,
                    programme: programme.value, // Programme
                    options: options.value, //Options (buvette, offre de repas, etc.)
                    conditions: conditions.value, //Conditions de participation
                    hebergement: hebergement.value, //Recommandations d’hébergement
                    restauration: restauration.value, //Recommandations restauration
                    visites: visites.value //Recommandations visites
                };
        console.log("nouvel evènement");
        console.log(newEvent);
        Evenements.insert(newEvent);

    },
    'submit': function(e) {
        console.log('form submit');
        e.preventDefault();
    }
});
