var exec = cordova.require('cordova/exec');
var utils = require('cordova/utils');

function __exec( fn, success, error, args ) {

    args = typeof args!=="undefined" ? args : [];

    exec(
        success,
        error,
        "SdkboxIAP",
        fn,
        args
    );

}

module.exports = {

    initPlugin : function( config, success, error ) {

       var params = [];
       if ( typeof config!=="undefined" && typeof config==="object") {
           params.push( config);
       } else {
            console.info("No configuration or  configuration is not an object.");
       }

        __exec(
            "initPlugin",
            success,
            error,
            params
        );

    },
    refresh: function(success, error ) {
        __exec( "refresh", success, error );
    },
               
    getProducts: function(success, error ) {
        __exec( "getProducts", success, error );
    },
    purchase : function( product_id, product_type, success, error ) {
        __exec(
            "purchase",
            success,
            error,
            [
                product_id,
                product_type
            ]
        );
    },
    restore : function( success, error ) {
        __exec(
            "restore",
            success,
            error
        );
    },
    consumePurchase : function( order_id, success, error ) {
        __exec(
            "consume",
            success,
            error,
            [
                order_id
            ]
        );
    },
    enableUserSideVerification : function( success, error ) {
       __exec(
              "enableUserSideVerification",
              success,
              error,
              [] );
               
    }

};
