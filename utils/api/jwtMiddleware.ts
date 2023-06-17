import {Request, Response} from 'express';

import {expressjwt} from 'express-jwt';
import util from 'util';

export { jwtMiddleware };

function jwtMiddleware(req: Request, res: Response) {
    const middleware = expressjwt({ secret: process.env.JWT_SECRET as string, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/auth',
            '/api/chat'
        ]
    });

    return util.promisify(middleware)(req, res);
}