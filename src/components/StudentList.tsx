import React, { useEffect, useState } from "react";
import { useIndexedDBStore } from "use-indexeddb";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Student } from "../types";

const StudentList: React.FC = () => {
  const { getAll } = useIndexedDBStore<Student>("students");
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    getAll().then(setStudents);
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Student List
      </Typography>
      <List>
        {students.map((s) => (
          <React.Fragment key={s.id}>
            <ListItem component={Link} to={`/student/${s.id}`}>
              <ListItemText
                primary={`${s.firstName} ${s.lastName}`}
                secondary={`Class: ${s.class} | Group: ${s.group}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default StudentList;
