

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
    ////console.log(evenements);
    return evenements;

};
Template.listeEvt.events({
    'click #newEvt': function(e) {
        page('/event/new');
    },
    'click .clickToDetail': function(e) {
        var evt = $(e.currentTarget).attr('id');
        page('/event/'+evt);
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
