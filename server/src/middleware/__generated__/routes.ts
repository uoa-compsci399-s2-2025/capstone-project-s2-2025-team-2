/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../../presentation-layer/controllers/UserController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ReagentController } from './../../presentation-layer/controllers/ReagentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GoogleOAuthController } from './../../presentation-layer/controllers/GoogleOAuthController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../../presentation-layer/controllers/AuthController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "User": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReagentTradingType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["trade"]},{"dataType":"enum","enums":["giveaway"]},{"dataType":"enum","enums":["sell"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReagentCategory": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["chemical"]},{"dataType":"enum","enums":["hazardous"]},{"dataType":"enum","enums":["biological"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Reagent": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "price": {"dataType":"double"},
            "expiryDate": {"dataType":"string","required":true},
            "tradingType": {"ref":"ReagentTradingType","required":true},
            "images": {"dataType":"array","array":{"dataType":"string"}},
            "categories": {"dataType":"array","array":{"dataType":"refAlias","ref":"ReagentCategory"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateReagentRequest": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "categories": {"dataType":"array","array":{"dataType":"refAlias","ref":"ReagentCategory"},"required":true},
            "price": {"dataType":"double"},
            "expiryDate": {"dataType":"string","required":true},
            "tradingType": {"ref":"ReagentTradingType","required":true},
            "images": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Reagent_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"userId":{"dataType":"string"},"name":{"dataType":"string"},"description":{"dataType":"string"},"price":{"dataType":"double"},"expiryDate":{"dataType":"string"},"tradingType":{"ref":"ReagentTradingType"},"images":{"dataType":"array","array":{"dataType":"string"}},"categories":{"dataType":"array","array":{"dataType":"refAlias","ref":"ReagentCategory"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GoogleOAuthUser": {
        "dataType": "refObject",
        "properties": {
            "uid": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "displayName": {"dataType":"string"},
            "photoURL": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GoogleOAuthResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "token": {"dataType":"string"},
            "user": {"ref":"GoogleOAuthUser"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GoogleOAuthRequest": {
        "dataType": "refObject",
        "properties": {
            "idToken": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "success": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SendVerificationCodeResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SendVerificationCodeRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyCodeResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyCodeRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "inputCode": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignUpResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignUpRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsUserController_getAllUsers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/users',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getAllUsers)),

            async function UserController_getAllUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getAllUsers, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getAllUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReagentController_getAllReagents: Record<string, TsoaRoute.ParameterSchema> = {
                category: {"in":"query","name":"category","dataType":"array","array":{"dataType":"refAlias","ref":"ReagentCategory"}},
        };
        app.get('/reagents',
            ...(fetchMiddlewares<RequestHandler>(ReagentController)),
            ...(fetchMiddlewares<RequestHandler>(ReagentController.prototype.getAllReagents)),

            async function ReagentController_getAllReagents(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReagentController_getAllReagents, request, response });

                const controller = new ReagentController();

              await templateService.apiHandler({
                methodName: 'getAllReagents',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReagentController_getReagent: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/reagents/:id',
            ...(fetchMiddlewares<RequestHandler>(ReagentController)),
            ...(fetchMiddlewares<RequestHandler>(ReagentController.prototype.getReagent)),

            async function ReagentController_getReagent(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReagentController_getReagent, request, response });

                const controller = new ReagentController();

              await templateService.apiHandler({
                methodName: 'getReagent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReagentController_createReagent: Record<string, TsoaRoute.ParameterSchema> = {
                requestObject: {"in":"body","name":"requestObject","required":true,"ref":"CreateReagentRequest"},
        };
        app.post('/reagents/:id',
            ...(fetchMiddlewares<RequestHandler>(ReagentController)),
            ...(fetchMiddlewares<RequestHandler>(ReagentController.prototype.createReagent)),

            async function ReagentController_createReagent(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReagentController_createReagent, request, response });

                const controller = new ReagentController();

              await templateService.apiHandler({
                methodName: 'createReagent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReagentController_deleteReagent: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/reagents/:id',
            ...(fetchMiddlewares<RequestHandler>(ReagentController)),
            ...(fetchMiddlewares<RequestHandler>(ReagentController.prototype.deleteReagent)),

            async function ReagentController_deleteReagent(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReagentController_deleteReagent, request, response });

                const controller = new ReagentController();

              await templateService.apiHandler({
                methodName: 'deleteReagent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReagentController_updateReagent: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                update: {"in":"body","name":"update","required":true,"ref":"Partial_Reagent_"},
        };
        app.patch('/reagents/:id',
            ...(fetchMiddlewares<RequestHandler>(ReagentController)),
            ...(fetchMiddlewares<RequestHandler>(ReagentController.prototype.updateReagent)),

            async function ReagentController_updateReagent(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReagentController_updateReagent, request, response });

                const controller = new ReagentController();

              await templateService.apiHandler({
                methodName: 'updateReagent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGoogleOAuthController_verifyToken: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"GoogleOAuthRequest"},
        };
        app.post('/auth/google/verify',
            ...(fetchMiddlewares<RequestHandler>(GoogleOAuthController)),
            ...(fetchMiddlewares<RequestHandler>(GoogleOAuthController.prototype.verifyToken)),

            async function GoogleOAuthController_verifyToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGoogleOAuthController_verifyToken, request, response });

                const controller = new GoogleOAuthController();

              await templateService.apiHandler({
                methodName: 'verifyToken',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LoginRequest"},
        };
        app.post('/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_sendVerificationCode: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"SendVerificationCodeRequest"},
        };
        app.post('/auth/send-verification-code',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.sendVerificationCode)),

            async function AuthController_sendVerificationCode(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_sendVerificationCode, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'sendVerificationCode',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_verifyCode: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"VerifyCodeRequest"},
        };
        app.post('/auth/verify-code',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.verifyCode)),

            async function AuthController_verifyCode(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_verifyCode, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'verifyCode',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_signUp: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"SignUpRequest"},
        };
        app.post('/auth/signup',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.signUp)),

            async function AuthController_signUp(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_signUp, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'signUp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
