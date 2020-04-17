const supertest = require('supertest')
const { queryInterface } = require('../models').sequelize
const app = require('../app')

describe('User router', () => {
    const dataRegister = {
        email: 'User1@mail.com',
        password: 'password1',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '081123456789',
        bio: 'This is his bio.',
        img_url: 'http://imgurl.com'
    }

    describe('Register a user', () => {
        describe('Register Success', () => {
            afterEach(done => {
                queryInterface.bulkDelete('Users', {})
                .then(_ => done)
                .catch(err => console.log(err))
            })

            it('Should return return an object containing all key with a hashed password (201)',
            done => {
                supertest(app)
                .post('/register')
                .send(dataRegister)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('id', expect.any(Number))
                    expect(res.body).toHaveProperty('email', dataRegister.email)
                    expect(res.body).toHaveProperty('first_name', dataRegister.first_name)
                    expect(res.body).toHaveProperty('last_name', dataRegister.last_name)
                    expect(res.body).toHaveProperty('phone_number', dataRegister.phone_number)
                    expect(res.body).toHaveProperty('img_url', dataRegister.img_url)
                    expect(res.body).toHaveProperty('hashedPassword', expect.any(String))
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
                    .send({ ...dataRegister, password: '' })
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
                    .send({ ...dataRegister, password: 'asd' })
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
                    .send({ ...dataRegister, first_name: '' })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.body).toHaveProperty('msg', 'Please insert your name')
                        done()
                    })
                }) 
            })

            describe('Phone number error', () => {
                it('Should return empty validation error: 400', done => {
                    supertest(app)
                    .post('/register')
                    .send({ ...dataRegister, phone_number: '' })
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
});