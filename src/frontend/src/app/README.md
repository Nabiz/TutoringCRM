# Struktura frontendu

Kod jest podzielony według funkcji biznesowych. Lista i szczegóły ucznia należą do
`students`, a lista lekcji do `lessons`. Komponenty są standalone — nie wymagają
modułów `NgModule`.

```text
app/
├── core/
│   ├── config/
│   │   ├── api.config.ts
│   │   └── material.config.ts
│   └── layout/
│       ├── app-shell.component.ts
│       └── app-shell.component.html
├── features/
│   ├── students/
│   │   ├── data-access/
│   │   │   ├── student.model.ts
│   │   │   └── students-api.service.ts
│   │   ├── pages/
│   │   │   ├── student-list/
│   │   │   └── student-details/
│   │   └── students.routes.ts
│   └── lessons/
│       ├── data-access/
│       │   ├── lesson.model.ts
│       │   └── lessons-api.service.ts
│       ├── pages/
│       │   └── lesson-list/
│       └── lessons.routes.ts
├── shared/
│   └── utils/
│       └── date-time.ts
├── app.ts
├── app.html
├── app.config.ts
└── app.routes.ts
```

## Odpowiedzialności

| Miejsce                          | Co tutaj umieszczać                                                    | Analogia do backendu                                   |
| -------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| `core/config`                    | Konfigurację całej aplikacji: adres API i domyślne ustawienia Material | Konfiguracja oraz rejestracja DI w `Program.cs`        |
| `core/layout`                    | Układ aplikacji, wspólną nawigację i miejsce na aktualną stronę        | Wspólna infrastruktura aplikacji                       |
| `features/<funkcja>/data-access` | Klienta HTTP danej funkcji oraz modele odpowiedzi i żądań              | Klient API i DTO; to nie jest repozytorium bazy danych |
| `features/<funkcja>/pages`       | Strony, ich formularze, stan ekranu i obsługę działań użytkownika      | Warstwa prezentacji                                    |
| `features/<funkcja>/*.routes.ts` | Trasy należące do danej funkcji                                        | Mapowanie endpointów do obsługi                        |
| `shared`                         | Kod używany w różnych funkcjach, niezależny od uczniów i lekcji        | Wspólne narzędzia                                      |

## Przepływ danych

Strona wstrzykuje serwis API przez `inject`, wywołuje jego metodę i aktualizuje
stan ekranu po otrzymaniu odpowiedzi. Serwis API odpowiada za adresy endpointów,
metody HTTP i typy przesyłanych danych. Reguły biznesowe nadal egzekwuje backend.

Szczegóły ucznia korzystają z klienta uczniów do odczytu ucznia i jego historii
lekcji oraz z klienta lekcji do dodawania i usuwania lekcji. Model lekcji pozostaje
w funkcji `lessons`, nawet gdy korzysta z niego ekran ucznia.

`core` i `shared` nie importują funkcji biznesowych. Kod związany z jedną funkcją
pozostaje w jej katalogu. Jeśli powstanie komponent formularza lub tabeli lekcji
używany na kilku stronach, powinien należeć do `features/lessons`, ponieważ zna
model lekcji. `shared` jest miejscem na elementy niezależne od konkretnej domeny.

## Konfiguracja i routing

- Adres backendu zmienia się w `core/config/api.config.ts`. Token `API_BASE_URL`
  można też nadpisać providerem w `app.config.ts` lub testach.
- Domyślny wygląd kart znajduje się w `core/config/material.config.ts`.
- `app.routes.ts` ładuje trasy funkcji, a trasy funkcji ładują komponenty stron
  dopiero po wejściu na daną trasę. Adres `/` prowadzi do `/students`.
- Pliki testów `.spec.ts` znajdują się obok testowanego kodu.
- Interfejs korzysta z Angular Material i gotowego motywu. Nie dodajemy własnych
  arkuszy CSS/SCSS ani stylów inline.

## Dodawanie kolejnej funkcji

Utwórz katalog w `features`, dodaj potrzebne modele i klienta HTTP w `data-access`,
strony w `pages` oraz plik tras. Następnie podłącz trasy w `app.routes.ts` i dodaj
link w `core/layout/app-shell.component.html`, jeśli funkcja ma być dostępna
z głównej nawigacji. Dodatkowe katalogi twórz wtedy, gdy istnieje kod, który ich
potrzebuje.
