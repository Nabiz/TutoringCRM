namespace TutoringCRM.Domain.Entities;

public class Lesson
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int DurationInMinutes { get; set; }
    public LessonMode Mode { get; set; }
    public bool IsPaid { get; set; }
    
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
}

public enum LessonMode
{
    Online,
    AtTutor,
    AtStudent
}