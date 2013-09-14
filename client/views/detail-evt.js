
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