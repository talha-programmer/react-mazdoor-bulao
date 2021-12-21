import { filter } from "lodash";
import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TableHead,
  TableSortLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import { Add, Delete, MoreVert } from "@material-ui/icons";
import { Box } from "@material-ui/core";
import { useEffect } from "react";
import Edit from "@material-ui/icons/Edit";
import { toast } from "react-toastify";
import useJobCategories from "../../../hooks/jobs/useJobCategories";
import CategoryDialog from "./CategoryDialog";
import useDeleteCategory from "../../../hooks/jobs/useDeleteCategory";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "index", label: "Sr.No", alignRight: false },
  { id: "name", label: "Name", alignRight: false }
];

export default function JobCategories() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState();
  let index = 1;
  const { data: jobCategories, isFetched } = useJobCategories();

  function MoreMenu({ categoryId }) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const {
      mutate: mtDelete,
      isSuccess: deleteSuccess,
      isError: deleteError,
      data
    } = useDeleteCategory();

    useEffect(() => {
      if (deleteSuccess) {
        toast.success("Deleted Successfully!");
      }
    }, [mtDelete, deleteSuccess]);

    function deleteCategory() {
      const data = {
        category_id: categoryId
      };
      mtDelete(data);
    }

    return (
      <>
        <IconButton ref={ref} onClick={() => setIsOpen(true)}>
          <MoreVert />
        </IconButton>

        <Menu
          open={isOpen}
          anchorEl={ref.current}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: { width: 200, maxWidth: "100%" }
          }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem sx={{ color: "text.secondary" }} onClick={deleteCategory}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText
              primary="Delete"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem>

          {/* <MenuItem
            component={RouterLink}
            to="#"
            sx={{ color: "text.secondary" }}
          >
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText
              primary="Edit"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem> */}
        </Menu>
      </>
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobCategories.length) : 0;

  useEffect(() => {
    if (isFetched) {
      setFilteredCategories(jobCategories);
    }
  }, [isFetched, jobCategories]);

  function UserListHead({
    order,
    orderBy,
    rowCount,
    headLabel,
    numSelected,
    onRequestSort,
    onSelectAllClick
  }) {
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headLabel.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.alignRight ? "right" : "left"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  return (
    <Container>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        style={{ marginBottom: 30 }}
      >
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Job Categories
          </Typography>
        </Grid>

        <Grid item>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setDialogOpen(true);
            }}
            startIcon={<Add />}
          >
            New Category
          </Button>
        </Grid>
      </Grid>
      {isFetched && filteredCategories && (
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={jobCategories.length}
              />
              <TableBody>
                {filteredCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, name } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="left">{index++}</TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="right">
                          <MoreMenu categoryId={id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={jobCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
      {dialogOpen && (
        <CategoryDialog open={dialogOpen} setOpen={setDialogOpen} />
      )}
    </Container>
  );
}
