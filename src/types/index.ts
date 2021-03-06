import firebase from "firebase";

export interface Timestamp {
  timestamp: number;
  timestampId: string;
}

export interface Activity {
  createdAt: number;
  id: string;
  lastUpdatedAt: number;
  name: string;
  performedAt: Timestamp[];
}

export interface DateSpeceficActivity {
  activityId: string;
  activityRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  id: string;
  performedAt: Timestamp[];
}

export interface ActivitiesList {
  docs: Activity[] | null;
}

export interface DateSpeceficActivitiesList {
  docs: DateSpeceficActivity[] | null;
}

export interface GraphData {
  xAxisData: string[];
  yAxisData: number[];
}
