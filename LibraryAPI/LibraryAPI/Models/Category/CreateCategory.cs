using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace LibraryAPI.Models;

public class CreateCategory
{
    public string Name { get; set; }
    public string Priority { get; set; }
    public bool Premium{ get; set; }
    public string CreatedBy { get; set; }
}

