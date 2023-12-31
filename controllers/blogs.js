const blogRouter = require('express').Router()
// const { request, response } = require('../app')
const blogs = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const gettoken = request => {
    const authorization = request.get('authorization')
    // console.log(authorization)
    if (authorization && authorization.startsWith('bearer')) {
        const newi = authorization.replace('bearer', '').trim();
        // console.log(newi)
        return (
            newi
        )
    }
    return null
}


blogRouter.post('/', async (request, response) => {
    const blogdata = request.body;
    try {
        const decodedtoken = jwt.verify(gettoken(request), process.env.SECRET)
        // const decodedtoken=request.token
        // console.log(blog)
        // console.log(process.env.SECRET, gettoken(request))
        // console.log(decodedtoken)
        if (!decodedtoken) {
            return response.status(401).json({ error: 'Token invalid' })
        }
        const user = await User.findById(decodedtoken.id);
        // console.log(user)
        // console.log(decodedtoken.id)
        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }
        const blog = new blogs({
            ...blogdata,
            user: user._id
        })
        const result = await blog.save();
        user.blogs = user.blogs.concat(result._id);
        await user.save();

        const populatedResult = await result.populate('user');

        response.status(201).json(populatedResult);
    } catch (error) {
        console.error('Failed', error.message)
        response.status(500).json({ error: 'Internal Server Error' });
    }
});


// blogRouter.delete('/:id', async (request, response) => {
//     try {
//         const decodedToken = jwt.verify(gettoken(request), process.env.SECRET);
//         if (!decodedToken) {
//             return response.status(401).json({ error: 'Token invalid' });
//         }

//         const user = await User.findById(decodedToken.id);
//         if (!user) {
//             return response.status(404).json({ error: 'User not found' });
//         }

//         const deletedBlog = await blogs.findByIdAndDelete(request.params.id);
//         if (!deletedBlog) {
//             return response.status(404).json({ error: 'Blog not found' });
//         }

//         response.status(204).end();
//         console.log('Deleted successfully!');
//     } catch (error) {
//         console.error('Failed', error.message);
//         response.status(500).json({ error: 'Internal Server Error' });
//     }
// });

blogRouter.delete('/:id', async (request, response) => {
    try {
        const dlt = await blogs.findByIdAndDelete(request.params.id);
        response.status(204).end();
        console.log('deleted succesfully !')
    } catch (error) {
        console.error('cant delete ', error.message)
    }
})


blogRouter.get('/', async (request, response) => {
    const notes = await blogs
        .find({}).populate('user')

    response.json(notes)
})

blogRouter.put('/:id', async (request, response) => {

    const blog = await blogs.findById(request.params.id)

    if (!blog) {
        return response.json(" Blog not found !")
    }

    blog.likes += 1;

    const updatedblog = await blog.save();
    response.json(updatedblog)
})

module.exports = blogRouter