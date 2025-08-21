import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useIndexedDBStore } from "use-indexeddb";
import { Typography, List, ListItem, Box, Button } from "@mui/material";
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

  useEffect(() => {
    if (id) {
      getByID(id).then(setStudent);
    }
  }, [id]);

  // Handler to add payment for current month
  const handleAddPayment = async () => {
    if (!student) return;

    const currentMonth = new Date().getMonth() + 1; // months are 0-based
    if (!student.paidMonths.includes(currentMonth)) {
      const updatedStudent = {
        ...student,
        paidMonths: [...student.paidMonths, currentMonth],
      };

      // update in DB
      await update(updatedStudent);

      // update state
      setStudent(updatedStudent);
    }
    alert("Déja payé ce mois !");
  };

  if (!student) return <Typography>En cours...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mt: 5 }}>
      <Typography variant="h4">
        {student.firstName} {student.lastName}
      </Typography>
      <Typography>
        <b>Classe:</b> {student.class}
      </Typography>
      <Typography>
        <b>Matière:</b> {student.subject}
      </Typography>
      <Typography>
        <b>Groupe:</b> {student.group}
      </Typography>

      <Typography mt={2}>
        <b>Paid Months:</b>
      </Typography>
      <List>
        {student.paidMonths.map((m) => (
          <ListItem key={m}>{MONTHS_FULL[m - 1]}</ListItem>
        ))}
      </List>

      <Button onClick={handleAddPayment} variant="contained" sx={{ mt: 2 }}>
        Payer Ce mois
      </Button>

      <Button component={Link} to="/" sx={{ mt: 2, ml: 2 }}>
        ← Back
      </Button>
    </Box>
  );
};

export default StudentDetails;
