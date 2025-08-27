import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => {
    return {
        secret: process.env.JWT_SECRET,
        aud: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        ttl: Number(process.env.JWT_TTL ?? '3600'),
        refreshTtl: Number(process.env.JWT_REFRESH_TTL ?? '84600'),
    }
});