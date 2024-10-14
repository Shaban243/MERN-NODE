// const User = require('../models/userModel.js');
// const Post = require('../models/postModel.js');

// const createPost = async (req, res) => {
//     try {
//         const { title, content, userId } = req.body; 

//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({ message: 'User not found.' });
        
//         if (!title || !content || !userId) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         const post = new Post({
//             title,
//             content,
//             user: userId, 
//         });

//         const newPost = await post.save();
//         const populatedPost = await Post.findById(newPost._id).populate('user', 'name email');
        
//         console.log('The newPost is: ', populatedPost);
//         return res.status(201).json({ message: 'Post created successfully!', post: populatedPost });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Server Error', Error: err.message });
//     }
// };





// // Fetching allPosts with populated User data
// const getAllPosts = async (req, res) => {
//     try {
//         const posts = await Post.find().populate('user', 'name email');
//         return res.status(200).json({ message: 'All posts associated with user data fetched successfully!', posts });

//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).json({ message: 'Server Error', Error: err.message });
//     }
// }

// module.exports = { createPost, getAllPosts };