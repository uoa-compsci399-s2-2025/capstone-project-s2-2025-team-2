import { Response } from "./ResponseDto"
import GoogleOAuthUser from "../Object/GoogleOAuthUser"

export default interface GoogleOAuthResponseDto extends Response {
  token?: string
  user?: GoogleOAuthUser
}
