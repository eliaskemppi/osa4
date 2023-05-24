const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
  
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })



test('right amount of JSON blogs returned', async () => {
    
    const response = await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('identification variable is id', async () => {

  const response = await api.get('/api/blogs')

  const shouldById = response.body[0].id
  expect(shouldById).toBeDefined()
})

describe('adding a blog', () => {

test('a valid blog can be added ', async () => {
  const newBlog = {
    "title": "test3",
    "author": "tester3",
    "url": "test",
    "likes": 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'test3'
  )
})
  
test('if likes is empty, should return 0', async () => {
  const newBlog = {
    "title": "0_likes",
    "author": "tester3",
    "url": "test"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const zeroLikes = blogsAtEnd.find(n => n.title === "0_likes")
  console.log(zeroLikes)
  expect(zeroLikes.likes).toBe(0)
})

test('if title or url missing should return bad request', async () => {
  const newBlog1 = {
    "author": "tester3",
    "url": "test",
    "likes": 0
  }

  const newBlog2 = {
    "title": "missingUrl",
    "author": "tester3",
    "likes": 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog1)
    .expect(400)

    await api
    .post('/api/blogs')
    .send(newBlog2)
    .expect(400)

})
})

describe('deleting a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(202)
  
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
    const idsAtEnd = blogsAtEnd.map(r => r.id)

    expect(idsAtEnd).not.toContain(blogToDelete.id)
  })
})

describe('editing a blog', () => {
  test('a blog can be liked', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]
    const editedBlog = {
      title: blogToEdit.title,
      author: blogToEdit.author,
      url: blogToEdit.url,
      likes: blogToEdit.likes + 1
    }
    
    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(editedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const finalBlogs = await helper.blogsInDb()
    const finalBlog = finalBlogs[0]
    expect(finalBlog.likes).toBe(1)
    })
       
})


  afterAll(async () => {
    await mongoose.connection.close()
  })