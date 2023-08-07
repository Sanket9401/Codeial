const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile =async function(req,res){
    
    let user = await User.findById(req.params.id);

    return res.render('user_profile', {
        title: "User Profile",
        profile_user : user
    });
}

module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        try{
        // await User.findByIdAndUpdate(req.params.id, req.body);
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req, res, function(err){
            if(err){
                console.log('*****Multer Error:', err);
            }
            user.name = req.body.name;
            user.email = req.body.email;

            if(req.file){
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                }
                // this is saving the path of the uploaded file into the avatar field in the user 
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
        })
    }catch(error){
        req.flash('error', error);
        return res.redirect('back');
    }
    }
    else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('user_sign_up',{
        title: "Sign Up"
    });
}
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('user_sign_in',{
        title: "Sign In"
    });
}
//get the sign up data
module.exports.create =async function(req, res){
    if(req.body.password !== req.body.confirm_password){
        return res.redirect('back');
    }

    try{
        let user = await User.findOne({email : req.body.email});
        if(!user){
            await User.create(req.body);
            return res.redirect('/user/sign-in');
        }
        else{
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err, 'Error in creating user');
        return;
    }
}
   
//sign in and create a session for user 
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully'); 
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout(function(err){
        if(err){
            console.log(err);
            return;
        }
        req.flash('success', 'You have logged out Successfully'); 

        return res.redirect('/');
    });
}
