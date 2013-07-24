/**
 * 
 * GLOBAL
 * 
 */

Meteor.startup(function() {
    // code to run on server at startup
    //insert the new event
// var localGetDetailEvt=null;
// Deps.autorun(function(){
//     Meteor.subscribe('getDetailEvt');

    //vérification de la query
    //flash("test flash", "info");
    var query = window.location.href.split('#');
    console.log('query -> ');
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
                flash("Vous ne pouvez pas modifier cet événement!", 'warning');
            }
            else
            {
                if (result)
                {
                    flash("Votre événement est validé !", 'info');
                } else {
                    console.log('Evénement déjà valide');
                }
                Session.set('evtEnCours', evtCourantId);
                displayView('nouvelEvt');
            }
        });

    }
    else if (query[1])
    {
        Meteor.call('fetchOneEvt', query[1], function(error, result) {
            if (result) {
                Session.set('evtEnCours', query[1]);
                console.log("displaying evt" + query[1]);
                displayView('detailEvt');
            }
            ;
        });
    }
    else {
        displayView('listeEvt');
        Session.set('currentView', 'listeEvt');
    }
});


/**
 * Helpers
 */
Handlebars.registerHelper('arrayify', function(obj) {
    result = [];
    for (var key in obj)
        result.push({name: key, value: obj[key]});
    return result;
});
Handlebars.registerHelper('iconify', function(text) {
    var inconificationTable = {
        'provisoire': new Handlebars.SafeString("<i class='icon-question-sign' title='Evénement provisoire qui peut encore changer de date, de lieu.'></i>"),
        'definitif': new Handlebars.SafeString("<i class='icon-ok' title='Evénement confirmé, la date et le lieu ne changeront plus.'></i>"),
        'annule': new Handlebars.SafeString("<i class='icon-remove' title='Evénement qui n\'aura pas lieu.></i>"),
        'local': new Handlebars.SafeString("<i class='icon-home' title='Organisation locale'></i>"),
        'departemental': new Handlebars.SafeString("<i class='icon-map-marker' title='Evénement de portée départementale'></i>"),
        'regional': new Handlebars.SafeString("<i class='icon-road' title='Evénement de portée régionale'></i>"),
        'national': new Handlebars.SafeString("<i class='icon-flag' title='Evénement de portée nationale'></i>"),
        'international': new Handlebars.SafeString("<i class='icon-plane' title='Evénement de portée internationale'></i>"),
    };
    if (inconificationTable[text])
        return inconificationTable[text];
    else
        return text;
});

/**
 * BIBLIOTHEQUE
 * 
 */
function getMonthIndex(d)
{
    if (_.isNaN(d.getFullYear()))
        return 'Inconnu';
    var nommois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    return nommois[d.getMonth()] + " " + d.getFullYear();

}
;

/*
 * affiche un message sous form d'un div alert
 * className = info|warning|error
 */
function flash(message, className)
{
    if (_.isUndefined(className))
        className = 'alert';
    $('#flashMessage').html(Template.flash({message: message, className: className})).fadeIn(200);
}
;

function checkBoxesValues(id)
{
    var vals = new Array();
    $('#' + id + ' :checkbox:checked').each(function(i) {
        vals.push($(this).val());
    });
    return vals;
}


function displayView(viewId) {
    $view = $('#' + viewId);
    $('.view').fadeOut(100);
    $view.fadeIn(300);
    Session.set('currentView', viewId);
}

/**
 * repère les templates générés plusieurs fois : à appeler après la génération des templates
 */
function logRenders() {
    _.each(Template, function(template, name) {
        var oldRender = template.rendered;
        var counter = 0;

        template.rendered = function() {
            console.log(name, "render count: ", ++counter);
            oldRender && oldRender.apply(this, arguments);
        };
    });
}


/** *
 * ENTETE
 */

Template.entete.events({
    'click #logotitre': function(e) {
        displayView('listeEvt');
        location.hash = '';
    }
});

/**
 * fil d'ariane / navigation
 */
Template.ariane.links = function() {
    var currentView = Session.get('currentView');
    var currentTitle = Session.get('titreEncours');
    var breadcrumb = new Array();

    // Toujours l'accueil
    breadcrumb.push(
            {
                id: 'accueil',
                label: 'accueil',
                href: '/'}
    );
    // Accueil
    if (currentView === 'listeEvt')
    {
        // rien de plus
    }
    // Détails
    else if (currentView === 'detailEvt')
    {
        breadcrumb.push(
                {
                    id: 'detail',
                    label: currentTitle,
                    last: true
                });
    }
    // Creation
    else if (currentView === 'nouvelEvt' && Session.get('evtEnCours') === undefined)
    {
        breadcrumb.push(
                {
                    id: 'creation',
                    label: 'création d\'un nouvel événement',
                    last: true
                });

    }
    // Modification
    else if (currentView === 'nouvelEvt')
    {
        breadcrumb.push(
                {
                    id: 'detaillink',
                    label: currentTitle,
                    href: Session.get('evtEnCours')
                });
        breadcrumb.push(
                {
                    id: 'modification',
                    label: 'modification',
                    last: true
                });
    }
    return breadcrumb;
};

Template.ariane.events({
    'click #detaillink a': function(e) {
        e.preventDefault();
        Session.set('evtEnCours', $(e.currentTarget).attr('href'));
        console.log($(e.currentTarget).attr('href'));
        displayView('detailEvt');
    }

});

/**
 * LISTEEVT
 */
Template.listeEvt.evenements = function() {
    var keywords = new RegExp(Session.get("search_keywords"), "i");
    var conditions = {
        $and: [
            {valide: true},
            {statut: {$ne: "annule"}},
            {$or: [
                    {nom: keywords},
                    {codepostal: keywords},
                    {lieu: keywords},
                    {echelle: keywords},
                    {statut: keywords},
                    {admin: keywords},
                    {orga: keywords},
                ]
            }
        ]
    };

    var liste = Evenements.find(conditions, {sort: {"datedeb": 1}}).fetch();
    var evenements = new Array();
    Session.set('titreEncours', '');

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
Template.listeEvt.events({
    'click #newEvt': function(e) {
        // pour ne pas préremplir si on a sélectionné un auparavant
        Session.set('evtEnCours', undefined);
        displayView('nouvelEvt');

    },
    'click .clickToDetail': function(e) {
        Session.set('evtEnCours', $(e.currentTarget).attr('id'));
        displayView('detailEvt');
    },
    'submit #search': function(e) {
        e.preventDefault();

    },
    'keyup [name=searchString]': function(e) {
        Session.set("search_keywords", e.currentTarget.value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"));
    },
    'click .clicktosearch': function(e) {
        e.preventDefault();
        var thesource = $(e.currentTarget);
        var newvalue=thesource.attr('href');
        thesource.siblings('input').attr("value",newvalue);
        thesource.siblings('input').keyup();
        Session.set("search_keywords", newvalue.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"));
    }


});

/**
 * DETAILEVT
 */

Template.detailEvt.evenement = function() {
    var res = Evenements.findOne(Session.get('evtEnCours'));
    res = _.omit(res, ['admin', '_id', 'codeedition']);

    Session.set('titreEncours', res.nom);
    //evenement.planiframable 
    if (res.plan
            && res.plan.indexOf("maps.google") !== -1)
    {
        res.planiframable = res.plan + "&output=embed";
    }

    return res;
};
Template.detailEvt.events({
    'click #return': function(e) {
        displayView('listeEvt');
    }
});

/**
 * NOUVELEVT
 */

Template.nouvelEvt.rendered = function() {
    //infobulles d'aide
    $('button.bspopover').popover({trigger: "hover", container: 'body'}); //initialize all popover in this template
    //etat des boutons radio
    $('[data-toggle="buttons-radio"]').each(function() {
        var valBouton = $(this).attr("data-value");
        var $button = $('[data-value="' + valBouton + '"]');
        //console.log($(this));
        $button.button('toggle');
        $button.trigger('click');
    });
    $('[data-type="checkbox"]').each(function() {
        var valChecked = $(this).attr("data-value").split(',');
        //console.log(valChecked);
        _.each(valChecked, function(item, key, list) {
            $('[value="' + item + '"]').attr('checked', true);
        })

    });


    //définition des validateur des champs dates
    //@todo: expliquer à julien pourquoi l'avoir mis là plutot que dans les balises html?
    $('#frmNouvelEvt input[type="date"]').attr('pattern', '(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\\d\\d');
    $('#frmNouvelEvt input[type="date"]').attr('min', '2000-01-01');
    $('#frmNouvelEvt input[type="date"]').attr('max', '2099-12-31');
};
Template.nouvelEvt.evenement = function() {
    //pour eviter d'afficher un evenement vide
    if (Session.get('evtEnCours') === undefined)
    {
        Session.set('titreEncours', '');
        return null;
    }

    var res = Evenements.findOne(Session.get('evtEnCours'));
    res = _.omit(res, ['codeedition']);
    Session.set('titreEncours', res.nom);

    return res;
};

Template.nouvelEvt.events({
    'click #cancel': function(e) {
        displayView('listeEvt');
    },
    //@todo: trouver plus élegant pour le masquage sélectif des champs optionnels
    'click #ouvrirreco': function(e) {
        $('#evtReco .evtParOption').toggle();
        $('#ouvrirreco i').toggleClass('icon-chevron-right  icon-chevron-down');
        $('html').animate({scrollTop: $("#ouvrirreco").offset().top}, 'slow');
        return false;
    },
    'click #ouvrircomplement': function(e) {
        $('#evtCompInfo .evtParOption').toggle();
        $('#ouvrircomplement i').toggleClass('icon-chevron-right  icon-chevron-down');
        $('html').animate({scrollTop: $("#ouvrircomplement").offset().top}, 'slow');
        return false;
    },
    //@todo: faire en sorte que ce soit correctement valué/initialisé/repopulé
    'click [data-toggle="buttons-radio"] button': function(e) {
        $button = $(e.currentTarget);
        $buttonGroup = $(e.currentTarget).parent();
        //console.log($buttonGroup);
        $buttonGroup.attr("data-value", $button.attr("data-value"));
        //console.log($buttonGroup.attr('data-value'));
    },
    'click #submitevt': function(e) {
        // vérifie la validité du formulaire en se reposant sur le navigateur
        // Tout sur la validation browser et HTML5: http://www.html5rocks.com/en/tutorials/forms/constraintvalidation/#toc-declarative-error-messages
        e.preventDefault();
        // NB checkValidity will fire "invalid" events
        if (!(e.target.form.checkValidity()))
        {
            $('html').animate({scrollTop: $('input:invalid').first().offset().top}, 'slow');
            console.log($('input:invalid').first());
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
                    echelle: $(echelle).attr('data-value'), //Echelle (nationale, régionale, ...)
                    cible: checkBoxesValues('cible'), //Public attendu (->cible)
                    prix: prix.value, //Prix d'inscription
                    orga: orga.value, //Nom de l'organisateur, 
                    statut: $(statut).attr('data-value'), //Statut           
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
        //quelques défauts
        if (!newEvent.statut)
            newEvent.statut = 'temporaire';

        // pour l'update
        if (dejaexistant.value != 'null')
        {
            console.log(dejaexistant.value)
            newEvent.dejaexistant = dejaexistant.value;
        }

        // envoi des informations au serveur pour creation 
        console.log("Nouvel evènement: envoi des données au serveur");
        console.log(newEvent);
        Meteor.call('addNewEvent', newEvent, function(error, result) {
            if (error !== undefined)
            {
                flash("Probleme: " + error, 'error');
            } else
            {
                flash(result, 'info');
                $('html').animate({scrollTop: $('#flashMessage').offset().top}, 'slow');

                console.log(newEvent);
            }
        });
        console.log("Evènement créé/modifié");

        // Retour à l'interface du calendrier
        displayView('listeEvt');
        // message de validation??        
        //return false;
    },
    'invalid input': function(e)
    {
        var $input = $(e.currentTarget);
        if ($input.siblings('.errorbox').length === 0)
        {
            $input.after('<div class="errorbox alert alert-block alert-error"><button type="button" class="close" data-dismiss="alert">×</button><p></p></div>');
        }
        $input.siblings('.errorbox').children('p').text(e.currentTarget.validationMessage);
        $input.siblings('.errorbox').fadeIn(500);
    },
    'blur input': function(e)
    {
        $(e.currentTarget).addClass("interacted");
        if ($(e.currentTarget).siblings('.errorbox').length > 0)
        {
            $(e.currentTarget).siblings('.errorbox').fadeOut(500);
        }
    }

});

logRenders();

