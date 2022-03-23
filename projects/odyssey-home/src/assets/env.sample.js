(function (window) {
    window['env'] = window['env'] || {};

    // Environment variables
    window['env']['odysseyHost'] = '${ODYSSEY_HOST}';
    window['env']['odysseyInstanceUrl'] = '${ODYSSEY_INSTANCE_URL}';

})(this);