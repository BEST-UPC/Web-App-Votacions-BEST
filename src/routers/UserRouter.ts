import { NextFunction, Request, Response, Router } from 'express';
import UserController from '../controllers/UserController';
import { IUser } from '../interface/IUser';

export default class UsersRouter {
    private _router = Router();
    private _controller = UserController;

    get router(): Router {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    /**
     * Connect routes to their matching controller endpoints.
     */
    private _configure() {
        this._router.get(
            '/',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result: Array<IUser> = await this._controller.getUsers(
                        req.user['id'],
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.patch(
            '/membership/:id',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result = await this._controller.updateMembership(
                        req.user['id'],
                        req.params.id,
                        req.body,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.get(
            '/:id',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result = await this._controller.getUser(
                        req.params.id,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.get(
            '/current',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    res.status(200).json(req.user);
                } catch (error) {
                    next(error);
                }
            },
        );
    }
}