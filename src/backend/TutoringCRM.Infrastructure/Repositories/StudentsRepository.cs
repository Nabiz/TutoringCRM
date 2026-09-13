using System.Collections.Generic;
using System.Linq;
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

    public IEnumerable<Student> GetAll()
    {
        return _dbContext.Students.ToList();
    }

    public Student? GetById(int id)
    {
        return _dbContext.Students.FirstOrDefault(s => s.Id == id);
    }
    public void Add(Student student)
    {
        _dbContext.Students.Add(student);
        _dbContext.SaveChanges();
    }
}