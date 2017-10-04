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

// app.get('/api/v1/papers', (request, response) => {
//   database('papers').select()
//     .then((papers) => {
//       response.status(200).json(papers);
//     })
//     .catch((error) => {
//       response.status(500).json({ error });
//     });
// });

app.listen(app.get('port'), () => {
	console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
