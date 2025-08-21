import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useIndexedDBStore } from "use-indexeddb";
import {
  Typography,
  Box,
  Button,
  TextField,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
} from "@mui/material";
import type { Student } from "../types";

const MONTHS_FULL = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const StudentDetails: React.FC = () => {
  const { id } = useParams();
  const { getByID, update } = useIndexedDBStore<Student>("students");
  const [student, setStudent] = useState<Student | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);

  const [monthDialogOpen, setMonthDialogOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);

  useEffect(() => {
    if (id) {
      getByID(id).then((s) => {
        setStudent(s);
        setEditedStudent(s);
      });
    }
  }, [id]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedStudent(student);
  };

  const handleSave = async () => {
    if (editedStudent) {
      await update(editedStudent);
      setStudent(editedStudent);
      setEditMode(false);
    }
  };

  const handleDeleteMonth = async (month: number) => {
    if (!student) return;
    const updatedStudent = {
      ...student,
      paidMonths: student.paidMonths.filter((m) => m !== month),
    };
    await update(updatedStudent);
    setStudent(updatedStudent);
    setEditedStudent(updatedStudent);
  };

  const handleAddSelectedMonths = async () => {
    if (!student) return;
    const monthsToAdd = selectedMonths.filter(
      (m) => !student.paidMonths.includes(m)
    );
    if (monthsToAdd.length === 0) {
      alert("Tous les mois sélectionnés sont déjà payés !");
      return;
    }
    const updatedStudent = {
      ...student,
      paidMonths: [...student.paidMonths, ...monthsToAdd].sort((a, b) => a - b),
    };
    await update(updatedStudent);
    setStudent(updatedStudent);
    setEditedStudent(updatedStudent);
    setSelectedMonths([]);
    setMonthDialogOpen(false);
  };

  const handleAddCurrentMonth = async () => {
    if (!student) return;

    const currentMonth = new Date().getMonth() + 1;
    if (student.paidMonths.includes(currentMonth)) {
      alert("Déjà payé ce mois !");
      return;
    }

    const updatedStudent = {
      ...student,
      paidMonths: [...student.paidMonths, currentMonth].sort((a, b) => a - b),
    };
    await update(updatedStudent);
    setStudent(updatedStudent);
    setEditedStudent(updatedStudent);
  };

  if (!student || !editedStudent)
    return <Typography textAlign="center">En cours...</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5 }}>
      <Card sx={{ p: 3, boxShadow: 4 }}>
        <CardContent>
          {!editMode ? (
            <>
              {/* Student Info */}
              <Typography variant="h4" gutterBottom>
                {student.firstName} {student.lastName}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <b>Classe:</b> {student.class}
              </Typography>
              <Typography>
                <b>Matière:</b> {student.subject}
              </Typography>
              <Typography>
                <b>Groupe:</b> {student.group}
              </Typography>

              {/* Paid Months */}
              <Typography mt={2}>
                <b>Mois payés:</b>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                {student.paidMonths.map((m) => (
                  <Chip
                    key={m}
                    label={MONTHS_FULL[m - 1]}
                    onDelete={() => handleDeleteMonth(m)}
                    // color="success"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>

              {/* Buttons */}
              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddCurrentMonth}
                >
                  Payer ce mois
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setMonthDialogOpen(true)}
                >
                  Ajouter mois(s) spécifique(s)
                </Button>
                <Button variant="outlined" onClick={toggleEditMode}>
                  Modifier
                </Button>
                <Button
                  component={Link}
                  to="/"
                  variant="text"
                  color="secondary"
                >
                  ← Retour
                </Button>
              </Stack>
            </>
          ) : (
            <>
              {/* Edit Form */}
              <Typography variant="h5" gutterBottom>
                Modifier l'étudiant
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Prénom"
                  value={editedStudent.firstName}
                  fullWidth
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      firstName: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Nom"
                  value={editedStudent.lastName}
                  fullWidth
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      lastName: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Classe"
                  value={editedStudent.class}
                  fullWidth
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      class: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Groupe"
                  value={editedStudent.group}
                  fullWidth
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      group: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Matière"
                  value={editedStudent.subject}
                  fullWidth
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      subject: e.target.value,
                    })
                  }
                />

                <Stack direction="row" spacing={2} justifyContent="flex-start">
                  <Button variant="contained" onClick={handleSave}>
                    Sauvegarder
                  </Button>
                  <Button variant="outlined" onClick={toggleEditMode}>
                    Annuler
                  </Button>
                </Stack>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog for selecting multiple months */}
      <Dialog
        open={monthDialogOpen}
        onClose={() => setMonthDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Sélectionner les mois à payer</DialogTitle>
        <DialogContent>
          <Stack spacing={1} mt={1}>
            {MONTHS_FULL.map((monthName, index) => {
              const monthNumber = index + 1;
              return (
                <FormControlLabel
                  key={monthNumber}
                  control={
                    <Checkbox
                      checked={selectedMonths.includes(monthNumber)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMonths([...selectedMonths, monthNumber]);
                        } else {
                          setSelectedMonths(
                            selectedMonths.filter((m) => m !== monthNumber)
                          );
                        }
                      }}
                    />
                  }
                  label={monthName}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMonthDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAddSelectedMonths}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentDetails;
