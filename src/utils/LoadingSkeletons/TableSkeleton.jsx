import { Skeleton, TableRow } from "@mui/material";
import React from "react";

const TableSkeleton = () => {
  return (
    <>
      <Skeleton sx={{ height: '80px'}} animation="wave" />
      <Skeleton sx={{ height: '80px'}} animation="wave" />
      <Skeleton sx={{ height: '80px'}} animation="wave" />
      <Skeleton sx={{ height: '80px'}} animation="wave"/>
   
    </>
  );
};

export default TableSkeleton;
