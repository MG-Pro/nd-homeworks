const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const supertest = require('supertest');


describe('REST API', () => {
  let server;

  before((done) => {
    require('../serverREST').app;
    setTimeout(() => {
      server = supertest.agent('http://localhost:3000');
      done();
    }, 500);
  });

  it('GET /users/', done => {
    server
      .get('/users')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.equal();
        done();
      });
  });


  //it("POST /users", done => {
  //  server
  //    .post('/users/')
  //    .send({name: 'Test', score: '1'})
  //    .expect("Content-type", /json/)
  //    .expect(200)
  //    .end(function (err, res) {
  //      expect(res.text).to.equal();
  //      done();
  //    });
  //});
  //
  //it("delete /users/:id", done => {
  //  server
  //    .post('/users/')
  //    .send({name: 'Test', score: '1'})
  //    .expect("Content-type", /json/)
  //    .expect(200)
  //    .end(function (err, res) {
  //      server
  //        .delete('/users/delete/Test')
  //        .expect(200)
  //        .end(function (err, res) {
  //          expect(res.text).to.equal();
  //          done();
  //        });
  //    });
  //});

});
