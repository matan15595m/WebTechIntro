const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Post = require('../models/post_model')
const newPostMessageUpdated = 'This is the updated message'
const newPostMessage = 'This is the new test post message'
const newPostSender = '111000'
let newPostId =''


beforeAll(async ()=>{
    await Post.remove()
})

afterAll(async ()=>{
    await Post.remove()
    mongoose.connection.close()
})

describe("Posts Tests", ()=>{

    test("add new post",async ()=>{
        const response = await request(app).post('/post').send({
            "message": newPostMessage,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
    })

    test("get all posts",async ()=>{
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)
    })
    test("get post by id",async ()=>{
        const response = await request(app).get('/post/' + newPostId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
    })
    test("get post by sender",async ()=>{
        const response = await request(app).get('/post?sender=' + newPostSender)
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)
    })
    test("update post by ID",async ()=>{
        let response = await request(app).put('/post/' + newPostId).send({
            "message": newPostMessageUpdated,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessageUpdated)
        expect(response.body.sender).toEqual(newPostSender)

        response = await request(app).get('/post/' + newPostId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessageUpdated)
        expect(response.body.sender).toEqual(newPostSender)

        response = await request(app).put('/post/12345').send({
            "message": newPostMessageUpdated,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(400)

        response = await request(app).put('/post/' + newPostId).send({
            "message": newPostMessageUpdated,
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessageUpdated)
        expect(response.body.sender).toEqual(newPostSender)
    })
    test("get post by id failure",async ()=>{
        const response = await request(app).get('/post/11111')
        expect(response.statusCode).toEqual(400)
    })

    //test of get post by id
    //test of get post by sender
    //test of update post by id
    //test of negative get post by id


    
})