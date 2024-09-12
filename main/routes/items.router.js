import express from 'express';
import { prisma } from '.../utils/prisma.js';

const router = express.Router();

router.post('/items', async (req, res, next) => {
    try {
        const { ItemID, ItemName, ItemStat, price } = req.body;

        const isExistItemName = await prisma.characters.findFirst({
            where: {
                ItemName,
            }
        });

        if (isExistItemName) {
            return res.status(403).json({ message: '존재하는 아이템 명입니다' });
        }
        const Item = await prisma.items.create({
            data: {
                ItemID: ItemID,
                ItemName: ItemName,
                ItemStat: ItemStat({
                    health: true,
                    power: true,
                }),
                price: price,
            },
        });

        return res.status(201).json({ message: '캐릭터 생성 완료' });
    } catch (error) {
        next(error);
    }
})