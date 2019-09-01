const express = require("express");

const app = express();

app.use(express.json());

const findIndexById = id => projects.findIndex(projectId => projectId.id == id);
const findIndexByTitle = title =>
  projects.findIndex(projectTitle => projectTitle.title == title);

function isIdInUse(req, res, next) {
  let unusedId = projects.length + 1;
  let indice = findIndexById(unusedId);
  while (indice != -1) {
    unusedId++;
    indice = findIndexById(unusedId);
  }

  req.params.unusedId = unusedId;
  return next();
}

function chkIfIdExists(req, res, next) {
  const { id } = req.params;
  const indice = findIndexById(id);
  if (indice == -1) {
    return res.status(400).json({
      error: "Id does not exist. Please check if project has not been removed."
    });
  }
  req.params.index = indice;
  return next();
}

const projects = [
  {
    id: "1",
    title: "Software Architecture",
    tasks: ["First Task", "Second Task"]
  },
  {
    id: "2",
    title: "UME Architecture",
    tasks: []
  },
  {
    id: "3",
    title: "Program Architecture",
    tasks: []
  }
];
let numberOfCalls = 0;
app.use((req, res, next) => {
  numberOfCalls++;
  console.log("Number of Calls made: " + numberOfCalls);
  return next();
});

app.post("/projects", isIdInUse, (req, res) => {
  const id = req.params.unusedId.toString();
  const { title } = req.body;
  const tasks = [];

  projects.push({ id, title, tasks });
  if (!req.body.title) {
    return res.status(400).json({ error: "Please add the Project's title." });
  }
  if (findIndexByTitle(title) != -1) {
    return res.status(200).json({ message: "Project successfully added." });
  }
  return res.status(400).json({ error: "Unexpected error." });
});

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.put("/projects/:id", chkIfIdExists, (req, res) => {
  const { title } = req.body;

  if (!req.body.title) {
    return res.status(400).json({ error: "Please add the Project's title." });
  }

  projects[req.params.index].title = title;

  return res
    .status(200)
    .json({ message: "Project's title changed successfully." });
});

app.delete("/projects/:id", chkIfIdExists, (req, res) => {
  const { id } = req.params;

  const indice = findIndexById(id);

  projects.splice(indice, 1);

  return res.json(projects);
});

app.post("/projects/:id/tasks", chkIfIdExists, (req, res) => {
  const { id } = req.params;

  const { taskTitle } = req.body;

  if (!req.body.title) {
    return res.status(400).json({ error: "Please add the Task's title." });
  }

  const indice = findIndexById(id);

  projects[indice].tasks.push(taskTitle);

  return res.json(projects);
});

app.listen(3334);
