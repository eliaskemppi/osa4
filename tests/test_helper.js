const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "test",
        "author": "tester",
        "url": "test",
        "likes": 0,
    },
    {
        "title": "test2",
        "author": "tester2",
        "url": "test",
        "likes": 5
      }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

module.exports = {
    initialBlogs, blogsInDb
  }