import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useIndexedDBStore } from "use-indexeddb";
import { Typography, List, ListItem, Box, Button } from "@mui/material";
import type { Student } from "../types";

const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const StudentDetails: React.FC = () => {
  const { id } = useParams();
  const { getByID } = useIndexedDBStore<Student>("students");
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (id) {
      getByID(id).then(setStudent);
    }
  }, [id]);

  if (!student) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4">
        {student.firstName} {student.lastName}
      </Typography>
      <Typography>
        <b>Class:</b> {student.class}
      </Typography>
      <Typography>
        <b>Group:</b> {student.group}
      </Typography>

      <Typography mt={2}>
        <b>Paid Months:</b>
      </Typography>
      <List>
        {student.paidMonths.map((m) => (
          <ListItem key={m}>{MONTHS_FULL[m - 1]}</ListItem>
        ))}
      </List>

      <Button component={Link} to="/" sx={{ mt: 2 }}>
        ← Back
      </Button>
    </Box>
  );
};

export default StudentDetails;
