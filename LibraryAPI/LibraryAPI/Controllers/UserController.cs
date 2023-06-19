﻿using Microsoft.AspNetCore.Authorization;
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
            return await _dbContext.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public User Get(int id)
        {
            return _dbContext.Users.Find(id);
        }

        [HttpDelete("{id}")]
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
        public async Task<ActionResult<User>> Post(RegisterModel user)
        {
            var userExists = await _userManager.FindByEmailAsync(user.Email);
            if (userExists == null)
            {

                User newUser = new User { Name = user.Name, Surname = user.Surname, Email = user.Email, UserName = user.Email, PasswordHash = user.Password, RoleId = user.RoleId };
                var passwordHasher = new PasswordHasher<User>();
                newUser.PasswordHash = passwordHasher.HashPassword(newUser, user.Password);
                await _dbContext.Users.AddAsync(newUser);
                await _dbContext.SaveChangesAsync();
                return await Task.FromResult(newUser);
            }
            return Unauthorized();
        }
    }
}

