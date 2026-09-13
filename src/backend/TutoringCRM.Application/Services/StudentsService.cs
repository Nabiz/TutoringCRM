using System.Collections.Generic;
using System.Linq;
using TutoringCRM.Application.DTOs;
using TutoringCRM.Application.Interfaces;
using TutoringCRM.Domain.Interfaces;
using TutoringCRM.Domain.Entities;

namespace TutoringCRM.Application.Services;

public class StudentsService : IStudentsService
{
    private readonly IStudentsRepository _studentsRepository;

    public StudentsService(IStudentsRepository studentsRepository)
    {
        _studentsRepository = studentsRepository;
    }

    public IEnumerable<StudentDto> GetAllStudents()
    {
        var students = _studentsRepository.GetAll();

        return students.Select(student => new StudentDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Grade = student.Grade
        });
    }

    public StudentDto? GetStudentById(int id)
    {
        var student = _studentsRepository.GetById(id);

        if (student == null)
        {
            return null;
        }

        return new StudentDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Grade = student.Grade
        };
    }

public async Task<StudentDto> CreateStudentAsync(CreateStudentDto createDto)
    {
        var student = new Student
        {
            Id = 0,
            FirstName = createDto.FirstName,
            LastName = createDto.LastName,
            Grade = createDto.Grade
        };

        _studentsRepository.Add(student);

        return new StudentDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Grade = student.Grade
        };
    }
}