

/**
 * BIBLIOTHEQUE
 * 
 */

/****** hack IE ******/
if (!window.console){
  console =function(){};
  console.log = function(){};
} 

/********************/

getMonthIndex = function(d)
{
    if (d === null || typeof d === 'undefined' || _.isNaN(d))
        return '';
    var nommois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    return nommois[d.getMonth()] + " " + d.getFullYear();

};

getDateFromInput = function(inputtext)
{
    if(_.isUndefined(inputtext))
    {
        return null;               
    }
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
        //console.log('Format de date non reconnu:' + inputtext);
        return null;
    }
};

getStringFromDate = function(date, universal)
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
};

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
    //console.log('tracking'+page);
};

tracker_Piwik= function(code){};

/*
 * affiche un message sous form d'un div alert
 * className = info|warning|error
 */
flash = function(message, className){
    if (_.isUndefined(className))
        className = 'alert';
    $('#flashMessage').html(Template.flash({message: message, className: className})).fadeIn(200);
};

checkBoxesValues = function(id){
    var vals = new Array();
    $('#' + id + ' :checkbox:checked').each(function(i) {
        vals.push($(this).val());
    });
    return vals;
}

resetForm = function (id) {
    $('#'+id).each(function(){
            this.reset();
            //console.info('reseting ',this);
    });
    $('#'+id+' input:checkbox').each(function(item){
        $(this).removeAttr('checked');
    });
    $('#'+id+' input:radio').each(function(item){
        $(this).removeAttr('selected');
    });
}

displayView = function(viewId) {
    $view = $('#' + viewId);
    $('.view').fadeOut(100);
    $view.fadeIn(300);
    Session.set('currentView', viewId);
    
    var evtId=Session.get('evtEnCours');
    if(evtId == undefined || evtId == "undefined"|| evtId == "")
        evtId='accueil';    
    var pagetrack='/agendapp/'+evtId;
    $("html, body").animate({ scrollTop: 0 }, 200);
    //console.log('current track : ' , pagetrack);    
    new tracker_PphpMV(pagetrack);
    new tracker_GA(pagetrack);
}

/**
 * repère les templates générés plusieurs fois : à appeler après la génération des templates
 */
logRenders = function() {
    _.each(Template, function(template, name) {
        var oldRender = template.rendered;
        var counter = 0;

        template.rendered = function() {
            //console.log(name, "render count: ", ++counter);
            oldRender && oldRender.apply(this, arguments);
        };
    });
}

/** recupérer les info de l'evt en cours */
getOneEvt = function(evtId){
    var res = Evenements.findOne(evtId);
    res = _.omit(res, ['admin', 'codeedition']);
    if(res.datedeb)
        res.datedeb = getStringFromDate(getDateFromInput(res.datedeb), false);
    if(res.datefin)
        res.datefin = getStringFromDate(getDateFromInput(res.datefin), false);
    if(res.forclusion)
        res.forclusion = getStringFromDate(getDateFromInput(res.forclusion), false);

    Session.set('titreEncours', res.nom);
    //evenement.planiframable 
    if (res.plan)
    {
        res.planLabel = cutString(res.plan, 30);
        if (res.plan.indexOf("maps.google") !== -1)
            res.planiframable = res.plan + "&output=embed";

        // les urls abrégées ne s'embed pas bien.
        //else if (res.plan.indexOf("goo.gl") !== -1)
        //res.planiframable = res.plan + "&output=embed";
    }

    if(res.url)
    {
        res.urlLabel = cutString(res.url, 30);
    }
    //console.log('evt en cours : ', res);
    return res;
}