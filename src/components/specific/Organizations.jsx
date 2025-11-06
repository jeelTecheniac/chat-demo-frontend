import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setIsOrganizations } from "../../redux/reducers/misc";
import {
  useCreateOrganizationMutation,
  useMyOrganizationsQuery,
  useJoinedOrganizationsQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";

const Organizations = () => {
  const { isOrganizations } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const orgName = useInputValidation("");

  const { isError, isLoading, error, data, refetch } =
    useMyOrganizationsQuery();

  const { data: joinedOrganizations, isLoading: findingJoinedOrganization } =
    useJoinedOrganizationsQuery();
  const [createOrganization, creating] = useAsyncMutation(
    useCreateOrganizationMutation
  );

  useErrors([{ isError, error }]);

  const closeHandler = () => dispatch(setIsOrganizations(false));

  const submitHandler = async () => {
    if (!orgName.value.trim())
      return toast.error("Organization name is required");

    await createOrganization("Creating organization...", {
      organizationName: orgName.value.trim(),
    });

    orgName.setValue("");
    refetch();
  };

  return (
    <Dialog
      onClose={closeHandler}
      open={isOrganizations}
      fullWidth
      maxWidth="xs"
    >
      <Stack p={{ xs: "1rem", sm: "2rem" }} spacing={"1rem"}>
        <DialogTitle textAlign={"center"} variant="h5">
          Organizations
        </DialogTitle>

        <TextField
          label="New Organization Name"
          value={orgName.value}
          onChange={orgName.changeHandler}
          disabled={creating}
        />
        <Button variant="contained" onClick={submitHandler} disabled={creating}>
          Create
        </Button>

        <Divider />

        <Typography variant="subtitle1">My Organizations</Typography>
        {isLoading || findingJoinedOrganization ? (
          <Skeleton />
        ) : (
          <List>
            {data?.organizations?.length ? (
              data.organizations.map((org) => (
                <ListItem key={org._id} disableGutters>
                  <ListItemText
                    primary={org.name}
                    secondary={new Date(org.createdAt).toLocaleString()}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                You have not created any organizations yet.
              </Typography>
            )}
          </List>
        )}

        <Divider />

        <Typography variant="subtitle1">Joined Organizations</Typography>
        {joinedOrganizations?.organizations?.length > 0 ? (
          <List>
            {joinedOrganizations.organizations.map((org) => (
              <ListItem key={org._id} disableGutters>
                <ListItemText
                  primary={org.name}
                  secondary={new Date(org.createdAt).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            You have not joined any organizations yet.
          </Typography>
        )}

        <Stack direction={"row"} justifyContent={"center"}>
          <Button variant="text" color="error" onClick={closeHandler}>
            Close
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default Organizations;
