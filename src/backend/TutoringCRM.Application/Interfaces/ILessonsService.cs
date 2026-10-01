using TutoringCRM.Application.DTOs;

namespace TutoringCRM.Application.Interfaces;

public interface ILessonsService
{
    Task<IEnumerable<LessonDto>> GetAllLessonsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<LessonDto>> GetLessonsByStudentIdAsync(int studentId, CancellationToken cancellationToken = default);
    Task<LessonDto?> GetLessonByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<LessonDto> CreateLessonAsync(CreateLessonDto createLessonDto, CancellationToken cancellationToken = default);
    Task<LessonDto> UpdateLessonAsync(int id, LessonDto updateLessonDto, CancellationToken cancellationToken = default);
    Task<LessonDto> ConfirmPaymentAsync(int id, CancellationToken cancellationToken = default);
    Task DeleteLessonAsync(int id, CancellationToken cancellationToken = default);
}
