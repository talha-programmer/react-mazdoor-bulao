import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  MenuItem
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import formatDistance from "date-fns/formatDistance";
import { useHistory } from "react-router-dom";

function MessageListItem(props) {
  const { message, divider, setIsOpen } = props;
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);
  const history = useHistory();
  const handleError = useCallback(() => {
    setHasErrorOccurred(true);
  }, [setHasErrorOccurred]);

  return (
    <MenuItem
      divider={divider}
      onClick={() => {
        history.push("/user/chat", {
          selectedUserId: message.from.id
        });
        setIsOpen(false);
      }}
    >
      <ListItemAvatar>
        {hasErrorOccurred ? (
          <ErrorIcon color="secondary" />
        ) : (
          <Avatar
            src={
              hasErrorOccurred
                ? null
                : message.from?.profile_image?.image_thumbnail_url
            }
            style={{ width: 50, height: 50, marginRight: 10 }}
            onError={handleError}
          />
        )}
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <span style={{ fontWeight: 500 }}>{message.from.name}</span> <br />
            {message.message_text}
          </>
        }
        secondary={`${formatDistance(
          new Date(message.created_at),
          new Date()
        )} ago`}
      />
    </MenuItem>
  );
}

MessageListItem.propTypes = {
  message: PropTypes.object.isRequired,
  divider: PropTypes.bool
};

export default MessageListItem;
