import crypto from "crypto";

// Para Registros
export const hashPassword = (password) => {
    const salt = getSalt(parseInt(process.env.SALT_SIZE));
    const salted = salt + password + salt;

    const hash = crypto
        .createHash("sha256")
        .update(salted)
        .digest("base64url");

    return salt + hash;
};

// Para Login
export const verifyPassword = (password, storedPassword) => {
    const saltSize = parseInt(process.env.SALT_SIZE);
    const salt = storedPassword.substring(0, saltSize);

    const salted = salt + password + salt;

    const hash = crypto
        .createHash("sha256")
        .update(salted)
        .digest("base64url");

    return storedPassword === (salt + hash);
};

export const getSalt = (size) => {
    return crypto.randomBytes(size).toString("base64url").substring(0, size);
}