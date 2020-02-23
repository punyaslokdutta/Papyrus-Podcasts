package com.papyrus_60;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.brentvatne.react.ReactVideoPackage;
//import com.reactnativecommunity.statusbar.RNCStatusBarPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
//import io.invertase.firebase.auth.RNFirebaseAuthPackage;
//import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import com.facebook.FacebookSdk;
//import com.dimowner.audiorecorder.ReactNativeRecorderPackage;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      //packages.add(new RNFirebaseFirestorePackage());
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      //packages.add(new ImagePickerPackage()) ;
      //packages.add(new RNCStatusBarPackage());
      //packages.add(new ReactNativeRecorderPackage());
      packages.add(new ReactVideoPackage() );
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
