import { User } from "../model/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const login = async (req, res) => {
    try {
        let {username, password} = req.body
        username = username.trim()
        
        console.log(username, password);
        
        if (!username || !password) { 
            return res.status(400).json({message:'All input is required'})
        }
        const userExist = await User.findOne({username})
        
        if (!userExist) {
            return res.status(400).json({message: 'user does not exist'})
        }
        const validPassword = await bcrypt.compare(password, userExist.password)
        if (!validPassword) {
            return res.status(400).json({message: 'Invalid password'})
        }

        const userForToken = {
            username: userExist.username,
            id: userExist._id
        }

        const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: '1h'})
        res.status(200).json({token, username: userExist.username, role: userExist.role, name: userExist.name, id:userExist._id, bookmarks: userExist.bookmarks})
    } catch (error) {
        res.status(500).json({ message: 'Unable to login', error: error.message });
    }
}

export const register = async (req, res) => {
    try {
        let {name, username, password, role } = req.body
        name = name.trim()
        username = username.trim()
        if (!name || !username || !password) {
            return res.status(400).json({message: 'All input is required'})
        }
        if(username.length < 3 || password.length < 6) {
            return res.status(400).json({message: 'Username must be at least 6 characters'})
        }
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            role: role || 'user' 
        })
        const user = await newUser.save()
        res.status(201).json(user)
        console.log({name, username, password: hashedPassword})
    } catch (error) {
        res.status(500).json('unable to register', error)
    }
}

// export const getUser = async (req, res) => {
//     try {
//         const { id } =  req.params
//         console.log(id);
        
//         const fetchUser = await User.findById(id)
//         if(!fetchUser){
//             return res.status(404).json({message: 'user not found'})
//         }
//         console.log(fetchUser)
//         res.status(200).json({username: fetchUser.username})
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({error})
//     }
// }

