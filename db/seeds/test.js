let projectsData = [{
  project_Name: 'Project1',
  id: 1,
  palettes: [
    {
      palette_name: 'Travis',
      palette_color1: '#FFFFFF',
      palette_color2: '#FFFFFF',
      palette_color3: '#FFFFFF',
      palette_color4: '#FFFFFF',
      palette_color5: '#FFFFFF',
      project_id: 1
    },
    {
      palette_name: 'Travis2',
      palette_color1: '#000000',
      palette_color2: '#FFFFFF',
      palette_color3: '#000000',
      palette_color4: '#FFFFFF',
      palette_color5: '#000000',
      project_id: 1
    }
  ]
},
{
  project_Name: 'Project2',
  id: 2,
  palettes: [
    {
      palette_name: 'Dave',
      palette_color1: '#FF4F6F',
      palette_color2: '#F7AAF7',
      palette_color3: '#FFFFFF',
      palette_color4: '#FF45F0',
      palette_color5: '#FFFFFF',
      project_id: 2
    }
  ]
}
]

const createProject = (knex, project) => {
  return knex('projects').insert({
    project_Name: project.project_Name,
    id: project.id,
  })
  .then(() => {
    let palettePromises = [];

    project.palettes.forEach(palette => {
      palettePromises.push(createPalette(knex, palette))
    })

    return Promise.all(palettePromises);
  })
}

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del(()))
    .then(() => {
      // Inserts seed entries
      let projectPromises = [];

      projectsData.forEach(project => {
        projectPromises.push(createProject(knex, project))
      });

      return Promise.all(projectPromises)
    })
    .then(() => console.log('Seeding is complete'))
    .catch(error => console.log(`Error seeding data: ${error}`))
};
