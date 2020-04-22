const supertest = require('supertest')
const { queryInterface } = require('../models').sequelize
const app = require('../app')
const petRoute = "/pet"

describe('Pet router', () => {
  const dataCreate = {
    name: 'felix the cat',
    species: 'angora',
    month: 2,
    year: 0,
    description: 'sudah lama ga dikasih makan',
  }

  const userData = {
    email: 'a@b.com',
    password: 'qweqwe',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '081123456789',
    bio: 'This is his bio.',
    img_url: 'http://imgurl.com',
    city: 'Jakarta Selatan'
  }

  const userData2 = {
    email: 'b@b.com',
    password: 'qweqwe',
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '081123456789',
    bio: 'This is his bio.',
    img_url: 'http://imgurl.com',
    city: 'Jakarta Selatan'
  }

  let token = null
  let token2 = null
  let userId2;

  let dataId;

  afterAll(done => {
    queryInterface.bulkDelete('Pets', {})
      .then(_ => queryInterface.bulkDelete('Users', {}))
      .then(_ => done())
      .catch(done)
  })

  beforeAll(done => {
    supertest(app)
      .post('/register')
      .send(userData)
      .end((err, res) => {
        token = res.body.token
        done()
      })
  })

  beforeAll(done => {
    supertest(app)
      .post('/register')
      .send(userData2)
      .end((err, res) => {
        token2 = res.body.token
        userId2 = res.body.id
        done()
      })
  })

  describe('Create a pet', () => {
    describe('Success create pet', () => {
      it('return pet data (201)',
        done => {
          supertest(app)
            .post(petRoute)
            .set('token', token)
            .send(dataCreate)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
              dataId = res.body.data.id;
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('data', expect.any(Object))
              expect(res.body.data).toHaveProperty('id', expect.any(Number))
              expect(res.body.data).toHaveProperty('name', expect.any(String))
              expect(res.body.data).toHaveProperty('species', expect.any(String))
              expect(res.body.data).toHaveProperty('UserId', expect.any(Number))
              expect(res.body.data).toHaveProperty('birth_date', expect.any(String))
              expect(res.body.data).toHaveProperty('description', expect.any(String))
              expect(res.body.data).toHaveProperty('status', expect.any(Number))
              expect(res.body.data).toHaveProperty('request_user_id')
              done()
            })
        })
    });

    describe('Error create pet', () => {
      describe('No token', () => {
        it('Invalid token no token (401)', done => {
          supertest(app)
            .post(petRoute)
            .send({ ...dataCreate })
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });

      describe('Invalid token', () => {
        it('Invalid token (401)', done => {
          supertest(app)
            .post(petRoute)
            .set('token', "zzzz")
            .send({ ...dataCreate })
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });

      describe('Description Error', () => {
        it('description is required (400)', done => {
          supertest(app)
            .post(petRoute)
            .set('token', token)
            .send({ ...dataCreate, description: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Please insert pet description`)
              done()
            })
        })
      });
    });
  });

  describe('Get pets', () => {
    describe('Success get pets', () => {
      it('return pets (200)',
        done => {
          supertest(app)
            .get(petRoute)
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('data', expect.any(Array))
              done()
            })
        })
    });

    describe('Error get pets', () => {
      describe('No token', () => {
        it('Invalid token no token (401)', done => {
          supertest(app)
            .get(petRoute)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });

      describe('Invalid token', () => {
        it('Invalid token (401)', done => {
          supertest(app)
            .get(petRoute)
            .set('token', "zzzz")
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });
    });
  });

  describe('Get pet by id', () => {
    describe('Success get a pet', () => {
      it('return pet data (200)',
        done => {
          supertest(app)
            .get(petRoute + `/${dataId}`)
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('data', expect.any(Object))
              done()
            })
        })
    });

    describe('Error get a pet', () => {
      describe('No token', () => {
        it('Invalid token no token (401)', done => {
          supertest(app)
            .get(petRoute + `/${dataId}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });

      describe('Invalid token', () => {
        it('Invalid token (401)', done => {
          supertest(app)
            .get(petRoute + `/${dataId}`)
            .set('token', "zzzz")
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });

      describe('Invalid id', () => {
        it('Id not found (404)', done => {
          supertest(app)
            .get(petRoute + "/999")
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Pet Not Found!`)
              done()
            })
        })
      });
    });
  });

  describe('Update a pet', () => {
    describe('Success update pet', () => {
      it('return updated pet data (200)',
        done => {
          supertest(app)
            .put(petRoute + `/${dataId}`)
            .set('token', token)
            .send({ name: "ujank" })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('data', expect.any(Object))
              expect(res.body.data).toHaveProperty('name', "ujank")
              done()
            })
        })
    });
    describe('Error update pet', () => {
      describe('No token', () => {
        it('invalid token (401)', done => {
          supertest(app)
            .put(petRoute + `/${dataId}`)
            .send({ name: "ujank" })
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });

      describe('Invalid token', () => {
        it('invalid token (401)', done => {
          supertest(app)
            .put(petRoute + `/${dataId}`)
            .set('token', "zzzz")
            .send({ name: "ujank" })
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });

      describe('Description Error', () => {
        it('Should return empty validation error (400)', done => {
          supertest(app)
            .put(petRoute + `/${dataId}`)
            .set('token', token)
            .send({ description: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', 'Please insert pet description')
              done()
            })
        })
      });

      describe('Invalid id', () => {
        it('Id not found (404)', done => {
          supertest(app)
            .put(petRoute + "/999")
            .set('token', token)
            .send({ description: '' })
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Pet Not Found!`)
              done()
            })
        })
      });

      describe('Unauthorize', () => {
        it('unauthorize (401)',
          done => {
            supertest(app)
              .put(petRoute + `/${dataId}`)
              .set('token', token2)
              .send({ name: "ujank" })
              .expect('Content-Type', /json/)
              .expect(401)
              .end((err, res) => {
                expect(err).toBe(null)
                expect(res.body).toHaveProperty('msg', `You are unauthorize!`)
                done()
              })
          })
      });
    });
  });

  describe('Update request pet', () => {
    describe('Success update pet', () => {
      it('return updated pet data (200)',
        done => {
          supertest(app)
            .patch(petRoute + `/${dataId}`)
            .set('token', token2)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('data', expect.any(Object))
              expect(res.body.data).toHaveProperty('request_user_id', expect.any(Number))
              done()
            })
        })
    });
    describe('Error update request pet', () => {
      describe('No token', () => {
        it('invalid token (401)', done => {
          supertest(app)
            .patch(petRoute + `/${dataId}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });


      describe('Invalid token', () => {
        it('invalid token (401)', done => {
          supertest(app)
            .patch(petRoute + `/${dataId}`)
            .set('token', "zzzz")
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });


      describe('Invalid id', () => {
        it('Id not found (404)', done => {
          supertest(app)
            .put(petRoute + "/999")
            .set('token', token)
            .send({ description: '' })
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Pet Not Found!`)
              done()
            })
        })
      });

    });
  });

  describe('Delete a pet', () => {
    describe('Error delete a pet', () => {
      describe('No token', () => {
        it('invalid token (401)', done => {
          supertest(app)
            .delete(petRoute + `/${dataId}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });
      describe('Invalid token', () => {
        it('invalid token (401)', done => {
          supertest(app)
            .delete(petRoute + `/${dataId}`)
            .set('token', "zzzz")
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `invalid token!`)
              done()
            })
        })
      });

      describe('Invalid id', () => {
        it('Id not found (404)', done => {
          supertest(app)
            .delete(petRoute + "/999")
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Pet Not Found!`)
              done()
            })
        })
      });

      describe('Unauthorize', () => {
        it('unauthorize (401)',
          done => {
            supertest(app)
              .put(petRoute + `/${dataId}`)
              .set('token', token2)
              .expect('Content-Type', /json/)
              .expect(401)
              .end((err, res) => {
                expect(err).toBe(null)
                expect(res.body).toHaveProperty('msg', `You are unauthorize!`)
                done()
              })
          })
      });

    });

    describe('Success delete pet', () => {
      it('return updated pet data (200)',
        done => {
          supertest(app)
            .delete(petRoute + `/${dataId}`)
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('data', expect.any(Object))
              done()
            })
        })
    });
  });
});