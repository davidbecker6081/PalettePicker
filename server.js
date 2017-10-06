//require modules in order to connect server file to database through knex
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

//methods to give app ability to parse json objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//method to tell express to look to the public folder for paths
app.use(express.static(path.join(__dirname, 'public')));

//setting the port for app to whatever the PORT is set to or to the default of 3000
app.set('port', process.env.PORT || 3000);

//setting local database title to Palette Picker
app.locals.title = 'Palette Picker';

//endpoint handler for post method
app.post('/api/projects', (request, response) => {
  //destructuring projectName form the request body
  const { projectName } = request.body;

//looping through the elements in the array given and checking if request body does not contain those keys
  for (let keys of ['projectName']) {
    if (!request.body[keys]) {

      //if a key is not found, return a status of 422 and an error message
      return response
        .status(422)
        .send({ error: `Expected format: { projectName: <String>. You're missing a ${keys} property.`})
    } else {

    }
  }

  //if all keys exist, post new project into database with new format and return everything in the new project object
  database('projects').insert({ project_Name: projectName }, '*')
    .then(project => {
      //return a status of 201 if successful and give back a json object that is the new project object
    return response.status(201).json(project)
    })
    .catch(error => {
      //if error, send back a status of 500 and a json error object
      response.status(500).json({ error })
    })
})

//endpoint handler for post to palettes
app.post('/api/palettes', (request, response) => {
  //destructuring request body
  const { projectId, paletteName, colors } = request.body;

//looping through the elements in the array given and checking if request body does not contain those keys
  for (let requiredParams of ['paletteName', 'colors', 'projectId']) {
    if (!request.body[requiredParams]) {
      //if a key is not found, return a status of 422 and an error message
      return response
        .status(422)
        .send({ error: `Expected format: { projectId: <Integer>, paletteName: <String>, colors: <Array>. You're missing a ${keys} property.` })
    } else if (request.body.colors.length !== 5) {
      //if colors does not have a length of 5, invalid request body, send status of 422 and an error message
      return response
        .status(422)
        .send({ error: `Expected format: { projectId: <Integer>, paletteName: <String>, colors: <Array>. You're missing a color or two.` })
    } else {
      // if do not meet the two criteria above, create an insertObj in the correct format to post
      const insertObj = {
        palette_name: paletteName,
        palette_color1: colors[0],
        palette_color2: colors[1],
        palette_color3: colors[2],
        palette_color4: colors[3],
        palette_color5: colors[4],
        project_id: projectId
      }

      //send insertObj to database to be posted, and return everything from the newly created object
      database('palettes').insert(insertObj, '*')
      .then(palette => {
        //return response status of 201 and json object of newly created palette data
        return response.status(201).json(palette)
      })
      .catch(error => {
        //if error, send back a status of 500 and a json error object
        response.status(500).json({ error })
      })
    }
  }


})

//endpoint handler for a get request to projects
app.get('/api/projects', (request, response) => {
  //ask database for all projects and give back in an order by id
  database('projects').select().orderBy('id')
    .then(projects => {
      if (!projects) {
        //if no projects were found, return a status of 404
        return response.status(404)
      }
      //otherwise return a status of 200 success and a json object with all of the project data
      response.status(200).json(projects)
    })
    .catch(error => {
      //if error, send back a status of 500 and a json error object
      response.status(500).json({ error })
    })
})

//endpoint handler for a get request for a specific project's palettes (by project id)
app.get('/api/projects/:id/palettes', (request, response) => {
  //request to the database for all palettes where the project_id of a palette in the database matches the request paramater given
  database('palettes')
    .where('project_id', request.params.id)
    .select()
    .then(palettes => {
      if (palettes.length === 0){
        //if no palettes found with the id, send status of 404 (Not-Found)
        return response.sendStatus(404)
      }
      //otherwise send back status of 200 and the palette that was found
      return response.status(200).json(palettes)
    })
    // .then(palettes => {
    //   response.status(200).json(palettes)
    // })
    .catch(error => {
      //if error, send back a status of 500 and a json error object
      response.status(500).json({ error })
    })
})

//endpoint handler for getting a specific palette by palette id
app.get('/api/palettes/:id', (request, response) => {
  //destructuring the request parameters in order to grab the palette id
  const { id } = request.params;

//request to the database where the palette id matches the request parameter id
  database('palettes')
    .where('id', id)
    .select()
    .then(palettes => {
      if (palettes.length === 0) {
        //if no palettes found with the id, send status of 404 (Not-Found)
        return response.status(404)
          // .send({ error: `It doesnt seem like you have any palettes with that id :-(` })
      }
      //otherwise return the palette
      return palettes
    })
    .then(palettes => {
      //when success send back status of 200 and the palette that was found
      return response.status(200).json(palettes)
    })
    .catch(error => {
      //if error, send back a status of 500 and a json error object
      response.status(500).json({ error })
    })
})

//endpoint handler for deleting a palette with a specific palette id
app.delete('/api/palettes/:id', (request, response) => {
  //destructuring the request parameters to get the id of the palette user wants to delete
  const { id } = request.params;

//request to database to delete a palette in palettes table that matches the id of the request paramaters
  database('palettes')
    .where('id', id)
    .del()
    .then((length) => {
      //if a palette is found, send status of 204 (No-Content)
      //if no palette found with the id, send back status of 422 and error message
      return length
        ? response.sendStatus(204)
        : response.status(422).send({ error: 'nothing to delete with that id' })
    })
    .catch(error => {
      //if error, send back a status of 500 and a json error object
      response.status(500).json({ error })
    })
})

//app should listen for start of server
//when app recieves the port information at start of server, log a message that has title and port app is running on
app.listen(app.get('port'), () => {
	console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

//export app
module.exports = app;
