const supertest = require('supertest')
const { queryInterface } = require('../models').sequelize
const app = require('../app')
const jwt = require('jsonwebtoken')

describe('User router', () => {
    const dataRegister = {
        email: 'User1@mail.com',
        password: 'password1',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '081123456789',
        bio: 'This is his bio.',
        img_url: 'http://imgurl.com',
        city: 'Jakarta Selatan'
    }

    describe('Register a user', () => {
        describe('Register Success', () => {
            afterAll(done => {
                queryInterface.bulkDelete('Users', {})
                .then(_ => done)
                .catch(err => console.log(err))
            })

            it('Should return return an object containing token',
            done => {
                supertest(app)
                .post('/register')
                .send(dataRegister)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('token', expect.any(String))
                    expect(res.body).toHaveProperty('first_name', dataRegister.first_name)
                    expect(res.body).toHaveProperty('email', dataRegister.email)
                    expect(res.body).toHaveProperty('img_url', dataRegister.img_url)
                    done()
                })
            })
        });
        
        describe('Register Error', () => {
            describe('Email Error', () => {
                it('Should return empty validation error: 400', done => {
                    supertest(app)
                    .post('/register')
                    .send({ ...dataRegister, email: '' })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Please insert your email')
                        done()
                    })
                })

                it('Should return an invalid email format error: 400', done => {
                    supertest(app)
                    .post('/register')
                    .send({ ...dataRegister, email: 'user1' })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Email is not valid')
                        done()
                    })
                })

                it('should return a unique constraint violation: 400', done => {
                    supertest(app)
                    .post('/register')
                    .send(dataRegister)
                    .end(() => {
                        supertest(app)
                        .post('/register')
                        .send(dataRegister)
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end((err, res) => {
                            expect(err).toBe(null)
                            expect(res.body).toHaveProperty('msg', 'Email has already been used')
                            done()
                        })
                    })
                }) 
            });
            
            describe('Password Error', () => {
                it('Should return empty validation error: 400', done => {
                    supertest(app)
                    .post('/register')
                    .send({ ...dataRegister, email: 'failtest@mail.com', password: '' })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Please insert your password')
                        done()
                    })
                })

                it('Should return length validation error: 400', done => {
                    supertest(app)
                    .post('/register')
                    .send({ ...dataRegister, email: 'failtest@mail.com', password: 'asd' })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Your password is too short')
                        done()
                    })
                })
            });
            
            describe('Name error', () => {
                it('Should return empty validation error: 400', done => {
                    supertest(app)
                    .post('/register')
                    .send({ ...dataRegister, email: 'failtest@mail.com', first_name: '' })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Please insert your name')
                        done()
                    })
                }) 
            })

            describe('City error', () => {
                it('Should return empty validation error: 400', done => {
                    supertest(app)
                    .post('/register')
                    .send({ ...dataRegister, email: 'failtest@mail.com', city: '' })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Please insert your city residency')
                        done()
                    })
                }) 
            })

            describe('Phone number error', () => {
                it('Should return empty validation error: 400', done => {
                    supertest(app)
                    .post('/register')
                    .send({ ...dataRegister, email: 'failtest@mail.com', phone_number: '' })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Please insert your phone number')
                        done()
                    })
                }) 
            })
        });
    });

    describe('Login user', () => {
        afterAll(done => {
            queryInterface.bulkDelete('Users', {})
            .then(_ => done)
            .catch(err => console.log(err))
        })

        const dataLogin = {
            email: 'User1@mail.com',
            password: 'password1'
        }

        supertest(app)
        .post('/register')
        .send(dataRegister)

        describe('Login successfull', () => {
            it('Should return a token, first_name, email, and img_url', done => {
                supertest(app)
                .post('/login')
                .send(dataLogin)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('token', expect.any(String))
                    expect(res.body).toHaveProperty('first_name', dataRegister.first_name)
                    expect(res.body).toHaveProperty('email', dataRegister.email)
                    expect(res.body).toHaveProperty('img_url', dataRegister.img_url)
                    done()
                })
            })
        });

        describe('Login failed', () => {
            it('should return wrong email msg :400', done => {
                supertest(app)
                .post('/login')
                .send({ ...dataLogin, email: 'wrong@mail.com' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Wrong email/password')
                    done()
                })
            })

            it('should return wrong password msg :400', done => {
                supertest(app)
                .post('/login')
                .send({ ...dataLogin, password: 'wrongpass' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Wrong email/password')
                    done()
                })
            })
        });
    });

    describe('Find a user', () => {
        let idToSearch

        

        it('Should return a user data', (done) => {
            supertest(app)
            .post('/register')
            .send(dataRegister)
            .end((err, res) => {
                idToSearch = jwt.verify(res.body.token, process.env.SECRET_KEY).id
                supertest(app)
                .get(`/users/${idToSearch}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('first_name', dataRegister.first_name)
                    expect(res.body).toHaveProperty('last_name', dataRegister.last_name)
                    expect(res.body).toHaveProperty('phone_number', dataRegister.phone_number)
                    expect(res.body).toHaveProperty('email', dataRegister.email)
                    expect(res.body).toHaveProperty('img_url', dataRegister.img_url)
                    expect(res.body).toHaveProperty('city', dataRegister.city)
                    expect(res.body).toHaveProperty('bio', dataRegister.bio)
                    expect(res.body).toHaveProperty('id',  expect.any(Number))
                    done()
                })
            })
        });
    });
});
