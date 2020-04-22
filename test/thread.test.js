const supertest = require('supertest')
const { queryInterface } = require('../models').sequelize
const app = require('../app')

describe('Thread Router', () => {
    afterAll(done => {
        queryInterface.bulkDelete('Users', {})
        .then(_ => queryInterface.bulkDelete('Threads', {}))
        .then(_ => done())
        .catch(done)
    })

    const userData = {
        email: 'User123@mail.com',
        password: 'password1',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '081123456789',
        bio: 'This is his bio.',
        img_url: 'http://imgurl.com',
        city: 'Jakarta Selatan'
    }

    const userData2 = {
        email: 'User2@mail.com',
        password: 'password2',
        first_name: 'John2',
        last_name: 'Doe2',
        phone_number: '081123456789',
        bio: 'This is his bio.',
        img_url: 'http://imgurl.com',
        city: 'Jakarta Selatan'
    }

    const userData3 = {
        email: 'User221@mail.com',
        password: 'password2',
        first_name: 'John2',
        last_name: 'Doe2',
        phone_number: '081123456789',
        bio: 'This is his bio.',
        img_url: 'http://imgurl.com',
        city: 'Jakarta Selatan'
    }

    const newThreadData = {
        title: '5 Kitten found',
        description: 'this is the description',
        long: 10.203,
        lat: -40.5,
    }

    const newThreadData2 = {
        title: '2 Kitten found',
        description: 'this is the description',
        long: 20.203,
        lat: -10.5,
    }

    let token
    let token2
    let idToFind
    let commentId

    supertest(app)
    .post('/register')
    .send(userData2)
    .end((err, res) => {
       token2 = res.body.token
    })
    
    describe('Create a thread', () => {
        describe('Successfully created a thread', () => {
            it('Should return a success message: 201', (done) => {
                supertest(app)
                .post('/register')
                .send(userData)
                .end((err, res) => {
                    token = res.body.token
                    supertest(app)
                    .post('/threads')
                    .set('token', token)
                    .send(newThreadData)
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Thread succesfully created')
                        done()
                    })
                })
            });
        });

        describe('Create thread failed', () => {
            it('Should return an empty title error: 400', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send({ ...newThreadData, title: '' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please insert the title')
                    done()
                })
            })

            it('Should return an empty long/lat error: 400', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send({ ...newThreadData, long: '' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please choose the location')
                    done()
                })
            })

            it('Should return an empty long/lat error: 400', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send({ ...newThreadData, lat: '' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please choose the location')
                    done()
                })
            })

            it('Should return unauthorized error: 401', (done) => {
                supertest(app)
                .post('/threads')
                .send(newThreadData)
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'invalid token!')
                    done()
                })
            })
        });
    });

    describe('Fetching threads', () => {
        describe('Find all', () => {
            it('Should return array of thread object', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send(newThreadData2)
                .end((err, res) => {
                    supertest(app)
                    .get('/threads')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body.data[0]).toHaveProperty('id', expect.any(Number))
                        idToFind = res.body.data[0].id
                        expect(res.body.data[0]).toHaveProperty('title', expect.any(String))
                        expect(res.body.data[0]).toHaveProperty('description', expect.any(String))
                        expect(res.body.data[0]).toHaveProperty('long', expect.any(String))
                        expect(res.body.data[0]).toHaveProperty('lat', expect.any(String))
                        expect(res.body.data[0]).toHaveProperty('status', expect.any(Number))
                        done()
                    })
                })
            })
        })

        describe('Find one', () => {
            it('Should return array of thread object', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send(newThreadData2)
                .end((err, res) => {
                    idToFind = res.body.id
                    supertest(app)
                    .get(`/threads/${idToFind}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body.data).toHaveProperty('id', expect.any(Number))
                        expect(res.body.data).toHaveProperty('title', expect.any(String))
                        expect(res.body.data).toHaveProperty('description', expect.any(String))
                        expect(res.body.data).toHaveProperty('long', expect.any(String))
                        expect(res.body.data).toHaveProperty('lat', expect.any(String))
                        expect(res.body.data).toHaveProperty('status', expect.any(Number))
                        done()
                    })
                })
            })

            it('Should return a 404 error', (done) => {
                supertest(app)
                .get(`/threads/0`)
                .expect('Content-Type', /json/)
                .expect(404)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Data not found')
                    done()
                })
            })
        });
    });
    
    describe('Editing threads', () => {
        describe('Edit thread success', () => {
            it('Should return a success message: 200', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send(newThreadData2)
                .end((err, res) => {
                    idToFind = res.body.id
                    supertest(app)
                    .put(`/threads/${idToFind}`)
                    .set('token', token)
                    .send({ description: 'new description' })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Thread succesfully edited')
                        done()
                    })
                })
            });
            it('Should return a success message: 200', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send(newThreadData2)
                .end((err, res) => {
                    idToFind = res.body.id
                    supertest(app)
                    .put(`/threads/statusUnresolved/${idToFind}`)
                    .send({ description: 'new description' })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Status updated')
                        done()
                    })
                })
            });
            it('Should return a success message: 200', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send(newThreadData2)
                .end((err, res) => {
                    idToFind = res.body.id
                    supertest(app)
                    .put(`/threads/statusRequested/${idToFind}`)
                    .send({ description: 'new description' })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Status updated')
                        done()
                    })
                })
            });
            it('Should return a success message: 200', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send(newThreadData2)
                .end((err, res) => {
                    idToFind = res.body.id
                    supertest(app)
                    .put(`/threads/statusResolved/${idToFind}`)
                    .send({ description: 'new description' })
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Status updated')
                        done()
                    })
                })
            });
        });

        describe('Edit thread failed', () => {
            it('Should return an empty title error: 400', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .set('token', token)
                .send({ title: '' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please insert the title')
                    done()
                })
            })

            it('Should return an empty long/lat error: 400', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .set('token', token)
                .send({ long: '', last_name: '' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please choose the location')
                    done()
                })
            })

            it('Should return unauthenticated error: 401', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .send({ description: 'new description' })
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'invalid token!')
                    done()
                })
            })

            it('Should return unauthorized error: 401', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .set('token', token2)
                .send({ description: 'new description' })
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'You are not authorized')
                    done()
                })
            })
        })
    });

    describe('Create a comment', () => {
        it('Should return a success message: 201', (done) => {
            supertest(app)
            .post('/threads')
            .set('token', token)
            .send(newThreadData2)
            .end((err, res) => {
                idToFind = res.body.id
                supertest(app)
                .post('/register')
                .send(userData3)
                .end((err, res) => {
                    supertest(app)
                    .post(`/threads/${idToFind}`)
                    .set('token', res.body.token)
                    .send({ message: 'Udah saya bantuin.' })
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Comment succesfully created')
                        done()
                    })
                })
            })
        });

        it('Should return a message validation error: 400', (done) => {
            supertest(app)
            .post('/threads')
            .set('token', token)
            .send(newThreadData2)
            .end((err, res) => {
                idToFind = res.body.id
                supertest(app)
                .post('/register')
                .send({...userData3, email: 'email2@mail.com'})
                .end((err, res) => {
                    supertest(app)
                    .post(`/threads/${idToFind}`)
                    .set('token', res.body.token)
                    .send({ message: '' })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Please insert your message')
                        done()
                    })
                })
            })
        });
    });

    describe('Deleting a thread', () => {
        describe('Delete a thread success', () => {
            it('Should return a success message: 200', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send(newThreadData2)
                .end((err, res) => {
                    idToFind = res.body.id
                    supertest(app)
                    .delete(`/threads/${idToFind}`)
                    .set('token', token)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Thread succesfully deleted')
                        done()
                    })
                })
            });
        });

        describe('Delete a thread failed', () => {
            it('Should return unauthenticated error: 401', (done) => {
                supertest(app)
                .delete(`/threads/${idToFind}`)
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'invalid token!')
                    done()
                })
            })

            it('Should return unauthorized error: 401', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send(newThreadData2)
                .end((err, res) => {
                    idToFind = res.body.id
                    supertest(app)
                    .delete(`/threads/${idToFind}`)
                    .set('token', token2)
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'You are not authorized')
                        done()
                    })
                })
            })
        })
    });

    
    

});
