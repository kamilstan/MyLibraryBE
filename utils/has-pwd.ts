import * as crypto from "crypto";

export const hashPwd = (p: string): string => {
    const hmac = crypto.createHmac('sha512', 'ew884nfiofssfjfeifufmloodfjofi3h');
    hmac.update(p);
    return hmac.digest('hex')
}