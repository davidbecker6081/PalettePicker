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
      project_id: 1
    }
  ]
}
]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del(()))
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};

exports.seed = function(knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('palettes').del() // delete all footnotes first
    .then(() => knex('papers').del()) // delete all papers

    // Now that we have a clean slate, we can re-insert our paper data
    .then(() => {
      return Promise.all([

        // Insert a single paper, return the paper ID, insert 2 footnotes
        knex('papers').insert({
          title: 'Fooo', author: 'Bob', publisher: 'Minnesota'
        }, 'id')
        .then(paper => {
          return knex('footnotes').insert([
            { note: 'Lorem', paper_id: paper[0] },
            { note: 'Dolor', paper_id: paper[0] }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

const createPaper = (knex, paper) => {
  return knex('papers').insert({
    title: paper.title,
    author: paper.author
  }, 'id')
  .then(paperId => {
    let footnotePromises = [];

    paper.footnotes.forEach(footnote => {
      footnotePromises.push(
        createFootnote(knex, {
          note: footnote,
          paper_id: paperId[0]
        })
      )
    });

    return Promise.all(footnotePromises);
  })
};

const createFootnote = (knex, footnote) => {
  return knex('footnotes').insert(footnote);
};

exports.seed = (knex, Promise) => {
  return knex('footnotes').del() // delete footnotes first
    .then(() => knex('papers').del()) // delete all papers
    .then(() => {
      let paperPromises = [];

      papersData.forEach(paper => {
        paperPromises.push(createPaper(knex, paper));
      });

      return Promise.all(paperPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
