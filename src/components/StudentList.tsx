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
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Student } from "../types";

const StudentList: React.FC = () => {
  const { getAll } = useIndexedDBStore<Student>("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    getAll().then((data) => {
      setStudents(data);
      setFiltered(data);
    });
  }, []);

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

    setFiltered(results);
    setCurrentPage(1); // Reset when filters change
  }, [search, classFilter, groupFilter, subjectFilter, students]);

  const classOptions = Array.from(new Set(students.map((s) => s.class)));
  const groupOptions = Array.from(new Set(students.map((s) => s.group)));
  const subjectOptions = Array.from(new Set(students.map((s) => s.subject)));

  const totalPages = Math.ceil(filtered.length / studentsPerPage);
  const startIdx = (currentPage - 1) * studentsPerPage;
  const currentStudents = filtered.slice(startIdx, startIdx + studentsPerPage);

  const clearFilters = () => {
    setSearch("");
    setClassFilter("");
    setGroupFilter("");
    setSubjectFilter("");
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Student List
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
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
        </Grid>
        <Grid item xs={12} sm={2}>
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
        </Grid>
        <Grid item xs={12} sm={2}>
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
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            onClick={clearFilters}
            variant="outlined"
            fullWidth
            sx={{ height: "100%" }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>

      <List>
        {currentStudents.map((s) => (
          <React.Fragment key={s.id}>
            <ListItem button component={Link} to={`/student/${s.id}`}>
              <ListItemText
                primary={`${s.firstName} ${s.lastName}`}
                secondary={`Class: ${s.class} | Group: ${s.group} | Matière: ${s.subject}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {totalPages > 1 && (
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
