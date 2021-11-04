import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
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
    padding: "10px",
    width: "fit-content"
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
  // window.Echo.private(`chat.with.${loggedInUserId}`).listen(
  //   "MessageReceived",
  //   (e) => {
  //     console.log("message received");
  //     const message = e.message;
  //     queryClient.setQueryData(
  //       [queryKeys.chatWithUser, message?.from],
  //       (oldData) => [...oldData, message]
  //     );
  //   }
  // );

  return (
    <>
      <List className={classes.messageArea} scroll="paper">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <>
            {chat &&
              chat.map((message) => (
                <ListItem key={message.id}>
                  <Grid
                    container
                    align={message.from === loggedInUserId ? "right" : "left"}
                  >
                    <Grid item xs={12}>
                      <div className={classes.singleMessage}>
                        <ListItemText
                          primary={message.message_text}
                        ></ListItemText>
                        <ListItemText
                          secondary={format(
                            new Date(message.created_at),
                            "hh:mm a"
                          )}
                        ></ListItemText>
                      </div>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            <ListItem ref={scrollRef}></ListItem>
          </>
        )}
      </List>
    </>
  );
};

const Chat = (props) => {
  const classes = useStyles();
  const { selectChat } = props;
  const userIdPassed = props.location?.state?.selectedUserId;
  const [selectedUserId, setSelectedUserId] = useState(userIdPassed);
  const [chatUsers, setChatUsers] = useState();
  const {
    data: dataChatUsers,
    isLoading: isUsersLoading,
    isError: isUsersError,
    isFetched: isUsersFetched
  } = useChatUsers();
  const messageRef = useRef();
  const searchRef = useRef();
  const {
    mutate,
    isSuccess: isMessageSuccess,
    isError: isMessageError
  } = useSendMessage();

  useEffect(selectChat, [selectChat]);

  useEffect(() => {
    if (isUsersFetched) {
      setChatUsers(Object.values(dataChatUsers));
    }
  }, [dataChatUsers, isUsersFetched]);

  const sendMessage = () => {
    const messageText = messageRef.current.value;

    const message = {
      message_text: messageText,
      to: selectedUserId
    };

    mutate(message);
  };

  useEffect(() => {
    if (isMessageSuccess) {
      messageRef.current.value = "";
    }
  }, [isMessageSuccess]);

  const searchUsers = () => {
    let value = searchRef.current.value;
    if (value.length > 0 && isUsersFetched) {
      let chat = Object.values(dataChatUsers).filter((user) => {
        const name = user.name.toLowerCase();
        value = value.toLowerCase();
        return name.includes(value);
      });
      setChatUsers(chat);
    } else {
      setChatUsers(Object.values(dataChatUsers));
    }
  };

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
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              inputRef={searchRef}
              onChange={searchUsers}
            />
          </Grid>
          <Divider />

          {isUsersLoading ? (
            <span>Loading...</span>
          ) : (
            <List className={classes.chatUsers}>
              {isUsersFetched &&
                chatUsers &&
                chatUsers.map((user) => (
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
