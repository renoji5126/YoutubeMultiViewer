var query = (function () {
    var queryString, queryItems, queryItem,
        i, length, matchs, key, pkey, skey, value, list, hash, params = {};
 
    queryString = window.location.search || '';
    queryString = queryString.substr(1, queryString.length);
 
    queryItems = queryString.split('&');
 
    for (i = 0, length = queryItems.length; i < length; i++) {
        queryItem = (queryItems[i] || '').split('=');
 
        key = queryItem[0];
        value = queryItem[1] ? window.decodeURIComponent(queryItem[1]) : undefined;
 
        matchs = (/([\w$]*)\[([\w$]*)\]/g).exec(key);
        if (matchs === null) {
            params[key] = value;
        } else {
            pkey = matchs[1];
            skey = matchs[2];
            if (!skey) {
                list = params[pkey] = params[pkey] || [];
                list[list.length] = value;
            } else {
                hash = params[pkey] = params[pkey] || {};
                hash[skey] = value;
            }
        }
    }
    return params;
})();
