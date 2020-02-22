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

package com.dimowner.audiorecorder.data.database;


import androidx.annotation.NonNull;

import java.util.Arrays;

public class Record {

	public static final int NO_ID = -1;
//	private static final String DELIMITER = ",";

	private int id;
	private String name;
	private long duration;
	private long created;
	private long added;
	private long removed;
	private String path;
	private boolean bookmark;
	private boolean waveformProcessed;
	private int[] amps;
	private byte[] data;
	//TODO: Remove not needed data clusters.

	public Record(int id, String name, long duration, long created, long added, long removed, String path,
					  boolean bookmark, boolean waveformProcessed, int[] amps) {
		this.id = id;
		this.name = name;
		this.duration = duration;
		this.created = created;
		this.added= added;
		this.removed = removed;
		this.path = path;
		this.bookmark = bookmark;
		this.waveformProcessed = waveformProcessed;
		this.amps = amps;
		this.data = int2byte(amps);
//		this.data = AndroidUtils.int2byte(amps);
	}

	public Record(int id, String name, long duration, long created, long added, long removed, String path,
					  boolean bookmark, boolean waveformProcessed, byte[] amps) {
		this.id = id;
		this.name = name;
		this.duration = duration;
		this.created = created;
		this.added = added;
		this.removed = removed;
		this.path = path;
		this.bookmark = bookmark;
		this.waveformProcessed = waveformProcessed;
		this.amps = byte2int(amps);
//		this.amps = AndroidUtils.byte2int(amps);
		this.data = amps;
	}

	public byte[] int2byte(int[] amps) {
		byte[] bytes = new byte[amps.length];
		for (int i = 0; i < amps.length; i++) {
			if (amps[i] >= 255) {
				bytes[i] = 127;
			} else if (amps[i] < 0) {
				bytes[i] = 0;
			} else {
				bytes[i] = (byte)(amps[i]-128);
			}
		}
		return bytes;
	}

	public int[] byte2int(byte[] amps) {
		int[] ints = new int[amps.length];
		for (int i = 0; i < amps.length; i++) {
			ints[i] = amps[i]+128;
		}
		return ints;
	}

	public int getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public long getCreated() {
		return created;
	}

	public long getAdded() {
		return added;
	}

	public long getRemoved() {
		return removed;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public int[] getAmps() {
		return amps;
	}

	public long getDuration() {
		return duration;
	}

	public byte[] getData() {
		return data;
	}

	public boolean isBookmarked() {
		return bookmark;
	}

	public boolean isWaveformProcessed() {
		return waveformProcessed;
	}

	public void setBookmark(boolean b) {
		this.bookmark = b;
	}

//	public static int[] stringToArray(String groups) {
//		if (groups != null && !groups.isEmpty()) {
//			String[] grStr = groups.split(DELIMITER);
//			int[] grInt = new int[grStr.length];
//			for (int i = 0; i < grStr.length; i++) {
//				try {
//					grInt[i] = Integer.parseInt(grStr[i]);
//				} catch (NumberFormatException e) {
//					Timber.e(e);
//				}
//			}
//			return grInt;
//		}
//		return new int[0];
//	}
//
//	public static String arrayToString(int[] tokens) {
//		StringBuilder sb = new StringBuilder();
//		boolean firstTime = true;
//		for (Object token: tokens) {
//			if (firstTime) {
//				firstTime = false;
//			} else {
//				sb.append(DELIMITER);
//			}
//			sb.append(token);
//		}
//		return sb.toString();
//	}

	@NonNull
	@Override
	public String toString() {
		return "Record{" +
				"id=" + id + '\'' +
				", name='" + name + '\'' +
				", duration=" + duration + '\'' +
				", created=" + created + '\'' +
				", added=" + added + '\'' +
				", path='" + path + '\'' +
				", bookmark=" + bookmark + '\'' +
				", waveformProcessed=" + waveformProcessed + '\'' +
				", amps=" + Arrays.toString(amps) +
				", data=" + Arrays.toString(data) +
				'}';
	}
}
