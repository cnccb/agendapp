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
        //statut
        'provisoire': new Handlebars.SafeString("<i class='icon-question-sign' title='Evénement provisoire qui peut encore changer de date, de lieu.'></i>"),
        'definitif': new Handlebars.SafeString("<i class='icon-ok' title='Evénement confirmé, la date et le lieu ne changeront plus.'></i>"),
        'annule': new Handlebars.SafeString("<i class='icon-remove' title='Evénement qui n''aura pas lieu'.></i>"),
        //echelle
        'local': new Handlebars.SafeString("<i class='icon-home' title='Organisation locale'></i>"),
        'departemental': new Handlebars.SafeString("<i class='icon-map-marker' title='Evénement départemental'></i>"),
        'regional': new Handlebars.SafeString("<i class='icon-road' title='Evénement régional'></i>"),
        'national': new Handlebars.SafeString("<i class='icon-flag' title='Evénement national'></i>"),
        'international': new Handlebars.SafeString("<i class='icon-plane' title='Evénement international'></i>"),
        //cible
        'competiteurs' : new Handlebars.SafeString("<i class='icon-user' title='Pour les compétiteurs'></i>"),
        'debutants' : new Handlebars.SafeString("<i class='icon-user' title='Pour les débutants'></i>"),
        'confirmes' : new Handlebars.SafeString("<i class='icon-user' title='Pour les confirmés'></i>"),
    };
    if (inconificationTable[text])
        return inconificationTable[text];
    else
        return text;
});

Handlebars.registerHelper('i18n', function(text){
    //@todo transformer le tableau en vrai tableau de traduction ou utiliser meteor i18n (cf https://github.com/jerico-dev/meteor-i18n)
    var i18n ={
        //statuts
        'provisoire': new Handlebars.SafeString('provisoire'),
        'definitif': new Handlebars.SafeString('définitif'),
        'annule': new Handlebars.SafeString('annulé'),
        //échelles
        'local': new Handlebars.SafeString('local'),
        'departemental': new Handlebars.SafeString('départemental') ,
        'regional': new Handlebars.SafeString('régional'),
        'national': new Handlebars.SafeString('national'),
        'international':  new Handlebars.SafeString('international'),
        //cible
        'competiteurs' : new Handlebars.SafeString('compétiteurs'),
        'debutants' : new Handlebars.SafeString('débutants'),
        'confirmes' : new Handlebars.SafeString('confirmés'),
    };
    if (i18n[text])
        return i18n[text]
    else 
        return text;
})