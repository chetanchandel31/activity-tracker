import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { firestore } from "firebase-config/firebase";
import useAuthListener from "hooks/useAuthListener";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Activity } from "types";
import { editFirestoreDoc } from "utils";

interface EditSingleActivityTextfieldProps {
  activity: Activity;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}

const EditSingleActivityTextfield = (
  props: EditSingleActivityTextfieldProps
) => {
  const { activity, setIsEditMode } = props;

  const theme = useTheme();
  const [user] = useAuthListener();
  const activitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/activities`
  );

  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [editedActivityName, setEditedActivityName] = useState(activity.name);
  const [isLoading, setIsLoading] = useState(false);

  const textFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // focus on mount because `autoFocus` prop doesn't seem to be working
    textFieldRef.current?.querySelector("input")?.focus();
  }, []);

  const cancelEdit = () => setIsEditMode(false);

  const editActivityName = async () => {
    // TODO: think if we need snackbars here 🤔
    setIsLoading(true);

    try {
      await editFirestoreDoc({
        collectionRef: activitiesCollectionRef,
        docId: activity.id,
        updatedDoc: { name: editedActivityName },
      });

      cancelEdit();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const instructions = (
    <>
      {isSmUp && <>escape to </>}
      <Link onClick={cancelEdit} sx={{ cursor: "pointer" }} underline="hover">
        <strong>cancel</strong>
      </Link>{" "}
      • enter to{" "}
      <Link
        onClick={editActivityName}
        sx={{ cursor: "pointer" }}
        underline="hover"
      >
        <strong>save</strong>
      </Link>
    </>
  );

  const helperText = isLoading ? "saving..." : instructions;

  return (
    <>
      <TextField
        autoFocus
        disabled={isLoading}
        helperText={helperText}
        onChange={({ target }) => setEditedActivityName(target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") cancelEdit();
          else if (event.key === "Enter") editActivityName();
        }}
        ref={textFieldRef}
        size="small"
        value={editedActivityName}
      />
    </>
  );
};

export default EditSingleActivityTextfield;
