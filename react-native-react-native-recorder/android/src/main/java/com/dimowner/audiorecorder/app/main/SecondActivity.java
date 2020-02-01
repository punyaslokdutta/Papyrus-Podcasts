package com.dimowner.audiorecorder.app.main;

import android.app.Activity;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.dimowner.audiorecorder.R;

public class SecondActivity extends Activity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.second_activity);
    }
}
