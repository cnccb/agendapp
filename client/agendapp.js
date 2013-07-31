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
        'annule': new Handlebars.SafeString("<i class='icon-remove' title='Evénement qui n''aura pas lieu'.></i>"),
        'local': new Handlebars.SafeString("<i class='icon-home' title='Organisation locale'></i>"),
        'departemental': new Handlebars.SafeString("<i class='icon-map-marker' title='Evénement départemental'></i>"),
        'regional': new Handlebars.SafeString("<i class='icon-road' title='Evénement régional'></i>"),
        'national': new Handlebars.SafeString("<i class='icon-flag' title='Evénement national'></i>"),
        'international': new Handlebars.SafeString("<i class='icon-plane' title='Evénement international'></i>"),
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
    if (d === null || typeof d === 'undefined' || _.isNaN(d))
        return '';
    var nommois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    return nommois[d.getMonth()] + " " + d.getFullYear();

}
;
function getDateFromInput(inputtext)
{
    var patronFrancais = /[0-9]{2}[./-][0-9]{2}[./-][0-9]{4}/g;
    var patronUniversl = /[0-9]{4}[./-][0-9]{2}[./-][0-9]{2}/g;
    if (patronFrancais.test(inputtext))
    {
        //console.log('Francais:' + inputtext);
        var split = inputtext.split(/[./-]/g);
        return new Date(split[2], split[1] - 1, split[0]);
    }
    else if (patronUniversl.test(inputtext))
    {
        //console.log('Universel:' + inputtext);
        var split = inputtext.split(/[./-]/g);
        return new Date(split[0], split[1] - 1, split[2]);
    }
    else
    {
        console.log('Format de date non reconnu:' + inputtext);
        return null;
    }
}
function getStringFromDate(date, universal)
{
    if (date === null)
        return '';
    if (typeof date === 'undefined')
        return '';

    universal = typeof universal !== 'undefined' ? universal : true;
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);
    var day = date.getDate();
    if (month < 10)
        month = '0' + month;
    if (day < 10)
        day = '0' + day;
    if (universal)
        return "" + year + '-' + month + '-' + day;
    else
        return "" + day + '/' + month + '/' + year;
}

tracker_GA = function(page) {
var _gaq = window._gaq || [];
    _gaq.push(['_setAccount', 'UA-42796021-1']);
    _gaq.push(['_trackPageview'],page);
    if ($('#gatracker').length === 0)
    {
        (function() {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.id = 'gatracker';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    }
};

tracker_PphpMV= function(page) {
    window.a_vars = Array();
    window.pagename = 'test/agendapp/'+page;

    window.phpmyvisitesSite = 17;
    window.phpmyvisitesURL = "http://console.akantor.net/phpmv2/phpmyvisites.php";

    if($('#pmvtracker').length === 0)
    {
        (function() {
            var pmv = document.createElement('script');
            pmv.type = 'text/javascript';
            pmv.id = 'pmvtracker';
            pmv.async = true;
            pmv.src = 'http://console.akantor.net/phpmv2/phpmyvisites.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(pmv, s);
            //pmv_log(phpmyvisitesURL, phpmyvisitesSite, pagename, a_vars);
        })();
    }
    console.log('tracking'+page);
};

tracker_Piwik= function(code){};

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
   new tracker_PphpMV(viewId);
    new tracker_GA(viewId);
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
        $('#frmNouvelEvt')[0].reset(); //pour éviter que les champs restent remplis après un première création

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
    },
    'click #accueil': function(e) {
        e.preventDefault();
        displayView('listeEvt');
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
    var evenementsSansDate = new Array();
    Session.set('titreEncours', '');

    var lastindex = null;
    _.each(liste, function(value, key, list) {
        var d = getDateFromInput(value.datedeb);
        var index = getMonthIndex(d);
        if (index !== lastindex)
        {
            if (index === '')
                evenementsSansDate.push({"TitreIntermediaire": 'Sans date'});
            else
                evenements.push({"TitreIntermediaire": index});
            lastindex = index;
        }
        value.jourdeb = getStringFromDate(d, false);
        if (index === '')
            evenementsSansDate.push(value);
        else
            evenements.push(value);
    });
    _.each(evenementsSansDate, function(value, key, list) {
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
        Session.set("search_keywords", $("#e.currentTarget").value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"));
    },
    'click .clicktosearch': function(e) {
        e.preventDefault();
        var thesource = $(e.currentTarget);
        var newvalue = thesource.attr('href');
        thesource.siblings('input').attr("value", newvalue);
        thesource.siblings('input').keyup();
        Session.set("search_keywords", newvalue.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"));
    }


});

/**
 * DETAILEVT
 */

Template.detailEvt.evenement = function() {
    if (!Session.get('evtEnCours'))
        return null;

    var res = Evenements.findOne(Session.get('evtEnCours'));
    res = _.omit(res, ['admin', '_id', 'codeedition']);
    res.datedeb = getStringFromDate(getDateFromInput(res.datedeb), false);
    res.datefin = getStringFromDate(getDateFromInput(res.datefin), false);
    res.forclusion = getStringFromDate(getDateFromInput(res.forclusion), false);

    Session.set('titreEncours', res.nom);
    //evenement.planiframable 
    if (res.plan)
    {
        if (res.plan.indexOf("maps.google") !== -1)
            res.planiframable = res.plan + "&output=embed";
        // les urls abrégées ne s'embed pas bien.
        //else if (res.plan.indexOf("goo.gl") !== -1)
        //res.planiframable = res.plan + "&output=embed";
    }

    return res;
};

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
    $('#frmNouvelEvt input[type="date"]').attr('pattern',
            '((0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)[0-9]{2})|'
            +'((19|20)[0-9]{2}[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01]))'
            );
    $('#frmNouvelEvt input[type="date"]').attr('min', getStringFromDate(new Date()));
    var end = new Date();
    end.setFullYear(end.getFullYear() + 3);
    $('#frmNouvelEvt input[type="date"]').attr('max', getStringFromDate(end));

    //creation des datepicker pour tous les éléments dates s'il ne sont pas reconnus par le navigateur
    var dateToFrString="";
    $('#frmNouvelEvt input[type="date"]').each(function(){
        if(document.getElementById($(this).attr('id')).type=='text')
        { 
            //console.log("vérif date pour "+$(this).attr('id'));
            // //changement de la valeur du champs en une chaîne au format dd/mm/yyyy
            if($(this).val())
            {
                dateToFrString=getStringFromDate(getDateFromInput($(this).val()),false);
                $(this).val(dateToFrString);
                $(this).attr('value',dateToFrString);
                //console.log("nouvelle valeur : " + $(this).val());
            }         
            //le datepicker est ensuite créé à la volée lors du click sur le champs date, 
            //et initialisé avec la valeur de l'input ou la date du jour par défaut  
            // cf 'click [type=date]' dans les events de nouvelEvt 
        }
    });
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
    res.datedeb = getStringFromDate(getDateFromInput(res.datedeb), true);
    res.datefin = getStringFromDate(getDateFromInput(res.datefin), true);
    res.forclusion = getStringFromDate(getDateFromInput(res.forclusion), true);

    return res;
};

Template.nouvelEvt.events({
    'click #cancel': function(e) {
        e.preventDefault();
        displayView('listeEvt');
    },
    //@todo: trouver plus élegant pour le masquage sélectif des champs optionnels
    'click #ouvrirreco': function(e) {
        $('#evtReco .evtParOption').toggle();
        $('#ouvrirreco i').toggleClass('icon-chevron-right  icon-chevron-down');
        $('html, body').animate({scrollTop: $("#ouvrirreco").offset().top}, 'slow');
        return false;
    },
    'click #ouvrircomplement': function(e) {
        $('#evtCompInfo .evtParOption').toggle();
        $('#ouvrircomplement i').toggleClass('icon-chevron-right  icon-chevron-down');
        $('html, body').animate({scrollTop: $("#ouvrircomplement").offset().top}, 'slow');
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
    'mousedown [type=date]' : function(e){
       //création d'un datepicker à la volée si le champs date n'est pas reconnu par le navigateur (voir le rendered du template)
       //le principe du test est que si le browser ne reconnait pas le type date, il mettra le type par defaut, ie "text".
       //donc on applique le datepicker aux champs date reconnu comme du text, en donnant le bon format 
       //la bibli utilisée est http://eternicode.github.io/bootstrap-datepicker/ patchée pour firefox(cf bug #552)
        
       var $input = $(e.currentTarget);
        if(document.getElementById($input.attr('id')).type=='text'){
            $input.datepicker({
            language: 'fr',
            format: 'dd/mm/yyyy',
            autoclose: true, //ferme la fenêtre sur clic
            startDate: getStringFromDate(getDateFromInput($input.attr('min')), false), 
            endDate: getStringFromDate(getDateFromInput($input.attr('max')), false)
        });
        }
        
    },
    'click #submitevt': function(e) {
        // vérifie la validité du formulaire en se reposant sur le navigateur
        // Tout sur la validation browser et HTML5: http://www.html5rocks.com/en/tutorials/forms/constraintvalidation/#toc-declarative-error-messages
        e.preventDefault();
        // NB checkValidity will fire "invalid" events
        if (!(e.target.form.checkValidity()))
        {
            $('html,body').animate({scrollTop: $('input:invalid').first().offset().top}, 'slow');
            console.log($('input:invalid').first());
            console.log("form invalid : exiting");
            return false;
        }


        // Filtre des valeurs du formulaire
        var newEvent =
                {
                    admin: $("#admin").val(), //Mail pour l'administration
                    nom: $("#nom").val(), //nom de l'évènement
                    datedeb: getStringFromDate(getDateFromInput($("#datedeb").val())), // Date 
                    datefin: getStringFromDate(getDateFromInput($("#datefin").val())), // Date 
                    forclusion: getStringFromDate(getDateFromInput($("#forclusion").val())), //Date de forclusion
                    horaires: $("#horaires").val(), //horaires (avec alternatives si pas bordé)
                    echelle: $("#echelle").attr('data-value'), //Echelle (nationale, régionale, ...)
                    cible: checkBoxesValues('cible'), //Public attendu (->cible)
                    prix: $("#prix").val(), //Prix d'inscription
                    orga: $("#orga").val(), //Nom de l'organisateur, 
                    statut: $("#statut").attr('data-value'), //Statut           
                    contact: $("#contact").val(), //Contact (pour information)            
                    tel: $("#tel").val(), //tel orga
                    lieu: $("#lieu").val(), //Lieu / adresse
                    codepostal: $("#codepostal").val(), //Lieu / adresse
                    plan: $("#plan").val(), // Plan d’accès
                    url: $("#url").val(),
                    programme: $("#programme").val(), // Programme
                    options: $("#options").val(), //Options (buvette, offre de repas, etc.)
                    conditions: $("#conditions").val(), //Conditions de participation
                    hebergement: $("#hebergement").val(), //Recommandations d’hébergement
                    restauration: $("#restauration").val(), //Recommandations restauration
                    visites: $("#visites").val() //Recommandations visites
                };
        //quelques défauts
        if (!newEvent.statut)
            newEvent.statut = 'temporaire';

        // pour l'update
        if ($("#dejaexistant").val() != 'null')
        {
            console.log($("#dejaexistant").val())
            newEvent.dejaexistant = $("#dejaexistant").val();
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
                $('html,body').animate({scrollTop: $('#flashMessage').offset().top}, 'slow');

                //console.log(newEvent);
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
