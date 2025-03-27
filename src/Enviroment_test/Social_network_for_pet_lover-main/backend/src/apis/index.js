const registerEndPoint = require('./register')
const loginEndPoint = require('./login')
const messageEndPoint = require('./message')

const postEndPoint = require('./post')
const eventEndPoint = require('./event')
const followEndPoint = require('./follow')
const petEndPoint = require('./pet')
const petUserEndPoint = require('./petuser')
const postUserEndPoint = require('./postuser')
const likeEndPoint = require('./like')
const commentEndPoint = require('./comment')
const historyEndPoint = require('./history')

const userEndPoint = require('./user')
const chatbotEndpoint = require('./chatbot')
const imageEndpoint = require('./image')
const notificationEndpoint = require('./notification')


function api(app) {

    app.post('/api/v1/register', registerEndPoint)
    
    app.post('/api/v1/login', loginEndPoint)
    app.get('/api/v1/login', loginEndPoint)

    app.use('/api/v1/message', messageEndPoint)

    app.use('/api/v1/post', postEndPoint)
    app.use('/api/v1/event', eventEndPoint)
    app.use('/api/v1/follow', followEndPoint)
    app.use('/api/v1/pet',petEndPoint)
    app.use('/api/v1/petuser',petUserEndPoint)
    app.use('/api/v1/postuser',postUserEndPoint)
    app.use('/api/v1/like',likeEndPoint)
    app.use('/api/v1/comment',commentEndPoint)
    app.use('/api/v1/history',historyEndPoint)

    app.use('/api/v1/user', userEndPoint)

    app.use('/api/v1/chatbot', chatbotEndpoint)
    app.use('/api/v1/image', imageEndpoint)
    app.use('/api/v1/notification', notificationEndpoint)

}

module.exports = api