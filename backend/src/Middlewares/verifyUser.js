const {SignJWT} = require('../utils/JWT');

const VerifyUser = async (req, res, next) => { 
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    const bearer = bearerHeader.split(' ');
    const token = bearer[ 1 ];
    
   
    try {
        if (!token) return res.status(401).json({
            message: 'Unauthorized'
        })
       
        const data =await SignJWT.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}
module.exports = VerifyUser;