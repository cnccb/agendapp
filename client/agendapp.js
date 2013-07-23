
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
        if (Meteor.call('fetchOneEvt', query[1]))
        {
            Session.set('evtEnCours', query[1]);
            displayView('detailEvt');
        }

    }
    else {
        displayView('listeEvt');
        Session.set('currentView','listeEvt');
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
    var inconificationTable={
        'provisoire':   new Handlebars.SafeString("<i class='icon-question-sign' title='Evénement provisoire qui peut encore changer de date, de lieu.'></i>"),
        'definitif':    new Handlebars.SafeString("<i class='icon-ok' title='Evénement confirmé, la date et le lieu ne changeront plus.'></i>"),
        'annule':       new Handlebars.SafeString("<i class='icon-remove' title='Evénement qui n\'aura pas lieu.></i>"),
        'local':        new Handlebars.SafeString("<i class='icon-home' title='Organisation locale'></i>"),
        'departemental':new Handlebars.SafeString("<i class='icon-map-marker' title='Evénement de portée départementale'></i>"),
        'regional':     new Handlebars.SafeString("<i class='icon-road' title='Evénement de portée régionale'></i>"),
        'national':     new Handlebars.SafeString("<i class='icon-flag' title='Evénement de portée nationale'></i>"),
        'international':new Handlebars.SafeString("<i class='icon-plane' title='Evénement de portée internationale'></i>"),
    };
    if(inconificationTable[text])
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

};

/*
 * affiche un message sous form d'un div alert
 * className = info|warning|error
 */
function flash(message, className)
{
    if (_.isUndefined(className))
        className = 'alert';
    $('#flashMessage').html(Template.flash({message: message, className: className})).fadeIn(200);
};

function checkBoxesValues(id)
{
    var vals=new Array();
    $('#'+id+' :checkbox:checked').each(function(i){
        vals.push($(this).val());
    });
    return vals;
}


function displayView(viewId){
    $view=$('#'+viewId);
    $('.view').fadeOut(100);
    $view.fadeIn(300);
    Session.set('currentView', viewId);
}

/**
* repère les templates générés plusieurs fois : à appeler après la génération des templates
*/
function logRenders () {
    _.each(Template, function (template, name) {
      var oldRender = template.rendered;
      var counter = 0;
 
      template.rendered = function () {
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
Template.ariane.links = function(){

    //@todo un peu overkill, à simplifier
    var currentView = Session.get('currentView');
    var menus ={
        accueil: {id:'accueil', label:'accueil', href:'/', active: true},
        creation: {id:'creation', label:'création', active:false, disabled: true},
        modification: {id:'modification', label:'modification', disabled: true},
        detail: {id:'detail', label:'détail', disabled: true}
    };
    switch(currentView)
    {
    case 'listeEvt':
        menus.accueil.active=true;
      break;
    case 'detailEvt':
        menus.accueil.active=false;
        menus.detail.active=true;
        menus.detail.disabled=false;
      break;
    case 'nouvelEvt':
        if(Session.get('evtEnCours')===undefined)
        {
            //creation
            menus.creation.active=true;      
            menus.creation.disabled=false;
            menus.modification.active=false;
            menus.modification.disabled=true;

        }else
        {
            //modification
            menus.creation.active=false;   
            menus.creation.disabled=true;
            menus.modification.active=true;
            menus.modification.disabled=false;

        }
        menus.accueil.active=false;  
      break;
    default:
    }
    var links = new Array();
    _.each(menus,function(value, key, list){
        links.push(value);
    })

    //transformation de l'objet en tableau pour handlebar
    return links;
}

Template.ariane.events({
    'click li.disabled a' : function(e){
        e.preventDefault();
    }
})

/**
 * LISTEEVT
 */
Template.listeEvt.evenements = function() {
    var liste = Evenements.find({$and: [{valide: true}, {statut: {$ne: "annule"}}]}, {sort: {"datedeb": 1}}).fetch();
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
Template.listeEvt.events({
    'click #newEvt': function(e) {
        // pour ne pas préremplir si on a sélectionné un auparavant
        Session.set('evtEnCours', undefined);        
        displayView('nouvelEvt');
        
    },
    'click .clickToDetail': function(e) {
        Session.set('evtEnCours', $(e.currentTarget).attr('id'));
        displayView('detailEvt');
    }

});

/**
 * DETAILEVT
 */

Template.detailEvt.evenement = function() {
    var res = Evenements.findOne(Session.get('evtEnCours'));
    res = _.omit(res, ['admin', '_id', 'codeedition']);

    //evenement.planiframable 
    if (res.plan
            && res.plan.indexOf("maps.google") !== -1)
    {
        res.planiframable=res.plan+"&output=embed";
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
        _.each(valChecked, function(item,key,list){
            $('[value="' + item + '"]').attr('checked',true);
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
        return null;

    var res = Evenements.findOne(Session.get('evtEnCours'));
    res = _.omit(res, ['codeedition']);
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
        $('html').animate({scrollTop: $input.offset().top}, 'slow');

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

