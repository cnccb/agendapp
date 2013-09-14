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