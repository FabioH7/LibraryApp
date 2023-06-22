using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAPI.Models;
using Microsoft.AspNetCore.Identity;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly DatabaseContext _dbContext;
        private readonly UserManager<User> _userManager;

        public UserController(DatabaseContext dbContext, UserManager<User> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> Get()
        {
            var users = await _dbContext.Users
            .Include(b => b.Role)
            .ToListAsync();
            var userDtos = users.Select(user => new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Bio = user.Bio,
                Role = user.Role.Name,

            }).ToList();
            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        public ActionResult<User> Get(int id)
        {
            var user = _dbContext.Users.Find(id);
            if (user == null)
            {
                return NotFound("User not found");
            }
            var userDto = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Bio = user.Bio,
                Role = user.Role.Name,

            };
            return Ok(userDto);
        }

        [HttpDelete("{id}")]
        [Authorize("AdminOnly")]
        public User Delete(int id)
        {
            User? user = _dbContext.Users.Find(id);
            if (user != null)
            {
                _dbContext.Users.Remove(user);
                _dbContext.SaveChanges();
                return user;
            }
            else
            {
                throw new ArgumentNullException();
            }
        }

        [HttpPost]
        [Authorize("AdminOnly")]
        public async Task<ActionResult<User>> Post(RegisterModel user)
        {
            var userExists = await _userManager.FindByEmailAsync(user.Email);
            if (userExists == null)
            {
                User newUser = new User { Name = user.Name, Surname = user.Surname, Email = user.Email, UserName = user.Email, RoleId = user.RoleId, Bio = user.Bio };
                var result = await _userManager.CreateAsync(newUser, user.Password);

                if (result.Succeeded)
                {
                    return await Task.FromResult(newUser);
                }
                else
                {
                    var errors = result.Errors.Select(e => e.Description);
                    Console.WriteLine("Failed to create user. Errors: " + string.Join(", ", errors));
                }
            }
            return BadRequest("User already exists.");
        }

    }
}

