import { useState } from "react";
import { Activity } from "types";
import DeleteActivityDialog from "./DeleteActivityDialog";
import EditSingleActivityTextfield from "./EditSingleActivityTextfield";
import MoreActionsMenuButton from "./MoreActionsMenuButton";
import SingleActivityCard from "./SingleActivityCard";
import SingleActivityTableRow from "./SingleActivityTableRow";

interface SingleActivityProps {
  view: "card" | "tableRow";
  activity: Activity;
  isRecordNowBtnLoading: boolean;
  handleRecordNow: (activity: Activity) => Promise<void>;
}

const SingleActivity = (props: SingleActivityProps) => {
  const { activity, isRecordNowBtnLoading, handleRecordNow, view } = props;

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
