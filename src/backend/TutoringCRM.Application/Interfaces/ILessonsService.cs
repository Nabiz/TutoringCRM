using TutoringCRM.Application.DTOs;

namespace TutoringCRM.Application.Interfaces;

public interface ILessonsService
{
    IEnumerable<LessonDto> GetAllLessons();
    LessonDto? GetLessonById(int id);
    Task<LessonDto> CreateLessonAsync(CreateLessonDto createLessonDto);
}
