using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TutoringCRM.Domain.Entities;
using TutoringCRM.Domain.Interfaces;
using TutoringCRM.Infrastructure.Data;

namespace TutoringCRM.Infrastructure.Repositories;

public class LessonsRepository : ILessonsRepository
{
    private readonly TutoringDbContext _dbContext;

    public LessonsRepository(TutoringDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Lesson>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Lessons.ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Lesson>> GetByDateRangeAsync(
        DateTime fromUtc, DateTime toUtc, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Lessons
            .AsNoTracking()
            .Where(lesson => lesson.Date >= fromUtc && lesson.Date < toUtc)
            .OrderBy(lesson => lesson.Date)
            .ThenBy(lesson => lesson.Id)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Lesson>> GetByStudentIdAsync(int studentId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Lessons
            .Where(lesson => lesson.StudentId == studentId)
            .ToListAsync(cancellationToken);
    }

    public Task<Lesson?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return _dbContext.Lessons.FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
    }

    public async Task AddAsync(Lesson lesson, CancellationToken cancellationToken = default)
    {
        _dbContext.Lessons.Add(lesson);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Lesson lesson, CancellationToken cancellationToken = default)
    {
        _dbContext.Lessons.Update(lesson);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var lesson = await _dbContext.Lessons.FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
        if (lesson != null)
        {
            _dbContext.Lessons.Remove(lesson);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
