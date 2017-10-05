const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.post('/api/projects', (request, response) => {
  const { projectName } = request.body;

  for (let keys of ['projectName']) {
    if (!request.body[keys]) {
      return response
        .status(422)
        .send({ error: `Expected format: { projectName: <String>. You're missing a ${keys} property.`})
    }
  }

  database('projects').insert({ project_Name: projectName }, '*')
    .then(project => {
      response.status(201).json(project)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/palettes', (request, response) => {
  const { projectId, paletteName, colors } = request.body;
  const insertObj = {
    palette_name: paletteName,
    palette_color1: colors[0],
    palette_color2: colors[1],
    palette_color3: colors[2],
    palette_color4: colors[3],
    palette_color5: colors[4],
    project_id: projectId
  }

  for (let requiredParams of ['paletteName', 'colors', 'projectId']) {
    if (!request.body[requiredParams]) {
      return response
        .status(422)
        .send({ error: `Expected format: { projectId: <Integer>, paletteName: <String>, colors: <Array>. You're missing a ${keys} property.` })
    } else if (request.body.colors.length !== 5) {
      return response
        .status(422)
        .send({ error: `Expected format: { projectId: <Integer>, paletteName: <String>, colors: <Array>. You're missing a color or two.` })
    }
  }

  database('palettes').insert(insertObj, '*')
    .then(project => {
      response.status(201).json(project)
    })
    .catch(error => {
      response.status(500).json({ error })
    })

})

app.get('/api/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/projects/:id/palettes', (request, response) => {
  database('palettes')
    .where('project_id', request.params.id)
    .select()
    .then(palettes => {
      if (palettes.length === 0){
        return response
          .status(404)
          .send({ error: `It doesnt seem like you have any palettes in that project :-(` })
      }
      return palettes
    })
    .then(palettes => {
      response.status(200).json(palettes)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/palettes/:id', (request, response) => {
  const { id } = request.params;
  // console.log('tag', request.params);
  //
  // if (!request.params){
  //   console.log('error');
  //   return response
  //     .status(422)
  //     .send({ error: `It doesnt seem like you have any palettes with that id :-(` })
  // }

  database('palettes')
    .where('id', id)
    .del()
    .then((length) => {
      length
        ? response.sendStatus(204)
        : response.status(422).send({ error: 'nothing to delete with that id' })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.listen(app.get('port'), () => {
	console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
