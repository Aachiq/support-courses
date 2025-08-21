import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  MenuItem,
  Card,
  CardContent,
  Stack,
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
    add(student).then(() => navigate("/"));
  };

  // Handle checkbox change for current month payment
  const handlePaidCurrentMonthChange = (checked: boolean) => {
    const currentMonth = new Date().getMonth() + 1;
    setStudent((prev) => ({
      ...prev,
      isPaidCurrentMonth: checked,
      paidMonths: checked
        ? Array.from(new Set([...prev.paidMonths, currentMonth]))
        : prev.paidMonths.filter((m) => m !== currentMonth),
    }));
  };

  return (
    <Card sx={{ maxWidth: 700, mx: "auto", mt: 5, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom textAlign="center">
          Créer un étudiant
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
                <MenuItem value="">
                  <em>-- Sélectionner --</em>
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
                      handlePaidCurrentMonthChange(e.target.checked)
                    }
                  />
                }
                label="Paiement du mois en cours"
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" type="submit">
                  Créer
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                  color="secondary"
                >
                  Annuler
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
