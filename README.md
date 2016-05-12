# Create application

`cordova create SdkboxIAP org.cocos2dx.PluginTest SdkboxIAP_Cordova`

## Android integration

`cordova platform add android`

`cordova plugin add https://github.com/sdkbox/sdkbox-cordova-plugin-iap.git --save`

* Set your application code, by modifying the `www` folder contents.

* Cypher/zipalign your application:

Create a file named `release-signing.properties` with the cyphering information. A valid example could be:

```json
storeFile=<path to your store file>
storeType=jks
keyAlias=<alias name>
storePassword=
keyPassword=
```
* Compile the application:

`cordova build android --release`


## iOS integration

`cordova platform add ios`

`cordova plugin add https://github.com/sdkbox/sdkbox-cordova-plugin-iap.git --save`

Rename the files `SdkboxIAP/platforms/ios/SdkboxIAP_Cordova/Classes/AppDelegate.m` and `SdkboxIAP/platforms/ios/SdkboxIAP_Cordova/Classes/MainViewController.m` to have `.mm` extension.

* Set your application code, by modifying the `www` folder contents.

`cordova build ios --release`

<h1>Cordova In-App Purchase Integration Guide</h1>

##Integration

Use this command to add the plugin to your Cordova project:
```bash
cordova plugin add https://github.com/sdkbox/sdkbox-cordova-plugin-iap --save
```

### Android integration

Cypher/zipalign your application:

Create a file named `release-signing.properties` with the cyphering information. A valid example could be:

```properties
storeFile=<path to your store file>
storeType=jks
keyAlias=<alias name>
storePassword=
keyPassword=
```

If you don't set `storePassword` and/or `keyPassword` the compilation script will prompt for them.

### iOS integration

Rename the files `<your project>/platforms/ios/SdkboxIAP_Cordova/Classes/AppDelegate.m` and
`<your project>/platforms/ios/SdkboxIAP_Cordova/Classes/MainViewController.m` to have `.mm` extension.

##Usage

### Plugin initialization IAP

Before using IAP functionality, the plugin must be initialized.

```javascript

sdkbox.PluginIAP.initPlugin(
    initialization_data,
    function success() {
        // plugin initialized ok.
    },
    function error( err:Error ) {
        // plugin not initialized.
        // err contains detailed info about it
    }
);
```

The `initialization_data` is a JSON object with the following structure:

```json
{
    "config" : {
        "iap" : {
            "items" : {
                "<item-name>" : {
                    "id" :   "string"         //  "<product-id>",
                    "type" : "string"         //  "non_consumable" | "consumable"
                }
            },
            "key" : "string"                  //  android only
        }
    },
    app_token : "string",
    app_secret: "string",
    debug :     "boolean",
    enabled :   "boolean"
}
```

#### IAP products definition

The `config` block is the IAP products definition.

You must create as much as needed `<item-name>` blocks. The `id` field on each block must match the id specified
on the Google Play store or on Game Center. The type, will be set accordingly to the type of product defined on the native consoles.
Though you must have a configuration for each platform, on ios and android you might very well have the same product ids set on its respectives consoles.

#### Plugin info fields

The `debug` field, will enable detailed logging information for the IAP internals. This field is optional and is false by default.
The `enabled` field, will make the plugin to be disabled. This field is optional, and the plugin is of course, enabled by default.

#### Remote config and services fields

Sdkbox has built-in support for remote configuration update and remote IAP receipt verification.
To benefit from these services, you must register first in [Sdkbox website](http://www.sdkbox.com).

After creating an online application descriptor for your app, the fields `app_token` and `app_secret`
 must match the counterpart values generated online.

A valid IAP configuration example call could be:

```javascript
sdkbox.PluginIAP.initPlugin(
    {
        "config" : {
            "iap": {
                "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq7eIGu7dRcBRBSC05cYvxjBMd7cqq9w6++1er+cqO2tyWPtWB4vuTkliq4k/Fkylx5UMfptdOYOW8ENgQyVucs/NyuOAGmve4j5JFhLPcLa6LjO2HUSY6zk04DRR9Zw7YPET4WAezZTz8jYMGhPG08HYltVj8cmSpSFWd1nI0pGOJoLQIMkIkXplgnPQRbMpuOu70vnQQBS1RFcoFT7OjaV8U0cfJzMoS1TMkGqaJKks2T+qOBNTtkXzge92EnvYIkhpCfN98dj6aQmETNp5yj5Fa+jcbAVF8dy5xymJwioL89XQKfKkGR+P6ESMoBEPfIZYIlMU8EUwmC+UKGLujQIDAQAB",
                "items": {
                    "remove_ads": {
                        "type": "non_consumable",
                        "id": "com.cocos2dx.non1"
                    },
                    "coin_package": {
                        "id": "com.cocos2dx.plugintest2"
                    },
                    "double_coin": {
                        "type": "non_consumable",
                        "id": "com.cocos2dx.non2"
                    },
                    "coin_package2": {
                        "id": "com.cocos2dx.plugintest3"
                    },
                    "coins_2":{
                        "id":"com.generamobile.ramboat.iapcoins2"
                    },
                    "coins_3":{
                        "id":"com.generamobile.ramboat.iapcoins3"
                    },
                    "coins_4":{
                        "id":"com.generamobile.ramboat.iapcoins4"
                    },
                    "coins_5":{
                        "id":"com.generamobile.ramboat.iapcoins5"
                    },
                    "special_coins_1":{
                        "id":"com.generamobile.ramboat.iapspecialcoins1"
                    },
                    "special_coins_2":{
                        "id":"com.generamobile.ramboat.iapspecialcoins2"
                    },
                    "special_coins_3":{
                        "id":"com.generamobile.ramboat.iapspecialcoins3"
                    }
                },
            }
        }
    },
    function success() {

    },
    function error( err:Error ) {

    }
);
```

### Get cached products' data [getProducts]

On plugin initialization, there's a request to the server to get the latest products information, like
prices, currency codes, descriptions, etc.

A call to

```javascript
    sdkbox.PluginIAP.getProducts(
        function( products ) {
            __log( products );

        },
        function(error) {
            __log( error ) ;
        }
    );
```

will get the products info. `products` parameter is an array of object of the following form:

```json
{
    "id"            : "string",   // e.g.: com.cocos2dx.non1
    "title"         : "string",   // defined on the dev console
    "description"   : "string",   // defined on the dev console
    "price"         : "string",   // e.g.: "$2.29"
    "currencyCode"  : "string",   // e.g.: "USD"
    "priceValue"    : "number",   // e.g.: 2.28999996185 . floating point is funny isn't it ?
    "name"          : "string",   // human readable name. Defined in the products config as `<item-name>` field
    "type"          : "number"    // 0 : consumable, 1 : non-consumable
}
```

### Retrieve latest Product data [refresh]

Instead of getting the products from the local cache by calling `getProducts`, you can request a cache
refresh by calling:

```javascript
    sdkbox.PluginIAP.refresh(
        function( products ) {
            // array of products
        },
        function(error) {
        }
    );
```

The `products` parameter has the same structure as the one for [getProducts] call.

### Make a purchase

To make a purchase call like:

```javascript
sdkbox.PluginIAP.purchase(
    product_name,
    product_type,
    function success( purchase_result ) {

    },
    function error( err ) {
        // an error message:
        // e.g. purchase canceled, or purchase error.
    });
```

`product_name` and `product_type` are fields defined in the configuration passed to `initPlugin`.

#### Android result:

The parameter `purchase_result` is of the form:

```json
{
    "sku" : "string"      // product id
    "original_json" : {
        "orderId"       : "string",   // e.g.: GPA.1371-4940-4055-37119
        "packageName"   : "string",   // e.g.: "org.cocos2ds.PluginTest" [ your app's bundle id ]
        "productId"     : "string",   // the purchased product id (defined on the store's console).
        "purchaseTime"  : "number",   // purchase utc time
        "purchaseState" : "number",
        "purchaseToken" : "string"    // e.g.: nkfpldadcgfbacbpjidffoka.AO-J ...
    },
    "signature" : "string"            // e.g.: BD3CALIQrV/R...
}
```

### Restore purchase

To restore purchases call:

```javascript
    sdkbox.PluginIAP.restore(
        function( products ) {

        },
        function(error) {

        });
```

`products` parameter is an array of the form:

```json
[
    "<product-id>", ...
]
```

The product ids will allow you to know what products must be granted. Only non-consumible products
can be restored.

__Note:__ the success callback could be triggered multiple times, depending on the number of products
you purchased and the system restores.


## IAP Receipts Verification

If you're using remote configuration for SDKBOX IAP, Receipts verification is turn on by default
[Click here to learn more.](/liveops/receipt-verification).

### Implement your own verification
You can get the receipt data and verify it with your own server by calling following method

```javascript
    sdkbox.PluginIAP.enableUserSideVerification(true);
```

>Note: iOS don't provide purchase receipt, only ciphered payload

## API Reference

Cordova plugins expect two callback functions for each Plugin exposed method.

The API is simple enough and is composed of the following methods:

```javascript

/** Purchase-Result
{
    "sku" : "string"      // product id
    "original_json" : {
        "orderId"       : "string",   // e.g.: GPA.1371-4940-4055-37119
        "packageName"   : "string",   // e.g.: "org.cocos2ds.PluginTest" [ your app's bundle id ]
        "productId"     : "string",   // the purchased product id (defined on the store's console).
        "purchaseTime"  : "number",   // purchase utc time
        "purchaseState" : "number",
        "purchaseToken" : "string"    // e.g.: nkfpldadcgfbacbpjidffoka.AO-J ...
    },
    "signature" : "string"            // e.g.: BD3CALIQrV/R...
}
*/

/** Product-Definition
{
    "id"            : "string",   // e.g.: com.cocos2dx.non1
    "title"         : "string",   // defined on the dev console
    "description"   : "string",   // defined on the dev console
    "price"         : "string",   // e.g.: "$2.29"
    "currencyCode"  : "string",   // e.g.: "USD"
    "priceValue"    : "number",    // e.g.: 2.28999996185 . floating point is funny isn't it ?
    "name"          : "string",    // human readable name. Defined in the products config as `<item-name>` field
    "type"          : "number"    // 0 : consumable, 1 : non-consumable
}
*/

module.exports = {

    /**
     * Initialize plugin with configuration. See Plugin Initialization IAP.
     */
    initPlugin : function( config, success, error ) {
    },

    /**
     * Refresh products cache
     * On success, the success callback will receive an array of Product-Definition objects.
     */
    refresh: function(success, error ) {
    },

    /**
     * Get products from the cache.
     * On success, the success callback will receive an array of Product-Definition objects.
     */
    getProducts: function(success, error ) {
    },

    /**
     * Purchase an item identified by its human readable name, and type.
     * On success, the success callback will receive a Purchase-Result object.
     */
    purchase : function( product_id, product_type, success, error ) {
    },

    /**
     * Restore purchases.
     * On success, the success callback will receibe an array of strings. Each string will be the
     * 'id' of the purchased item.
     */
    restore : function( success, error ) {
    },

    enableUserSideVerification : function( success, error ) {
    }

};
```
