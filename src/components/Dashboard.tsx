import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { useIndexedDBStore } from "use-indexeddb";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { Student } from "../types";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { getAll } = useIndexedDBStore<Student>("students");
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    getAll().then((data) => setStudents(data));
  }, []);

  const totalStudents = students.length;

  // const studentsByClass = students.reduce((acc: Record<string, number>, s) => {
  //   acc[s.class] = (acc[s.class] || 0) + 1;
  //   return acc;
  // }, {});

  // const studentsBySubject = students.reduce(
  //   (acc: Record<string, number>, s) => {
  //     acc[s.subject] = (acc[s.subject] || 0) + 1;
  //     return acc;
  //   },
  //   {}
  // );

  const currentMonthPaid = students.filter((s) => s.isPaidCurrentMonth).length;
  const currentMonthUnpaid = students.filter(
    (s) => s.isPaidCurrentMonth === false
  ).length;
  // const currentMonthUnpaid = totalStudents - currentMonthPaid;

  // const totalPaidMonths = students.reduce(
  //   (sum, s) => sum + s.paidMonths.length,
  //   0
  // );

  return (
    <Grid container spacing={4} justifyContent={"center"}>
      {/* Stats Summary */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">Nombre Etudiants</Typography>
          <Typography variant="h4">{totalStudents}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">Payés Ce Mois</Typography>
          <Typography variant="h4" color="green">
            {currentMonthPaid}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">Non Payés Ce Mois</Typography>
          <Typography variant="h4" color="red">
            {currentMonthUnpaid}
          </Typography>
        </Paper>
      </Grid>
      {/* <Grid item xs={12} md={3}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">Total Paid Months</Typography>
          <Typography variant="h4">{totalPaidMonths}</Typography>
        </Paper>
      </Grid> */}

      {/* Bar Chart: Students by Class */}
      {/* Pie Chart: Students by Subject */}
      {/* <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Students by Class
            </Typography>
            <Bar
              data={{
                labels: Object.keys(studentsByClass),
                datasets: [
                  {
                    label: "Number of Students",
                    data: Object.values(studentsByClass),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Students by Matière
            </Typography>
            <Pie
              data={{
                labels: Object.keys(studentsBySubject),
                datasets: [
                  {
                    label: "Students",
                    data: Object.values(studentsBySubject),
                    backgroundColor: [
                      "#f44336",
                      "#3f51b5",
                      "#4caf50",
                      "#ff9800",
                      "#9c27b0",
                    ],
                  },
                ],
              }}
            />
          </Paper>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;
