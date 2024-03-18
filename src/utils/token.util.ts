import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

export async function generateToken(
  payload: string | object | Buffer,
  secretOrPrivateKey: Secret,
  options?: SignOptions
) {
  return jwt.sign(payload, secretOrPrivateKey, options);
}

export async function verifyToken(
  token: string,
  secretOrPublicKey: Secret
): Promise<JwtPayload> {
  return jwt.verify(token, secretOrPublicKey) as JwtPayload;
}
