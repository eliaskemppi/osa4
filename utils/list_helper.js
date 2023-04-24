const dummy = (blogs) => {
    return 1
  }
  

const totalLikes = (blogs) => {
   return (
    blogs.map(x => x.likes).reduce((a, current) => a + current, 0)
   ) 
  }

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  
  let mostLiked = blogs[0]
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > mostLiked.likes) {
      mostLiked = blogs[i]
    }
  }
  
  return mostLiked
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }