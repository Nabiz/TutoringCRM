namespace TutoringCRM.Domain.Entities;

public class Student
{
    public required int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public int Grade { get; set; }

    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}