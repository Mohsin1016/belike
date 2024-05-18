const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const admin = require("./routes/admin.routes");
const teacher = require("./routes/teacher.routes");
const student = require("./routes/student.routes");
const userRoutes = require('./routes/userRoutes');
app.use("/api/v1/admin/", admin);
app.use("/api/v1/teacher/", teacher);
app.use("/api/v1/student", student);
app.use('/api/users', userRoutes);
module.exports = app;
