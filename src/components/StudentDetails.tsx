import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useIndexedDBStore } from "use-indexeddb";
import {
  Typography,
  List,
  ListItem,
  Box,
  Button,
  TextField,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Stack,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedStudent(student);
  };

  // Save edited student info
  const handleSave = async () => {
    if (editedStudent) {
      await update(editedStudent);
      setStudent(editedStudent);
      setEditMode(false);
    }
  };

  // Delete a paid month
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

  // Add specific months (multi-select)
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

  // Handler to add payment for current month
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

  if (!student || !editedStudent) return <Typography>En cours...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mt: 5 }}>
      <Typography variant="h4">
        {student.firstName} {student.lastName}
      </Typography>

      {editMode ? (
        <>
          <TextField
            label="Prénom"
            value={editedStudent.firstName}
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) =>
              setEditedStudent({ ...editedStudent, firstName: e.target.value })
            }
          />
          <TextField
            label="Nom"
            value={editedStudent.lastName}
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) =>
              setEditedStudent({ ...editedStudent, lastName: e.target.value })
            }
          />
          <TextField
            label="Classe"
            value={editedStudent.class}
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) =>
              setEditedStudent({ ...editedStudent, class: e.target.value })
            }
          />
          <TextField
            label="Groupe"
            value={editedStudent.group}
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) =>
              setEditedStudent({ ...editedStudent, group: e.target.value })
            }
          />
          <TextField
            label="Matière"
            value={editedStudent.subject}
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) =>
              setEditedStudent({ ...editedStudent, subject: e.target.value })
            }
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
            Sauvegarder
          </Button>
          <Button sx={{ mt: 2, ml: 2 }} onClick={toggleEditMode}>
            Annuler
          </Button>
        </>
      ) : (
        <Button variant="outlined" sx={{ mt: 2 }} onClick={toggleEditMode}>
          Modifier Étudiant
        </Button>
      )}

      <Typography mt={4}>
        <b>Mois payés:</b>
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
        {student.paidMonths.map((m) => (
          <Chip
            key={m}
            label={MONTHS_FULL[m - 1]}
            onDelete={() => handleDeleteMonth(m)}
            // color="secondary"
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>

      <Button
        onClick={handleAddCurrentMonth}
        variant="contained"
        sx={{ mt: 2 }}
      >
        Payer ce mois
      </Button>
      <Button
        onClick={() => setMonthDialogOpen(true)}
        variant="outlined"
        sx={{ mt: 2, ml: 2 }}
      >
        Ajouter mois(s) spécifique(s)
      </Button>

      {/* Dialog to select multiple months */}
      <Dialog open={monthDialogOpen} onClose={() => setMonthDialogOpen(false)}>
        <DialogTitle>Sélectionner les mois à payer</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMonthDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleAddSelectedMonths}>Ajouter</Button>
        </DialogActions>
      </Dialog>

      <Button component={Link} to="/" sx={{ mt: 2, ml: 2 }}>
        ← Retour
      </Button>
    </Box>
  );
};

export default StudentDetails;
