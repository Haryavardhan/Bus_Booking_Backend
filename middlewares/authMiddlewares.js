const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      res.status(401).json({error: 'Not authorized, token failed'})
      
    }
  }

  if (!token) {
    res.status(401).json({error: 'Not authorized, token failed'})
  }
}

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403)
    throw new Error('Access denied. Admins only.')
  }
}

module.exports = { protect, isAdmin }
