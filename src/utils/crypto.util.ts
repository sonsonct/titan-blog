import * as crypto from 'crypto';

export class CryptoUtil {
  /**
   *
   * @param plainText plain text
   * @param secretKey secret key in form of plain text must be of 16, 24 and 32 character long for 128, 192 and 256 bits of key size.
   * @returns encrypted string in base64 encode
   */
  public static encryptString(
    plainText: string,
    secretKey: string,
    algorithm?: crypto.CipherGCMTypes,
  ) {
    if (!algorithm) algorithm = 'aes-128-gcm';

    const iv = secretKey.substring(0, 16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv, { authTagLength: 16 });
    const encrypted = Buffer.concat([
      cipher.update(plainText),
      cipher.final(),
      cipher.getAuthTag(),
    ]);
    return encrypted.toString('base64');
  }

  /**
   *
   * @param encryptedText encrypted string in base64 encode
   * @param secretKey string has length is 16
   * @returns string plain text
   */
  public static decryptString(
    encryptedText: string,
    secretKey: string,
    algorithm?: crypto.CipherGCMTypes,
  ) {
    if (!algorithm) algorithm = 'aes-128-gcm';

    const iv = secretKey.substring(0, 16);
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv, { authTagLength: 16 });

    const encRawTextBuff = Buffer.from(encryptedText, 'base64');

    const authTagBuff = encRawTextBuff.subarray(encRawTextBuff.length - 16); // Returns a new Buffer that references the same memory as the original, but offset and cropped by the start and end indices.
    const encryptedTextBuff = encRawTextBuff.subarray(0, encRawTextBuff.length - 16); // Returns a new Buffer that references the same memory as the original, but offset and cropped by the start and end indices.

    decipher.setAuthTag(authTagBuff);

    const decrypted = Buffer.concat([decipher.update(encryptedTextBuff), decipher.final()]);

    return decrypted.toString();
  }

  public static hashString(plainStr: string, key: string, algorithm?: string): string {
    algorithm = algorithm || 'sha256';
    const hash = crypto.createHmac(algorithm, key);
    hash.update(plainStr);
    return hash.digest('hex');
  }
}
