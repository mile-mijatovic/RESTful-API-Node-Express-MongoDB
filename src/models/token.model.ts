import { Model, model, Schema } from "mongoose";
import { IToken, TokenModel } from "../types/token";

const tokenSchema = new Schema<IToken, TokenModel>({
  token: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expires: { type: Date, required: true },
});

class TokenClass extends Model<TokenModel> {
  static async generateToken(token: string, userId: string, expires: number) {
    const generatedToken = await this.create({
      token: token,
      userId: userId,
      expires,
    });

    return generatedToken;
  }

  static async deleteToken(tokenId: string) {
    await this.deleteOne({ _id: tokenId });
  }

  static async getToken(generatedToken: string) {
    return await this.findOne({
      token: generatedToken,
      expires: { $gt: Date.now() },
    });
  }
}

tokenSchema.loadClass(TokenClass);

const Token = model<IToken, TokenModel>("Token", tokenSchema);

export default Token;
