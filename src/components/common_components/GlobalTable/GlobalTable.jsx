"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
// import DeleteIcon from '@mui/icons-material/Delete';
// import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from "@mui/utils";
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import Link from "next/link";
import ReactPaginate from "react-paginate";
import TableSkeleton from "@/utils/LoadingSkeletons/TableSkeleton";
import { DeleteOutlineRounded, EditOutlined } from "@mui/icons-material";
import useDebounce from "@/hooks/useDebounce";
import { productApi } from "@/api/api";

function descendingComparator(a, b, orderBy) {
  // Function to safely access nested properties
  const getNestedProperty = (object, keys) => {
    return keys.reduce((obj, key) => {
      if (obj && key in obj) {
        return obj[key];
      } else if (obj && /\[\d+\]/.test(key)) {
        // Check if key is an array index
        const index = parseInt(key.match(/\[(\d+)\]/)[1]);
        return obj[index];
      }
      return null;
    }, object);
  };

  // Split the orderBy string into an array of keys
  const keys = orderBy.split(".");

  // Safely get the values of the nested properties
  const aValue = getNestedProperty(a, keys);
  const bValue = getNestedProperty(b, keys);

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
    numSelected,
    rowCount,
    onSelectAllClick,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headerStyles = {
    fontFamily: `var(--bs-font-sans-serif)`,
    color: `#030320`,
    fontSize: "12px",
    fontWeight: 600,
  };

  return (
    <TableHead
      sx={{ position: "sticky", top: 0, background: "white", zIndex: 10 }}
    >
      <TableRow>
        {!props?.noCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
        )}
        {props.header.map((headCell, i) => (
          <TableCell key={i} align="left">
            {headCell.id ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                style={headerStyles}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <span style={headerStyles}>{headCell.label}</span>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  header: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, showFilter, selectedItems } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 0 },
        pr: { xs: 0, sm: 0 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <div className="tableTitleCard">
        <div className="tableHeader">
          <div className="flex-center mr-20" style={{ gap: "20px" }}>
            <h3 className="title">{props.title}</h3>
            {/* // Show Filter based on props */}
            {showFilter && numSelected <= 0 && (
              <TextField
                label="Outlined"
                variant="outlined"
                onChange={(e) => props?.setSearchTerm(e.target.value)}
              />
            )}
          </div>
          {props.showDots ? (
            <img
              src="/static/images/DashboardIcons/chevron.svg"
              alt="option"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              className="optionButton"
              onClick={handleClick}
            />
          ) : (
            <></>
          )}

          {/* Render the option modal based on showModal state */}
          <Popover
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Popover>

          {(props?.showEdit || props.showDelete || props.showAdd) && (
            <div className="flex" style={{ alignItems: "center", gap: "5px" }}>
              {numSelected == 1 && (
                <IconButton onClick={props?.openFormEditDrawer}>
                  <EditOutlined />
                </IconButton>
              )}
              {numSelected > 0 && (
                <IconButton
                  onClick={(e) => props?.deleteItem(e, selectedItems)}
                >
                  <DeleteOutlineRounded />
                </IconButton>
              )}
              {props?.showAdd && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={props?.openFormDrawer}
                >
                  {props.add_btn_title}
                </Button>
              )}
            </div>
          )}
        </div>
        {/* <p className="bodyS" style={{ color: '#632E99' }}>This Month</p> */}

        <hr className="horizontalRule" />
      </div>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const GlobalTable = (props) => {
  //Table States
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState(null);

  React.useEffect(() => {
    if (props?.tableData) {
      props?.setData(props?.tableData);
    }
  }, [props?.tableData]);

  // Debounced function to handle search term changes
  useDebounce(
    async () => {
      if (searchTerm) {
        const response = await props?.searchApi.get(
          `${props?.searchPath}/${searchTerm}`
        ); // Modify API endpoint as needed
        props?.setData(response);
      } else {
        props?.setData(props?.tableData);
      }
    },
    500,
    [searchTerm]
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // All Select Feature
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = props?.tableData?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // Search functionality
  React.useEffect(() => {
    if (searchTerm == "") {
      props?.fetchData();
    }
  }, [searchTerm]);

  const visibleRows = React.useMemo(() => {
    if (!searchTerm) {
      return props?.tableData; // Return all props?.tableData if there's no search term
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return props?.tableData?.filter((row) => {
      // Check if any property of the object includes the search term
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
  }, [searchTerm, props?.tableData]); // Dependencies: searchTerm and the original tableData

  //want sort functionality for visibleRows
  const sortedRows = React.useMemo(() => {
    return stableSort(visibleRows, getComparator(order, orderBy));
  }, [order, orderBy, visibleRows]);

  console.log("selected products: ", searchTerm);

  return (
    <>
      <Paper
        sx={{
          padding: "12px",
          height: "100%",
          boxShadow: "none",
          position: "relative",
        }}
      >
        {!props?.noToolbar && (
          <EnhancedTableToolbar
            numSelected={selected?.length}
            showFilter={props?.showSearch}
            showDots={props?.showDots}
            setSearchTerm={setSearchTerm}
            title={props?.title}
            data={props?.roundData}
            deleteItem={props?.deleteItem}
            showDelete={props?.showDelete}
            showEdit={props?.showEdit}
            add_btn_title={props?.add_btn_title}
            showAdd={props?.showAdd}
            setEditingRound={props?.setEditingRound}
            setIsEditDrawerOpen={props?.setIsEditDrawerOpen}
            setisFoundationEdt={props?.setisFoundationEdt}
            roundData={props?.roundData}
            showTrend={props?.showTrend}
            selectedItems={selected}
            openFormDrawer={props?.openFormDrawer}
            openFormEditDrawer={props?.openFormEditDrawer}
          />
        )}
        {props?.is_loading ? (
          <TableSkeleton />
        ) : (
          <TableContainer style={{ maxHeight: "365px", overflow: "auto" }}>
            <Table aria-labelledby="tableTitle" ref={props?.tableRef}>
              <EnhancedTableHead
                numSelected={selected?.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                showDots={props?.showDots}
                rowCount={props?.tableData?.length}
                header={props?.tableHeader}
                noCheckbox={props?.noCheckbox}
              />
              <TableBody>
                {/* {sortedRows?.map((row, rowIndex) =>
                React.Children.map(props.children, (child) =>
                  React.cloneElement(child, { row, key: rowIndex })
                )
              )} */}

                {React.Children.map(props.children, (child) =>
                  React.cloneElement(child, {
                    row: sortedRows,
                    handleSelect: handleClick,
                    isSelected: isSelected,
                  })
                )}

                {/* {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )} */}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* {sortedRows?.length > 0 && (
        <ReactPaginate
                  previousLabel={"previous"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  pageCount={props?.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={props?.setPageSelected}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
              />
      )} */}
    </>
  );
};

export default GlobalTable;
