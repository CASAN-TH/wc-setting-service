'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Setting = mongoose.model('Setting');

var credentials,
    token,
    mockup;

describe('Setting CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            label: 'general',
            description: 'GENERAL',
            parent_id: 'Product'
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Setting get use token', (done) => {
        request(app)
            .post('/api/settings')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/settings')
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data[0].label, mockup.label)
                        assert.equal(resp.data[0].description, mockup.description)
                        assert.equal(resp.data[0].parent_id, mockup.parent_id)
                        done();
                    });
            });
    });

    it('should be Setting get by id', function (done) {
        request(app)
            .post('/api/settings')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/settings/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.label, mockup.label);
                        assert.equal(resp.data.description, mockup.description);
                        assert.equal(resp.data.parent_id, mockup.parent_id);
                        done();
                    });
            });
    });

    it('should be Setting post use token', (done) => {
        request(app)
            .post('/api/settings')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.label, mockup.label);
                assert.equal(resp.data.description, mockup.description);
                assert.equal(resp.data.parent_id, mockup.parent_id);
                done();
            });
    });

    it('should be setting put use token', function (done) {

        request(app)
            .post('/api/settings')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    label: 'name update'
                }
                request(app)
                    .put('/api/settings/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.label, update.label);
                        assert.equal(resp.data.description, mockup.description);
                        assert.equal(resp.data.parent_id, mockup.parent_id);
                        done();
                    });
            });

    });

    it('should be setting delete use token', function (done) {

        request(app)
            .post('/api/settings')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/settings/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be setting get not use token', (done) => {
        request(app)
            .get('/api/settings')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be setting post not use token', function (done) {

        request(app)
            .post('/api/settings')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be setting put not use token', function (done) {

        request(app)
            .post('/api/settings')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/settings/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be setting delete not use token', function (done) {

        request(app)
            .post('/api/settings')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/settings/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Setting.remove().exec(done);
    });

});