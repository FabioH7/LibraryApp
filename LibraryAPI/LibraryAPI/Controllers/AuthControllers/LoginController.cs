using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using LibraryAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Configuration;
using LibraryAPI.Models.AuthModels;

namespace Backend_Web_Lib.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;

        public AccountController(UserManager<User> userManager, IConfiguration configuration, ITokenService tokenService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterModel model)
        {
            var newUser = new User { Name = model.Name, Surname = model.Surname, Bio = model.Bio, RoleId = model.RoleId };
            var isCreated = await _userManager.CreateAsync(newUser);
            if (isCreated.Succeeded)
            {
                return Ok();
            }
            else
            {

                return BadRequest(isCreated.Errors);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null)
            {
                var passwordHasher = new PasswordHasher<User>();
                var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);
                if (result == PasswordVerificationResult.Failed)
                {
                    return Unauthorized();
                }
                var roles = await _userManager.GetRolesAsync(user);
                var roleClaims = roles.Select(role => new Claim(ClaimTypes.Role, role));

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                }.Union(roleClaims);

                var token = _tokenService.GenerateAccessToken(user);

                return Ok(new
                {
                    token,
                    user = new
                    {
                        username = user.UserName,
                        email = user.Email,
                        role = roles
                    }
                });
            }

            return Unauthorized();
        }
    }
}
