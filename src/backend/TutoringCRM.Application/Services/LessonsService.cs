using System.Collections.Generic;
using System.Linq;
using TutoringCRM.Application.DTOs;
using TutoringCRM.Application.Interfaces;
using TutoringCRM.Domain.Entities;
using TutoringCRM.Domain.Interfaces;

namespace TutoringCRM.Application.Services;

public class LessonsService : ILessonsService
{
    private readonly ILessonsRepository _lessonsRepository;

    public LessonsService(ILessonsRepository lessonsRepository)
    {
        _lessonsRepository = lessonsRepository;
    }

    public IEnumerable<LessonDto> GetAllLessons()
    {
        var lessons = _lessonsRepository.GetAll();

        return lessons.Select(lesson => new LessonDto
        {
            Id = lesson.Id,
            Date = lesson.Date,
            DurationInMinutes = lesson.DurationInMinutes,
            Mode = lesson.Mode,
            IsPaid = lesson.IsPaid,
            StudentId = lesson.StudentId
        });
    }

    public IEnumerable<LessonDto> GetLessonsByStudentId(int studentId)
    {
        var lessons = _lessonsRepository.GetByStudentId(studentId);

        return lessons.Select(lesson => new LessonDto
        {
            Id = lesson.Id,
            Date = lesson.Date,
            DurationInMinutes = lesson.DurationInMinutes,
            Mode = lesson.Mode,
            IsPaid = lesson.IsPaid,
            StudentId = lesson.StudentId
        });
    }

    public LessonDto? GetLessonById(int id)
    {
        var lesson = _lessonsRepository.GetById(id);

        if (lesson == null)
        {
            return null;
        }

        return new LessonDto
        {
            Id = lesson.Id,
            Date = lesson.Date,
            DurationInMinutes = lesson.DurationInMinutes,
            Mode = lesson.Mode,
            IsPaid = lesson.IsPaid,
            StudentId = lesson.StudentId
        };
    }

    public async Task<LessonDto> CreateLessonAsync(CreateLessonDto createDto)
    {
        var lesson = new Lesson
        {
            Id = 0,
            Date = createDto.Date,
            DurationInMinutes = createDto.DurationInMinutes,
            Mode = createDto.Mode,
            IsPaid = createDto.IsPaid,
            StudentId = createDto.StudentId
        };

        _lessonsRepository.Add(lesson);

        return new LessonDto
        {
            Id = lesson.Id,
            Date = lesson.Date,
            DurationInMinutes = lesson.DurationInMinutes,
            Mode = lesson.Mode,
            IsPaid = lesson.IsPaid,
            StudentId = lesson.StudentId
        };
    }

    public async Task DeleteLessonAsync(int id)
    {
        _lessonsRepository.Delete(id);
    }
}
