import express from 'express';
import { prisma } from '.../utils/prisma.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/characters', async (req, res, next) => {
    try {
        const { UID } = req.account;
        const { CharName, health, power, money } = req.body;

        const isExistCharName = await prisma.characters.findFirst({
            where:{
                CharName,
            }
        });

        if (isExistCharName) {
            return res.status(403).json({ message: '존재하는 캐릭터 명입니다' });
        }

        const character = await prisma.characters.create({
            data: {
                UID: +UID,
                CharName: CharName,
                health: 500,
                power: 100,
                money: 10000,
            },
        });

        return res.status(201).json({ message: '캐릭터 생성 완료' });
    } catch (error) {
        next(error);
    }
});

router.delete('/characters/:CharID', async (req, res, next) => {
    try {
        const { CharID } = req.params;
        const { UID } = req.account;

        const character = await prisma.characters.findFirst({ where: { CharID: +CharID } });

        if (!character)
            return res.status(403).json({ message: '캐릭터가 존재하지 않습니다' });

        const deleteCharacter = await prisma.characters.delete({
            where: {
                CharID: +CharID,
                UID: +UID,
            },
        });
        return res.status(201).json({ message: '캐릭터 삭제 완료' });
    } catch (error) {
        next(error);
    }
});

router.get('/characters', async (req, res, next) => {
    try {
        const { CharID } = req.params;

        const character = await prisma.character.findFirst({
            where: { CharID: +CharID },
            select: {
                charname: true,
                health: true,
                power: true,
            }
        });
        return res.status(201).json({ data: character });
    }catch(error){
        next(error);
    }
});

router.get('/characters/:CharID', async (req, res, next) => {
    try {
        const { CharID } = req.params;
        const { UID } = req.account;

        const character = await prisma.character.findFirst({
            where: { CharID: +CharID },
            select: {
                charname: true,
                health: true,
                power: true,
                money: true,
            }
        });
        return res.status(201).json({ data: character });
    }catch(error){
        next(error);
    }
});