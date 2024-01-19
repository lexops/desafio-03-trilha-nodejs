const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepoIdExists(request, response, next){
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if(!repository){
    return response.status(404).json({error: 'Repository not found.'})
  }

  request.repository = repository;

  return next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  // const repoExists = repositories.some((repo) => repo.url === url);

  // if(repoExists){
  //   return response.status(400).json({error: 'Repo already exists.'})
  // }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

// app.use(checkRepoIdExists);

app.put("/repositories/:id", checkRepoIdExists, (request, response) => {
  const { title, url, techs } = request.body;
  const { repository } = request;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepoIdExists, (request, response) => {
  const { repository } = request;

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
