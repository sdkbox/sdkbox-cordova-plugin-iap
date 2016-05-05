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





### Android Gotchas, how to set a specific versionCode/versionName [If it is the first time you submit a cordova App for IAP, forget about this, but anyway, worth to know info].

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
