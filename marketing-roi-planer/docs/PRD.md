Aplikacja służy do planowania rocznego budżetu marketingowego, przypisywania środków do kanałów oraz obliczania oczekiwanego zysku na podstawie ROI podanego przez użytkownika. Umożliwia zapis i porównanie scenariuszy, aby wybrać wariant podziału budżetu.

Wersja PRD: 1.0. Data: 12 października 2026. Dokument określa zakres pierwszej wersji aplikacji i warunki jej odbioru.

## Cel produktu i odbiorcy

Odbiorcy: właściciele firm, marketing managerowie i osoby planujące wydatki marketingowe. Główny problem: podział środków między kanały i ocena łącznego efektu bez ręcznych obliczeń w arkuszu.

Użytkownik powinien móc przygotować pierwszy scenariusz w ciągu 5 minut, zmienić alokację i natychmiast zobaczyć wpływ na wynik. Miernik odbioru użyteczności: co najmniej 4 z 5 testerów samodzielnie tworzy, zapisuje i porównuje dwa scenariusze w ciągu 5 minut. Dla MVP wystarczy test moderowany, bez instalowania analityki śledzącej.

## Ustalenia i zakres pierwszej wersji

Ustalenia z wcześniejszego opisu: użytkownik podaje procent budżetu i oczekiwany ROI dla każdej kategorii; ROI oznacza zysk ponad koszt inwestycji; niewydany budżet stanowi rezerwę bez zwrotu; scenariusze są zapisywane w przeglądarce bez konta. Wyniki obejmują wykresy i porównanie wariantów.

Pozostałe decyzje w tym PRD stanowią domyślną specyfikację implementacji.

**MVP obejmuje:**

- Roczny budżet, walutę i edytowalną listę kategorii.

- Podział procentowy budżetu oraz oczekiwany roczny ROI kategorii.

- Automatyczne obliczenia, walidację i rezerwę.

- Podsumowanie liczbowe i trzy rodzaje wykresów.

- Tworzenie, zapisywanie, wczytywanie, aktualizowanie, duplikowanie i usuwanie scenariuszy.

- Porównanie 2–4 zapisanych scenariuszy.

- Eksport i import scenariuszy w formacie JSON jako kopię zapasową.

**Poza MVP:** konta i współpraca zespołowa, synchronizacja między urządzeniami, integracje reklamowe, dane o faktycznej sprzedaży, automatyczna optymalizacja alokacji, rekomendacje AI, prognozowanie ROI, kursy walut, rozliczenia podatkowe, miesięczne harmonogramy oraz eksport PDF i Excel.

## Główne ścieżki użytkownika

1. Użytkownik otwiera pusty kalkulator, podaje roczny budżet i walutę.

2. Nadaje nazwę scenariuszowi oraz ustawia udział budżetu i ROI wybranych kategorii.

3. Widzi kwoty przypisane do kategorii, pozostałą rezerwę, zysk i łączny ROI.

4. Koryguje wartości i obserwuje zmianę wyników oraz wykresów.

5. Zapisuje scenariusz, duplikuje go i przygotowuje drugi wariant.

6. Wybiera oba warianty do porównania; sprawdza zysk, ROI, rezerwę i różnice alokacji.

Osobna ścieżka: użytkownik eksportuje zapisane scenariusze do JSON, a następnie odtwarza je przez import.

## Dane wejściowe i walidacja

| Pole | Reguła |
| - | - |
| Nazwa scenariusza | Wymagana przy zapisie; 1–80 znaków po usunięciu skrajnych spacji. Nazwy mogą się powtarzać; identyfikatorem jest ID. |
| Roczny budżet | Wymagany; 0–1 000 000 000 jednostek waluty; maksymalnie 2 miejsca po przecinku. Wartość 0 oznacza pusty budżet. |
| Waluta | PLN domyślnie; dostępne także EUR i USD. Zmiana zmienia jednostkę, bez przeliczania wartości. |
| Nazwa kategorii | Wymagana; 1–60 znaków. Unikalna w scenariuszu po normalizacji spacji i wielkości liter. |
| Udział budżetu | Wymagany; 0–100%; maksymalnie 2 miejsca po przecinku. |
| Oczekiwany roczny ROI | Wymagany przy udziale większym od 0; od −100% do 10 000%, maksymalnie 2 miejsca po przecinku. Dla udziału 0 puste pole traktowane jako 0. |

Domyślne kategorie: Social media, WWW i SEO, Reklama w wyszukiwarkach, Radio, Telewizja, Outdoor, E-mail marketing, Targi i wydarzenia, Inne. Wszystkie początkowo mają udział 0% i ROI 0%. Limit: 30 kategorii w scenariuszu. Użytkownik może dodawać, usuwać i zmieniać nazwy kategorii.

Suma udziałów nie może przekraczać 100%. Aplikacja pozwala tymczasowo wpisać większą sumę, pokazuje błąd i skalę przekroczenia, blokuje zapis oraz zastępuje wyniki i wykresy komunikatem o niepoprawnych danych. Nie zmniejsza automatycznie innych udziałów.

Suma udziałów mniejsza od 100% jest poprawna. Rezerwa nie jest edytowalną kategorią.

Puste wymagane pola, tekst w polach liczbowych oraz wartości poza zakresem są błędem; nie mogą po cichu zmieniać się w zero. Podczas edycji niekompletne liczby mogą istnieć w polu, ale wynik jest dostępny dopiero po prawidłowym uzupełnieniu.

Akceptowane są przecinek i kropka jako separator dziesiętny oraz spacje między grupami cyfr. Separatory tysięcy w postaci przecinka lub kropki nie są obsługiwane; należy to opisać w podpowiedzi. Więcej niż dwa miejsca po przecinku wymaga korekty. Nie akceptować Infinity, NaN i notacji naukowej.

## Model obliczeń i znaczenie ROI

Wszystkie oczekiwania dotyczą jednego roku. ROI jest założeniem użytkownika, a wynik jest symulacją. Aplikacja nie ocenia wiarygodności wpisanego ROI.

Oznaczenia:

- B — całkowity roczny budżet.

- pᵢ — udział kategorii i w budżecie, w procentach.

- rᵢ — oczekiwany ROI kategorii i, w procentach.

- Iᵢ — inwestycja w kategorii.

- Zᵢ — oczekiwany zysk netto ponad koszt tej inwestycji.

- Wᵢ — modelowana kwota odzyskana z inwestycji, obejmująca kapitał i zysk.

**Wzory:**

- Iᵢ = B × pᵢ / 100

- Zᵢ = Iᵢ × rᵢ / 100

- Wᵢ = Iᵢ + Zᵢ

- I = suma Iᵢ

- R = B − I

- Z = suma Zᵢ

- W = I + Z

- ROI zainwestowanych środków = Z / I × 100%, gdy I > 0

- Zysk względem całego budżetu = Z / B × 100%, gdy B > 0

- Środki końcowe z uwzględnieniem rezerwy = R + W = B + Z

Głównym procentowym wynikiem jest **ROI zainwestowanych środków**. Wskaźnik zysku względem całego budżetu musi mieć oddzielną etykietę. Rezerwa nie generuje zysku, pozostaje częścią środków końcowych i nie wchodzi do mianownika ROI inwestycji.

ROI nie jest średnią arytmetyczną ROI kategorii. Przy ROI 0% zysk wynosi 0, przy 100% zysk jest równy inwestycji, a przy −100% inwestycja zostaje w całości utracona. Kwoty odzyskanej nie należy nazywać przychodem ze sprzedaży; aplikacja nie modeluje marży ani atrybucji sprzedaży.

Gdy I = 0, ROI inwestycji pokazuje „Nie dotyczy”. Gdy B = 0, również wskaźnik zysku względem budżetu pokazuje „Nie dotyczy”. Pozostałe kwoty są liczone zgodnie ze wzorami.

**Precyzja:** obliczenia wykonywać na liczbach dziesiętnych, bez zaokrąglania pośrednich wyników. Kwoty prezentować do 2 miejsc po przecinku, procenty do 2 miejsc, stosując zaokrąglenie half-up. Sumy liczyć z wartości niezaokrąglonych. Pod tabelą pokazać informację, że suma zaokrąglonych wierszy może różnić się od podsumowania o kilka groszy.

## Przykład referencyjny

Budżet roczny: 100 000 PLN. Wartości ROI są przykładowymi założeniami do sprawdzenia obliczeń.

| Kategoria | Udział | Inwestycja | ROI | Zysk | Kwota odzyskana |
| - | -: | -: | -: | -: | -: |
| Social media | 40% | 40 000 PLN | 50% | 20 000 PLN | 60 000 PLN |
| WWW i SEO | 30% | 30 000 PLN | 100% | 30 000 PLN | 60 000 PLN |
| Radio | 20% | 20 000 PLN | −25% | −5 000 PLN | 15 000 PLN |
| Rezerwa | 10% | 10 000 PLN | Nie dotyczy | 0 PLN | Nie dotyczy |

Inwestycja: 90 000 PLN. Rezerwa: 10 000 PLN. Zysk: 45 000 PLN. Kwota odzyskana z inwestycji: 135 000 PLN. ROI inwestycji: 50%. Zysk względem całego budżetu: 45%. Środki końcowe z rezerwą: 145 000 PLN.

## Ekrany i wymagania funkcjonalne

**Kalkulator:** nagłówek z nazwą scenariusza, rocznym budżetem i walutą; tabela kategorii; wskaźnik sumy alokacji; podsumowanie; wykresy. Na telefonie wiersze kategorii przyjmują formę kart. Każda kategoria ma edytowalne pola nazwy, udziału i ROI oraz wyliczane kwoty inwestycji, zysku i odzyskanych środków.

Wyniki aktualizują się po zmianie poprawnej wartości bez przycisku „Oblicz”. Główne karty: zainwestowany budżet, rezerwa, oczekiwany zysk, ROI inwestycji. W rozwinięciu: odzyskane środki, zysk względem całego budżetu i środki końcowe.

Przyciski: Nowy scenariusz, Zapisz scenariusz, Zapisz zmiany, Zapisz jako nowy, Dodaj kategorię, Wczytaj przykład. Usunięcie kategorii z udziałem większym od 0 wymaga potwierdzenia; zwolniony udział przechodzi do rezerwy. Zmiana budżetu zachowuje udziały i ROI, przelicza kwoty.

**Moje scenariusze:** lista z nazwą, datą aktualizacji, budżetem, walutą, zyskiem i ROI; sortowanie od ostatnio zmienionego. Akcje: wczytaj, duplikuj, usuń, wybierz do porównania, eksportuj. Usuwanie scenariusza wymaga potwierdzenia.

**Porównanie:** wybór 2–4 zapisanych scenariuszy i jednego wariantu bazowego. Tabela zawiera budżet, inwestycję, rezerwę, zysk, ROI inwestycji, zysk względem całego budżetu oraz środki końcowe. Dla zysku pokazać różnicę kwotową wobec bazy, a dla ROI różnicę w punktach procentowych.

Porównanie dopuszcza różne budżety, ale wyświetla informację o ich różnicy i rozróżnia najwyższy zysk od najwyższego ROI. Scenariusze muszą mieć tę samą walutę; mieszany wybór jest blokowany z wyjaśnieniem. Nie wykonuje się przeliczeń kursowych. Gdy ROI jest „Nie dotyczy”, nie uwzględniać go w rankingu ROI.

W porównaniu kategorii dopasowywać znormalizowane nazwy; brak kategorii oznacza udział i inwestycję 0, a ROI „Nie dotyczy”. Kolory i kolejność wspólnych kategorii pozostają spójne w porównywanych wykresach.

## Wykresy

| Wykres | Wymagane zachowanie |
| - | - |
| Podział budżetu | Wykres pierścieniowy udziałów, z rezerwą jako oddzielnym szarym segmentem. Etykiety: nazwa, procent i kwota. Pomijać segmenty zerowe. Przy budżecie 0 wyświetlić pusty stan. |
| Zysk według kategorii | Wykres słupkowy z osią obejmującą zero; wartości ujemne widoczne poniżej lub po lewej stronie zera. Rezerwę pominąć. Podpowiedź: inwestycja, ROI, zysk. |
| Porównanie scenariuszy | Oddzielny wykres kwot zysku i oddzielny wykres ROI. Wspólna waluta na wykresie kwot; ROI w procentach. Nie mieszać kwot i procentów na jednej osi. |

Przy samych zerowych zyskach pokazać opis „Brak oczekiwanego zysku”. Wartości ujemne muszą być rozpoznawalne także po znaku i położeniu, a nie wyłącznie kolorze. Każdy wykres ma dostępną tabelę danych lub równoważną listę tekstową. Etykiety długich nazw nie mogą zasłaniać danych.

## Zapisywanie i model danych

Aplikacja działa po stronie przeglądarki; backend i logowanie nie są wymagane. Zapisane scenariusze oraz bieżący szkic przechowywać lokalnie, np. w localStorage. Dane są dostępne w tej samej przeglądarce, profilu i pod tym samym adresem aplikacji. Wyczyszczenie danych witryny usuwa scenariusze; użytkownik musi otrzymać tę informację przy pierwszym zapisie.

Szkic zapisywać automatycznie po zmianach, z opóźnieniem do 500 ms. Szkic może zawierać niekompletne pola, ale nie jest zapisanym scenariuszem i nie może wejść do porównania. Po ponownym otwarciu odtworzyć szkic. Zapis scenariusza jest jawny i wymaga poprawnych danych.

Przed zastąpieniem niezapisanych zmian przez wczytanie, nowy scenariusz lub przykład pokazać opcje: zapisz, odrzuć, anuluj. Dla błędnych danych umożliwić tylko odrzucenie albo anulowanie.

**Model scenariusza:** schemaVersion, id, name, currency, annualBudget, categories, createdAt, updatedAt. Kategoria: id, name, allocationPercent, expectedRoiPercent. ID są stabilne i niezależne od nazwy. Wartości dziesiętne przechowywać jako kanoniczne ciągi z kropką. Daty w ISO 8601. Wyników obliczeń nie zapisywać jako źródła prawdy; odtwarzać je z danych wejściowych.

**Kopia zapasowa JSON:** zawiera schemaVersion i tablicę scenariuszy. Import do 1 MB i 100 scenariuszy; sprawdzić strukturę, wszystkie zakresy i wersję przed zapisem. Nieznana wersja lub pojedynczy błędny scenariusz odrzuca cały import z opisem błędu. Import tworzy nowe ID, nie nadpisuje istniejących scenariuszy. Po imporcie wyświetlić liczbę dodanych wariantów.

Jeżeli zapis jest niedostępny lub przestrzeń jest pełna, nie pokazywać komunikatu o sukcesie. Zachować dane w pamięci, pokazać błąd i umożliwić eksport poprawnego bieżącego scenariusza. Uszkodzone zapisane dane nie mogą blokować otwarcia aplikacji ani być automatycznie usuwane; zaoferować pobranie surowej kopii i reset po potwierdzeniu. Przy zmianie danych w innej karcie pokazać komunikat i odświeżyć po decyzji użytkownika, bez automatycznego nadpisywania aktywnej edycji.

## Wymagania jakościowe i techniczne

- Interfejs w języku polskim; formatowanie liczb zgodne z pl-PL, waluta jawnie podana przy kwotach.

- Responsywny układ od 360 px; kluczowe formularze i podsumowania bez poziomego przewijania. Szeroka tabela porównawcza może mieć własny przewijany obszar z przypiętymi nazwami metryk.

- Pełna obsługa klawiaturą, widoczny fokus, etykiety formularzy, błędy powiązane z polami i komunikaty dostępne dla czytnika ekranu. Cel dostępności: WCAG 2.2 AA.

- Aktualizacja wyników i wykresów do 200 ms po zatwierdzeniu poprawnej wartości przy 30 kategoriach i porównaniu 4 scenariuszy na standardowym laptopie testowym.

- Pierwszy użyteczny widok do 3 sekund przy połączeniu 10 Mb/s w środowisku testowym.

- Obsługa aktualnej i poprzedniej stabilnej wersji Chrome, Edge, Firefox oraz Safari w chwili odbioru.

- Kalkulator, wykresy i dane mają korzystać z jednego modułu obliczeniowego; warstwa UI nie może implementować odrębnych wzorów.

- Dane budżetu nie są wysyłane na serwer ani do usług analitycznych. Nazwy traktować jako tekst i bezpiecznie renderować; nie interpretować ich jako HTML.

- Proponowana realizacja: TypeScript i React lub równoważny framework, biblioteka obliczeń dziesiętnych, biblioteka wykresów z dostępną reprezentacją tabelaryczną. Wybór bibliotek nie zmienia wymagań produktu.

## Kryteria akceptacji i testy odbiorowe

| ID | Przypadek | Oczekiwany wynik |
| - | - | - |
| AC01 | Dane przykładu referencyjnego | Inwestycja 90 000; rezerwa 10 000; zysk 45 000; ROI 50%; środki końcowe 145 000 PLN. |
| AC02 | Budżet 100 000; udział 100%; ROI 100% | Inwestycja 100 000; zysk 100 000; odzyskane i końcowe środki 200 000; ROI 100%. |
| AC03 | Budżet 100 000; udział 50%; ROI 0% | Inwestycja 50 000; rezerwa 50 000; zysk 0; ROI 0%; środki końcowe 100 000. |
| AC04 | Budżet 100 000; udział 100%; ROI −100% | Zysk −100 000; kwota odzyskana i środki końcowe 0; ROI −100%. |
| AC05 | Budżet dodatni; wszystkie udziały 0 | Całość w rezerwie; zysk 0; ROI inwestycji „Nie dotyczy”; zysk względem budżetu 0%. |
| AC06 | Budżet 0; poprawne udziały do 100% | Wszystkie kwoty 0; oba wskaźniki procentowe „Nie dotyczy”; brak błędu dzielenia przez zero. |
| AC07 | Udziały 60% i 50% | Błąd przekroczenia o 10 punktów procentowych; zapis i wyniki zablokowane. Korekta do 100% przywraca wynik. |
| AC08 | Udziały 33,33%; 33,33%; 33,34% | Suma dokładnie 100%; brak rezerwy i fałszywego błędu precyzji. |
| AC09 | Budżet 100 000; udziały 90% i 10%; ROI 10% i 100% | Zysk 19 000; ROI 19%, a nie 55%. |
| AC10 | Puste ROI przy dodatnim udziale; ROI poniżej −100%; budżet ujemny | Jasny błąd przy odpowiednim polu; zapis niedostępny. |
| AC11 | Zapis i ponowne otwarcie aplikacji | Nazwa, kategorie, waluta i dane wejściowe odtworzone; wyniki przeliczone identycznie. |
| AC12 | Aktualizacja i duplikowanie | Aktualizacja zachowuje ID; duplikat otrzymuje nowe ID; zmiany duplikatu nie zmieniają oryginału. |
| AC13 | Dwa warianty PLN i EUR | Porównanie zablokowane z wyjaśnieniem braku przeliczeń walut. |
| AC14 | Baza: zysk 45 000 i ROI 50%; wariant: zysk 54 000 i ROI 60% | Różnica zysku +9 000; różnica ROI +10 punktów procentowych. |
| AC15 | Eksport i import poprawnego JSON | Wszystkie dane wejściowe zachowane; nowe ID; istniejące scenariusze nie nadpisane. |
| AC16 | Uszkodzony JSON, nieznana wersja lub błąd zapisu | Kontrolowany komunikat; brak częściowego importu i fałszywego potwierdzenia zapisu. |
| AC17 | Wykresy z dodatnimi i ujemnymi zyskami | Poprawna oś zero, znaki, kwoty i dane tekstowe zgodne z podsumowaniem. |
| AC18 | Obsługa telefonu i klawiatury | Można stworzyć, zapisać i porównać warianty; etykiety, fokus i komunikaty są czytelne. |

Testy powinny objąć jednostkowo wzory i walidację, integracyjnie zapis i import oraz całą ścieżkę tworzenia i porównania scenariuszy. Sprawdzić także zaokrąglenia, limity, nazwy z polskimi znakami, brak miejsca na zapis i niezapisane zmiany.

## Warunki ukończenia i dalszy rozwój

MVP jest gotowe po spełnieniu AC01–AC18, sprawdzeniu dostępności kluczowych ścieżek, potwierdzeniu zgodności wykresów z obliczeniami oraz wykonaniu testu użyteczności. Nie mogą pozostać błędy powodujące utratę danych, nieprawidłowe obliczenia lub pozorne potwierdzenie zapisu.

Najważniejsze ograniczenia modelu: ROI jest wpisywanym założeniem, efekty kategorii są sumowane bez modelowania ich wzajemnego wpływu, a marginalny zwrot z kolejnej złotówki pozostaje stały. Aplikacja powinna pokazywać krótką informację „Wyniki są symulacją opartą na podanym ROI”.

Kolejne wersje mogą dodać wariant pesymistyczny, bazowy i optymistyczny ROI, plan miesięczny, eksport raportu, porównanie planu z wykonaniem oraz synchronizację scenariuszy. Żadna z tych funkcji nie jest warunkiem ukończenia MVP.
