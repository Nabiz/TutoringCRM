using TutoringCRM.Domain.Entities;

namespace TutoringCRM.Domain.Interfaces;

public interface ILessonsRepository
{
    Task<IEnumerable<Lesson>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Lesson>> GetByStudentIdAsync(int studentId, CancellationToken cancellationToken = default);
    Task<Lesson?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Lesson lesson, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task UpdateAsync(Lesson lesson, CancellationToken cancellationToken = default);
}
