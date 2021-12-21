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
import useUsers from "../../../hooks/admin/useUsers";
import { useEffect } from "react";
import { userTypesStrings } from "../../../config/enums/userTypes";
import CreateUserDialog from "./CreateUserDialog";
import Edit from "@material-ui/icons/Edit";
import useDeleteUser from "../../../hooks/user/useDeleteUser";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "username", label: "Username", alignRight: false },
  { id: "type", label: "Type", alignRight: false },
  { id: "phone", label: "Phone", alignRight: false },
  { id: "location", label: "Location", alignRight: false },
  { id: "" }
];

export default function Users() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState();

  const { data: users, isFetched } = useUsers();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  function UserMoreMenu({ userId }) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const {
      mutate: mtDelete,
      isSuccess: deleteSuccess,
      isError: deleteError,
      data
    } = useDeleteUser();

    useEffect(() => {
      if (deleteSuccess) {
        toast.success("Deleted Successfully!");
      }
    }, [mtDelete, deleteSuccess]);

    function deleteUser() {
      const data = {
        user_id: userId
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
          <MenuItem sx={{ color: "text.secondary" }} onClick={deleteUser}>
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  useEffect(() => {
    if (isFetched) {
      setFilteredUsers(users);
    }
  }, [isFetched, users]);

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
            Users
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
            New User
          </Button>
        </Grid>
      </Grid>
      {isFetched && filteredUsers && (
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, name, email, username, location } = row;
                    const phone = row?.phone_number;
                    const type = userTypesStrings[row.user_type];
                    const avatarUrl = row?.profile_image?.image_thumbnail_url;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell component="th" scope="row" padding="default">
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Grid item>
                              <Avatar alt={name} src={avatarUrl} />
                            </Grid>

                            <Grid item>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{username}</TableCell>
                        <TableCell align="left">{type}</TableCell>
                        <TableCell align="left">{phone}</TableCell>
                        <TableCell align="left">{location}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu userId={id} />
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
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
      {dialogOpen && (
        <CreateUserDialog open={dialogOpen} setOpen={setDialogOpen} />
      )}
    </Container>
  );
}
