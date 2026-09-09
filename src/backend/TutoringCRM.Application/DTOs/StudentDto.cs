namespace TutoringCRM.Application.DTOs;

public class StudentDto
{
    public required string Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public int Grade { get; set; }
}