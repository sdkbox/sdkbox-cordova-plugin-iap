# Create application

`cordova create SdkboxIAP org.cocos2dx.PluginTest SdkboxIAP_Cordova`

# Android integration

`cordova platform add android`

`cordova plugin add https://github.com/sdkbox/sdkbox-cordova-plugin-iap.git --save`

* Add configuration file [will be changed in favour of integrating the json file from javascript].

Copy a valid sdkbox_config.json file to SdkboxIAP/platforms/android/assets
A valid example would be:
```json
{
  "android": {
    "iap": {
      "key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq7eIGu7dRcBRBSC05cYvxjBMd7cqq9w6++1er+cqO2tyWPtWB4vuTkliq4k/Fkylx5UMfptdOYOW8ENgQyVucs/NyuOAGmve4j5JFhLPcLa6LjO2HUSY6zk04DRR9Zw7YPET4WAezZTz8jYMGhPG08HYltVj8cmSpSFWd1nI0pGOJoLQIMkIkXplgnPQRbMpuOu70vnQQBS1RFcoFT7OjaV8U0cfJzMoS1TMkGqaJKks2T+qOBNTtkXzge92EnvYIkhpCfN98dj6aQmETNp5yj5Fa+jcbAVF8dy5xymJwioL89XQKfKkGR+P6ESMoBEPfIZYIlMU8EUwmC+UKGLujQIDAQAB",
      "items": {
        "remove_ads": {
          "id": "com.cocos2dx.non1",
          "type": "non_consumable"
        },
        "double_coin": {
          "id": "com.cocos2dx.non2",
          "type": "non_consumable"
        },
        "coin_package": {
          "id": "com.cocos2dx.plugintest2"
        },
        "coin_package2": {
          "id": "com.cocos2dx.plugintest3"
        }
      }
    }
  }
}
```

* Set your application code, by modifying the `www` folder contents.
* Compile the application:

`cordova build android --release`

* Cypher/zipalign your application:

Create a file named `release-signing.properties` with the cyphering information. A valid example could be:

```json
storeFile=<path to your store file>
storeType=jks
keyAlias=<alias name>
storePassword=
keyPassword=
```

### Gotchas [If it is the first time you submit a cordova App for IAP, forget about this, but anyway, worth to know info].

The default gradle file to build a Cordova app, mangles the application's manifest versionCode with some black witchery, which renders mostly impossible to have an specific version code. This is needed to submit IAP enabled apps to the google play store.
In order to have finer control over `versionName` and `versionCode`, you have to:

#### Modify config.xml

This file is in the root of your Cordova app folder.
In there, `bundle id, versionCode, and versionName` (the three key elements to create an IAP enabled app) are defined.
Change the `widget` node as in the example to fit your own needs:
`<widget id="org.cocos2dx.PluginTest" android-versionCode="2" version="1.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">`

#### Edit build.gradle file:

* modify line 165:
Change this: `versionCode cdvVersionCode ?: Integer.parseInt("" + privateHelpers.extractIntFromManifest("versionCode") + "0")` 
by removing the trailing `"0"`. 

Leave it as: `versionCode cdvVersionCode ?: Integer.parseInt("" + privateHelpers.extractIntFromManifest("versionCode") )`
* remove/comment lines 180-210

```gradle

// this block out
    if (Boolean.valueOf(cdvBuildMultipleApks)) {
        productFlavors {
            armv7 {
                versionCode defaultConfig.versionCode + 2
                ndk {
                    abiFilters "armeabi-v7a", ""
                }
            }
            x86 {
                versionCode defaultConfig.versionCode + 4
                ndk {
                    abiFilters "x86", ""
                }
            }
            all {
                ndk {
                    abiFilters "all", ""
                }
            }
        }
    } else if (!cdvVersionCode) {
      def minSdkVersion = cdvMinSdkVersion ?: privateHelpers.extractIntFromManifest("minSdkVersion")
      // Vary versionCode by the two most common API levels:
      // 14 is ICS, which is the lowest API level for many apps.
      // 20 is Lollipop, which is the lowest API level for the updatable system webview.
      if (minSdkVersion >= 20) {
        defaultConfig.versionCode += 9
      } else if (minSdkVersion >= 14) {
        defaultConfig.versionCode += 8
      }
    }
```

You can check the `versionCode` by executing `aapt l -a <an apk file> | grep versionCode`.
The result should be the one you specified.

# iOS integration

`cordova platform add ios`

If not done before:

`cordova plugin add https://github.com/sdkbox/sdkbox-cordova-plugin-iap.git --save`

* Open ios project from `SdkboxIAP/platforms/ios/SdkboxIAP_Cordova.xcodeproj`

Add a valid `sdkbox_config.json` file to Resources. (see Android integration for a valid example).
Rename the files `SdkboxIAP/platforms/ios/SdkboxIAP_Cordova/Classes/AppDelegate.m` and `SdkboxIAP/platforms/ios/SdkboxIAP_Cordova/Classes/AppDelegate.m` to have `.mm` extension.

* Compile app

`cordova build ios --release`
