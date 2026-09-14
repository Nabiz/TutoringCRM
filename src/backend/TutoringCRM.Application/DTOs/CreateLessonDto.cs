using TutoringCRM.Domain.Entities;

namespace TutoringCRM.Application.DTOs;

public class CreateLessonDto
{
    public required DateTime Date { get; set; }
    public int DurationInMinutes { get; set; }
    public LessonMode Mode { get; set; }
    public bool IsPaid { get; set; }
    public int StudentId { get; set; }
}
