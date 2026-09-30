using TutoringCRM.Application.DTOs;

namespace TutoringCRM.Application.Interfaces;

public interface ILessonsService
{
    IEnumerable<LessonDto> GetAllLessons();
    IEnumerable<LessonDto> GetLessonsByStudentId(int studentId);
    LessonDto? GetLessonById(int id);
    Task<LessonDto> CreateLessonAsync(CreateLessonDto createLessonDto);
    Task DeleteLessonAsync(int id);
}
