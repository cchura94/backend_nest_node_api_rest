const secret = process.env.JWT_SECRET || 'SECRETO' 
console.log(secret);
export const jwtConstants = {
    secret: secret,
};