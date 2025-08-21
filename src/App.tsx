import { Routes, Route, Link } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import StudentDetails from "./components/StudentDetails";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Box>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cours du Soir
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/add">
            Add Student
          </Button>
        </Toolbar>
      </AppBar>
      <Dashboard />
      <Container>
        <Routes>
          <Route path="/" element={<StudentList />} />
          <Route path="/add" element={<StudentForm />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
