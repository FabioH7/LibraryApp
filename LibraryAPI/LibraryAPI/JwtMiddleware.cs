using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task Invoke(HttpContext context, ITokenService tokenService)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        if (token != null)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"])),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidAudience = _configuration["JwtSettings:Audience"],
                ClockSkew = TimeSpan.Zero
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
                var jwtToken = (JwtSecurityToken)validatedToken;

                var expirationDateUnix = long.Parse(jwtToken.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp)?.Value);
                var expirationDate = DateTimeOffset.FromUnixTimeSeconds(expirationDateUnix).UtcDateTime;

                if (expirationDate <= DateTime.UtcNow)
                {
                    // Access token has expired, check refresh token
                    var refreshToken = context.Request.Headers["RefreshToken"].FirstOrDefault();
                    if (refreshToken != null)
                    {
                        var tokenResult = tokenService.RefreshTokens(refreshToken);
                        if (tokenResult != null)
                        {
                            // Tokens refreshed successfully, return them to the frontend
                            context.Response.Headers["Access-Token"] = tokenResult.AccessToken;
                            context.Response.Headers["Refresh-Token"] = tokenResult.RefreshToken;
                        }
                        else
                        {
                            // Refresh token not found or invalid, set unauthorized status
                            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                            return;
                        }
                    }
                    else
                    {
                        // Refresh token not provided, set unauthorized status
                        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        return;
                    }
                }
                else
                {
                    // Access token is still valid, continue with the request
                    AttachUserToContext(context, token);
                }
            }
            catch (Exception)
            {
                // Token validation failed
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }
        }

        await _next(context);
    }

    private void AttachUserToContext(HttpContext context, string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"]);

        try
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidAudience = _configuration["JwtSettings:Audience"],
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
            var jwtToken = (JwtSecurityToken)validatedToken;

            var expirationDateUnix = long.Parse(jwtToken.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp)?.Value);
            var expirationDate = DateTimeOffset.FromUnixTimeSeconds(expirationDateUnix).UtcDateTime;

            if (expirationDate <= DateTime.UtcNow)
            {
                // Token has expired, log out the user
                // You can perform any necessary logout logic here
                // For example, you can clear authentication cookies or session data
                // You can also redirect the user to the login page
                // This example simply sets a "401 Unauthorized" status code
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return;
            }

            // Token is valid, continue with the request

            // Set the user identity on the context
            context.User = principal;
        }
        catch (Exception)
        {
            // Token validation failed
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        }
    }
}
