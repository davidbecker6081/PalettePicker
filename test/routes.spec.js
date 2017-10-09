const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

before(done => {
  database.migrate.latest()
    .then(() => database.seed.run())
    .then(() => done())
    .catch(error => console.log(error))
});

describe('Client Routes', () => {
	it('should return the homepage with text', done => {
		chai
			.request(server)
			.get('/')
			.end((error, response) => {
				response.should.have.status(200);
				response.should.be.html;
				response.res.text.should.include('PalettePicker');
				done();
			});
	});

	it("should return a 404 error if the path doesn't exist", done => {
		chai
			.request(server)
			.get('/wrong')
			.end((error, response) => {
				response.should.have.status(404);
				done();
			});
	});
});

describe('API Routes', () => {

  beforeEach(done => {
    database.seed.run()
    .then(() => { done() })
    .catch(error => {
      console.log(error)
    })
  });

	describe('GET /api/projects', () => {
		it('should return all of the projects', done => {
			chai
				.request(server)
				.get('/api/projects')
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
					response.body.should.be.a('array');
					response.body.length.should.equal(3);
					response.body
						.filter(project => project.project_Name === 'Project1')
						.length.should.equal(1);
					response.body[0].should.have.property('project_Name');
					// response.body[0].project_Name.should.equal('Project1');
					response.body[0].should.have.property('id');
					response.body
						.filter(project => project.id === 1)
						.length.should.equal(1);
					done();
				});
		});

    it('should return a 404 error if the endpoint is wrong', (done) => {
      chai.request(server)
        .get('/api/proj')
        .end((error, response) => {
          response.should.have.status(404);
          done()
        })
    })
	});

  describe('GET /api/projects/:id/palettes', () => {
    it('should return all of the palettes for a specific project', (done) => {
      chai.request(server)
        .get('/api/projects/1/palettes')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('palette_name');
          response.body[0].should.have.property('palette_color1');
          response.body[0].should.have.property('project_id');
          response.body.filter(palette => palette.palette_name === 'Travis').length.should.equal(1);
          response.body.filter(palette => palette.palette_name === 'Travis2').length.should.equal(1);
          done();
      })
    })

    it('should return a 404 error if no palettes are found', (done) => {
      chai.request(server)
        .get('/api/projects/3/palettes')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        })
    })
  })

  describe('GET /api/palettes/:id', () => {
    it('should return a specific palette', (done) => {
      chai.request(server)
        .get('/api/palettes/3')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.length.should.equal(1);
          response.body[0].id.should.equal(3);
          response.body[0].should.have.property('palette_name');
          response.body[0].should.have.property('palette_color1');
          response.body[0].should.have.property('project_id');
          response.body.filter(palette => palette.palette_name === 'Dave').length.should.equal(1);
          response.body[0].palette_name.should.equal('Dave');
          done();
        })
    })

    it.skip('should return a 404 error if no palettes are found', (done) => {
      chai.request(server)
        .get('/api/palettes/4')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        })
    })
  })

  describe('POST /api/projects', () => {
    it('should return a 201 status if post successful', (done) => {
      chai.request(server)
        .post('/api/projects')
        .send({
          projectName: 'Project5'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('project_Name');
          response.body.filter(project => project.project_Name === 'Project5').length.should.equal(1);
          done();
        })
    })

    it('should return a 422 error if post unsuccessful', (done) => {
      chai.request(server)
        .post('/api/projects')
        .send({
          project: 'Project6'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Expected format: { projectName: <String>. You\'re missing a projectName property.')
          done();
        })
    })

    it('should return a 500 error if project already exists', (done) => {
      chai.request(server)
        .post('/api/projects')
        .send({
          projectName: 'Project1'
        })
        .end((error, response) => {
          response.should.have.status(500);
          done();
        })
    })
  })

  describe('POST /api/palettes', () => {
    it('should return a 201 and the project if post was successful', (done) => {
      chai.request(server)
        .post('/api/palettes')
        .send({
          paletteName: 'FunPalette',
          colors: ['#FFFFFF', '#000000', '#FFFFFF', '#000000', '#000000'],
          projectId: 1
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('palette_name');
          response.body[0].palette_name.should.equal('FunPalette');
          response.body[0].palette_color1.should.equal('#FFFFFF');
          done();
        })
    })

    it.skip('should return a 422 error if palette is missing info', (done) => {
      chai.request(server)
        .post('/api/palettes')
        .send({
          paletteName: 'Palette1'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Expected format: { projectId: <Integer>, paletteName: <String>, colors: <Array>. You\'re missing a colors projectId property.')
          done();
        })
    })

    it.skip('should return a 422 error if palette colors are not equal to 5', (done) => {
      chai.request(server)
        .post('/api/palettes')
        .send({
          paletteName: 'FunPalette2',
          colors: ['#FFFFFF', '#000000', '#FFFFFF', '#000000'],
          projectId: 1
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('Expected format: { projectId: <Integer>, paletteName: <String>, colors: <Array>. You\'re missing a color or two.')
          done();
        })
    })
  })

  describe('DELETE /api/palettes/:id', () => {
    it('should return a status of 204 if delete was successful', (done) => {
      chai.request(server)
      .delete('/api/palettes/2')
      .end((error, response) => {
        response.should.have.status(204);
        done();
      })
    })

    it('should return a status of 422 if no palette exists with an id', (done) => {
      chai.request(server)
        .delete('/api/palettes/50')
        .end((error, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('nothing to delete with that id');
          done();
        })
    })

    it('should return a 500 error if wrong endpoint', (done) => {
      chai.request(server)
        .delete('/api/')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        })
    })
  })
});

// after(() => {
//   process.exit();
// })
