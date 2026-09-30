using TutoringCRM.Domain.Entities;

namespace TutoringCRM.Domain.Interfaces;

public interface ILessonsRepository
{
    IEnumerable<Lesson> GetAll();
    IEnumerable<Lesson> GetByStudentId(int studentId);
    Lesson? GetById(int id);
    void Add(Lesson lesson);
    void Delete(int id);
}
