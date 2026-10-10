using System.Collections.Generic;
using TutoringCRM.Domain.Entities;

namespace TutoringCRM.Domain.Interfaces;

public interface IStudentsRepository
{
    Task<IEnumerable<Student>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Student?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Student student, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
