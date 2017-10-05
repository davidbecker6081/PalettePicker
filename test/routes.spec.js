const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

before((done) => {
  // Run migrations and seeds for test database
  done()
});

beforeEach((done) => {
    // Would normally run run your seed(s), which includes clearing all records
    // from each of the tables
    // server.locals.projects = students;
    done();
  });

describe('Client Routes', () => {
  it('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.includes('PalettePicker')
      done();
    })
  })

  it('should return a 404 error if the path doesn\'t exist', (done) => {
    chai.request(server)
    .get('/wrong')
    .end((error, response) => {
      response.should.have.status(404);
      done()
    })
  })
});

describe('API Routes', () => {

  describe('GET /api/projects', () => {
    it('should return all of the projects', (done) => {
      chai.request(server)
      .get('/api/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body.filter((project) => project.project_Name === 'Project1').length.should.equal(1);
        response.body[0].should.have.property('project_Name');
        // response.body[0].project_Name.should.equal('Project1');
        response.body[0].should.have.property('id');
        response.body.filter((project) => project.id === 1).length.should.equal(1);
        done();
      })
    })
  })
});
