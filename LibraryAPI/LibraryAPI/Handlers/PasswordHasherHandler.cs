using System;
using System.Security.Cryptography;

public class PasswordHasher
{
    private const int SaltSize = 16; // 16 bytes = 128 bits
    private const int HashSize = 32; // 32 bytes = 256 bits
    private const int Iterations = 10000;

    public static string HashPassword(string password)
    {
        // Generate a random salt
        byte[] salt = new byte[SaltSize];
        using (var rng = new RNGCryptoServiceProvider())
        {
            rng.GetBytes(salt);
        }

        // Compute the hash of the password with the salt
        byte[] hash = ComputeHash(password, salt);

        // Combine the salt and hash together
        byte[] saltedHash = new byte[SaltSize + HashSize];
        Array.Copy(salt, 0, saltedHash, 0, SaltSize);
        Array.Copy(hash, 0, saltedHash, SaltSize, HashSize);

        // Convert the combined salted hash to Base64 string for storage
        string hashedPassword = Convert.ToBase64String(saltedHash);

        return hashedPassword;
    }

    public static bool VerifyPassword(string password, string hashedPassword)
    {
        // Convert the Base64 string back to byte array
        byte[] saltedHash = Convert.FromBase64String(hashedPassword);

        // Extract the salt from the salted hash
        byte[] salt = new byte[SaltSize];
        Array.Copy(saltedHash, 0, salt, 0, SaltSize);

        // Compute the hash of the provided password with the extracted salt
        byte[] hash = ComputeHash(password, salt);

        // Compare the computed hash with the stored salted hash
        bool passwordsMatch = CompareByteArrays(hash, 0, saltedHash, SaltSize, HashSize);

        return passwordsMatch;
    }

    private static byte[] ComputeHash(string password, byte[] salt)
    {
        using (var rfc2898DeriveBytes = new Rfc2898DeriveBytes(password, salt, Iterations))
        {
            return rfc2898DeriveBytes.GetBytes(HashSize);
        }
    }

    private static bool CompareByteArrays(byte[] array1, int offset1, byte[] array2, int offset2, int count)
    {
        for (int i = 0; i < count; i++)
        {
            if (array1[offset1 + i] != array2[offset2 + i])
                return false;
        }
        return true;
    }
}
