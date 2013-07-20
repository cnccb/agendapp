
Meteor.startup(function() {
    // code to run on server at startup
    //insert the new event
// var localGetDetailEvt=null;
// Deps.autorun(function(){
//     Meteor.subscribe('getDetailEvt');

    //vérification de la query

    var query = window.location.href.split('#');
    console.log(query);
    //si la query contient des variables, on fait la vérif du code
    if (query[1] && query[2])
    {
        // abstraction des parametres
        var evtCodeEditionContest = query[1];
        var evtCourantId = query[2];


        // test de validation (au cas où)
        Meteor.call('verifCodeConfirm', evtCourantId, evtCodeEditionContest, function(error, result) {
            if (error)
            {
                alert("Vous ne pouvez pas modifier cet événement!");
            }
            else
            {
                if (result)
                {
                    alert("Votre événement est validé !"); //todo faire mieux que ça...
                    window.close(); //sinon la fenêtre qui contient le code de validation reste ouverte (donc deux fenêtres) //todo à améliorer
                } else {
                    console.log('Evénement déjà valide');
                }
                Session.set('evtEnCours', evtCourantId);
                $('#listeEvt').fadeOut(100, function() {
                    $('#nouvelEvt').fadeIn(500);
                });
            }
        });

    }
    else if (query[1])
    {
        Session.set('evtEnCours', query[1]);
        $('#listeEvt').fadeOut(100, function() {
            $('#detailEvt').fadeIn(500);
        });
    }
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
    var liste = Evenements.find({$and: [{valide: true},{statut:{$ne: "annule"}}]}, {sort: {"datedeb": 1}}).fetch();
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
    //console.log(evenements);
    return evenements;

};

Template.detailEvt.evenement = function() {
    var res = Evenements.findOne(Session.get('evtEnCours'));
    res = _.omit(res, ['admin', '_id','codeedition']);
    return res;
};
Template.nouvelEvt.evenement = function() {
    var res = Evenements.findOne(Session.get('evtEnCours'));
    res = _.omit(res, ['codeedition']);
    return res;
};


Template.listeEvt.events({
    'click #newEvt': function(e) {
        // pour ne pas préremplir si on a sélectionné un auparavant
        Session.set('evtEnCours', null);
        $('#listeEvt').fadeOut(100, function() {
            $('#nouvelEvt').fadeIn(500);
        });
    },
    'click .clickToDetail': function(e) {
        Session.set('evtEnCours', $(e.currentTarget).attr('id'));
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
    'click #ouvrirreco': function(e) {
        $('#evtReco .evtParOption').toggle();
        $('#ouvrirreco').toggleClass('icon-eye-open icon-eye-close');
        //@todo: faire quelque chose pour ne pas changer l'url pose probleme pour les editions
        location.hash = "#evtReco";
        return false;
    },
    'click #ouvrircomplement': function(e) {
        $('#evtCompInfo .evtParOption').toggle();
        $('#ouvrircomplement').toggleClass('icon-eye-open icon-eye-close');
        //@todo: faire quelque chose pour ne pas changer l'url pose probleme pour les editions
        location.hash = "#evtCompInfo";
        return false;
    },
    'click [data-toggle="buttons-radio"] button': function(e){
        $button=$(e.currentTarget);
        var name = $button.parent().attr("data-toggle-name");
        $('#'+name).val($button.attr("data-value"));
        console.log(name);
    },
    'click #submitevt': function(e) {
        // vérifie la validité du formulaire en se reposant sur le navigateur
        // Tout sur la validation browser et HTML5: http://www.html5rocks.com/en/tutorials/forms/constraintvalidation/
        e.preventDefault();
        // NB checkValidity will fire "invalid" events
        if (!(e.target.form.checkValidity()))
        {
            console.log("form invalid : exiting");
            return false;
        }

        // Filtre des valeurs du formulaire
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

        // envoi des informations au serveur pour creation 
        console.log("Nouvel evènement: envoi des données au serveur");
        console.log(newEvent);
        Meteor.call('addNewEvent', newEvent);
        console.log("Evènement créé");

        // Retour à l'interface du calendrier
        $('#nouvelEvt').fadeOut(100, function() {
            $('#listeEvt').fadeIn(500);
        });
        // message de validation??        
        //return false;
    },
    'invalid input': function(e)
    {
        if ($(e.currentTarget).siblings('.errorbox').length === 0)
        {
            $(e.currentTarget).after('<div class="errorbox alert alert-block alert-error"><button type="button" class="close" data-dismiss="alert">×</button><p>***</p></div>');
        }
        $(e.currentTarget).siblings('.errorbox').children('p').text(e.currentTarget.validationMessage);
        $(e.currentTarget).siblings('.errorbox').fadeIn(500);
    },
    'change input': function(e)
    {
        if ($(e.currentTarget).siblings('.errorbox').length > 0)
        {
            $(e.currentTarget).siblings('.errorbox').fadeOut(500);
        }
    },
    'blur input': function(e)
    {
        $(e.currentTarget).addClass("interacted");
    }
            
});

Template.detailEvt.events({
    'click #return': function(e) {
        $('#detailEvt').fadeOut(100, function() {
            $('#listeEvt').fadeIn(500);
        });
    }
});

Handlebars.registerHelper('arrayify', function(obj) {
    result = [];
    for (var key in obj)
        result.push({name: key, value: obj[key]});
    return result;
});