namespace TutoringCRM.Application.DTOs;

public class CreateStudentDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public int Grade { get; set; }
}