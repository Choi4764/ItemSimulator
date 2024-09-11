import express from 'express';
import { prisma } from '.../utils/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/sign up', async (req, res, next) => {
    try {
        const { ID, PW, PW_confirm} = req.body;
        const isExistAccount = await prisma.accounts.findFirst({
            where: {
                ID,
            }
        });

        if (isExistAccount) {
            return res.status(402).json({ message: '존재하는 ID입니다' });
        }

        const idregex = /^[a-z|0-9]+%/;
        if (!idregex.test(ID)) {
            return res.status(402).json({ message: '영어 소문자와 숫자의 조합만 사용가능합니다' })
        }

        if (PW.length < 6) {
            return res.status(402).json({ message: '비밀번호는 최소 6자 이상이어야합니다' })
        }

        if (PW !== PW_confirm) {
            return res.status(402).json({ message: '비밀번호가 일치하지 않습니다' })
        }

        const hashedPW = await bcrypt.hash(PW, 10);

        const account = await prisma.accounts.create({
            data: {
                ID,
                PW: hashedPW,
            },
        });

        return res.status(201).json({ message: '회원가입이 완료되었습니다' });
    } catch (error) {
        next(error);
    }
});

router.post('/sign in', authMiddleware, async (req, res, next) => {
    const { ID, PW } = req.body;
    const account = await prisma.accounts.findFirst({ where: { ID } });

    if (!account)
        return res.status(401).json({ message: '존재하지 않는 계정입니다' });
    else if (!(await bcrypt.compare(PW, account.PW)))
        return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' })

    const token = jwt.sign({
        UID: UID,
    },
        'custom-secret-key',
    );

    res.cookie('authorization', `Bearer ${token}`);
    return res.status(200).json({ message: '로그인 성공' })
});