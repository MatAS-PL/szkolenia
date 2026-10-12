# Planer — budżet marketingowy i ROI

Statyczna aplikacja w języku polskim zgodna z zakresem MVP załączonego PRD. Dane budżetu, szkic i scenariusze przechowywane wyłącznie w localStorage. Bez kont, telemetrii i żądań do usług zewnętrznych.

## Uruchomienie

Serwuj katalog `dist` przez HTTP, np. `python -m http.server 4173 --directory dist`.

## Weryfikacja

`npm ci` i `npm test`. Pełne raporty: `node tests/model.test.mjs` oraz `node tests/ui.test.mjs`. Weryfikacja w Chromium obejmuje zapis, duplikowanie, porównanie, import JSON, przywrócenie szkicu, błędne dane i szerokość 360 px. Test moderowany 4/5 użytkowników oraz macierz poprzednich wersji Safari/Firefox/Edge wymagają osobnego odbioru.

## Obliczenia

Wspólny moduł `dist/model.mjs` korzysta z arytmetyki stałoprzecinkowej BigInt (kwoty jako dokładne liczby dziesiętne z mianownikiem 10^10). Wyniki pośrednie nie są zaokrąglane. Zaokrąglenie prezentacji half-up. ROI to zysk netto ponad koszt inwestycji; rezerwa nie generuje zysku ani nie wchodzi do mianownika ROI inwestycji.

## Specyfikacja

Wymagania MVP: [docs/PRD.md](docs/PRD.md).

## GitHub Pages

Aplikacja: https://matas-pl.github.io/szkolenia/

GitHub Pages publikuje gałąź `main` z katalogu głównego repozytorium. Główny `index.html` wczytuje zasoby z `marketing-roi-planer/dist/`; `.nojekyll` wyłącza przetwarzanie Jekyll. Po zmianie `dist/index.html` zaktualizuj również główny `index.html`, zachowując wskazane ścieżki CSS i JavaScript.

Scenariusze ze starego adresu aplikacji można przenieść za pomocą eksportu i importu JSON.
