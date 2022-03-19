import Button from "@mui/material/Button";
import { useSnackbarContext } from "contexts/snackbar-context";
import useAuthListener from "hooks/useAuthListener";
import moment from "moment";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Activity, DateSpeceficActivity } from "types";
import { getDateStringFromMoment } from "utils";
import { handleRecordNowInFirestore } from "../helpers/handleRecordNowInFirestore";
import DeleteActivityDialog from "./DeleteActivityDialog";
import EditSingleActivityTextfield from "./EditSingleActivityTextfield";
import MoreActionsMenuButton from "./MoreActionsMenuButton";
import SingleActivityCard from "./SingleActivityCard";
import SingleActivityTableRow from "./SingleActivityTableRow";

interface SingleActivityProps {
  activity: Activity;
  dateSpecificActivitiesList: DateSpeceficActivity[] | null;
  view: "card" | "tableRow";
}

const SingleActivity = (props: SingleActivityProps) => {
  const { activity, dateSpecificActivitiesList, view } = props;

  const [user] = useAuthListener();
  const history = useHistory();
  const currentDateString = getDateStringFromMoment(moment());

  const { handleCloseSnackbar, showAlert } = useSnackbarContext();

  const [isRecordNowBtnLoading, setIsRecordNowBtnLoading] = useState(false);

  const showSuccessMessage = (activity: Activity) => {
    showAlert({
      message: (
        <>
          Added <strong>{activity.name}</strong> to{" "}
          <strong>{currentDateString}</strong>{" "}
          <Button
            color="success"
            onClick={() => {
              history.push(`./date-manager/${currentDateString}`);
              handleCloseSnackbar();
            }}
          >
            Check
          </Button>
        </>
      ),
    });
  };

  const handleRecordNow = async (activity: Activity) => {
    if (dateSpecificActivitiesList === null) return;
    setIsRecordNowBtnLoading(true);

    const dateSpecificActivity = dateSpecificActivitiesList.find(
      (el) => el.activityId === activity.id
    );

    try {
      await handleRecordNowInFirestore({
        activity,
        dateSpecificActivity,
        user,
      });

      showSuccessMessage(activity);
    } catch (err: any) {
      console.log(err);
      showAlert({
        message: err?.message || "something went wrong 😭",
        alertColor: "error",
      });
    } finally {
      setIsRecordNowBtnLoading(false);
    }
  };

  // expand icon
  const [openExpandableArea, setOpenExpandableArea] = useState(false);

  // edit and delete
  const [isEditMode, setIsEditMode] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleClose = () => setIsDeleteDialogOpen(false);

  const moreActionsMenuBtn = (
    <MoreActionsMenuButton
      isEditMode={isEditMode}
      openDeleteDialog={() => setIsDeleteDialogOpen(true)}
      openEditMode={() => setIsEditMode(true)}
    />
  );

  const editableActivityName = isEditMode ? (
    <EditSingleActivityTextfield
      activity={activity}
      setIsEditMode={setIsEditMode}
    />
  ) : (
    activity.name
  );

  const singleACtivityRowOrCardProps = {
    activity: activity,
    editableActivityName: editableActivityName,
    isRecordNowBtnLoading: isRecordNowBtnLoading,
    moreActionsMenuBtn: moreActionsMenuBtn,
    openExpandableArea: openExpandableArea,
    recordActivity: () => handleRecordNow(activity),
    toggleExpandableArea: () => setOpenExpandableArea((prev) => !prev),
  };

  return (
    <>
      {view === "tableRow" && (
        <>
          <SingleActivityTableRow {...singleACtivityRowOrCardProps} />
        </>
      )}

      {view === "card" && (
        <SingleActivityCard {...singleACtivityRowOrCardProps} />
      )}

      <DeleteActivityDialog
        activity={activity}
        handleClose={handleClose}
        open={isDeleteDialogOpen}
      />
    </>
  );
};

export default SingleActivity;
