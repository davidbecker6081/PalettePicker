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

});
