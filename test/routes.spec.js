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
    .then(() => { database.seed.run() })
    .then(() => { done() })
    .catch(error => { console.log(error) })
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
  })
});

// after(() => {
//   process.exit();
// })
