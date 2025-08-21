import React, { useEffect, useState } from "react";
import { useIndexedDBStore } from "use-indexeddb";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  TextField,
  MenuItem,
  Grid,
  Button,
  Pagination,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import type { Student } from "../types";

const StudentList: React.FC = () => {
  const { getAll, deleteRecord } = useIndexedDBStore<Student>("students"); // add deleteRecord here
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [unpaidFilter, setUnpaidFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    getAll().then((data) => {
      setStudents(data);
      setFiltered(data);
    });
  };

  useEffect(() => {
    let results = [...students];

    if (search) {
      results = results.filter((s) =>
        `${s.firstName} ${s.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (classFilter) {
      results = results.filter((s) => s.class === classFilter);
    }

    if (groupFilter) {
      results = results.filter((s) => s.group === groupFilter);
    }

    if (subjectFilter) {
      results = results.filter((s) => s.subject === subjectFilter);
    }

    if (unpaidFilter) {
      // const currentMonthPaid = students.filter((s) => s.isPaidCurrentMonth).length;
      const unpaidStudents = students.filter(
        (s) => s.isPaidCurrentMonth === false
      );
      results = unpaidStudents;
    }
    setFiltered(results);
    setCurrentPage(1); // Reset when filters change
  }, [search, classFilter, groupFilter, subjectFilter, students, unpaidFilter]);

  const classOptions = Array.from(new Set(students.map((s) => s.class)));
  const groupOptions = Array.from(new Set(students.map((s) => s.group)));
  const subjectOptions = Array.from(new Set(students.map((s) => s.subject)));
  const isPaidOptions = ["Payé", "Non Payé"];

  const totalPages = Math.ceil(filtered.length / studentsPerPage);
  const startIdx = (currentPage - 1) * studentsPerPage;
  const currentStudents = filtered.slice(startIdx, startIdx + studentsPerPage);

  const clearFilters = () => {
    setSearch("");
    setClassFilter("");
    setGroupFilter("");
    setSubjectFilter("");
    setUnpaidFilter(false);
  };

  // Delete handler
  const handleDelete = (id: string) => {
    deleteRecord(id)
      .then(() => {
        loadStudents(); // reload students after delete
      })
      .catch((err: any) => {
        console.error("Delete failed:", err);
      });
  };

  return (
    <Box marginY={2}>
      <Typography variant="h5">Liste Des Etudiants</Typography>

      <Box
        sx={{
          display: "flex",
          magrin: 10,
        }}
      >
        <Box flex={1}>
          <TextField
            label="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>
        <Box flex={1}>
          <TextField
            select
            label="Filter by class"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {classOptions.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box flex={1}>
          <TextField
            select
            label="Filter by group"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {groupOptions.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box flex={1}>
          <TextField
            select
            label="Filter by matière"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {subjectOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box flex={1} marginLeft={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={unpaidFilter}
                onChange={() => setUnpaidFilter(!unpaidFilter)}
              />
            }
            label="Non Payés"
          />
        </Box>
        <Box>
          <Button
            onClick={clearFilters}
            variant="outlined"
            fullWidth
            sx={{ height: "100%" }}
          >
            Reset
          </Button>
        </Box>
      </Box>

      <List>
        {currentStudents.map((s) => (
          <React.Fragment key={s.id}>
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(s.id)}
                  size="large"
                >
                  <DeleteIcon color="error" />
                </IconButton>
              }
              component={Link}
              to={`/student/${s.id}`}
            >
              <ListItemText
                primary={`${s.firstName} ${s.lastName}`}
                secondary={`Class: ${s.class} | Group: ${s.group} | Matière: ${s.subject}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {totalPages > 0 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default StudentList;
