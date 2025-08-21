import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  MenuItem,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useIndexedDBStore } from "use-indexeddb";
import type { Student } from "../types";

const subjects = ["Math", "Physique", "Français"];

const StudentForm: React.FC = () => {
  const { add } = useIndexedDBStore<Student>("students");
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student>({
    id: uuidv4(),
    firstName: "",
    lastName: "",
    class: "",
    group: "",
    subject: "",
    paidMonths: [],
    isPaidCurrentMonth: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add(student).then(() => {
      navigate("/");
    });
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Create Student
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Prénom"
              value={student.firstName}
              onChange={(e) =>
                setStudent({ ...student, firstName: e.target.value })
              }
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Nom"
              value={student.lastName}
              onChange={(e) =>
                setStudent({ ...student, lastName: e.target.value })
              }
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Classe"
              value={student.class}
              onChange={(e) =>
                setStudent({ ...student, class: e.target.value })
              }
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Groupe"
              value={student.group}
              onChange={(e) =>
                setStudent({ ...student, group: e.target.value })
              }
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              select
              label="Matière"
              value={student.subject}
              onChange={(e) =>
                setStudent({ ...student, subject: e.target.value })
              }
              fullWidth
              required
            >
              <MenuItem
                value=""
                onClick={() => setStudent({ ...student, subject: "" })}
              >
                All
              </MenuItem>
              {subjects.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.isPaidCurrentMonth}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      isPaidCurrentMonth: e.target.checked,
                      paidMonths: [
                        ...student.paidMonths,
                        new Date().getMonth() + 1,
                      ],
                    })
                  }
                />
              }
              label="Has paid current month"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" type="submit">
              Créer
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default StudentForm;
