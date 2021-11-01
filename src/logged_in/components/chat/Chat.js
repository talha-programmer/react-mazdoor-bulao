import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import useChatUsers from "../../../hooks/chat/useChatUsers";
import useChatWithUser from "../../../hooks/chat/useChatWithUser";
import { useQueryClient } from "react-query";
import queryKeys from "../../../config/queryKeys";
import useSendMessage from "../../../hooks/chat/useSendMessage";
import { format } from "date-fns";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  chatSection: {
    width: "100%"
  },
  headBG: {
    backgroundColor: "#e0e0e0"
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0"
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto"
  },
  chatUsers: {
    overflowY: "auto"
  },
  singleMessage: {
    backgroundColor: "rgba(239,239,239,1)",
    borderRadius: "22px",
    padding: "10px"
    //width: "fit-content"
  }
});

const MessageArea = ({ userId }) => {
  const { data: chat, isLoading, isError } = useChatWithUser(userId);
  const queryClient = useQueryClient();
  const loggedInUserId = queryClient.getQueryData(queryKeys.user)?.id;
  const classes = useStyles();
  const scrollRef = useRef();

  useEffect(() => {
    // Scroll to the last message whenever the chat updates
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [chat]);

  // TODO Fix multiple times reloading of this code
  window.Echo.private(`chat.with.${loggedInUserId}`).listen(
    "MessageReceived",
    (e) => {
      console.log("message received");
      const message = e.message;
      queryClient.setQueryData(
        [queryKeys.chatWithUser, message?.from],
        (oldData) => [...oldData, message]
      );
    }
  );

  return (
    <>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <List className={classes.messageArea} scroll="paper">
          {chat &&
            chat.map((message) => (
              <ListItem key={message.id}>
                <Grid
                  container
                  className={classes.singleMessage}
                  align={message.from === loggedInUserId ? "right" : "left"}
                >
                  <Grid item xs={12}>
                    <ListItemText primary={message.message}></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      secondary={format(
                        new Date(message.created_at),
                        "hh:mm a"
                      )}
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          <ListItem ref={scrollRef}></ListItem>
        </List>
      )}
    </>
  );
};

const Chat = (props) => {
  const classes = useStyles();
  const userIdPassed = props.location?.state?.selectedUserId;
  const [selectedUserId, setSelectedUserId] = useState(userIdPassed);
  const { data: chatUsers, isLoading, isError, isFetched } = useChatUsers();
  const messageRef = useRef();

  const { mutate, isSuccess, isError: isMessageError } = useSendMessage();

  const sendMessage = () => {
    const messageText = messageRef.current.value;

    const message = {
      message_text: messageText,
      to: selectedUserId
    };

    mutate(message);
  };

  useEffect(() => {
    if (isSuccess) {
      messageRef.current.value = "";
    }
  }, [isSuccess]);

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField label="Search" variant="outlined" fullWidth />
          </Grid>
          <Divider />

          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <List className={classes.chatUsers}>
              {isFetched &&
                Object.values(chatUsers).map((user) => (
                  <ListItem
                    button
                    key={user.id}
                    onClick={() => {
                      setSelectedUserId(user.id);
                    }}
                    selected={selectedUserId === user.id}
                  >
                    <ListItemIcon>
                      <Avatar alt={user.name} />
                    </ListItemIcon>
                    <ListItemText primary={user.name}></ListItemText>
                  </ListItem>
                ))}
            </List>
          )}
        </Grid>
        <Grid item xs={9}>
          <MessageArea userId={selectedUserId} />
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                label="Type Something"
                inputRef={messageRef}
                fullWidth
              />
            </Grid>
            <Grid xs={1} align="right">
              <Fab color="primary" aria-label="add" onClick={sendMessage}>
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;