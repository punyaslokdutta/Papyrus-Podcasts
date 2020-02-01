/*
 * Copyright 2018 Dmitriy Ponomarenko
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.dimowner.audiorecorder;

import android.app.Application;
import android.content.Context;
import android.os.Handler;

//import com.crashlytics.android.Crashlytics;
import com.dimowner.audiorecorder.util.AndroidUtils;
//import io.fabric.sdk.android.Fabric;

import timber.log.Timber;

public class ARApplication {

	private static String PACKAGE_NAME ;
	public static volatile Handler applicationHandler;
	public static Context mContext;

	public static ARApplication arApplicationn= new ARApplication();

	private  ARApplication(){}

	public static ARApplication getApplicationInstacne(Context context){
		mContext=context;
		return  arApplicationn;
	}

	/** Screen width in dp */
	private static float screenWidthDp = 0;

	public static Injector injector;

	private static boolean isRecording = false;

	public static Injector getInjector() {
		return injector;
	}

	public static String appPackage() {
		return PACKAGE_NAME;
	}

	/**
	 * Calculate density pixels per second for record duration.
	 * Used for visualisation waveform in view.
	 * @param durationSec record duration in seconds
	 */
	public static float getDpPerSecond(float durationSec) {
		if (durationSec > AppConstants.LONG_RECORD_THRESHOLD_SECONDS) {
			return AppConstants.WAVEFORM_WIDTH * screenWidthDp / durationSec;
		} else {
			return AppConstants.SHORT_RECORD_DP_PER_SECOND;
		}
	}

	public static int getLongWaveformSampleCount() {
		return (int)(AppConstants.WAVEFORM_WIDTH * screenWidthDp);
	}

	public void  initialiseComponent() {
		if (BuildConfig.DEBUG) {
			//Timber initialization
			Timber.plant(new Timber.DebugTree() {
				@Override
				protected String createStackElementTag(StackTraceElement element) {
					return "AR-AR " + super.createStackElementTag(element) + ":" + element.getLineNumber();
				}
			});
		}
		//		Fabric.with(this, new Crashlytics());

		//PACKAGE_NAME = getApplicationContext().getPackageName();
		applicationHandler = new Handler(mContext.getMainLooper());
		screenWidthDp = AndroidUtils.pxToDp(AndroidUtils.getScreenWidth(mContext));
		injector = new Injector(mContext);
	}

/*	@Override
	public void onTerminate() {
		super.onTerminate();
		Timber.v("onTerminate");
		injector.releaseMainPresenter();
		injector.closeTasks();
	}*/



	public static boolean isRecording() {
		return isRecording;
	}

	public static void setRecording(boolean recording) {
		ARApplication.isRecording = recording;
	}
}
