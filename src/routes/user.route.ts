import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { PermissionName } from '../domain/enums/permission.enum';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { checkPermission } from '../middlewares/permission.middleware';
import { signInValidation, signUpValidation, updateUserValidation } from '../middlewares/validation.middleware';

export default class UserRoutes {
    router: Router;
    userController: UserController = new UserController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post(
            '/signup',
            signUpValidation,
            this.userController.signUp,
        );

        this.router.post(
            '/signin',
            signInValidation,
            this.userController.signIn,
        );

        this.router.post('/refresh-token', this.userController.refreshToken);

        this.router.get(
            '/users/list',
            isAuthenticated,
            checkPermission(PermissionName.GET_ALL_USERS),
            this.userController.getAllUsers,
        );
        
        this.router.get(
            '/user/:id',
            isAuthenticated,
            checkPermission(PermissionName.GET_USER),
            this.userController.getUserById,
        );

        this.router.put(
            '/user/:id',
            isAuthenticated,
            checkPermission(PermissionName.UPDATE_USER),
            updateUserValidation,
            this.userController.updateUser,
        );

        this.router.delete(
            '/user/:id',
            isAuthenticated,
            checkPermission(PermissionName.DELETE_USER),
            this.userController.deleteUser,
        );
    }
}
