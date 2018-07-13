var should = require('should');
var request = require('supertest');
var app = require('../mainTest');

describe('API', () => {

    var req, res;
    
    describe('/v3/groups/:groupId/users GET', () => {
        
        it('returns 401, wrong apiKey', (done) => {
            request(app)
                .get('/api/v3/groups/' + global.group1._id + "/users")
                .set('apikey', global.apikey + "wrong")
                .set('access-token', global.user2.apiaccesstoken)
                .expect(401, done)
        });

        it('returns 403, Wrong access token', (done) => {
            request(app)
                .get('/api/v3/groups/' + global.group1._id + "/users")
                .set('apikey', global.apikey)
                .set('access-token', global.user2.apiaccesstoken + "wrong")
                .expect(403, done) 
        });

        it('returns 422, if group id is wrong', (done) => {
            request(app)
                .get('/api/v3/groups/' + 'wrongId' + "/users")
                .set('apikey', global.apikey)
                .set('access-token', global.user2.apiaccesstoken)
                .expect(422, done)
        });

        it('returns group users', (done) => {
            request(app)
                .get('/api/v3/groups/' + global.group1._id + "/users")
                .set('apikey', global.apikey)
                .set('access-token', global.user2.apiaccesstoken)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    res.body.should.have.property('users');                                        
                    res.body.users.should.be.instanceof(Array).and.have.lengthOf(2);                
                    done();
                });
        });

        it('returns group users', (done) => {
            request(app)
                .get('/api/v3/groups/' + global.group1._id + "/users?limit=1&offset=1")
                .set('apikey', global.apikey)
                .set('access-token', global.user2.apiaccesstoken)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    res.body.should.have.property('users');                                        
                    res.body.users.should.be.instanceof(Array).and.have.lengthOf(1);                
                    done();
                });
        });
        
    });
});