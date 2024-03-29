const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create= async function(req, res){

    try{
        let post = await Post.create({
            content : req.body.content,
            user : req.user._id
        });

        if(req.xhr){
          return res.status(200).json({
            data : {
              post : post
            },
            message : "Post created!"
          });
        }

        req.flash('success','Post published');
        return res.redirect('back');
    }
    catch(error){
        req.flash('error',err);
        return res.redirect('back');
    }  
}

module.exports.destroy = async function(req, res){
    try{
    const post = await Post.findById(req.params.id);
    //.id means converting object id into string
      if(post.user == req.user.id){

        await Like.deleteMany({likeable : post, onModel : 'Post'});
        await Like.deleteMany({_id : {$in : post.comments}});

        await Post.findByIdAndDelete(post.id);
       
        await Comment.deleteMany({post : req.params.id});

       if(req.xhr){
          return res.status(200).json({
            data : {
              post_id : req.params.id
            },
            message : "Post deleted"
          });
       }

       req.flash('success','Post and associated comments deleted!');
       return res.redirect('back');
       
      }
      else{
        req.flash('error','You can not delete this post!');
        return res.redirect('back');
      }
    }
    catch(err){
        req.flash('error',err);
        return res.redirect('back');
    } 
}