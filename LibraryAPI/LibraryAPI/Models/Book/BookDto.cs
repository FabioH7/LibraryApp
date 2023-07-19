public class BookDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public string Author { get; set; }
    public string CreatedBy { get; set; }
    public string CreatedAt { get; set; }
    public List<string>? Categories { get; set; }
}