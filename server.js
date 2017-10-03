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
  const { projectName } = request.body

  database('projects').insert({ project_Name: projectName }, '*')
    .then(project => {
      console.log('good');
      response.status(201).json(project)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

// for (let requiredParameter of ['title', 'author']) {
//   if (!paper[requiredParameter]) {
//     return response
//       .status(422)
//       .send({ error: `Expected format: { title: <String>, author: <String> }. You're missing a "${requiredParameter}" property.` });
//   }
// }
//
// database('papers').insert(paper, 'id')
//   .then(paper => {
//     response.status(201).json({ id: paper[0] })
//   })
//   .catch(error => {
//     response.status(500).json({ error });
//   });


app.listen(app.get('port'), () => {
	console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
