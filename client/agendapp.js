//insert the new event
var localGetDetailEvt=null;
Deps.autorun(function(){
    Meteor.subscribe('getDetailEvt');
});

function getMonthIndex(d)
{
    if (_.isNaN(d.getFullYear()))
        return 'Inconnu';
    var nommois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    return nommois[d.getMonth()] + " " + d.getFullYear();

}

Template.listeEvt.evenements = function() {
    var liste = Evenements.find({}, {sort: {"datedeb": 1}}).fetch();
    var evenements = new Array();

    var lastindex = null;
    _.each(liste, function(value, key, list) {
        var d = new Date(value.datedeb);
        var index = getMonthIndex(d);
        if (index !== lastindex)
        {
            evenements.push({"TitreIntermediaire": index});
            lastindex = index;
        }
        value.jourdeb = d.toLocaleDateString();
        evenements.push(value);
    });
    console.log(evenements);
    return evenements;

};

Template.detailEvt.evenement = function() {
    var res=Evenements.findOne(Session.get('evtEnCours'));
    res = _.omit(res,['admin','_id']);
    return res;
};


Template.listeEvt.events({
    'click #newEvt': function(e) {
        $('#listeEvt').fadeOut(100, function() {
            $('#nouvelEvt').fadeIn(500);
        });
    },
    'click .clickToDetail': function(e) {
        Session.set('evtEnCours',$(e.currentTarget).attr('id'));
        $('#listeEvt').fadeOut(100, function() {
            $('#detailEvt').fadeIn(500);
        });
    }
    
});
Template.nouvelEvt.events({
    'click #cancel': function(e) {
        $('#nouvelEvt').fadeOut(100, function() {
            $('#listeEvt').fadeIn(500);
        });            
    },
    'click #submitevt': function(e) {
        e.preventDefault();
        var newEvent =
                {
                    admin: admin.value, //Mail pour l'administration
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
                    codepostal: codepostal.value, //Lieu / adresse
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
        $('#nouvelEvt').fadeOut(100, function() {
            $('#listeEvt').fadeIn(500);
        });        
    },
    'submit': function(e) {
        console.log('form submit');
        e.preventDefault();
    }
});

Template.detailEvt.events({
    'click #return': function(e) {
        $('#detailEvt').fadeOut(100, function() {
            $('#listeEvt').fadeIn(500);
        });            
    }
});

Handlebars.registerHelper('arrayify',function(obj){
    result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});