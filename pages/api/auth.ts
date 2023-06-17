import type { NextApiRequest, NextApiResponse } from 'next'

import Users from '../../data/user.json';
import { apiHandler } from '../../utils/api';
import jwt from 'jsonwebtoken'

function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            res.status(405).json({
                error: 'Only POST requests allowed',
              })
            return
        }
        const body = req.body;
        const user = Users.find((user: any) => user.username === body.username && user.password === btoa(body.password));
        if (!user) {
            res.status(405).json({
                error: `Username or password is incorrect.`,
              })
            return
        }
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
    
        res.status(200).json({
            id: user.id,
            username: user.username,
            token
        });
    } catch (error) {
        res.status(405).send({ message: `${error}` })
        return
    }
};

export default apiHandler(handler);