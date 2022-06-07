// implement your posts router here
const express = require('express')

const Posts = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
  Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    })    
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  Posts.findById(id)
    .then(post => {
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.status(200).json(post)
        }
    }) 
    .catch(err =>  {
        res.status(500).json({ message: " The post information could not be retrieved" })
    } )
})

router.post('/', (req, res) => {
  const post = req.body
  if (!post.title || !post.contents) {
      res.status(400).json({ message: "Please provide title and contents for the post" })
  } else {
    Posts.insert(post)
      .then(newPostId => {
          Posts.findById(newPostId.id)
            .then(newPost => {
                res.status(201).json(newPost)
            })
      })
      .catch(err => {
          res.status(500).json({ message: "There was an error while saving the post to the database" })
      })
  }
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const newPost = req.body
  
  if(!newPost.title || !newPost.contents) {
      res.status(400).json({ message: "Please provide title and contents for the post" })
  } else {
      Posts.update(id, newPost)
        .then(numOfUpdates => {
            if (numOfUpdates === 1) {
                Posts.findById(id)
                .then(newPostRecord => {
                    res.status(200).json(newPostRecord)
                })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be modified" })
        })
  }
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    
    Posts.findById(id)
      .then(deletePost => {
          if (!deletePost) {
              res.status(404).json({ message: "The post with the specified ID does not exist" })
          } else {
              Posts.remove(id)
                .then(numOfDeletes => {
                    if (numOfDeletes === 1) {
                        res.status(200).json(deletePost)
                    } else {
                        res.status(500).json({ message: "The post information could not be modified" })
                    }
                })
          }
      })
      .catch(err => {
          res.status(500).json({ message: "The post information could not be modified" })
      })
})

router.get('/:id/comments', (req, res) => {
  const { id } = req.params
  Posts.findById(id)
    .then(post => {
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            Posts.findPostComments(id)
              .then(comments => {
                  res.status(200).json(comments)
              })
        }
    })  
    .catch(err => {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    })
})

module.exports = router