using System.Collections.Generic;
using System.Linq;
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

    public IEnumerable<Lesson> GetAll()
    {
        return _dbContext.Lessons.ToList();
    }

    public IEnumerable<Lesson> GetByStudentId(int studentId)
    {
        return _dbContext.Lessons
            .Where(lesson => lesson.StudentId == studentId)
            .ToList();
    }

    public Lesson? GetById(int id)
    {
        return _dbContext.Lessons.FirstOrDefault(l => l.Id == id);
    }

    public void Add(Lesson lesson)
    {
        _dbContext.Lessons.Add(lesson);
        _dbContext.SaveChanges();
    }
}
