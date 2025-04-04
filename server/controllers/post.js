import { Post, Comment } from '../model/Post.js';
import { User } from '../model/User.js';
import { getTokenFrom } from './utils.js';

import jwt from 'jsonwebtoken';


export const getPostsSpecificToAuthor = async (req, res) => {
    try {
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ message: 'Token missing or invalid' });
        }
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ message: 'User not logged in' });
        }
        if(user.role !== 'author') {
            return res.status(403).json({ message: 'User is not an author ' });
        }
        const postsOfAuthor = await Post.find({ creator: user._id });
        if (postsOfAuthor.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
            
        }
        console.log(postsOfAuthor);
        return res.json(postsOfAuthor);
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        }
        return res.status(500).json(error);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        let { offset } = req.query;
        offset = parseInt(offset) || 0;
        const limit = 10
        const posts = await Post.find().sort({createdAt: -1}).skip(offset).limit(limit).populate('creator','-password -bookmarks -posts -role -username').populate({
            path: 'comments', 
            options: {sort : {updatedAt: -1}}
        });        
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

export const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params
        
        const getLoggedUser = jwt.verify(getTokenFrom(req), process.env.SECRET)
        if(!getLoggedUser.id){
            return res.status(403).send("Unauthorized: user have to log in")
        }
        const user = await User.findById(getLoggedUser.id)
        if (!user) {
            return res.status(404).send("User not found")
        }
        const getPost = await Post.findById(id).populate({
            path: 'comments',
            options: {sort: {createdAt: -1}}
        })
        if (!getPost) {
            return res.status(404).send("Post not Found")   
        }
        if(!getPost.watched.includes(user._id)){
            getPost.watched.push(user._id)
            await getPost.save()
        } 
        const { creator } = getPost
        const authorId = creator.toString()
        const author = await User.findById(authorId)
        const post = getPost.toObject()
        post.creator = author ?  author.username : 'Anonymous Author'
        res.status(200).json(post)
        // res.status(200).json(getPost)
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export const createPost = async (req, res) => {
    try {
        const body = req.body;
        if (!body.title || !body.description || !body.content) {
            return res.status(400).json({ message: 'Title, description and content are required' });
        }
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        console.log('decodedToken', decodedToken);
        
        if (!decodedToken.id) {
            return res.status(401).json({ message: 'Token missing or invalid' });
        }
        const user = await User.findById(decodedToken.id);
        console.log('user', user);
        if (!user) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        if(user.role !== 'author') {
            return res.status(403).json({ message: 'User is not allowed to create posts' });
        }

        const post = new Post({
            title: body.title,
            description: body.description,
            content: body.content,
            creator: user._id
        });

        const savedPost =  await post.save()
        user.posts = user.posts.concat(savedPost._id);
        await user.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
        
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content } = req.body;
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ message: 'Token missing or invalid' });
        }
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ message: 'User not logged in' });
        }
        if(user.role !== 'author') {
            return res.status(403).json({ message: 'User is not allowed to update posts' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.creator.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'User is not allowed to update this post' });
        }
        
        const updatedPost = await Post.findByIdAndUpdate({ _id: id }, { title, description, content }, { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
        if (!decodedToken.id) {
                return res.status(401).json({ message: 'Token missing or invalid' });
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
                return res.status(401).json({ message: 'User not logged in' });
        }
        if(user.role !== 'author') {
                return res.status(403).json({ message: 'User is not allowed to delete post' });
        }
    
    
        const post = await Post.findById(id);
         if (!post) {
                return res.status(404).json({ message: 'Post not found' });
        }
        if (post.creator.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'User is not allowed to delete this post' });
        }
        const deletePost = await Post.findByIdAndDelete(id)
        res.status(200).json(deletePost)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ message: 'Token missing or invalid' });
        }
        
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ message: 'User not logged in' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new Comment({
            comment,
            creator: user._id,
            username: user.username,
            post: post._id
        });
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getCommentsForPost = async (req, res) => {
    try {
        const { id } = req.params;
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        if (!decodedToken.id) { 
            return res.status(401).json({ message: 'Token missing or invalid' });
        }   
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ message: 'User not logged in' });
        }
        const post = await Post.findById(id).populate('comments');
        res.status(200).json(post.comments);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

export const addBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        
        
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ message: 'Token missing or invalid' });
        }
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ message: 'User not logged in' });
        }
        if (user.bookmarks.map(String).includes(id)) {
            return res.status(400).json({ message: 'Post already bookmarked' });
            
        }
        user.bookmarks = user.bookmarks.concat(id);
        await user.save();
        res.status(200).json(user.bookmarks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error', error });
    }
}

export const removeBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ message: 'Token missing or invalid' });
        }
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ message: 'User not logged in' });
        }
        user.bookmarks = user.bookmarks.filter(b => b.toString() !== id);
        await user.save();
        res.status(200).json({ message: 'Bookmark removed', bookmarks: user.bookmarks });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getBookmarks = async (req, res) => {
    try {
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ message: 'Token missing or invalid' });
        }  
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return res.status(401).json({ message: 'User not logged in' });
        }
        const bookmarks = user.bookmarks;
        res.status(200).json(bookmarks);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error', error });
        
    }
}

export const likePost = async (req, res) => {
    try {
        const {id} = req.params
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
        if(!decodedToken.id){
            return res.status(401).json({message: 'Token missing or invalid'})
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return res.status(401).json({message: 'User not logged in'})
        }
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({message: 'Post not found'})
        }
       const userIndex = post.likes.indexOf(user._id);

        if (userIndex === -1) {
            // User hasn't liked the post yet, so like it
            post.likes.push(user._id);
        } else {
            // User has already liked it, so unlike it
            post.likes.splice(userIndex, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

