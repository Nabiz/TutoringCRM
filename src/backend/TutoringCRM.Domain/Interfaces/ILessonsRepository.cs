using TutoringCRM.Domain.Entities;

namespace TutoringCRM.Domain.Interfaces;

public interface ILessonsRepository
{
    IEnumerable<Lesson> GetAll();
    Lesson? GetById(int id);
    void Add(Lesson lesson);
}
