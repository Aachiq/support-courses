import React, { useEffect, useState } from "react";
import { useIndexedDBStore } from "use-indexeddb";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  MenuItem,
  Grid,
  Button,
  Pagination,
  IconButton,
  FormControlLabel,
  Checkbox,
  Stack,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import type { Student } from "../types";

const StudentList: React.FC = () => {
  const { getAll, deleteRecord } = useIndexedDBStore<Student>("students");
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
    if (classFilter) results = results.filter((s) => s.class === classFilter);
    if (groupFilter) results = results.filter((s) => s.group === groupFilter);
    if (subjectFilter)
      results = results.filter((s) => s.subject === subjectFilter);
    if (unpaidFilter) results = results.filter((s) => !s.isPaidCurrentMonth);

    setFiltered(results);
    setCurrentPage(1);
  }, [search, classFilter, groupFilter, subjectFilter, students, unpaidFilter]);

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
    setUnpaidFilter(false);
  };

  const handleDelete = (id: string) => {
    deleteRecord(id)
      .then(() => loadStudents())
      .catch((err: any) => console.error("Delete failed:", err));
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5 }}>
      <Typography
        variant="h4"
        color="primary"
        fontWeight={500}
        textAlign="center"
      >
        Liste des Étudiants
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2, width: "100%" }}>
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          flexWrap="wrap"
        >
          <TextField
            label="Nom"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ maxWidth: 150 }}
          />
          <TextField
            select
            label="Classe"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {classOptions.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Groupe"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {groupOptions.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Matière"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {subjectOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={unpaidFilter}
                onChange={() => setUnpaidFilter(!unpaidFilter)}
              />
            }
            label="Non payés"
          />
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{ minHeight: 56 }}
          >
            Réinitialiser
          </Button>
        </Stack>
      </Card>

      {/* Student List */}
      <Stack spacing={2}>
        {currentStudents.map((s) => (
          <Card key={s.id} variant="outlined">
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box
                component={Link}
                to={`/student/${s.id}`}
                sx={{ textDecoration: "none", flexGrow: 1 }}
              >
                <Typography variant="h6">{`${s.firstName} ${s.lastName}`}</Typography>
                <Typography color="text.secondary">
                  Classe: {s.class} | Groupe: {s.group} | Matière: {s.subject} |{" "}
                  {s.isPaidCurrentMonth ? "Payé ce mois" : "Non payé"}
                </Typography>
              </Box>
              <IconButton onClick={() => handleDelete(s.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Pagination */}
      {totalPages > 0 && (
        <Box mt={3} display="flex" justifyContent="center">
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
