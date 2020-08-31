// it's a function
const express = require('express')
const path= require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// handlebars - rendering dynamic templates
// set up handlebars engine
app.set('view engine', 'hbs')
// express searches in 'views' directory by default
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
// set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Orsi'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'error'
        })
    }
    geocode(req.query.address, (error, { location, longitude, latitude } = {}) => {
        if (error) {
            return res.send(error)
        }
        forecast(longitude, latitude, (error, forecastData) => {
            if (error) {
                return res.send(error)
            }
    
            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'Error'
        })
    }

    console.log(req.query.search)
    res.send({
        products: [
            
        ]
    })
    
})

// app.get('/help', (req, res) => {
//     res.send({
//         name: 'Orsi',
//         age: 28
//     })
// })

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Orsi'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Orsi'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Orsi',
        errorMessage: 'Help article not found!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Orsi',
        errorMessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})
