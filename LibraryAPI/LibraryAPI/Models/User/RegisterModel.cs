namespace LibraryAPI.Models;

public class RegisterModel
{
    public string Name { get; set; }
    public string Surname { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string CreatedBy { get; set; }
    public string? Bio { get; set; }
    public int RoleId { get; set; }
}