import { AddonService } from './addon';
import { AddonServiceImpl } from './addon/addon.service';
import { AuthServiceImpl } from './auth/auth.service';
import { AuthService } from './auth/auth.types';
import { GameService } from './game';
import { GameServiceImpl } from './game/game.service';
import { GameCategoryService } from './game-category';
import { GameCategoryServiceImpl } from './game-category/game-category.service';
import { HttpClient, HttpClientImpl } from './http-client';
import { UserServiceImpl } from './user/user.service';
import { UserService } from './user/user.types';

const httpClient: HttpClient = new HttpClientImpl();
export const userService: UserService = new UserServiceImpl(httpClient);
export const authService: AuthService = new AuthServiceImpl(httpClient);
export const gameService: GameService = new GameServiceImpl(httpClient);
export const gameCategoryService: GameCategoryService = new GameCategoryServiceImpl(httpClient);
export const addonService: AddonService = new AddonServiceImpl(httpClient);
