import { registerAs } from "@nestjs/config";

export default registerAs('message', () => ({
    teste1: 'VALOR 1',
    teste2: 'VALOR 2',
}));