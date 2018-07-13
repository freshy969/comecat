var should = require('should');
var request = require('supertest');
var app = require('../mainTest');
var util = require('util');

describe('WEB API', function () {

    var req, res;

    describe('/message/list GET', function () {
    
        it('should work messagelist', function (done) {

            request(app)
                .get('/api/v2/message/list/3-' + global.room1._id + '/0/new')
                .set('access-token', global.user1.accessToken)
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}

                res.body.should.have.property('code');
                res.body.code.should.equal(1);
                
                done();
            
            });   
            
        });

    });
    
});