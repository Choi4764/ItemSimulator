import jwt from 'jsonwebtoken';
import { prisma } from '.../utils/prisma.js'

export default async function (req, res, next) {
    try {
        const { authorization } = req.cookies;

        if (!authorization)
            throw new Error('토큰이 존재하지 않습니다');

        const [tokenType, token] = authorization.split(' ');

        if (tokenType !== 'Bearer')
            throw new Error('토큰 타입이 일치하지 않습니다')

        const decodedtoken = jwt.verify(token, 'custom-secret-key');
        const UID = decodedtoken.UID;

        const account = await prisma.accounts.findFirst({
            where: { UID: +UID }
        });

        if (!account)
            throw new Error('토큰 사용자가 존재하지 않습니다')

        req.account = account;
        next();
    } catch (error) {
        res.clearCookie('authorization');

        switch (error.name) {
            case 'TokenExpiredError':
                return res.status(401).json({ message: '토큰이 만료되었습니다' });
            case 'JsonWebTokenError':
                return res.status(401).json({message: '토큰이 조작되었습니다'});
                default:
                    return res.status(400).json({message: error.message ?? '비정상적인 요청'});
        }
    }
}