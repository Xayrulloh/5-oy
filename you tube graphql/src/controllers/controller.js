import { Router } from 'express'

export default Router()
    .get('/', (req, res) => res.render('index'))
    .get('/login', (req, res) => res.render('login'))
    .get('/register', (req, res) => res.render('register'))