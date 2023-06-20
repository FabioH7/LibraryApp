using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LibraryAPI.Models;
using LibraryAPI.Models.AuthModels;
using Microsoft.AspNetCore.Authentication;
using BCrypt.Net;

[ApiController]
[Route("api/login")]
public class LoginController : ControllerBase
{
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly UserManager<User> _userManager;

    public LoginController(SignInManager<User> signInManager, IConfiguration configuration, UserManager<User> userManager)
    {
        _signInManager = signInManager;
        _configuration = configuration;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> Login(LoginModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user != null)
            {
                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    var token = await GenerateJwtTokenAsync(user);
                    return Ok(new { Token = token, User = user });
                }
            }
        }

        var response = new
        {
            Message = "Invalid username or password.",
            ErrorCode = 401
        };

        return StatusCode(401, response);
    }


    private async Task<string> GenerateJwtTokenAsync(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]);
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var expiration = DateTime.UtcNow.AddDays(Convert.ToInt32(jwtSettings["ExpirationDays"]));

        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiration,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
