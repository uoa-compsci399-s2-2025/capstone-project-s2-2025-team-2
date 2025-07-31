/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from "@tsoa/runtime"
import { fetchMiddlewares, ExpressTemplateService } from "@tsoa/runtime"
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from "./../../service-layer/controllers/UserController"
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from "express"

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  User: {
    dataType: "refObject",
    properties: {
      id: { dataType: "double", required: true },
      email: { dataType: "string", required: true },
      name: { dataType: "string", required: true },
      phoneNumbers: {
        dataType: "array",
        array: { dataType: "string" },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Pick_User.email-or-name-or-phoneNumbers_": {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        email: { dataType: "string", required: true },
        name: { dataType: "string", required: true },
        phoneNumbers: {
          dataType: "array",
          array: { dataType: "string" },
          required: true,
        },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UserCreationParams: {
    dataType: "refAlias",
    type: {
      dataType: "intersection",
      subSchemas: [
        { ref: "Pick_User.email-or-name-or-phoneNumbers_" },
        {
          dataType: "nestedObjectLiteral",
          nestedProperties: { isAdmin: { dataType: "boolean" } },
        },
      ],
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: "throw-on-extras",
  bodyCoercion: true,
})

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsUsersController_getUser: Record<string, TsoaRoute.ParameterSchema> =
    {
      userId: {
        in: "path",
        name: "userId",
        required: true,
        dataType: "double",
      },
      name: { in: "query", name: "name", dataType: "string" },
    }
  app.get(
    "/users/:userId",
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(UsersController.prototype.getUser),

    async function UsersController_getUser(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_getUser,
          request,
          response,
        })

        const controller = new UsersController()

        await templateService.apiHandler({
          methodName: "getUser",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        })
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_createUser: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "UserCreationParams",
    },
  }
  app.post(
    "/users",
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(UsersController.prototype.createUser),

    async function UsersController_createUser(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_createUser,
          request,
          response,
        })

        const controller = new UsersController()

        await templateService.apiHandler({
          methodName: "createUser",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        })
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_deleteUser: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: { in: "path", name: "userId", required: true, dataType: "double" },
  }
  app.delete(
    "/users/:userId",
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(UsersController.prototype.deleteUser),

    async function UsersController_deleteUser(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_deleteUser,
          request,
          response,
        })

        const controller = new UsersController()

        await templateService.apiHandler({
          methodName: "deleteUser",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        })
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_getAllUsers: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {}
  app.get(
    "/users",
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(UsersController.prototype.getAllUsers),

    async function UsersController_getAllUsers(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_getAllUsers,
          request,
          response,
        })

        const controller = new UsersController()

        await templateService.apiHandler({
          methodName: "getAllUsers",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        })
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
