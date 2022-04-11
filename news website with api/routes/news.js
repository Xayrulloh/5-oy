const express = require('express'), axios = require('axios'), newsr = express.Router(), moment = require('moment'), math = require('math')

newsr.get('/', async(req,res) => {
    try {
        let url = 'http://newsapi.org/v2/top-headlines?'+'country=us&'+'apiKey=36f3e29b704f41339af8439dc1228334'

        const news_get = await axios.get(url)
        res.render('news', {articles:news_get.data.articles})

    } catch (error) {
        error.response ? console.log(error) : ''
    }
})

newsr.post('/search', async (req, res) => {
    const search = req.body.search

    try {
        let url = `http://newsapi.org/v2/everything?q=${search}&apiKey=36f3e29b704f41339af8439dc1228334`

        const news_get = await axios.get(url)
        res.render('news', {articles:news_get.data.articles})

    } catch (error) {
        error.response ? console.log(error) : ''
    }
})

newsr.get('/news/:category', async(req,res) => {
    let category = req.params.category
    
    try {
        let url = 'http://newsapi.org/v2/top-headlines?country=us&category=' + category + '&apiKey=36f3e29b704f41339af8439dc1228334';
        
        const news_get = await axios.get(url);
        res.render('category', {articles:news_get.data.articles})

    } catch (error) {
        error.response ? console.log(error) : ''
        
    }
})

newsr.get

module.exports=newsr

