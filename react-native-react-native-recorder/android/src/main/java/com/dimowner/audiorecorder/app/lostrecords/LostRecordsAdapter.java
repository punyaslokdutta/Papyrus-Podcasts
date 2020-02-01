package com.dimowner.audiorecorder.app.lostrecords;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.dimowner.audiorecorder.R;
import com.dimowner.audiorecorder.util.TimeUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created on 14.12.2019.
 *
 * @author Dimowner
 */
public class LostRecordsAdapter extends RecyclerView.Adapter<LostRecordsAdapter.ItemViewHolder> {

	private List<RecordItem> data;
	private OnItemClickListener onItemClickListener;

	LostRecordsAdapter() {
		this.data = new ArrayList<>();
	}

	public void setData(List<RecordItem> list) {
		if (!data.isEmpty()) {
			data.clear();
		}
		data.addAll(list);
		notifyDataSetChanged();
	}

	void removeItem(int id) {
		int pos = -1;
		for (int i = 0; i < data.size(); i++) {
			if (id == data.get(i).getId()) {
				pos = i;
			}
		}
		if (pos >= 0 && pos < data.size()) {
			data.remove(pos);
			notifyDataSetChanged();
		}
	}

	void clearData() {
		data.clear();
		notifyDataSetChanged();
	}

	public List<RecordItem> getData() {
		return data;
	}

	@NonNull
	@Override
	public ItemViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
		View v = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.list_item_lost, viewGroup, false);
		return new ItemViewHolder(v);
	}

	@Override
	public void onBindViewHolder(@NonNull ItemViewHolder holder, final int position) {
		final int pos = holder.getAdapterPosition();
		if (pos != RecyclerView.NO_POSITION) {
			holder.name.setText(data.get(pos).getName());
			holder.location.setText(data.get(pos).getPath());
			holder.duration.setText(TimeUtils.formatTimeIntervalMinSec(data.get(pos).getDuration()/1000));
			holder.view.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					if (onItemClickListener != null) {
						onItemClickListener.onItemClick(data.get(pos));
					}
				}
			});
			holder.btnDelete.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					if (onItemClickListener != null) {
						onItemClickListener.onRemoveItemClick(data.get(pos));
					}
				}
			});
		}
	}

	@Override
	public int getItemCount() {
		return data.size();
	}

	public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
		this.onItemClickListener = onItemClickListener;
	}

	class ItemViewHolder extends RecyclerView.ViewHolder {
		TextView name;
		TextView location;
		TextView duration;
		ImageButton btnDelete;
		View view;

		ItemViewHolder(View itemView) {
			super(itemView);
			view = itemView;
			name = itemView.findViewById(R.id.list_item_name);
			duration = itemView.findViewById(R.id.list_item_duration);
			location = itemView.findViewById(R.id.list_item_location);
			btnDelete = itemView.findViewById(R.id.list_item_delete);
		}
	}

	public interface OnItemClickListener {
		void onItemClick(RecordItem record);
		void onRemoveItemClick(RecordItem record);
	}
}
