import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { API_BASE_URL } from './core/config/api.config';
import { materialProviders } from './core/config/material.config';
import { Lesson } from './features/lessons/data-access/lesson.model';
import { LessonListComponent } from './features/lessons/pages/lesson-list/lesson-list.component';
import { Student } from './features/students/data-access/student.model';
import { StudentDetailsComponent } from './features/students/pages/student-details/student-details.component';
import { StudentListComponent } from './features/students/pages/student-list/student-list.component';

describe('Feature routes and API integration', () => {
  const apiUrl = 'http://test-api.local/api';
  const student: Student = { id: 7, firstName: 'Jan', lastName: 'Testowy', grade: 4 };
  const lesson: Lesson = {
    id: 11,
    date: '2026-10-02T16:30:00.000Z',
    durationInMinutes: 60,
    mode: 0,
    isPaid: false,
    studentId: 7,
  };
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: apiUrl },
        ...materialProviders,
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('redirects the home page to the students feature and displays fetched students', async () => {
    const harness = await RouterTestingHarness.create('/');
    http.expectOne(`${apiUrl}/students`).flush([student]);
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/students');
    expect(harness.routeNativeElement?.textContent).toContain('Jan Testowy');
    expect(
      harness.routeNativeElement?.querySelector('a[mat-list-item]')?.getAttribute('href'),
    ).toBe('/students/7');
  });

  it('creates a student through the extracted API service and refreshes the list', async () => {
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/students', StudentListComponent);
    http.expectOne(`${apiUrl}/students`).flush([]);
    page.studentForm = { firstName: ' Jan ', lastName: ' Testowy ', grade: 4 };

    page.onSubmit();
    const create = http.expectOne(`${apiUrl}/students`);
    expect(create.request.method).toBe('POST');
    expect(create.request.body).toEqual({ firstName: 'Jan', lastName: 'Testowy', grade: 4 });
    create.flush(student);
    http.expectOne(`${apiUrl}/students`).flush([student]);
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('Jan Testowy');
    expect(page.studentForm.firstName).toBe('');
  });

  it('loads student details and their lessons through the students endpoints', async () => {
    const harness = await RouterTestingHarness.create('/students/7');
    http.expectOne(`${apiUrl}/students/7`).flush(student);
    http.expectOne(`${apiUrl}/students/7/lessons`).flush([lesson]);
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('Jan Testowy');
    expect(harness.routeNativeElement?.querySelectorAll('mat-row').length).toBe(1);
    expect(harness.routeNativeElement?.textContent).toContain('60 min');
    expect(harness.routeNativeElement?.querySelectorAll('mat-header-cell').length).toBe(5);
    expect(harness.routeNativeElement?.querySelector('mat-table')?.getAttribute('aria-label')).toBe(
      'Historia lekcji ucznia',
    );
  });

  it('creates a lesson using the backend mode value and refreshes the lessons page', async () => {
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/lessons', LessonListComponent);
    http.expectOne(`${apiUrl}/lessons`).flush([]);
    page.lessonForm = {
      date: '2026-10-02T18:30',
      durationInMinutes: 90,
      mode: 'AtStudent',
      isPaid: true,
      studentId: 7,
    };

    page.onSubmit();
    const create = http.expectOne(`${apiUrl}/lessons`);
    expect(create.request.method).toBe('POST');
    expect(create.request.body).toEqual({
      date: new Date('2026-10-02T18:30').toISOString(),
      durationInMinutes: 90,
      mode: 2,
      isPaid: true,
      studentId: 7,
    });
    const savedLesson = { ...lesson, ...create.request.body };
    create.flush(savedLesson);
    http.expectOne(`${apiUrl}/lessons`).flush([savedLesson]);
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('90 min');
    expect(harness.routeNativeElement?.textContent).toContain('U ucznia');
    expect(harness.routeNativeElement?.querySelectorAll('mat-header-cell').length).toBe(6);
    expect(page.lessonForm.mode).toBe('Online');
  });

  it('deletes a lesson from student details and refreshes the student history', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/students/7', StudentDetailsComponent);
    http.expectOne(`${apiUrl}/students/7`).flush(student);
    http.expectOne(`${apiUrl}/students/7/lessons`).flush([lesson]);

    harness.detectChanges();
    const deleteButton = harness.routeNativeElement?.querySelector<HTMLButtonElement>(
      'button[aria-label^="Usuń lekcję"]',
    );
    expect(deleteButton).toBeTruthy();
    deleteButton!.click();
    const deletion = http.expectOne(`${apiUrl}/lessons/11`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush(null);
    http.expectOne(`${apiUrl}/students/7`).flush(student);
    http.expectOne(`${apiUrl}/students/7/lessons`).flush([]);
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('Brak lekcji dla tego ucznia.');
  });

  it('deletes a lesson from the shared table on the lessons page', async () => {
    const harness = await RouterTestingHarness.create('/lessons');
    http.expectOne(`${apiUrl}/lessons`).flush([lesson]);
    harness.detectChanges();

    const deleteButton = harness.routeNativeElement?.querySelector<HTMLButtonElement>(
      'button[aria-label^="Usuń lekcję"]',
    );
    expect(deleteButton).toBeTruthy();
    deleteButton!.click();
    const deletion = http.expectOne(`${apiUrl}/lessons/11`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush(null);
    http.expectOne(`${apiUrl}/lessons`).flush([]);
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('Brak lekcji.');
    expect(harness.routeNativeElement?.querySelector('mat-table')).toBeNull();
  });

  it.each(['/lessons', '/students/7'])(
    'confirms payment from %s, prevents duplicate requests and updates the row',
    async (route) => {
      const harness = await RouterTestingHarness.create(route);
      if (route === '/lessons') {
        http.expectOne(`${apiUrl}/lessons`).flush([lesson]);
      } else {
        http.expectOne(`${apiUrl}/students/7`).flush(student);
        http.expectOne(`${apiUrl}/students/7/lessons`).flush([lesson]);
      }
      harness.detectChanges();

      const paymentButton = harness.routeNativeElement!.querySelector<HTMLButtonElement>(
        'button[aria-label^="Oznacz jako opłaconą"]',
      )!;
      expect(paymentButton).toBeTruthy();
      paymentButton.click();
      paymentButton.click();
      const confirmation = http.expectOne(`${apiUrl}/lessons/11/confirm-payment`);
      expect(confirmation.request.method).toBe('POST');
      expect(confirmation.request.body).toBeNull();
      harness.detectChanges();
      expect(paymentButton.disabled).toBe(true);

      confirmation.flush({ ...lesson, isPaid: true });
      harness.detectChanges();

      expect(harness.routeNativeElement?.querySelector('mat-cell:nth-child(4)')?.textContent).toBe(
        'Opłacona',
      );
      expect(
        harness.routeNativeElement?.querySelector('button[aria-label^="Oznacz jako opłaconą"]'),
      ).toBeNull();
      expect(
        harness.routeNativeElement?.querySelector<HTMLButtonElement>(
          'button[aria-label^="Usuń lekcję"]',
        )?.disabled,
      ).toBe(false);
    },
  );

  it.each(['/lessons', '/students/7'])(
    'keeps the unpaid status on %s after a payment error and allows retrying',
    async (route) => {
      const harness = await RouterTestingHarness.create(route);
      const snackBar = TestBed.inject(MatSnackBar);
      const openSnackBar = vi.spyOn(snackBar, 'open');
      if (route === '/lessons') {
        http.expectOne(`${apiUrl}/lessons`).flush([lesson]);
      } else {
        http.expectOne(`${apiUrl}/students/7`).flush(student);
        http.expectOne(`${apiUrl}/students/7/lessons`).flush([lesson]);
      }
      harness.detectChanges();

      const paymentButton = harness.routeNativeElement!.querySelector<HTMLButtonElement>(
        'button[aria-label^="Oznacz jako opłaconą"]',
      )!;
      paymentButton.click();
      http.expectOne(`${apiUrl}/lessons/11/confirm-payment`).flush(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
      harness.detectChanges();

      expect(harness.routeNativeElement?.textContent).toContain('Nieopłacona');
      expect(paymentButton.disabled).toBe(false);
      expect(openSnackBar).toHaveBeenCalledWith(
        'Nie udało się potwierdzić płatności. Spróbuj ponownie.',
        'Zamknij',
        { duration: 5000 },
      );

      paymentButton.click();
      http.expectOne(`${apiUrl}/lessons/11/confirm-payment`).flush({ ...lesson, isPaid: true });
      harness.detectChanges();
      expect(
        harness.routeNativeElement?.querySelector('button[aria-label^="Oznacz jako opłaconą"]'),
      ).toBeNull();
      snackBar.dismiss();
      openSnackBar.mockRestore();
    },
  );

  it('rejects an invalid student identifier without sending API requests', async () => {
    const harness = await RouterTestingHarness.create('/students/invalid');
    harness.detectChanges();

    http.expectNone(() => true);
    expect(harness.routeNativeElement?.textContent).toContain(
      'Nieprawidłowy identyfikator ucznia.',
    );
  });
});
