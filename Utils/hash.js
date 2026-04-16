import crypto from "crypto";

export const hash = (password) => {
    const salt = getSalt(parseInt(process.env.SALT_SIZE));
    const salted = salt + password + salt;
    const hashing = crypto.createHash("sha256")
    const hash = hashing.update(salted).digest("base64url")
    return { salt, hash };
}

export const getSalt = (size) => {
    return crypto.randomBytes(size).toString("base64url").substring(0, size);
}