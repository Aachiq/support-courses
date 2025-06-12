import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useIndexedDBStore } from "use-indexeddb";
import type { Student } from "../types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const StudentForm: React.FC = () => {
  const navigate = useNavigate();
  const { add } = useIndexedDBStore<Student>("students");

  const [form, setForm] = useState<Omit<Student, "id">>({
    firstName: "",
    lastName: "",
    class: "",
    group: "",
    paidMonths: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMonth = (month: number) => {
    setForm((prev) => ({
      ...prev,
      paidMonths: prev.paidMonths.includes(month)
        ? prev.paidMonths.filter((m) => m !== month)
        : [...prev.paidMonths, month],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = { id: uuidv4(), ...form };
    await add(newStudent);
    navigate("/");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: "auto" }}
    >
      <Typography variant="h5" gutterBottom>
        Add Student
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Class"
            name="class"
            value={form.class}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Group"
            name="group"
            value={form.group}
            onChange={handleChange}
            required
          />
        </Grid>
      </Grid>

      <Typography sx={{ mt: 2 }}>Paid Months:</Typography>
      <FormGroup row>
        {MONTHS.map((m, i) => (
          <FormControlLabel
            key={i}
            control={
              <Checkbox
                checked={form.paidMonths.includes(i + 1)}
                onChange={() => toggleMonth(i + 1)}
              />
            }
            label={m}
          />
        ))}
      </FormGroup>

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Save
      </Button>
    </Box>
  );
};

export default StudentForm;
