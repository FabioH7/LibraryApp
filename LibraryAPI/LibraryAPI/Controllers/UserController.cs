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
        private readonly RoleManager<Role> _roleManager;

        public UserController(DatabaseContext dbContext, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> Get()
        {
            var users = await _dbContext.Users
                .Include(u => u.Role)
                .Include(u => u.Books)
                .ToListAsync();

            var userDtos = users.Select(user => new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Bio = user.Bio,
                Role = user.Role.Name,
                CreatedBy = user.CreatedBy,
                CreatedAt = user.CreatedAt,
                Books = user.Books.Select(book => new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Description = book.Description,
                    Author = book.Author.Name,
                    ImageUrl = book.ImageUrl
                }).ToList()
            }).ToList();

            return Ok(userDtos);
        }


        [HttpGet("{id}")]
        public ActionResult<User> Get(int id)
        {
            var user = _dbContext.Users
            .Include(u => u.Role)
            .Include(u => u.Books)
            .ThenInclude(ub => ub.Categories)
            .FirstOrDefault(u => u.Id == id);

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
                Books = user.Books.Select(book => new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Description = book.Description,
                    Author = book.Author.Name,
                    ImageUrl = book.ImageUrl,

                }).ToList()
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
                string createdAt = DateTime.Now.ToString("MM/dd/yyyy H:mm");
                User newUser = new User { Name = user.Name, Surname = user.Surname, Email = user.Email, CreatedAt = createdAt, CreatedBy = user.CreatedBy, UserName = user.Email, RoleId = user.RoleId, Bio = user.Bio };
                var result = await _userManager.CreateAsync(newUser, user.Password);
                var role = await _roleManager.FindByIdAsync(user.RoleId.ToString());
                if (role != null)
                {
                    if (!await _userManager.IsInRoleAsync(newUser, role.Name))
                    {
                        var addToRoleResult = await _userManager.AddToRoleAsync(newUser, role.Name);
                        if (!addToRoleResult.Succeeded)
                        {
                            var addToRoleErrors = addToRoleResult.Errors.Select(e => e.Description);
                            Console.WriteLine("Failed to assign role to the user. Errors: " + string.Join(", ", addToRoleErrors));
                        }
                    }
                }
                else
                {
                    Console.WriteLine("Role not found for the specified RoleId.");
                }
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

        [HttpPut("{id}")]
        [Authorize("AdminOnly")]
        public async Task<ActionResult<User>> Put(int id, RegisterModel user)
        {
            var existingUser = await _userManager.FindByIdAsync(id.ToString());
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.Name = user.Name;
            existingUser.Surname = user.Surname;
            existingUser.Email = user.Email;
            existingUser.UserName = user.Email;
            existingUser.RoleId = user.RoleId;
            existingUser.Bio = user.Bio;

            var result = await _userManager.UpdateAsync(existingUser);
            if (result.Succeeded)
            {
                var role = await _roleManager.FindByIdAsync(user.RoleId.ToString());
                if (role != null)
                {
                    if (!await _userManager.IsInRoleAsync(existingUser, role.Name))
                    {
                        var addToRoleResult = await _userManager.AddToRoleAsync(existingUser, role.Name);
                        if (!addToRoleResult.Succeeded)
                        {
                            var addToRoleErrors = addToRoleResult.Errors.Select(e => e.Description);
                            Console.WriteLine("Failed to assign role to the user. Errors: " + string.Join(", ", addToRoleErrors));
                        }
                    }
                }
                else
                {
                    Console.WriteLine("Role not found for the specified RoleId.");
                }

                return existingUser;
            }
            else
            {
                var errors = result.Errors.Select(e => e.Description);
                Console.WriteLine("Failed to update user. Errors: " + string.Join(", ", errors));
                return BadRequest(errors);
            }
        }
    }
}

