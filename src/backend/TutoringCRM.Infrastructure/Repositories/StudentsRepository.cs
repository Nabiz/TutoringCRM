using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TutoringCRM.Domain.Entities;
using TutoringCRM.Domain.Interfaces;
using TutoringCRM.Infrastructure.Data;

namespace TutoringCRM.Infrastructure.Repositories;

public class StudentsRepository : IStudentsRepository
{
    private readonly TutoringDbContext _dbContext;

    public StudentsRepository(TutoringDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Student>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Students.ToListAsync(cancellationToken);
    }

    public Task<Student?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Students.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }
    public async Task AddAsync(Student student, CancellationToken cancellationToken = default)
    {
        _dbContext.Students.Add(student);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
