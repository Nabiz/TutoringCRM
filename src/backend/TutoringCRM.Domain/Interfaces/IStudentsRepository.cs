using System.Collections.Generic;
using TutoringCRM.Domain.Entities;

namespace TutoringCRM.Domain.Interfaces;

public interface IStudentsRepository
{
    IEnumerable<Student> GetAll();
    Student? GetById(string id);
}