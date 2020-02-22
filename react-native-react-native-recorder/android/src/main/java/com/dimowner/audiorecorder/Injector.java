/*
 * Copyright 2018 Dmitriy Ponomarenko
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.dimowner.audiorecorder;

import android.content.Context;

import com.dimowner.audiorecorder.app.AppRecorder;
import com.dimowner.audiorecorder.app.AppRecorderImpl;
import com.dimowner.audiorecorder.app.lostrecords.LostRecordsContract;
import com.dimowner.audiorecorder.app.lostrecords.LostRecordsPresenter;
import com.dimowner.audiorecorder.app.trash.TrashContract;
import com.dimowner.audiorecorder.app.trash.TrashPresenter;
import com.dimowner.audiorecorder.audio.player.AudioPlayer;
import com.dimowner.audiorecorder.audio.player.PlayerContract;
import com.dimowner.audiorecorder.audio.recorder.AudioRecorder;
import com.dimowner.audiorecorder.audio.recorder.RecorderContract;
import com.dimowner.audiorecorder.audio.recorder.WavRecorder;
import com.dimowner.audiorecorder.data.FileRepository;
import com.dimowner.audiorecorder.data.FileRepositoryImpl;
import com.dimowner.audiorecorder.data.Prefs;
import com.dimowner.audiorecorder.data.PrefsImpl;
import com.dimowner.audiorecorder.data.database.LocalRepository;
import com.dimowner.audiorecorder.data.database.LocalRepositoryImpl;
import com.dimowner.audiorecorder.data.database.RecordsDataSource;
import com.dimowner.audiorecorder.app.main.MainContract;
import com.dimowner.audiorecorder.app.main.MainPresenter;
import com.dimowner.audiorecorder.app.records.RecordsContract;
import com.dimowner.audiorecorder.app.records.RecordsPresenter;
import com.dimowner.audiorecorder.app.settings.SettingsContract;
import com.dimowner.audiorecorder.app.settings.SettingsPresenter;
import com.dimowner.audiorecorder.data.database.TrashDataSource;

public class Injector {

	private Context context;

	private BackgroundQueue loadingTasks;
	private BackgroundQueue recordingTasks;
	private BackgroundQueue importTasks;
	private BackgroundQueue processingTasks;
	private BackgroundQueue copyTasks;

	private MainContract.UserActionsListener mainPresenter;
	private RecordsContract.UserActionsListener recordsPresenter;
	private SettingsContract.UserActionsListener settingsPresenter;
	private LostRecordsContract.UserActionsListener lostRecordsPresenter;
	private TrashContract.UserActionsListener trashPresenter;

	public Injector(Context context) {
		this.context = context;
	}

	public Prefs providePrefs() {
		return PrefsImpl.getInstance(context);
	}

	public RecordsDataSource provideRecordsDataSource() {
		return RecordsDataSource.getInstance(context);
	}

	public TrashDataSource provideTrashDataSource() {
		return TrashDataSource.getInstance(context);
	}

	public FileRepository provideFileRepository() {
		return FileRepositoryImpl.getInstance(context, providePrefs());
	}

	public LocalRepository provideLocalRepository() {
		return LocalRepositoryImpl.getInstance(provideRecordsDataSource(), provideTrashDataSource());
	}

	public AppRecorder provideAppRecorder() {
		return AppRecorderImpl.getInstance(provideAudioRecorder(), provideLocalRepository(),
				provideLoadingTasksQueue(), provideProcessingTasksQueue(), providePrefs());
	}

	public BackgroundQueue provideLoadingTasksQueue() {
		if (loadingTasks == null) {
			loadingTasks = new BackgroundQueue("LoadingTasks");
		}
		return loadingTasks;
	}

	public BackgroundQueue provideRecordingTasksQueue() {
		if (recordingTasks == null) {
			recordingTasks = new BackgroundQueue("RecordingTasks");
		}
		return recordingTasks;
	}

	public BackgroundQueue provideImportTasksQueue() {
		if (importTasks == null) {
			importTasks = new BackgroundQueue("ImportTasks");
		}
		return importTasks;
	}

	public BackgroundQueue provideProcessingTasksQueue() {
		if (processingTasks == null) {
			processingTasks = new BackgroundQueue("ProcessingTasks");
		}
		return processingTasks;
	}

	public BackgroundQueue provideCopyTasksQueue() {
		if (copyTasks == null) {
			copyTasks = new BackgroundQueue("CopyTasks");
		}
		return copyTasks;
	}

	public ColorMap provideColorMap() {
		return ColorMap.getInstance(providePrefs());
	}

	public PlayerContract.Player provideAudioPlayer() {
		return AudioPlayer.getInstance();
	}

	//todo kamal
	public RecorderContract.Recorder provideAudioRecorder() {
		if (providePrefs().getFormat() == AppConstants.RECORDING_FORMAT_WAV) {
			return WavRecorder.getInstance();
		} else {
			return AudioRecorder.getInstance();
		}
	}

	public MainContract.UserActionsListener provideMainPresenter() {
		if (mainPresenter == null) {
			mainPresenter = new MainPresenter(providePrefs(), provideFileRepository(),
					provideLocalRepository(), provideAudioPlayer(), provideAppRecorder(),
					provideLoadingTasksQueue(), provideRecordingTasksQueue(), provideImportTasksQueue());
		}
		return mainPresenter;
	}

	public RecordsContract.UserActionsListener provideRecordsPresenter() {
		if (recordsPresenter == null) {
			recordsPresenter = new RecordsPresenter(provideLocalRepository(), provideFileRepository(),
					provideLoadingTasksQueue(), provideRecordingTasksQueue(), provideCopyTasksQueue(),
					provideAudioPlayer(), provideAppRecorder(), providePrefs());
		}
		return recordsPresenter;
	}

	public SettingsContract.UserActionsListener provideSettingsPresenter() {
		if (settingsPresenter == null) {
			settingsPresenter = new SettingsPresenter(provideLocalRepository(), provideFileRepository(),
					provideRecordingTasksQueue(), provideLoadingTasksQueue(), providePrefs());
		}
		return settingsPresenter;
	}

	public TrashContract.UserActionsListener provideTrashPresenter() {
		if (trashPresenter == null) {
			trashPresenter = new TrashPresenter(provideLoadingTasksQueue(), provideRecordingTasksQueue(),
					provideFileRepository(), provideLocalRepository());
		}
		return trashPresenter;
	}

	public LostRecordsContract.UserActionsListener provideLostRecordsPresenter() {
		if (lostRecordsPresenter == null) {
			lostRecordsPresenter = new LostRecordsPresenter(provideLoadingTasksQueue(), provideRecordingTasksQueue(),
					provideLocalRepository(), providePrefs());
		}
		return lostRecordsPresenter;
	}

	public void releaseTrashPresenter() {
		if (trashPresenter != null) {
			trashPresenter.clear();
			trashPresenter = null;
		}
	}

	public void releaseLostRecordsPresenter() {
		if (lostRecordsPresenter != null) {
			lostRecordsPresenter.clear();
			lostRecordsPresenter = null;
		}
	}

	public void releaseRecordsPresenter() {
		if (recordsPresenter != null) {
			recordsPresenter.clear();
			recordsPresenter = null;
		}
	}

	public void releaseMainPresenter() {
		if (mainPresenter != null) {
			mainPresenter.clear();
			mainPresenter = null;
		}
	}

	public void releaseSettingsPresenter() {
		if (settingsPresenter != null) {
			settingsPresenter.clear();
			settingsPresenter = null;
		}
	}

	public void closeTasks() {
		loadingTasks.cleanupQueue();
		loadingTasks.close();
		importTasks.cleanupQueue();
		importTasks.close();
		processingTasks.cleanupQueue();
		processingTasks.close();
		recordingTasks.cleanupQueue();
		recordingTasks.close();
	}
}
