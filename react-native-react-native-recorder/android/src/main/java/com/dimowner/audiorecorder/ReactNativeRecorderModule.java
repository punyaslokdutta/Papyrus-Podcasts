package com.dimowner.audiorecorder;

import com.dimowner.audiorecorder.app.main.SecondActivity;
import com.dimowner.audiorecorder.app.records.RecordsActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.dimowner.audiorecorder.app.main.MainActivity;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.content.Intent;

public class ReactNativeRecorderModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ReactNativeRecorderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ReactNativeRecorder";
    }

   @ReactMethod
    public void sampleMethod() {
       // callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
           Intent intent= new Intent(reactContext, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }
    @ReactMethod
    public void sampleMethodTwo() {
        // callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
        Intent intent= new Intent(reactContext, RecordsActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }
}
