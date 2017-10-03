exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('project_Name').unique();
      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('palette_name');
      table.string('palette_color1');
      table.string('palette_color2');
      table.string('palette_color3');
      table.string('palette_color4');
      table.string('palette_color5');
      table.integer('project_id').unsigned()
      table.foreign('project_id')
        .references('projects.id');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
     knex.schema.dropTable('palettes'),
     knex.schema.dropTable('projects')
   ]);
};
