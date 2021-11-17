import React from "react";
import { Box } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

const BoxCircularProgress = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};

export default BoxCircularProgress;
