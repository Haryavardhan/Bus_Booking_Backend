const User = require('../models/userModel')


//user register
const register = async (req, res) => {
    const { email, password, role='user'} = req.body

    if(!email || !password)
    {
        res.status(400).json({error: 'Please Provide all fields'})
    }

    const userExists = await User.findOne({ email })
    if(userExists)
    {
        res.status(400).json({error: 'User already exists'})
    }

    const user = await User.create({ email,  password, role})

    // If user creation failed
    if (!user) {
        res.status(500).json({error: 'user registration failed'});
    }

    res.status(201).json(
        {
            success: true,
            user,
            message: "user created successfully"
        }
    )
}

//User login
const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password)
    {
        res.status(400).json({error: 'Please provide both email and password'})
    }

    const user = await User.findOne({ email })
    if(!user)
    {
        res.status(400).json({error: "Invalid email or password"})
       

    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect)
    {
        res.status(400).json({error: 'Incorrect Password'})
    }

    const token = await user.generateJWT()

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
    })

}

const deleteUser = async (req, res) => {
    const {id} = req.params
    const user = await User.findById(id)

    if (!user) {
        res.status(404).json({error: 'User not found'})
    }

    await user.deleteOne()

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
}

const getUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
}


module.exports = {register, login, deleteUser, getUsers}