# Projekt: Hangar Filmowy - Plan Rozwoju Strony One-Page

**Data utworzenia:** 20 grudnia 2025  
**Wersja:** 1.0  
**Status:** Plan do zatwierdzenia

---

## I. Podstawowe Informacje o Projekcie

### 1.1 Nazwa Projektu
**Hangar Filmowy** - Premium kino plenerowe z ekranami LED

### 1.2 Typ Strony
One-page website (single page application) z płynnym scrollowaniem między sekcjami

### 1.3 Cel Biznesowy
Prezentacja oferty wypożyczalni ekranów LED do kina plenerowego oraz pozyskiwanie leadów przez formularz kontaktowy

### 1.4 Wymagania Techniczne
- **Hosting:** Cloudflare Pages
- **Version Control:** GitHub
- **CI/CD:** GitHub Actions
- **Panel Administracyjny:** Wymagany do zarządzania treścią i mediami
- **Baza Danych:** Wymagana do autoryzacji i przechowywania treści

---

## II. Analiza Konceptu Wizualnego (screen konceptu.png + koncept Gemini)

### 2.1 Design System - Wytyczne Wizualne

**Palette Kolorystyczna:**
- **Główne kolory:**
  - Ciemny granat/niebieski (#0A1828, #1E3A5F) - nocne niebo, tło
  - Złoty/pomarańczowy (#FFA500, #FFD700) - akcenty ciepłe, CTA
  - Jasny niebieski (#4D90FE, #64C7FF) - akcenty LED, technologia
  - Biały (#FFFFFF) - tekst na ciemnym tle
- **Gradienty:** 
  - Hero: Od ciemnego nieba (góra #0A1828) do ciepłych tonów (dół #1E3A5F)
  - Zachód słońca efekt dla hero background
- **Akcenty:** Żółte światła (popcorn, projekcja), białe (ekran LED świecący)

**Typografia:**
- **Font Stack:** "Google Sans", "Helvetica Neue", Arial, sans-serif
- **H1 (Hero):** 
  - Desktop: 64px-72px, font-weight: 700
  - Mobile: 36px-42px
  - Line-height: 1.2
- **H2 (Sekcje):** 
  - Desktop: 42px-48px, font-weight: 600
  - Mobile: 28px-32px
- **Body:** 
  - 16px-18px, font-weight: 400
  - Line-height: 1.6
- **Buttons:** 16px, font-weight: 600, uppercase letter-spacing

**Layout & Grid:**
- **Container max-width:** 1280px
- **Gutter:** 24px (mobile), 40px (desktop)
- **Section padding:** 80px top/bottom (desktop), 60px (mobile)
- **Grid:** 12-column system
- **Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
  - Wide: > 1440px

**Animacje (Framer Motion):**
- **Scroll-triggered:** 
  - Fade in + translateY(-30px → 0)
  - Duration: 0.6s, easing: ease-out
  - Stagger: 0.1s between elements
- **Hero:** 
  - Background: Subtle parallax scroll (slowdown 0.5x)
  - Stars twinkling animation (opacity pulse)
- **CTA buttons:** 
  - Hover: scale(1.05) + box-shadow increase
  - Transition: 0.3s ease
- **Cards/Boxy:** 
  - Hover: translateY(-8px) + shadow elevation
  - Transition: 0.4s cubic-bezier

**Imagery Style:**
- **Format:** WebP (fallback JPG)
- **Hero background:** 
  - Wieczorne/nocne niebo z gwiazdami
  - Sylwetka ekranu LED świecącego
  - Rozdzielczość: min. 1920x1080
- **Section images:**
  - Autentyczne zdjęcia z eventów
  - Ludzie oglądający film, atmosfera
- **Overlays:** 
  - Dark gradient (rgba(10,24,40,0.6)) dla czytelności
  - Linear-gradient: to bottom
- **Icons:** 
  - Style: Outlined lub filled
  - Size: 48px-64px
  - Color: Primary brand color

### 2.2 Wireframe Kompletny

```
┌─────────────────────────────────────────┐
│ [NAVBAR] Fixed, transparent→solid       │
│ Logo | Menu: O nas·Oferta·Kontakt      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  🌟 HERO SECTION (100vh)                │
│                                         │
│       H1: Prawdziwe kino...             │
│       Subtitle + Lead                   │
│       [CTA Primary] [CTA Secondary]     │
│                                         │
│       ↓ scroll indicator                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  O NAS (Split 50/50)                    │
│  ┌────────┬────────┐                    │
│  │ TEXT   │ IMAGE  │                    │
│  │ H2     │ [Foto] │                    │
│  │ Paragr │        │                    │
│  └────────┴────────┘                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  DLACZEGO MY? (Grid 3 col)              │
│  ┌──────┬──────┬──────┐                 │
│  │ BOX1 │ BOX2 │ BOX3 │                 │
│  │ Icon │ Icon │ Icon │                 │
│  │ H3   │ H3   │ H3   │                 │
│  │ Text │ Text │ Text │                 │
│  └──────┴──────┴──────┘                 │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  OFERTA (Grid 2x2 lub 4 col)            │
│  ┌─────┬─────┬─────┬─────┐              │
│  │CARD1│CARD2│CARD3│CARD4│              │
│  │Icon │Icon │Icon │Icon │              │
│  │H3   │H3   │H3   │H3   │              │
│  │Desc │Desc │Desc │Desc │              │
│  └─────┴─────┴─────┴─────┘              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  DLA KOGO? (Grid 4 col, colored)        │
│  ┌─────┬─────┬─────┬─────┐              │
│  │CARD1│CARD2│CARD3│CARD4│              │
│  │Gminy│Hotel│Firmy│Fest.│              │
│  │Icon │Icon │Icon │Icon │              │
│  │Text │Text │Text │Text │              │
│  └─────┴─────┴─────┴─────┘              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  PROCES (Timeline horizontal)           │
│  ①──→──②──→──③──→──④                    │
│  Step  Step  Step  Step                 │
│  Desc  Desc  Desc  Desc                 │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  KONTAKT (Split)                        │
│  ┌────────────┬──────────┐              │
│  │ FORMULARZ  │  DANE    │              │
│  │ [inputs]   │  Tel     │              │
│  │ [textarea] │  Email   │              │
│  │ [button]   │  Social  │              │
│  └────────────┴──────────┘              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  FOOTER (Dark background)               │
│  Slogan + Links + Copyright             │
└─────────────────────────────────────────┘
```

---

## III. Struktura Strony (7 Sekcji) - Specyfikacja Szczegółowa

### Nawigacja (Fixed Header)

**Desktop Navigation:**
```
┌──────────────────────────────────────────────────┐
│ [LOGO] Hangar Filmowy    O nas·Oferta·Kontakt   │
└──────────────────────────────────────────────────┘
```

**Funkcjonalność:**
- **Pozycja:** Fixed top, z-index: 1000
- **Tło:** 
  - Transparent z blur przy scroll=0
  - Solid dark (#0A1828) z shadow przy scroll>50px
- **Wysokość:** 80px
- **Logo:** 
  - Height: 40px
  - Po lewej stronie
  - Link do #hero (scroll to top)
- **Menu items:**
  - Font-size: 16px
  - Spacing: 32px between items
  - Hover: Color change + underline animation
  - Active: Bold + primary color
  - Smooth scroll do sekcji
- **Mobile (<768px):** 
  - Hamburger menu (☰)
  - Slide-in menu from right
  - Overlay dark background

---

### Sekcja 1: HERO SECTION
**Treść (źródło: prompt.md):**
- **H1:** "Prawdziwe kino pod gwiazdami. W jakości, jakiej jeszcze nie widziałeś."
- **Subtitle/Lead:** "Zapomnij o wyblakłym obrazie z rzutnika. Hangar Filmowy to potężne ekrany LED, krystaliczny dźwięk i zapach świeżego popcornu. Organizujemy plenerowe pokazy filmowe klasy premium."
- **CTA Buttons:** 
  - Primary: [Zorganizuj pokaz] → scroll to formularz kontaktowy
  - Secondary: [Zobacz naszą technologię] → scroll to sekcja Dlaczego My

**Wymagania wizualne:**
- **Background:** Full-screen image/video - nocne niebo + ekran LED świecący
- **Overlay:** Dark gradient rgba(10,24,40,0.4) top to bottom
- **Height:** 100vh (pełna wysokość viewport)
- **Text alignment:** Center
- **Text color:** White (#FFFFFF)
- **CTA styles:**
  - Primary: Gradient button (orange→gold), padding: 16px 40px, border-radius: 30px
  - Secondary: Outline button (white border), hover: filled
- **Scroll indicator:** Animowana strzałka w dół (bounce animation)
- **Parallax:** Background moves 0.5x scroll speed

### Sekcja 2: O NAS (Misja i Obietnica)
**Treść (źródło: prompt.md):**
- **H2:** "Wychodzimy z cienia. Wnosimy kino plenerowe na nowy poziom."
- **Content:** 
  
  "Przez lata kino plenerowe kojarzyło się z jednym: czekaniem na zmrok, walką z wiatrem falującym ekranem i kompromisami w jakości obrazu. Hangar Filmowy zmienia te zasady gry.
  
  Jesteśmy zespołem pasjonatów kina i ekspertów od eventów. Nasza obietnica jest prosta: dostarczamy wrażenia kinowe (dosłownie!) w dowolnym miejscu w Polsce. Nie uznajemy półśrodków. Nasze ekrany świecą jasno, dźwięk wbija w fotel, a obsługa licencyjna zdejmuje Ci z głowy wszystkie formalności. Tworzymy wydarzenia, o których mieszkańcy rozmawiają miesiącami."

**Wymagania wizualne:**
- **Layout:** Split section 50/50 (text left, image right)
- **Text side:**
  - H2: 48px, margin-bottom: 24px
  - Paragraf: 18px, line-height: 1.8, color: #333
  - Padding: 60px
- **Image side:**
  - Zdjęcie: zespół przy montażu ekranu lub ekran LED w akcji
  - Border-radius: 16px
  - Box-shadow: 0 20px 60px rgba(0,0,0,0.15)
- **Mobile:** Stack (text top, image bottom)
- **Background:** Light gray (#F5F5F5) lub white

### Sekcja 3: DLACZEGO MY? (Technologia LED i Przewagi)
**H2 (źródło: prompt.md):** "Dlaczego ekran LED, a nie rzutnik?"

**Format:** 3 boxy obok siebie (Grid 3 kolumny)

**Box 1: Obraz Żyleta – O Każdej Porze**
- **Tekst:** "Tradycyjna projekcja wymaga całkowitej ciemności. Nasze ekrany LED o ultrawysokiej jasności pozwalają rozpocząć seans wcześniej, nawet przy zachodzącym słońcu. Czerń jest czarna, kolory nasycone, a rozdzielczość zachwyca każdego widza."
- **Icon:** Słońce + ekran (SVG), size: 64px
- **Color accent:** Gradient yellow-orange (#FFD700 → #FFA500)

**Box 2: Odporność na Warunki**
- **Tekst:** "Wiatr? Lekki deszcz? Dla naszych modułowych ścian LED to nie problem. Konstrukcja jest stabilna i bezpieczna, w przeciwieństwie do tradycyjnych ekranów pneumatycznych („dmuchańców"), które poddają się przy mocniejszych podmuchach."
- **Icon:** Tarcza ochronna, size: 64px
- **Color accent:** Gradient blue (#4D90FE → #64C7FF)

**Box 3: Dźwięk, Który Czujesz**
- **Tekst:** "Kino to w 50% dźwięk. Instalujemy profesjonalne systemy nagłośnieniowe, które zapewniają czystość dialogów i głębię efektów specjalnych, precyzyjnie pokrywając dźwiękiem strefę widowni."
- **Icon:** Fale dźwiękowe, size: 64px
- **Color accent:** Gradient purple (#8B5CF6 → #A78BFA)

**Layout:**
- **Desktop:** 3 kolumny równej szerokości (grid-template-columns: 1fr 1fr 1fr)
- **Tablet:** 3 kolumny (squeeze, gap: 20px)
- **Mobile:** 1 kolumna (stack, gap: 32px)
- **Card style:** 
  - Background: White
  - Padding: 40px
  - Border-radius: 20px
  - Box-shadow: 0 4px 20px rgba(0,0,0,0.08)
  - Hover: translateY(-8px), shadow: 0 12px 40px rgba(0,0,0,0.15)
  - Transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1)
- **Background sekcji:** Light gradient (#F8F9FA → #FFFFFF)

### Sekcja 4: OFERTA (Kompleksowa obsługa)
**H2 (źródło: prompt.md):** "Od licencji po ostatnie ziarno kukurydzy. Pełna obsługa Twojego eventu."

**Format:** 4 karty usług (Grid 2x2 desktop lub 4 kolumny wide screen)

**Karta 1: Technika Kinowa Premium**
- **Tekst:** "Mobilne ekrany LED o dużej powierzchni i wysokiej jasności (nits). Do tego profesjonalne nagłośnienie i oświetlenie ambientowe, budujące klimat strefy widza."
- **Icon:** Ekran LED z promieniami światła
- **Color theme:** Blue gradient
- **CTA:** "Szczegóły" (opcjonalnie)

**Karta 2: Pośrednictwo Licencyjne**
- **Tekst:** "Nie wiesz, jak legalnie wyświetlić hit z Hollywood? Zrobimy to za Ciebie. Jako Hangar Filmowy pośredniczymy w zakupie praw do publicznego odtwarzania (licencje parasolowe i jednorazowe). Wybierasz tytuł, my załatwiamy papiery."
- **Icon:** Dokument ze stemplem/certyfikat
- **Color theme:** Green gradient
- **CTA:** "Szczegóły" (opcjonalnie)

**Karta 3: Strefa Widza i Klimat**
- **Tekst:** "To nie tylko oglądanie, to doświadczenie. Zapewniamy wygodne leżaki w dużej ilości oraz nastrojowe oświetlenie terenu, które tworzy magię kina letniego."
- **Icon:** Leżak + lampki świetlne
- **Color theme:** Purple gradient
- **CTA:** "Szczegóły" (opcjonalnie)

**Karta 4: Popcorn Bar**
- **Tekst:** "Czym jest kino bez zapachu prażonej kukurydzy? Dostarczamy profesjonalne maszyny do popcornu wraz z obsługą. Świeży, ciepły, chrupiący – dokładnie taki, jak w multipleksie."
- **Icon:** Popcorn box
- **Color theme:** Yellow/Gold gradient
- **CTA:** "Szczegóły" (opcjonalnie)

**Layout:**
- **Wide screen (>1280px):** 4 kolumny (grid: 1fr 1fr 1fr 1fr)
- **Desktop (1024-1280px):** 2x2 grid
- **Tablet (640-1024px):** 2x2 grid, squeeze
- **Mobile (<640px):** 1 kolumna stack
- **Card style:** 
  - Background: Gradient overlay na image/color
  - Padding: 48px 32px
  - Border-radius: 24px
  - Min-height: 360px
  - Text color: White
  - Hover: scale(1.03), shadow increase
  - Transition: 0.4s ease-out
- **Gap:** 24px between cards
- **Background sekcji:** Dark navy (#0A1828)

### Sekcja 5: DLA KOGO? (Grupy docelowe)
**H2 (źródło: prompt.md):** "Tworzymy kino tam, gdzie go potrzebujesz."

**Format:** 4 karty grup docelowych

**Karta 1: Samorządy i Miasta**
- **Tekst:** "Dni miasta, wakacyjne cykle kulturalne, kina letnie na rynkach i w parkach."
- **Icon:** Budynek ratusza/pomnik miejski, 64px
- **Target audience:** Urzędy miejskie, centra kultury, burmistrze
- **Background color:** Gradient blue-teal (#4D90FE → #0EA5E9)

**Karta 2: Hotele i Ośrodki Wypoczynkowe**
- **Tekst:** "Atrakcja premium dla gości hotelowych."
- **Icon:** Hotel/resort/parasol plażowy, 64px
- **Target audience:** Hotele, SPA, ośrodki wczasowe
- **Background color:** Gradient orange (#FF6B35 → #F7931E)

**Karta 3: Firmy i Korporacje**
- **Tekst:** "Eventy integracyjne, premiery produktów, pokazy szkoleniowe w plenerze."
- **Icon:** Budynek biurowy/teczka, 64px
- **Target audience:** Działy HR, marketing, event managerzy
- **Background color:** Gradient purple (#8B5CF6 → #6D28D9)

**Karta 4: Organizatorzy Festiwali**
- **Tekst:** "Strefy chilloutu i kina towarzyszące dużym wydarzeniom."
- **Icon:** Scena festiwalowa/mikrofon, 64px
- **Target audience:** Agencje eventowe, organizatorzy festiwali
- **Background color:** Gradient green (#10B981 → #059669)

**Layout:**
- **Wide screen:** 4 kolumny (1fr 1fr 1fr 1fr)
- **Desktop:** 2x2 grid
- **Tablet:** 2x2 grid
- **Mobile:** 1 kolumna
- **Card style:**
  - Background: Gradient z kolorem grupy docelowej
  - Padding: 48px 32px
  - Border-radius: 20px
  - Min-height: 280px
  - Text color: White
  - Icon color: White z opacity 0.9
  - Hover: scale(1.05) + shadow
  - Transition: 0.4s ease-out
- **Gap:** 24px
- **Background sekcji:** White/Light gray

### Sekcja 6: PROCES WSPÓŁPRACY (Krok po kroku)
**H2 (źródło: prompt.md):** "Jak zorganizować kino z Hangarem Filmowym?"

**Format:** Horizontal timeline (4 kroki z połączeniami)

**Krok 1: Wybór terminu i lokalizacji**
- **Numer:** 01
- **Tekst:** "Zadzwoń do nas, sprawdzimy dostępność i warunki terenowe."
- **Icon:** Kalendarz + pin lokalizacji
- **Action:** Konsultacja telefoniczna/email

**Krok 2: Dobór repertuaru**
- **Numer:** 02
- **Tekst:** "Pomożemy wybrać film, który przyciągnie tłumy, i sprawdzimy jego dostępność licencyjną."
- **Icon:** Klapsa filmowa/taśma filmowa
- **Action:** Wybór filmu + weryfikacja licencji

**Krok 3: Realizacja**
- **Numer:** 03
- **Tekst:** "Przyjeżdżamy, montujemy potężny ekran LED, nagłośnienie, strefę relaksu i maszynę do popcornu."
- **Icon:** Narzędzia (klucz + śrubokręt) + ekran
- **Action:** Montaż, setup, testy techniczne

**Krok 4: Showtime!**
- **Numer:** 04
- **Tekst:** "Odpalamy film i dbamy o techniczny przebieg całego wydarzenia."
- **Icon:** Play button w kółku + gwiazdy
- **Action:** Event + wsparcie techniczne

**Layout:**
- **Desktop:** Horizontal timeline
  - 4 boxy w rzędzie
  - Linie/strzałki łączące kroki
  - Numery w dużych kółkach nad tekstem
- **Tablet:** 2x2 grid z numerami, subtle connectors
- **Mobile:** Vertical timeline
  - Stack (jeden pod drugim)
  - Linia pionowa po lewej stronie
  - Numery w kółkach z lewej
- **Style:**
  - Numbers: 72px, bold, w kółkach (120px diameter)
  - Circle background: Gradient primary color
  - Icons: 56px, above text
  - Text: 16px, line-height: 1.6
  - Connector lines: 2px, dashed, primary color
- **Animation:** Steps fade in sequentially (stagger 0.15s)
- **Background:** White

### Sekcja 7: KONFIGURATOR WYDARZENIA / KONTAKT
**H2:** "Zaplanuj Swoje Wydarzenie"

**Lead:** "Skonfiguruj wstępny plan, a my zajmiemy się resztą."

**Layout:** Split section (55% konfigurator / 45% podsumowanie)

---

**Lewa strona: INTERAKTYWNY KONFIGURATOR**

**Struktura:**
```
┌─────────────────────────────────────────┐
│ H2: Zaplanuj Swoje Wydarzenie           │
│ Lead: Skonfiguruj wstępny plan...       │
├─────────────────────────────────────────┤
│                                         │
│ Rodzaj Wydarzenia                       │
│ ┌────────┬────────┬────────┬────────┐   │
│ │ Plener │ Event  │  Kino  │  Inne  │   │
│ │Miejski │Firmowy │Samoch. │        │   │
│ └────────┴────────┴────────┴────────┘   │
│ (Buttons - single select, toggle style) │
│                                         │
│ Przewidywana liczba widzów        200   │
│ ──────────●───────────────────────      │
│ 50 (Kameralnie)      1000+ (Mass Event) │
│                                         │
│ Dodatki                                 │
│ ○ Stoisko z Popcornem                   │
│ ○ Leżaki (ilość dopasowana do widzów)   │
│ ● Obsługa Licencyjna                    │
│                                         │
└─────────────────────────────────────────┘
```

**Komponenty:**

**1. Rodzaj Wydarzenia (4 przyciski):**
- **Type:** Toggle buttons (single select)
- **Opcje:** 
  - Plener Miejski
  - Event Firmowy
  - Kino Samochodowe
  - Inne
- **Style:**
  - Default: Border 2px solid #E5E7EB, background transparent
  - Selected: Border 2px solid #FFD700, background rgba(255,215,0,0.1)
  - Size: 150px x 80px (desktop), full-width stack (mobile)
  - Font: 16px, semi-bold
  - Hover: scale(1.02), border-color lighter
- **Funkcjonalność:** 
  - Tylko 1 może być wybrany
  - Kliknięcie zmienia wybór i aktualizuje podsumowanie po prawej

**2. Przewidywana liczba widzów (Suwak):**
- **Type:** Range slider (interactive)
- **Zakres:** 50 - 1000+
- **Step:** 10
- **Labels:**
  - Minimum: "50 (Kameralnie)"
  - Maximum: "1000+ (Mass Event)"
  - Current value: Wyświetlany nad suwakiem (np. "200")
- **Style:**
  - Track: Height 6px, background #E5E7EB
  - Filled track: Gradient gold (#FFD700 → #FFA500)
  - Thumb: 20px circle, gold, box-shadow, scale on hover
- **Funkcjonalność:**
  - Real-time update wartości
  - Automatyczna aktualizacja podsumowania po prawej
  - Jeśli wybrano "Leżaki", liczba leżaków = liczba widzów

**3. Dodatki (Przełączniki):**
- **Type:** Toggle switches (multi-select)
- **Opcje:**
  - [ ] Stoisko z Popcornem
  - [ ] Leżaki (ilość dopasowana do widzów)
  - [x] Obsługa Licencyjna (domyślnie włączona)
- **Style:**
  - Toggle: Width 50px, height 26px
  - Off: Background #E5E7EB
  - On: Background gradient (#FFD700 → #FFA500)
  - Thumb: 20px circle, white, smooth transition 0.3s
  - Label: 16px, position right of toggle
- **Funkcjonalność:**
  - Niezależne włączanie/wyłączanie
  - Aktualizacja podsumowania po prawej
  - Leżaki: Wyświetla liczbę w podsumowaniu

**4. Dane Kontaktowe (Formularz - na samym dole konfiguratora):**
- **Type:** Text inputs (obowiązkowe i opcjonalne)
- **Pola:**

```
┌─ Imię * ──────────────────────────┐
│ [text input]                      │
└───────────────────────────────────┘

┌─ Nazwisko * ──────────────────────┐
│ [text input]                      │
└───────────────────────────────────┘

┌─ Email * ─────────────────────────┐
│ [email input]                     │
└───────────────────────────────────┘

┌─ Telefon (opcjonalnie) ───────────┐
│ [tel input]                       │
└───────────────────────────────────┘

┌─ Wiadomość * ─────────────────────┐
│ [textarea, rows: 4]               │
│ Opisz szczegóły wydarzenia...     │
└───────────────────────────────────┘
```

- **Style:**
  - Input height: 48px (textarea: auto)
  - Border: 1px solid #4B5563 (gray-600)
  - Border-radius: 8px
  - Background: rgba(30, 41, 59, 0.5) (semi-transparent)
  - Text color: White
  - Placeholder: #9CA3AF
  - Focus: Border #FFD700, box-shadow gold glow
  - Font-size: 16px
  - Spacing: 16px between fields
  - Required asterisk: color #FFD700

- **Validation:**
  - Real-time validation (on blur)
  - Required fields: Imię, Nazwisko, Email, Wiadomość
  - Email format validation
  - Error messages w kolorze czerwonym pod inputem
  - Wszystkie pola muszą być wypełnione przed wysłaniem

- **Funkcjonalność:**
  - Po wypełnieniu wszystkich wymaganych pól, przycisk w podsumowaniu po prawej staje się aktywny
  - Submit wysyła całą konfigurację + dane kontaktowe
  - Brak osobnego modalu - wszystko w jednym widoku

---

**Prawa strona: PODSUMOWANIE KONFIGURACJI**

**Struktura:**
```
┌─────────────────────────────────────┐
│      TWOJA KONFIGURACJA             │
├─────────────────────────────────────┤
│                                     │
│ Kino Samochodowe                    │
│ ─────────────────────────────────── │
│                                     │
│ Technologia                         │
│ Ekran LED Premium       W zestawie  │
│                                     │
│ Widownia                            │
│ 200 osób                            │
│                                     │
│ Licencja                            │
│ ✓                                   │
│                                     │
│ ─────────────────────────────────── │
│ Szacowany poziom realizacji:        │
│ PROFESSIONAL                        │
│                                     │
│ [ZAPYTAJ O TERMIN] ← CTA Button     │
│                                     │
└─────────────────────────────────────┘
```

**Zawartość dynamiczna:**

**1. Nagłówek:** "TWOJA KONFIGURACJA"
- Font: 14px, uppercase, letter-spacing: 2px
- Color: #9CA3AF

**2. Wybrany typ wydarzenia:**
- Font: 28px, bold
- Color: White
- Dynamicznie zmienia się na podstawie wyboru z lewej

**3. Technologia (stała):**
- Label: "Technologia"
- Value: "Ekran LED Premium"
- Badge: "W zestawie" (gray, small)
- Zawsze wyświetlane

**4. Widownia (dynamiczna):**
- Label: "Widownia"
- Value: "[X] osób" (z suwaka)
- Aktualizuje się w real-time

**5. Dodatki (warunkowe wyświetlanie):**
- Jeśli włączone "Stoisko z Popcornem":
  - Popcorn ✓
- Jeśli włączone "Leżaki":
  - Leżaki ([X] szt.)
- Jeśli włączone "Licencja":
  - Licencja ✓

**6. Poziom realizacji (kalkulowany):**
- **Algorytm:**
  - Widzów 50-150: KAMERALNY
  - Widzów 151-500: STANDARD
  - Widzów 501-800: PROFESSIONAL
  - Widzów 801+: MASS EVENT
- **Style:**
  - Font: 12px, uppercase
  - Color: #FFD700 (gold)
  - Position: Bottom, before CTA

**7. CTA Button "WYŚLIJ ZAPYTANIE":**
- **Funkcjonalność:** 
  - Submit całego formularza (konfiguracja + dane kontaktowe)
  - Walidacja wszystkich wymaganych pól przed wysłaniem
  - Disabled jeśli nie wszystkie wymagane pola wypełnione
  - Po wysłaniu: Success message "Dziękujemy! Odezwiemy się w ciągu 24h"
- **Style:**
  - Background: Gradient (#FFD700 → #FFA500)
  - Padding: 16px 32px
  - Font: 16px, bold, uppercase
  - Border-radius: 8px
  - Hover: scale(1.05), brightness increase
  - Width: 100%

**Style całego kontenera:**
- Background: Dark navy gradient (#1E3A5F → #0A1828)
- Border: 1px solid rgba(255,215,0,0.2)
- Border-radius: 16px
- Padding: 40px
- Box-shadow: 0 10px 40px rgba(0,0,0,0.3)

---

**Modal Formularza (po kliknięciu "ZAPYTAJ O TERMIN"):**

**Zawartość modalu:**
```
┌─────────────────────────────────────┐
│ [X] Zamknij                         │
│                                     │
│ Potwierdź Zapytanie                 │
│ ─────────────────────────────────── │
│                                     │
│ Twoja konfiguracja:                 │
│ • Rodzaj: [Kino Samochodowe]        │
│ • Widownia: [200 osób]              │
│ • Dodatki: [Licencja]               │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ ┌─ Imię i nazwisko * ─────────────┐ │
│ │ [text input]                    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Email * ───────────────────────┐ │
│ │ [email input]                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Telefon * ─────────────────────┐ │
│ │ [tel input]                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Preferowany termin (opcjonalne)┐ │
│ │ [date picker]                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ Dodatkowe uwagi ───────────────┐ │
│ │ [textarea]                      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ☑ Akceptuję politykę prywatności * │
│                                     │
│ [WYŚLIJ ZAPYTANIE] ← Gold button    │
│                                     │
└─────────────────────────────────────┘
```

**Wysyłanie emaili (po submit):**

**Email 1: Do firmy (pokaz@hangarfilmowy.pl)**
```
Temat: Nowe zapytanie - [Rodzaj Wydarzenia]

Nowe zapytanie od: [Imię] [Nazwisko]
Email: [email]
Telefon: [telefon lub "Nie podano"]

KONFIGURACJA:
─────────────
Rodzaj: [Kino Samochodowe]
Widownia: [200 osób]
Poziom realizacji: [PROFESSIONAL]
Dodatki:
- Stoisko z Popcornem ✓
- Leżaki (200 szt.) ✓
- Obsługa Licencyjna ✓

WIADOMOŚĆ OD KLIENTA:
─────────────
[Treść wiadomości]

Szacowany poziom realizacji: PROFESSIONAL
```

**Email 2: Do klienta (kopia potwierdzająca)**
```
Temat: Potwierdzenie zapytania - Hangar Filmowy

Dzień dobry [Imię],

Dziękujemy za zapytanie!

Otrzymaliśmy Twoją konfigurację:
• Rodzaj: Kino Samochodowe
• Widownia: 200 osób
• Poziom: PROFESSIONAL
• Dodatki: Obsługa Licencyjna, Leżaki (200 szt.)

Twoja wiadomość:
[Treść wiadomości]

Skontaktujemy się z Tobą w ciągu 24 godzin 
z indywidualną wyceną i szczegółami.

Pozdrawiamy,
Zespół Hangar Filmowy

Tel: [telefon]
Email: pokaz@hangarfilmowy.pl
```

---

**FOOTER (poniżej, full-width)**

**Layout:**
```
┌───────────────────────────────────────────────────┐
│ Background: Dark navy (#0A1828)                   │
│ Color: White/Light gray                           │
├───────────────────────────────────────────────────┤
│                                                   │
│  "Hangar Filmowy – Najjaśniejszy punkt           │
│   na mapie letnich wydarzeń."                     │
│                                                   │
│  [Polityka prywatności] [Regulamin] [RODO]       │
│                                                   │
│  © 2025 Hangar Filmowy.                           │
│  Wszystkie prawa zastrzeżone.                     │
│                                                   │
└───────────────────────────────────────────────────┘
```

**Style:**
- Padding: 60px 40px
- Text align: center
- Slogan: 24px, bold, margin-bottom: 32px
- Links: 14px, color: #9CA3AF, hover: white
- Copyright: 14px, color: #6B7280, margin-top: 24px
- Links spacing: 24px between items

---

**Dodatkowe elementy:**
- **Back to top button:** Fixed, bottom-right, pokazuje się po scroll >500px
- **Smooth scroll:** Wszystkie anchor links animowane
- **Form submit:** AJAX request, no page reload

---

## III. Rekomendowany Stos Technologiczny

### 3.1 Frontend (Strona Główna)
- **Framework:** Next.js 14 (App Router) - SSG dla performance
- **Język:** TypeScript - type safety
- **Styling:** 
  - **TailwindCSS** - utility-first CSS (zgodny z designem z konceptu)
  - **Shadcn/ui** - komponenty (buttons, inputs, cards)
  - **CSS Variables** - dla kolorów brandowych z palety
- **Animacje:** 
  - **Framer Motion** - scroll animations, parallax, page transitions
  - **GSAP** (opcjonalnie) - complex timeline animations
- **Formularze:** 
  - **React Hook Form** - performance
  - **Zod** - validation schema
- **Icons:** 
  - **Lucide Icons** - consistent, modern
  - **Custom SVG** - dla brand icons
  


### 3.2 Wymagania Wizualne - Szczegóły Implementacji



### 3.2 Backend / Admin Panel
- **Framework:** Next.js 14 API Routes (serverless functions)
- **Autentykacja:** NextAuth.js v5 (session-based)
- **ORM:** Prisma (PostgreSQL)
- **Baza danych:** Supabase
- **Storage:** Cloudflare R2 (media/zdjęcia, zero egress fees)
- **Email:** Resend (powiadomienia z formularza)

### 3.3 Panel Administracyjny
- **Admin UI:** Custom built w Next.js (protected routes)
- **Editor treści:** TipTap lub Lexical (WYSIWYG)
- **Upload mediów:** Drag & drop z preview
- **Dashboard:** Statystyki z Chart.js lub Recharts

### 3.4 Deployment
- **Hosting:** Cloudflare Pages
- **CI/CD:** GitHub Actions
- **Domain:** Cloudflare DNS
- **SSL:** Automatyczne (Cloudflare)

### 3.5 Monitoring & Analytics
- **Analytics:** Cloudflare Web Analytics (privacy-first)
- **Error tracking:** Sentry (opcjonalnie)
- **Uptime monitoring:** Cloudflare Workers Cron

---

### 3.6 Konfiguracja Supabase

**1. Utworzenie projektu:**
- Zaloguj się do [supabase.com](https://supabase.com)
- New Project
- Nazwa: `hangar-filmowy`
- Database Password: [silne hasło - zapisz w menedżerze haseł]
- Region: `Frankfurt` (najbliżej Polski dla najlepszej latencji)

**2. Connection String:**
```env
# .env.local
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**3. Prisma Setup:**
```bash
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

**4. Supabase Storage (dla mediów - opcjonalne, jeśli nie używamy tylko R2):**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

**5. Row Level Security (RLS):**
- W Supabase Dashboard → Authentication → Policies
- Włącz RLS dla tabel dostępnych przez API
- Przykładowe policy dla `form_submissions`:
```sql
-- Public insert (dla formularza)
CREATE POLICY "Enable insert for everyone" ON form_submissions
FOR INSERT WITH CHECK (true);

-- Admin read (dla panelu)
CREATE POLICY "Enable read for authenticated users" ON form_submissions
FOR SELECT USING (auth.role() = 'authenticated');
```

**6. Environment Variables (.env.local):**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # dla admin operations

# Database (Prisma)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@hangarfilmowy.pl
EMAIL_TO=pokaz@hangarfilmowy.pl
```

**7. Free Tier Limity Supabase:**
- Database: 500MB
- Storage: 1GB
- Bandwidth: 2GB/miesiąc
- Realtime connections: 200 concurrent
- Edge Functions: 500,000 invocations/miesiąc

---

### 3.7 Przykładowa Implementacja Konfiguratora (TypeScript + React)

**State management (używając useState):**
```typescript
// types/configurator.ts
export type EventType = 'plener_miejski' | 'event_firmowy' | 'kino_samochodowe' | 'inne';

export interface ConfiguratorState {
  eventType: EventType;
  audienceSize: number;
  extras: {
    popcorn: boolean;
    sunbeds: boolean;
    license: boolean;
  };
}

export type EstimatedLevel = 'KAMERALNY' | 'STANDARD' | 'PROFESSIONAL' | 'MASS EVENT';

// utils/calculateLevel.ts
export function calculateLevel(audienceSize: number): EstimatedLevel {
  if (audienceSize <= 150) return 'KAMERALNY';
  if (audienceSize <= 500) return 'STANDARD';
  if (audienceSize <= 800) return 'PROFESSIONAL';
  return 'MASS EVENT';
}
```

**Główny komponent konfiguratora:**
```typescript
// components/EventConfigurator.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ConfiguratorState, EventType } from '@/types/configurator';
import { calculateLevel } from '@/utils/calculateLevel';

const contactFormSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć min. 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć min. 2 znaki'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Wiadomość musi mieć min. 10 znaków'),
});

type ContactForm = z.infer<typeof contactFormSchema>;

export default function EventConfigurator() {
  const [config, setConfig] = useState<ConfiguratorState>({
    eventType: 'kino_samochodowe',
    audienceSize: 200,
    extras: {
      popcorn: false,
      sunbeds: false,
      license: true, // domyślnie włączona
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
  });
  
  const estimatedLevel = calculateLevel(config.audienceSize);
  
  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          config,
          estimatedLevel,
        }),
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Lewa strona - Konfigurator */}
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                Zaplanuj Swoje Wydarzenie
              </h2>
              <p className="text-gray-400 mb-8">
                Skonfiguruj wstępny plan, a my zajmiemy się resztą.
              </p>
              
              {/* Rodzaj Wydarzenia */}
              <div className="mb-8">
                <label className="block text-white mb-4 font-semibold">
                  Rodzaj Wydarzenia
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'plener_miejski', label: 'Plener Miejski' },
                    { value: 'event_firmowy', label: 'Event Firmowy' },
                    { value: 'kino_samochodowe', label: 'Kino Samochodowe' },
                    { value: 'inne', label: 'Inne' },
                  ].map((type) => (
                    <button
                      type="button"
                      key={type.value}
                      onClick={() => setConfig({ ...config, eventType: type.value as EventType })}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-300
                        ${config.eventType === type.value
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                        }
                      `}
                    >
                      <span className="text-white font-semibold">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Suwak widzów */}
              <div className="mb-8">
                <label className="block text-white mb-2 font-semibold">
                  Przewidywana liczba widzów
                  <span className="float-right text-yellow-500 text-2xl font-bold">
                    {config.audienceSize}
                  </span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={config.audienceSize}
                  onChange={(e) => setConfig({ ...config, audienceSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-gold"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>50 (Kameralnie)</span>
                  <span>1000+ (Mass Event)</span>
                </div>
              </div>
              
              {/* Dodatki */}
              <div className="mb-8">
                <label className="block text-white mb-4 font-semibold">Dodatki</label>
                {[
                  { key: 'popcorn', label: 'Stoisko z Popcornem' },
                  { key: 'sunbeds', label: 'Leżaki (ilość dopasowana do widzów)' },
                  { key: 'license', label: 'Obsługa Licencyjna' },
                ].map((extra) => (
                  <div key={extra.key} className="flex items-center mb-4">
                    <button
                      type="button"
                      onClick={() => setConfig({
                        ...config,
                        extras: {
                          ...config.extras,
                          [extra.key]: !config.extras[extra.key as keyof typeof config.extras],
                        },
                      })}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors duration-300
                        ${config.extras[extra.key as keyof typeof config.extras]
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gray-600'
                        }
                      `}
                    >
                      <span
                        className={`
                          absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
                          transition-transform duration-300
                          ${config.extras[extra.key as keyof typeof config.extras]
                            ? 'translate-x-6'
                            : 'translate-x-0'
                          }
                        `}
                      />
                    </button>
                    <span className="ml-4 text-white">{extra.label}</span>
                  </div>
                ))}
              </div>
              
              {/* Formularz Kontaktowy */}
              <div className="space-y-4 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Twoje Dane
                </h3>
                
                {/* Imię */}
                <div>
                  <label className="block text-white mb-2">
                    Imię <span className="text-yellow-500">*</span>
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    placeholder="Jan"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                
                {/* Nazwisko */}
                <div>
                  <label className="block text-white mb-2">
                    Nazwisko <span className="text-yellow-500">*</span>
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    placeholder="Kowalski"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-white mb-2">
                    Email <span className="text-yellow-500">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    placeholder="jan.kowalski@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                {/* Telefon */}
                <div>
                  <label className="block text-white mb-2">
                    Telefon (opcjonalnie)
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    placeholder="+48 123 456 789"
                  />
                </div>
                
                {/* Wiadomość */}
                <div>
                  <label className="block text-white mb-2">
                    Wiadomość <span className="text-yellow-500">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all resize-none"
                    placeholder="Opisz szczegóły wydarzenia..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>
              </div>
            </div>
          
          {/* Prawa strona - Podsumowanie */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-yellow-500/20 shadow-2xl">
            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-6">
              TWOJA KONFIGURACJA
            </h3>
            
            <h4 className="text-3xl font-bold text-white mb-8">
              {config.eventType === 'plener_miejski' && 'Plener Miejski'}
              {config.eventType === 'event_firmowy' && 'Event Firmowy'}
              {config.eventType === 'kino_samochodowe' && 'Kino Samochodowe'}
              {config.eventType === 'inne' && 'Inne'}
            </h4>
            
            <div className="space-y-6 mb-8">
              <div>
                <p className="text-gray-400 text-sm mb-1">Technologia</p>
                <p className="text-white font-semibold flex justify-between items-center">
                  Ekran LED Premium
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">W zestawie</span>
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Widownia</p>
                <p className="text-white font-semibold">{config.audienceSize} osób</p>
              </div>
              
              {(config.extras.popcorn || config.extras.sunbeds || config.extras.license) && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Dodatki</p>
                  <div className="space-y-2">
                    {config.extras.popcorn && (
                      <p className="text-white flex items-center">
                        <span className="text-green-500 mr-2">✓</span> Popcorn
                      </p>
                    )}
                    {config.extras.sunbeds && (
                      <p className="text-white flex items-center">
                        <span className="text-green-500 mr-2">✓</span> 
                        Leżaki ({config.audienceSize} szt.)
                      </p>
                    )}
                    {config.extras.license && (
                      <p className="text-white flex items-center">
                        <span className="text-green-500 mr-2">✓</span> Licencja
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-700 pt-6 mb-6">
              <p className="text-gray-400 text-xs mb-1">Szacowany poziom realizacji:</p>
              <p className="text-yellow-500 font-bold text-lg">{estimatedLevel}</p>
            </div>
            
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                <p className="text-green-400 text-center font-semibold">
                  Dziękujemy! Odezwiemy się w ciągu 24h
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-4 rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'WYSYŁANIE...' : 'WYŚLIJ ZAPYTANIE'}
            </button>
          </div>
        </div>
        </form>
      </div>
    </section>
  );
}
```

**API Route do wysyłania emaili:**
```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY!);

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  config: z.object({
    eventType: z.enum(['plener_miejski', 'event_firmowy', 'kino_samochodowe', 'inne']),
    audienceSize: z.number().min(50).max(1000),
    extras: z.object({
      popcorn: z.boolean(),
      sunbeds: z.boolean(),
      license: z.boolean(),
    }),
  }),
  estimatedLevel: z.enum(['KAMERALNY', 'STANDARD', 'PROFESSIONAL', 'MASS EVENT']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);
    
    const eventTypeLabels = {
      plener_miejski: 'Plener Miejski',
      event_firmowy: 'Event Firmowy',
      kino_samochodowe: 'Kino Samochodowe',
      inne: 'Inne',
    };
    
    const fullName = `${data.firstName} ${data.lastName}`;
    
    // Email do firmy
    const emailToCompany = {
      to: 'pokaz@hangarfilmowy.pl',
      from: 'noreply@hangarfilmowy.pl', // Musi być zweryfikowana domena w Resend
      subject: `Nowe zapytanie - ${eventTypeLabels[data.config.eventType]}`,
      html: `
        <h2>Nowe zapytanie od: ${fullName}</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Telefon:</strong> ${data.phone}</p>` : ''}
        
        <h3>KONFIGURACJA:</h3>
        <ul>
          <li><strong>Rodzaj:</strong> ${eventTypeLabels[data.config.eventType]}</li>
          <li><strong>Widownia:</strong> ${data.config.audienceSize} osób</li>
          <li><strong>Poziom realizacji:</strong> ${data.estimatedLevel}</li>
          <li><strong>Dodatki:</strong></li>
          <ul>
            ${data.config.extras.popcorn ? '<li>✓ Stoisko z Popcornem</li>' : ''}
            ${data.config.extras.sunbeds ? `<li>✓ Leżaki (${data.config.audienceSize} szt.)</li>` : ''}
            ${data.config.extras.license ? '<li>✓ Obsługa Licencyjna</li>' : ''}
          </ul>
        </ul>
        
        <h3>WIADOMOŚĆ OD KLIENTA:</h3>
        <p>${data.message}</p>
      `,
    };
    
    await resend.emails.send(emailToCompany);
    
    // Email potwierdzający do klienta
    const emailToClient = {
      from: 'noreply@hangarfilmowy.pl', // Musi być zweryfikowana domena w Resend
      to: data.email,
      subject: 'Potwierdzenie zapytania - Hangar Filmowy',
      html: `
        <h2>Dzień dobry ${data.firstName},</h2>
        <p>Dziękujemy za zapytanie!</p>
        
        <h3>Otrzymaliśmy Twoją konfigurację:</h3>
        <ul>
          <li><strong>Rodzaj:</strong> ${eventTypeLabels[data.config.eventType]}</li>
          <li><strong>Widownia:</strong> ${data.config.audienceSize} osób</li>
          <li><strong>Poziom:</strong> ${data.estimatedLevel}</li>
          ${data.config.extras.popcorn ? '<li>✓ Stoisko z Popcornem</li>' : ''}
          ${data.config.extras.sunbeds ? `<li>✓ Leżaki (${data.config.audienceSize} szt.)</li>` : ''}
          ${data.config.extras.license ? '<li>✓ Obsługa Licencyjna</li>' : ''}
        </ul>
        
        <p><strong>Twoja wiadomość:</strong><br>${data.message}</p>
        
        <p>Skontaktujemy się z Tobą w ciągu 24 godzin z indywidualną wyceną i szczegółami.</p>
        
        <p>Pozdrawiamy,<br>Zespół Hangar Filmowy</p>
        <p>Tel: [telefon]<br>Email: pokaz@hangarfilmowy.pl</p>
      `,
    };
    
    await resend.emails.send(emailToClient);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

**Konfiguracja Resend:**

**1. Instalacja paczki:**
```bash
npm install resend
```

**2. Environment Variables (.env.local):**
```env
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email addresses
EMAIL_FROM=noreply@hangarfilmowy.pl
EMAIL_TO=pokaz@hangarfilmowy.pl
```

**3. Weryfikacja domeny w Resend:**
- Zaloguj się do Resend Dashboard (resend.com)
- Settings → Domains
- Add Domain → wprowadź hangarfilmowy.pl
- Dodaj rekordy DNS zgodnie z instrukcjami:
  - TXT record dla weryfikacji
  - MX records (opcjonalne, dla odbierania emaili)
  - SPF i DKIM records
- Poczekaj na weryfikację (~24h, czasem szybciej)

**4. Resend API Key:**
- Settings → API Keys
- Create API Key
- Wybierz uprawnienia: "Sending access"
- Skopiuj klucz do .env.local (zaczyna się od `re_`)

**5. Email Templates (opcjonalnie - React Email):**
- Resend wspiera React Email components
- Można tworzyć szablony w React/TSX
- Alternatywnie: zwykły HTML jak w przykładzie powyżej

**CSS dla custom suwaka (Tailwind):**
```css
/* globals.css */
.slider-gold::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(255, 165, 0, 0.5);
  transition: transform 0.2s;
}

.slider-gold::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider-gold::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(255, 165, 0, 0.5);
  border: none;
}
```

---

## IV. Wymagania Funkcjonalne - Panel Administracyjny

### 4.1 System Autoryzacji
**Funkcje:**
- Login z hashem (bcrypt)
- Session management (NextAuth.js)
- Wylogowanie
- Zmiana hasła
- Opcjonalnie: 2FA (future enhancement)

**Tabela w bazie:** `users`
```
- id: string (UUID)
- email: string (unique)
- password: string (hashed)
- name: string
- role: enum (admin, editor)
- createdAt: DateTime
- updatedAt: DateTime
```

### 4.2 Zarządzanie Treścią
**Możliwości edycji:**
- Hero Section (H1, subtitle, lead, CTA buttons)
- O Nas (tekst + zdjęcie)
- Dlaczego My (3 boxy: tytuł + opis)
- Oferta (4 karty: ikona, tytuł, opis)
- Dla Kogo (4 karty: tytuł + opis)
- Proces (4 kroki: numer, tytuł, opis)
- Footer (lead, dane kontaktowe, slogan)

**Tabela w bazie:** `content_sections`
```
- id: string
- sectionKey: string (np. "hero", "about", "offer")
- contentType: enum (text, image, card, box)
- data: JSON (elastyczna struktura)
- order: integer
- isVisible: boolean
- updatedAt: DateTime
- updatedBy: string (user ID)
```

### 4.3 Zarządzanie Mediami
**Funkcje:**
- Upload zdjęć (drag & drop)
- Podgląd galerii
- Przypisanie do sekcji
- Optymalizacja (automatyczna przez Next.js Image)
- Usuwanie mediów

**Tabela w bazie:** `media`
```
- id: string
- fileName: string
- fileUrl: string (Cloudflare R2)
- fileType: string (image/jpeg, etc.)
- fileSize: integer
- alt: string
- section: string
- uploadedAt: DateTime
- uploadedBy: string (user ID)
```

### 4.4 Zarządzanie Formularzami (Konfigurator)
**Funkcje:**
- Przeglądanie zgłoszeń z konfiguratora
- Status (nowe, w trakcie, zamknięte)
- Odpowiedzi przez email
- Archiwizacja
- Statystyki najpopularniejszych konfiguracji

**Tabela w bazie:** `form_submissions`
```
- id: string
- firstName: string
- lastName: string
- email: string
- phone: string (nullable)
- message: text
- eventType: enum (plener_miejski, event_firmowy, kino_samochodowe, inne)
- audienceSize: integer (50-1000+)
- extras: JSON {
    popcorn: boolean,
    sunbeds: boolean,
    license: boolean
  }
- estimatedLevel: enum (kameralny, standard, professional, mass_event)
- status: enum (new, in_progress, closed)
- submittedAt: DateTime
- adminNotes: text (notatki admina)
```

### 4.5 Ustawienia Strony
**Funkcje:**
- Dane kontaktowe (email, telefon)
- Social media links
- SEO (title, description, keywords)
- Google Analytics ID
- Maintenance mode

**Tabela w bazie:** `settings`
```
- key: string (unique)
- value: JSON
- updatedAt: DateTime
- updatedBy: string (user ID)
```

---

## V. Architektura Bazy Danych (Prisma Schema)

### 5.1 Schema Overview
```prisma
// 1. Users (autoryzacja)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(EDITOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  EDITOR
}

// 2. Content Sections (treść strony)
model ContentSection {
  id          String      @id @default(uuid())
  sectionKey  String      @unique
  contentType ContentType
  data        Json
  order       Int
  isVisible   Boolean     @default(true)
  updatedAt   DateTime    @updatedAt
  updatedBy   String
}

enum ContentType {
  TEXT
  IMAGE
  CARD
  BOX
  TIMELINE
}

// 3. Media (zdjęcia/grafiki)
model Media {
  id         String   @id @default(uuid())
  fileName   String
  fileUrl    String
  fileType   String
  fileSize   Int
  alt        String?
  section    String?
  uploadedAt DateTime @default(now())
  uploadedBy String
}

// 4. Form Submissions (zgłoszenia z formularza konfiguratora)
model FormSubmission {
  id             String           @id @default(uuid())
  firstName      String
  lastName       String
  email          String
  phone          String?
  message        String           @db.Text
  eventType      EventType
  audienceSize   Int
  extras         Json             // { popcorn: boolean, sunbeds: boolean, license: boolean }
  estimatedLevel EstimatedLevel
  status         SubmissionStatus @default(NEW)
  submittedAt    DateTime         @default(now())
  adminNotes     String?          @db.Text
}

enum EventType {
  PLENER_MIEJSKI
  EVENT_FIRMOWY
  KINO_SAMOCHODOWE
  INNE
}

enum EstimatedLevel {
  KAMERALNY
  STANDARD
  PROFESSIONAL
  MASS_EVENT
}

enum SubmissionStatus {
  NEW
  IN_PROGRESS
  CLOSED
}

// 5. Settings (ustawienia strony)
model Setting {
  key       String   @unique
  value     Json
  updatedAt DateTime @updatedAt
  updatedBy String
}
```

---

## VI. Środki Bezpieczeństwa

### 6.1 Autoryzacja i Autentykacja
- ✅ Hasła hashowane (bcrypt, salt rounds: 10)
- ✅ Session-based auth (NextAuth.js)
- ✅ HTTP-only cookies (zabezpieczenie przed XSS)
- ✅ CSRF protection (built-in Next.js)
- ✅ Rate limiting na login (Cloudflare Workers)

### 6.2 API Security
- ✅ Middleware sprawdzający sesję dla protected routes
- ✅ Input validation (Zod schemas)
- ✅ Sanitization danych (DOMPurify dla WYSIWYG)
- ✅ CORS configuration
- ✅ API rate limiting (Cloudflare)

### 6.3 Database Security
- ✅ Prisma ORM (SQL injection protection)
- ✅ Environment variables dla credentials
- ✅ Connection pooling (Supabase)
- ✅ Backup automatyczne (Supabase daily backups)

### 6.4 Media Storage Security
- ✅ Cloudflare R2 z signed URLs
- ✅ File type validation (tylko obrazy)
- ✅ File size limits (max 10MB per image)
- ✅ Image optimization (Next.js Image component)

### 6.5 Frontend Security
- ✅ Content Security Policy (CSP headers)
- ✅ HTTPS only (Cloudflare SSL)
- ✅ XSS protection (React escaping)
- ✅ Dependency scanning (Dependabot)

---

## VII. Harmonogram Projektu (8 Tygodni)

### **Tydzień 1: Setup & Fundament**
**Zadania:**
- Utworzenie repository GitHub
- Inicjalizacja projektu Next.js 14 + TypeScript
- Konfiguracja TailwindCSS + Shadcn/ui
- Setup Prisma + Supabase
- Konfiguracja NextAuth.js
- Setup Cloudflare Pages

**Deliverables:**
- ✅ Działający lokalny environment
- ✅ Połączenie z bazą danych
- ✅ GitHub Actions workflow

---

### **Tydzień 2: Struktura Strony Głównej**
**Zadania:**
- Routing i layout (App Router)
- Sekcja Hero (statyczna wersja)
- Sekcja O Nas
- Sekcja Dlaczego My (3 boxy)
- Responsywność (mobile-first)

**Deliverables:**
- ✅ 3 pierwsze sekcje strony
- ✅ Podstawowa nawigacja
- ✅ Responsywny design

---

### **Tydzień 3: Dokończenie Sekcji + Animacje**
**Zadania:**
- Sekcja Oferta (4 karty)
- Sekcja Dla Kogo (4 karty)
- Sekcja Proces (timeline)
- Footer + formularz kontaktowy (UI)
- Implementacja Framer Motion (scroll animations)

**Deliverables:**
- ✅ Kompletna strona główna
- ✅ Smooth scroll między sekcjami
- ✅ Animacje przy scrollu

---

### **Tydzień 4: Panel Administracyjny - Core**
**Zadania:**
- Login screen + autoryzacja
- Dashboard (strona główna panelu)
- Layout panelu (sidebar, topbar)
- Strona zarządzania użytkownikami
- Middleware dla protected routes

**Deliverables:**
- ✅ Działający system logowania
- ✅ Dashboard z menu
- ✅ Zabezpieczone trasy

---

### **Tydzień 5: CMS - Zarządzanie Treścią**
**Zadania:**
- Strona edycji treści (lista sekcji)
- Formularze edycji dla każdej sekcji
- WYSIWYG editor (TipTap)
- Preview mode
- Save & publish functionality

**Deliverables:**
- ✅ Pełna edycja treści wszystkich sekcji
- ✅ Podgląd zmian
- ✅ Zapisywanie do bazy

---

### **Tydzień 6: Media Library + Formularze**
**Zadania:**
- Upload mediów (drag & drop)
- Galeria zdjęć w panelu
- Cloudflare R2 integration
- Zarządzanie zgłoszeniami z formularza
- Email notifications (Resend)

**Deliverables:**
- ✅ Działająca biblioteka mediów
- ✅ Upload na Cloudflare R2
- ✅ Zarządzanie formami
- ✅ Powiadomienia email

---

### **Tydzień 7: Optymalizacja + SEO**
**Zadania:**
- Next.js Image optimization (WebP, lazy loading, sizes)
- **SEO Meta Tags:**
  - Meta title, description, keywords
  - Open Graph tags (OG:title, OG:description, OG:image)
  - Twitter Card tags
  - Canonical URLs
- **Schema.org Markup:**
  - LocalBusiness schema
  - Service schema
  - BreadcrumbList schema
  - Implementacja JSON-LD w komponencie
- **Technical SEO:**
  - Sitemap.xml generation (app/sitemap.ts)
  - Robots.txt configuration (app/robots.ts)
  - Alt texts dla wszystkich obrazów
  - Semantic HTML5 (proper H1-H6 hierarchy)
- **Performance:**
  - Lighthouse audit + fixes
  - Core Web Vitals optimization (LCP, FID, CLS)
  - Font optimization (font-display: swap)
  - CSS/JS minification
- **Files:**
  - Favicon set (16x16, 32x32, 180x180, 192x192, 512x512)
  - OG image (1200x630px)
  - Apple touch icon
  - site.webmanifest
- **Testing:**
  - Google Rich Results Test
  - Mobile-Friendly Test
  - PageSpeed Insights (desktop + mobile)
  - Cross-browser testing

**Deliverables:**
- ✅ Lighthouse score 90+ (desktop), 85+ (mobile)
- ✅ SEO ready - wszystkie meta tags + schema
- ✅ Zoptymalizowane obrazy (WebP + fallback)
- ✅ Sitemap + robots.txt działające
- ✅ Zero błędów w Google Rich Results Test

---

### **Tydzień 8: Testing + Deployment**
**Zadania:**
- Testing (unit + e2e)
- Bug fixing
- Security audit
- Documentation (README)
- Deployment na Cloudflare Pages
- DNS configuration
- Final review

**Deliverables:**
- ✅ Działająca strona na produkcji
- ✅ Panel administracyjny gotowy
- ✅ Dokumentacja techniczna

---

## VIII. Szacunkowe Koszty Miesięczne

### 8.1 Hosting i Infrastruktura
| Usługa | Plan | Koszt |
|--------|------|-------|
| Cloudflare Pages | Free | $0/mies. |
| Supabase | Free tier | $0/mies. (do 500MB DB + 1GB storage) |
| Cloudflare R2 | Pay-as-you-go | ~$0.50-2/mies. (dla małej ilości zdjęć) |
| Resend (email) | Free | $0/mies. (do 100 emaili/dzień = ~3000/mies.) |
| **SUMA** | | **$0.50-2/mies.** |

### 8.2 Opcjonalne Rozszerzenia
| Usługa | Plan | Koszt |
|--------|------|-------|
| Supabase Pro | + więcej zasobów | $25/mies. |
| Custom domain | Rejestracja | ~$15/rok |
| Cloudflare Pro | + lepsze analytics | $20/mies. |
| Sentry (error tracking) | Team | $26/mies. |

### 8.3 Szacunek Całkowity
- **Wersja minimalna (MVP):** $0.50-2/mies. + $15/rok (domena) = **~$2-5/mies.**
- **Wersja rozszerzona:** $5-15/mies. (z płatnymi planami)

**Uwaga:** GitHub jest darmowy dla publicznych repo lub $4/mies. dla prywatnych (Teams).

---

## IX. Performance & Metrics

### 9.1 Cele Performance
- **Lighthouse Score:** 90+ (wszystkie kategorie)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.0s
- **Cumulative Layout Shift:** < 0.1
- **Total Bundle Size:** < 300KB (gzipped)

### 9.2 SEO - Kompletna Strategia Optymalizacji

#### 9.2.1 Meta Tags (Next.js Metadata API)

**Główna strona (app/page.tsx):**
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hangar Filmowy - Kino Plenerowe z Ekranami LED | Wypożyczalnia Premium',
  description: 'Profesjonalne kino plenerowe na Twoje wydarzenie. Ekrany LED premium, obsługa licencyjna, pełna organizacja. Idealne dla gmin, firm i festiwali. Zapytaj o wycenę!',
  keywords: [
    'kino plenerowe',
    'wypożyczalnia ekranów LED',
    'kino samochodowe',
    'ekran LED na event',
    'pokaz filmowy outdoor',
    'organizacja kina plenerowego',
    'licencje filmowe',
    'event firmowy z kinem',
    'letnie kino',
    'projektor plenerowy',
  ],
  authors: [{ name: 'Hangar Filmowy' }],
  creator: 'Hangar Filmowy',
  publisher: 'Hangar Filmowy',
  
  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://hangarfilmowy.pl',
    siteName: 'Hangar Filmowy',
    title: 'Hangar Filmowy - Profesjonalne Kino Plenerowe z Ekranami LED',
    description: 'Zorganizuj niezapomniane kino plenerowe! Ekrany LED premium, pełna obsługa, licencje filmowe. Sprawdź naszą ofertę.',
    images: [
      {
        url: 'https://hangarfilmowy.pl/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hangar Filmowy - Kino Plenerowe LED',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Hangar Filmowy - Kino Plenerowe z Ekranami LED',
    description: 'Profesjonalne kino plenerowe na Twoje wydarzenie. Ekrany LED, obsługa licencyjna, pełna organizacja.',
    images: ['https://hangarfilmowy.pl/og-image.jpg'],
    creator: '@HangarFilmowy',
  },
  
  // Verification
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Canonical
  alternates: {
    canonical: 'https://hangarfilmowy.pl',
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  
  // Manifest
  manifest: '/site.webmanifest',
};
```

#### 9.2.2 Structured Data (JSON-LD Schema.org)

**LocalBusiness Schema:**
```typescript
// components/StructuredData.tsx
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://hangarfilmowy.pl/#organization',
    name: 'Hangar Filmowy',
    description: 'Profesjonalne kino plenerowe z ekranami LED premium',
    url: 'https://hangarfilmowy.pl',
    telephone: '+48-XXX-XXX-XXX',
    email: 'pokaz@hangarfilmowy.pl',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PL',
      addressLocality: '[Miasto]',
      postalCode: '[Kod]',
      streetAddress: '[Ulica]',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '[LAT]',
      longitude: '[LON]',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    priceRange: '$$',
    image: 'https://hangarfilmowy.pl/og-image.jpg',
    logo: 'https://hangarfilmowy.pl/logo.png',
    sameAs: [
      'https://www.facebook.com/hangarfilmowy',
      'https://www.instagram.com/hangarfilmowy',
      'https://www.youtube.com/@hangarfilmowy',
      'https://www.linkedin.com/company/hangarfilmowy',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Poland',
    },
    serviceType: [
      'Wypożyczalnia ekranów LED',
      'Organizacja kina plenerowego',
      'Kino samochodowe',
      'Obsługa licencyjna filmów',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Service Schema:**
```typescript
export function ServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Wypożyczalnia Ekranów LED do Kina Plenerowego',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Hangar Filmowy',
      url: 'https://hangarfilmowy.pl',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Poland',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Usługi Kina Plenerowego',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wypożyczenie Ekranu LED Premium',
            description: 'Profesjonalny ekran LED do kina plenerowego z pełną obsługą techniczną',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Obsługa Licencyjna',
            description: 'Kompleksowa obsługa prawna - zakup licencji na pokazy filmowe',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Kino Samochodowe',
            description: 'Organizacja kina samochodowego z transmisją audio na radiach FM',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pełna Organizacja Eventu',
            description: 'Kompleksowa organizacja wydarzenia - od A do Z',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**BreadcrumbList (dla one-page):**
```typescript
export function BreadcrumbSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Strona Główna',
        item: 'https://hangarfilmowy.pl',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'O Nas',
        item: 'https://hangarfilmowy.pl#o-nas',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Oferta',
        item: 'https://hangarfilmowy.pl#oferta',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Kontakt',
        item: 'https://hangarfilmowy.pl#kontakt',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

#### 9.2.3 Semantic HTML & Accessibility

**Struktura nagłówków (H1-H6):**
```html
<body>
  <!-- H1 - TYLKO JEDEN na stronie (Hero Section) -->
  <h1>Prawdziwe Kino Pod Gwiazdami</h1>
  
  <!-- H2 - Główne sekcje -->
  <section id="o-nas">
    <h2>Hangar Filmowy - Kino, które przychodzi do Ciebie</h2>
  </section>
  
  <section id="dlaczego-my">
    <h2>Dlaczego warto wybrać Hangar Filmowy?</h2>
    <!-- H3 - Podsekcje -->
    <h3>Ekrany LED Najwyższej Klasy</h3>
    <h3>Pełna Obsługa Licencyjna</h3>
    <h3>Doświadczony Zespół</h3>
  </section>
  
  <section id="oferta">
    <h2>Nasza Oferta</h2>
    <h3>Wypożyczenie Ekranu LED</h3>
    <h3>Obsługa Licencyjna</h3>
    <h3>Kino Samochodowe</h3>
    <h3>Pełna Organizacja</h3>
  </section>
  
  <section id="dla-kogo">
    <h2>Dla Kogo?</h2>
    <h3>Gminy i Miasta</h3>
    <h3>Hotele i Ośrodki</h3>
    <h3>Firmy</h3>
    <h3>Festiwale</h3>
  </section>
  
  <section id="proces">
    <h2>Jak to działa?</h2>
    <!-- Timeline steps jako h3 -->
  </section>
  
  <section id="kontakt">
    <h2>Zaplanuj Swoje Wydarzenie</h2>
  </section>
</body>
```

**Alt texts dla obrazów:**
```tsx
// Dobre praktyki
<Image
  src="/hero-bg.jpg"
  alt="Wieczorne kino plenerowe z ekranem LED i widzami oglądającymi film pod gwiazdami"
  width={1920}
  height={1080}
  priority
/>

<Image
  src="/ekran-led.jpg"
  alt="Profesjonalny ekran LED premium do kina plenerowego - jasny obraz w nocy"
  width={800}
  height={600}
/>

<Image
  src="/licencje.jpg"
  alt="Dokumenty licencyjne na pokazy filmowe - obsługa prawna kina plenerowego"
  width={600}
  height={400}
/>

// ZŁE praktyki - unikać:
// alt="image1" ❌
// alt="foto" ❌
// alt="" ❌ (tylko dla dekoracji)
```

#### 9.2.4 Sitemap.xml

**app/sitemap.ts:**
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hangarfilmowy.pl';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}#o-nas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}#oferta`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}#kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/polityka-prywatnosci`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/regulamin`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
```

#### 9.2.5 Robots.txt

**app/robots.ts:**
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hangarfilmowy.pl';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

#### 9.2.6 Performance dla SEO

**Core Web Vitals Optymalizacje:**

1. **LCP (Largest Contentful Paint) < 2.5s:**
```typescript
// Hero image z priority
<Image
  src="/hero-bg.jpg"
  alt="Kino plenerowe"
  fill
  priority // ważne dla LCP!
  quality={90}
  sizes="100vw"
/>
```

2. **FID (First Input Delay) < 100ms:**
- Minimal JavaScript na start
- Dynamic imports dla nieistotnych komponentów
```typescript
// Lazy load konfiguratora
const EventConfigurator = dynamic(() => import('@/components/EventConfigurator'), {
  loading: () => <ConfiguratorSkeleton />,
  ssr: false, // jeśli nie potrzebny na serwerze
});
```

3. **CLS (Cumulative Layout Shift) < 0.1:**
- Zawsze określaj width/height dla obrazów
- Rezerwuj przestrzeń dla dynamicznej treści
```tsx
// Skeleton podczas ładowania
{isLoading ? (
  <div className="h-[500px] animate-pulse bg-gray-200" />
) : (
  <Image src={src} alt={alt} width={800} height={500} />
)}
```

4. **Next.js Image Optimization:**
```typescript
// next.config.js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-r2-bucket.r2.cloudflarestorage.com',
      },
    ],
  },
};
```

#### 9.2.7 Mobile-First & Responsywność

**Viewport Meta:**
```html
<!-- Automatyczne w Next.js, ale warto wiedzieć -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
```

**Touch-friendly:**
- Minimum 44x44px dla przycisków (WCAG)
- Spacing między klikalnymi elementami min 8px
- Font size min 16px (zapobiega zoom na iOS)

#### 9.2.8 Cel SEO Keywords

**Primary Keywords (Volume):**
1. "kino plenerowe" - 2400/mies
2. "wypożyczalnia ekranów LED" - 390/mies
3. "kino samochodowe" - 1900/mies
4. "pokaz filmowy outdoor" - 480/mies
5. "organizacja kina plenerowego" - 320/mies

**Long-tail Keywords:**
- "kino plenerowe dla gminy"
- "ekran LED na event firmowy"
- "licencje na pokazy filmowe"
- "ile kosztuje kino plenerowe"
- "wypożyczalnia ekranów LED Polska"

**Content Strategy:**
- Naturalne użycie keywords w H1, H2, H3
- Keywords w pierwszym akapicie każdej sekcji
- Synonimy i related terms (pokaz, projekcja, seanse)
- LSI keywords: letnie kino, outdoor cinema, projektor, nagłośnienie

#### 9.2.9 Local SEO

**Google Business Profile:**
- Założenie profilu Google Moja Firma
- Kategorie: "Event Rental Company", "Audio Visual Equipment Supplier"
- Zdjęcia z eventów
- Regularne posty o realizacjach

**NAP Consistency (Name, Address, Phone):**
- Identyczne dane na stronie, Google, Facebook, katalogach
- Schema.org markup z danymi kontaktowymi
- Footer z pełnymi danymi firmy

#### 9.2.10 Monitoring SEO

**Google Search Console:**
- Weryfikacja domeny
- Monitoring pozycji keywords
- Analiza kliknięć i impressions
- Sprawdzanie Coverage (indexed pages)

**Narzędzia:**
- Google PageSpeed Insights - performance
- GTmetrix - szczegółowa analiza
- Screaming Frog - technical SEO audit
- Ahrefs/SEMrush - keywords tracking (opcjonalnie)

### 9.3 Monitoring
- Cloudflare Web Analytics (traffic, bounce rate)
- Uptime monitoring (Cloudflare Workers)
- Error tracking (Sentry - opcjonalnie)
- Form submission rate

---

## X. Alternatywne Opcje Stack'u

### Opcja 1: Next.js + Supabase (REKOMENDOWANE)
**Zalety:**
- ✅ Pełna kontrola nad kodem
- ✅ Świetna integracja z Cloudflare Pages
- ✅ Najszybsze performance (SSG + ISR)
- ✅ Nowoczesny stack
- ✅ Darmowy hosting (Cloudflare + Supabase free tier)

**Wady:**
- ❌ Więcej kodu do napisania
- ❌ Dłuższy czas development

---

### Opcja 2: Next.js + Strapi (Headless CMS)
**Zalety:**
- ✅ Gotowy panel administracyjny
- ✅ GraphQL API
- ✅ Pluginy (media library, email)

**Wady:**
- ❌ Wymaga osobnego hostingu dla Strapi
- ❌ Większe koszty (~$15-30/mies. dla VPS)
- ❌ Mniej elastyczne niż custom solution

---

### Opcja 3: Astro + Decap CMS (GitCMS)
**Zalety:**
- ✅ Ultra-szybki (zero JS by default)
- ✅ Git-based CMS (brak bazy danych)
- ✅ Prosty deployment

**Wady:**
- ❌ Brak dynamic features (zgłoszenia z formularza wymagają external service)
- ❌ Decap CMS mniej intuicyjny
- ❌ Ograniczone możliwości zarządzania użytkownikami

---

**Rekomendacja:** **Opcja 1 (Next.js + Supabase)** - najlepsze połączenie performance, kontroli i kosztów.

---

## XI. Dokumentacja Wymagana

### 11.1 Dla Developerów
- `README.md` - setup projektu
- `ARCHITECTURE.md` - struktura kodu
- `API.md` - dokumentacja API routes
- Environment variables (`.env.example`)

### 11.2 Dla Klienta
- `USER_GUIDE.md` - jak używać panelu admin
- `CONTENT_MANAGEMENT.md` - jak edytować treść
- `MEDIA_GUIDE.md` - jak dodawać zdjęcia
- `FAQ.md` - najczęstsze pytania

### 11.3 Deployment
- `DEPLOYMENT.md` - kroki wdrożenia
- `CLOUDFLARE_SETUP.md` - konfiguracja Cloudflare
- `DATABASE_MIGRATIONS.md` - jak uruchomić migracje

### 11.4 SEO Documentation
- `SEO_CHECKLIST.md` - lista kontrolna przed launch
- `KEYWORDS_STRATEGY.md` - lista głównych fraz kluczowych
- `SCHEMA_MARKUP.md` - dokumentacja użytych schematów
- `ALT_TEXTS.md` - lista wszystkich alt textów dla obrazów

---

## XI.B Pliki SEO do Utworzenia

### Struktura katalogów dla SEO:
```
/public
  ├── favicon.ico
  ├── favicon-16x16.png
  ├── favicon-32x32.png
  ├── apple-touch-icon.png (180x180)
  ├── android-chrome-192x192.png
  ├── android-chrome-512x512.png
  ├── og-image.jpg (1200x630)
  ├── logo.png
  ├── logo.svg
  └── site.webmanifest

/app
  ├── sitemap.ts
  ├── robots.ts
  ├── metadata.ts (konfiguracja meta tags)
  └── layout.tsx (z meta tags i schema)

/components/seo
  ├── LocalBusinessSchema.tsx
  ├── ServiceSchema.tsx
  ├── BreadcrumbSchema.tsx
  └── StructuredData.tsx (wrapper)
```

### Przykładowy site.webmanifest:
```json
{
  "name": "Hangar Filmowy - Kino Plenerowe LED",
  "short_name": "Hangar Filmowy",
  "description": "Profesjonalne kino plenerowe z ekranami LED premium",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#0A1828",
  "background_color": "#0A1828",
  "display": "standalone",
  "start_url": "/",
  "scope": "/"
}
```

### Przykładowy .htaccess (jeśli Apache):
```apache
# Redirect www to non-www (lub odwrotnie)
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.hangarfilmowy\.pl [NC]
RewriteRule ^(.*)$ https://hangarfilmowy.pl/$1 [L,R=301]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Compress text files
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>
```

---

## XII. Przygotowanie Treści (Przed Startem)

### 12.1 Copywriting
- ✅ Tekst dla wszystkich sekcji (z prompt.md)
- ⬜ Recenzje/testimoniale (jeśli będą)
- ✅ Meta title i description (SEO) - opisane w sekcji 9.2.1
- ⬜ Alt texts dla wszystkich obrazów (według wytycznych z 9.2.3)
- ⬜ Keywords research - sprawdzenie popularności fraz (9.2.8)
- ⬜ LSI keywords - synonimy i powiązane frazy

### 12.2 Zdjęcia (Wymagane) + SEO
- **Hero:** Wieczorny seans plenerowy z ekranem LED
  - Alt: "Wieczorne kino plenerowe z ekranem LED i widzami oglądającymi film pod gwiazdami"
  - Format: WebP + fallback JPG, 1920x1080px minimum
- **O Nas:** Zdjęcie zespołu lub montażu
  - Alt: "Zespół Hangar Filmowy podczas montażu ekranu LED do kina plenerowego"
- **Dlaczego My:** Zdjęcia ekranu LED w różnych warunkach
  - Alt: "Profesjonalny ekran LED premium - jasny obraz w nocy dla kina plenerowego"
- **Oferta:** Ikony/zdjęcia dla każdej usługi
  - Alt opisujący konkretną usługę (np. "Dokumenty licencyjne na pokazy filmowe")
- **Dla Kogo:** Zdjęcia reprezentujące grupy docelowe
  - Alt z kontekstem (np. "Kino plenerowe na wydarzeniu miejskim - widzowie na leżakach")
- **OG Image:** 1200x630px dla social media sharing
  - Plik: og-image.jpg w /public
- **Logo:** Hangar Filmowy 
  - SVG (primary), PNG (fallback), ICO (favicon)
  - Rozmiary: 16x16, 32x32, 180x180 (Apple), 192x192, 512x512

**Wymagania techniczne:**
- Format: WebP (primary) + JPG/PNG fallback
- Optymalizacja: TinyPNG/ImageOptim przed uploadem
- Max size: 200KB per image (hero może być większy)
- Responsive: przygotować w 3 wersjach (mobile, tablet, desktop)

### 12.3 Dane Kontaktowe + NAP Consistency
- ✅ Email firmowy: pokaz@hangarfilmowy.pl
- ⬜ Numer telefonu (format: +48 XXX XXX XXX - identyczny wszędzie!)
- ⬜ Adres firmy (jeśli Local SEO) - dokładnie ten sam na:
  - Stronie www
  - Google Business Profile
  - Facebook Page
  - Wszystkich katalogach firmowych
- ⬜ Link do social media:
  - Facebook: https://www.facebook.com/hangarfilmowy
  - Instagram: https://www.instagram.com/hangarfilmowy
  - YouTube: https://www.youtube.com/@hangarfilmowy
  - LinkedIn: https://www.linkedin.com/company/hangarfilmowy

### 12.4 SEO Checklist Przed Launch

**Technical SEO:**
- [ ] Meta title (50-60 znaków) - sprawdzone
- [ ] Meta description (150-160 znaków) - sprawdzone
- [ ] Open Graph tags (OG:title, OG:description, OG:image)
- [ ] Twitter Card tags
- [ ] Canonical URL ustawiony
- [ ] Sitemap.xml wygenerowany i dostępny
- [ ] Robots.txt skonfigurowany
- [ ] Favicon we wszystkich rozmiarach
- [ ] 404 page customowa (przyjazna dla użytkownika)

**On-Page SEO:**
- [ ] H1 tag (tylko jeden na stronie)
- [ ] Struktura H2-H6 logiczna i hierarchiczna
- [ ] Alt text dla WSZYSTKICH obrazów
- [ ] Internal linking między sekcjami
- [ ] URL structure clean (bez zbędnych parametrów)
- [ ] Keywords w pierwszym akapicie każdej sekcji
- [ ] Długość treści: min. 1500 słów całość (dla rankingu)

**Schema.org Markup:**
- [ ] LocalBusiness schema
- [ ] Service schema
- [ ] BreadcrumbList schema
- [ ] Organization schema
- [ ] Testowane przez Google Rich Results Test

**Performance:**
- [ ] Lighthouse Score Desktop: 90+
- [ ] Lighthouse Score Mobile: 85+
- [ ] Core Web Vitals spełnione (LCP, FID, CLS)
- [ ] Images optimized (WebP, lazy loading)
- [ ] Fonts optimized (font-display: swap)
- [ ] CSS/JS minimized i compressed

**External:**
- [ ] Google Search Console - domena zweryfikowana
- [ ] Google Analytics 4 - tracking code dodany
- [ ] Google Business Profile - profil utworzony i uzupełniony
- [ ] Bing Webmaster Tools - domena dodana
- [ ] Social media links - wszystkie działają

**Testing:**
- [ ] Mobile-friendly test (Google) - passed
- [ ] PageSpeed Insights - 90+ score
- [ ] Schema validator - bez błędów
- [ ] Broken links checker - wszystkie linki działają
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## XIII. Ryzyka i Wyzwania

### 13.1 Techniczne
| Ryzyko | Prawdopodobieństwo | Impact | Mitigacja |
|--------|-------------------|--------|-----------|
| Limity Supabase free tier | Średnie | Średni | Monitoring użycia + upgrade plan |
| Cloudflare R2 koszty | Niskie | Niski | Optymalizacja zdjęć + CDN |
| Next.js breaking changes | Niskie | Wysoki | Pinned versions w package.json |

### 13.2 Biznesowe
| Ryzyko | Prawdopodobieństwo | Impact | Mitigacja |
|--------|-------------------|--------|-----------|
| Brak zdjęć wysokiej jakości | Średnie | Wysoki | Stock photos (Unsplash/Pexels) |
| Zmiana wymagań w trakcie | Średnie | Średni | Agile approach, iteracje |
| Opóźnienia w dostawie treści | Wysokie | Średni | Placeholder content + deadline |

---

## XIV. Roadmap Przyszłych Funkcji (Post-Launch)

### Faza 2 (Q1 2026)
- ⬜ Blog/Aktualności (case studies eventów)
- ⬜ Galeria zrealizowanych eventów
- ⬜ System recenzji/testimoniali
- ⬜ Kalkulator wyceny online

### Faza 3 (Q2 2026)
- ⬜ Integracja z kalendarzem (rezerwacje)
- ⬜ Multi-language (PL/EN)
- ⬜ Live chat support
- ⬜ Newsletter z MailerLite

### Faza 4 (Q3 2026)
- ⬜ Portal klienta (śledzenie zamówień)
- ⬜ System płatności online
- ⬜ API dla partnerów
- ⬜ Mobile app (React Native)

---

## XV. Checklisty

### 15.1 Pre-Launch Checklist - SEO & Technical

**SEO Fundamentals:**
- [ ] Meta title zoptymalizowany (50-60 znaków, główny keyword na początku)
- [ ] Meta description zachęcająca (150-160 znaków, CTA w treści)
- [ ] Keywords research wykonany - lista 10-15 fraz
- [ ] H1 tylko jeden na stronie (Hero section)
- [ ] Hierarchia H2-H6 logiczna i semantyczna
- [ ] Alt texts dla WSZYSTKICH obrazów (opisowe, z keywords)
- [ ] Schema.org markup zaimplementowany (LocalBusiness, Service, Breadcrumb)
- [ ] Open Graph tags kompletne (title, description, image 1200x630)
- [ ] Twitter Card tags dodane
- [ ] Canonical URL ustawiony

**Files & Structure:**
- [ ] sitemap.xml wygenerowany i dostępny
- [ ] robots.txt skonfigurowany (allow /, disallow /admin/)
- [ ] favicon.ico + PNG w różnych rozmiarach (16, 32, 180, 192, 512)
- [ ] apple-touch-icon.png (180x180)
- [ ] og-image.jpg (1200x630) dla social sharing
- [ ] site.webmanifest dla PWA compatibility
- [ ] 404.html page customowa (przyjazna, z nawigacją)

**Performance & Core Web Vitals:**
- [ ] Lighthouse Desktop Score: 90+ (wszystkie kategorie)
- [ ] Lighthouse Mobile Score: 85+
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1
- [ ] Images w formacie WebP + fallback
- [ ] Lazy loading dla obrazów poniżej fold
- [ ] Font-display: swap dla Google Fonts
- [ ] Preload dla krytycznych zasobów
- [ ] Minimized CSS/JS (production build)

**Google Integration:**
- [ ] Google Search Console - domena zweryfikowana
- [ ] Sitemap submitted w GSC
- [ ] Google Analytics 4 - tracking code
- [ ] Google Tag Manager (opcjonalnie)
- [ ] Google Business Profile utworzony i wypełniony
- [ ] Google My Maps - lokalizacja oznaczona (jeśli Local SEO)

**Testing & Validation:**
- [ ] Google Rich Results Test - schema bez błędów
- [ ] Google Mobile-Friendly Test - passed
- [ ] PageSpeed Insights - green scores
- [ ] W3C HTML Validator - zero błędów
- [ ] WAVE Accessibility - minimum errors
- [ ] Broken links checker - wszystkie linki działają
- [ ] Cross-browser test (Chrome, Firefox, Safari, Edge)
- [ ] Cross-device test (phone, tablet, desktop)

### 15.2 Pre-Launch Checklist - Content & Design
- [ ] **Treść:**
  - [ ] Wszystkie sekcje wypełnione zgodnie z prompt.md
  - [ ] H1 Hero: "Prawdziwe kino pod gwiazdami. W jakości, jakiej jeszcze nie widziałeś."
  - [ ] Wszystkie H2 zgodne ze źródłem
  - [ ] Teksty w sekcji "Dlaczego My" (3 boxy) - pełne treści z prompt.md
  - [ ] Teksty w sekcji "Oferta" (4 karty) - szczegółowe opisy
  - [ ] Teksty w sekcji "Dla Kogo" (4 karty)
  - [ ] Timeline "Proces" - 4 kroki z dokładnymi opisami
  - [ ] Footer slogan: "Najjaśniejszy punkt na mapie letnich wydarzeń"
  - [ ] Keywords naturally integrated w pierwszym akapicie każdej sekcji
  
- [ ] **Zdjęcia (wysokiej jakości + SEO):**
  - [ ] Hero background: Nocne niebo + ekran LED świecący (min. 1920x1080px, WebP)
    - Alt: "Wieczorne kino plenerowe z ekranem LED premium i widzami pod gwiazdami"
  - [ ] O Nas: Zespół przy montażu lub ekran w akcji
    - Alt: "Zespół Hangar Filmowy podczas profesjonalnego montażu ekranu LED"
  - [ ] Dlaczego My: 3 ikony/zdjęcia (słońce+ekran, tarcza, fale dźwiękowe)
    - Alt każdego: opisowy z kontekstem technologii LED
  - [ ] Oferta: 4 zdjęcia/ikony dla każdej usługi
    - Alt każdego: nazwa usługi + krótki opis
  - [ ] Dla Kogo: 4 ikony (ratusz, hotel, biurowiec, scena)
    - Alt każdego: "Kino plenerowe dla [grupy docelowej]"
  - [ ] Proces: 4 ikony (kalendarz, klapsa, narzędzia, play)
    - Alt każdego: opis kroku procesu
  - [ ] Logo: Hangar Filmowy (SVG + PNG, różne rozmiary dla favicon)
  - [ ] OG Image: 1200x630px dla social media preview
  
- [ ] **Design zgodny z konceptem:**
  - [ ] Paleta kolorów: Navy (#0A1828), Orange (#FFA500), Blue (#4D90FE)
  - [ ] Gradienty: Hero background, buttons, cards
  - [ ] Fonty: Google Sans (primary), Inter (fallback)
  - [ ] Animacje: Scroll-triggered fade in + slide up
  - [ ] Parallax effect na Hero background
  - [ ] Hover effects na kartach i przyciskach
  - [ ] Smooth scroll między sekcjami
  - [ ] Responsive dla mobile/tablet/desktop
  
- [ ] **Funkcjonalność:**
  - [ ] Navbar fixed + transparent→solid on scroll
  - [ ] Smooth scroll do sekcji (anchor links)
  - [ ] Formularz kontaktowy z validacją
  - [ ] Email notifications działające
  - [ ] Back to top button (po scroll >500px)
  - [ ] Mobile hamburger menu
  - [ ] SSL certyfikat aktywny
  
- [ ] **SEO & Performance:**
  - [ ] Meta title zgodny z brandem
  - [ ] Meta description (max 160 znaków)
  - [ ] Open Graph tags (og:image, og:title, og:description)
  - [ ] Alt tags dla wszystkich obrazów
  - [ ] Semantic HTML5 (header, nav, main, section, footer)
  - [ ] Lighthouse score: 90+ (wszystkie kategorie)
  - [ ] First Contentful Paint < 1.5s
  - [ ] Images optimized (WebP + fallback)
  - [ ] Lazy loading dla obrazów poniżej fold
  
- [ ] **Accessibility:**
  - [ ] Contrast ratio minimum 4.5:1
  - [ ] Focus visible na wszystkich interactive elements
  - [ ] Aria labels dla ikon
  - [ ] Keyboard navigation working
  - [ ] Screen reader tested

### 15.2 Technical Implementation Checklist
- [ ] **Next.js Setup:**
  - [ ] Project initialized (npx create-next-app@latest)
  - [ ] TypeScript configured
  - [ ] TailwindCSS + PostCSS setup
  - [ ] Shadcn/ui components installed
  - [ ] Framer Motion installed
  - [ ] App Router structure (/app/page.tsx)
  
- [ ] **Database & Backend:**
  - [ ] Supabase project created
  - [ ] Prisma schema defined (5 tables)
  - [ ] Database migrations run
  - [ ] NextAuth.js configured
  - [ ] API routes dla formularza (/api/contact)
  - [ ] Resend account configured
  - [ ] Domena email zweryfikowana w Resend (noreply@hangarfilmowy.pl)
  - [ ] Resend API key dodany do .env
  
- [ ] **Media & Assets:**
  - [ ] Cloudflare R2 bucket created
  - [ ] Image upload function working
  - [ ] Next.js Image component used
  - [ ] All images optimized (TinyPNG/Squoosh)
  - [ ] Icons sourced (Lucide React)
  - [ ] Logo SVG exported (multiple sizes)
  
- [ ] **Deployment:**
  - [ ] GitHub repository created
  - [ ] Cloudflare Pages connected
  - [ ] Environment variables set (.env.production)
  - [ ] Custom domain connected
  - [ ] DNS configured
  - [ ] SSL auto-renewed
  - [ ] GitHub Actions workflow (CI/CD)
  
- [ ] **Admin Panel:**
  - [ ] Login page (/admin/login)
  - [ ] Dashboard (/admin/dashboard)
  - [ ] Content management pages
  - [ ] Media library interface
  - [ ] Form submissions list
  - [ ] User management (if multiple users)

### 15.3 Post-Launch Checklist
- [ ] **Testing:**
  - [ ] Cross-browser (Chrome, Safari, Firefox, Edge)
  - [ ] Mobile testing (iOS Safari, Chrome Android)
  - [ ] Form submission tested (real email)
  - [ ] All links working (no 404s)
  - [ ] Google Analytics tracking
  - [ ] Error monitoring active (Sentry)
  
- [ ] **SEO & Marketing:**
  - [ ] Google Search Console setup
  - [ ] Sitemap.xml submitted
  - [ ] robots.txt configured
  - [ ] Google My Business (if applicable)
  - [ ] Social media profiles linked
  - [ ] Facebook Pixel (if ads planned)
  
- [ ] **Monitoring (pierwsze 7 dni):**
  - [ ] Uptime check (99.9%+)
  - [ ] Page load speed < 3s
  - [ ] Bounce rate < 60%
  - [ ] Form conversion rate tracking
  - [ ] Error rate < 1%
  
- [ ] **Client Handoff:**
  - [ ] Admin credentials delivered
  - [ ] User guide (PDF) delivered
  - [ ] Video tutorial recorded (opcjonalnie)
  - [ ] Backup schedule explained
  - [ ] Support contact info provided

---

## XVI. Pytania do Klienta (Do Wyjaśnienia)

1. **Branding:**
   - Czy mamy już logo i brand guidelines (kolory, fonty)?
   - Jaki jest preferowany styl wizualny? (modern/elegant/playful)

2. **Zdjęcia:**
   - Czy mamy własne zdjęcia z eventów?
   - Czy możemy użyć stock photos dla brakujących?

3. **Dane kontaktowe:**
   - Jaki email i telefon wyświetlać?
   - Czy są profile social media (FB, Instagram)?

4. **Funkcje:**
   - Czy potrzebna jest wersja angielska strony?
   - Czy planujemy blog/aktualności?

5. **Admin panel:**
   - Ile osób będzie miało dostęp do panelu?
   - Czy potrzebne są różne poziomy uprawnień?

6. **Formularze:**
   - Na jaki email mają przychodzić zgłoszenia?
   - Czy auto-responder dla klienta jest wymagany?

7. **Analytics:**
   - Czy mamy Google Analytics/Meta Pixel?
   - Jakie dane chcemy śledzić?

8. **Legal:**
   - Czy mamy przygotowaną politykę prywatności?
   - Czy potrzebne są cookies consent?

9. **Hosting:**
   - Czy mamy już domenę? (np. hangarfilmowy.pl)
   - Kto zarządza domeną i DNS?

10. **Budget:**
    - Jaki jest budżet na miesięczne koszty operacyjne?
    - Czy akceptujemy free tier z możliwością upgrade?

---

## XVII. Kontakt Techniczny

**Project Manager:**  
[Do uzupełnienia]

**Lead Developer:**  
[Do uzupełnienia]

**Designer:**  
[Do uzupełnienia]

**Repository:**  
`github.com/[user]/hangar-filmowy` (do utworzenia)

**Staging Environment:**  
`hangar-filmowy-staging.pages.dev` (Cloudflare)

**Production Environment:**  
`hangarfilmowy.pl` (docelowa domena)

---

## XVIII. Załączniki

### Pliki Źródłowe
- ✅ `prompt.md` - Szczegółowa specyfikacja treści
- ✅ `koncept/hangar-filmowy-gemini.html` - Rozmowa z Gemini AI

### Do Dostarczenia
- ⬜ `brand-guidelines.pdf` - Wytyczne brandowe
- ⬜ `photos/` - Folder ze zdjęciami wysokiej jakości
- ⬜ `logo/` - Logo w formatach svg, png (różne rozmiary)
- ⬜ `legal/` - Polityka prywatności, regulamin

---

## XIX. Zatwierdzenia

| Etap | Data | Osoba | Status |
|------|------|-------|--------|
| Plan projektu | [Do uzupełnienia] | [Klient] | ⬜ Oczekuje |
| Design mockup | [Do uzupełnienia] | [Klient] | ⬜ Oczekuje |
| Wersja testowa | [Do uzupełnienia] | [Klient] | ⬜ Oczekuje |
| Wersja finalna | [Do uzupełnienia] | [Klient] | ⬜ Oczekuje |
| Go-live | [Do uzupełnienia] | [Klient] | ⬜ Oczekuje |

---

## XX. Historia Zmian

| Wersja | Data | Autor | Zmiany |
|--------|------|-------|--------|
| 1.0 | 2025-12-20 | GitHub Copilot | Utworzenie dokumentu planu projektu |

---

**Status dokumentu:** ✅ Gotowy do przeglądu  
**Następny krok:** Zatwierdzenie przez klienta i wybór stack'u technologicznego

---

*Dokument wygenerowany automatycznie na podstawie analizy plików:*
- *prompt.md*
- *koncept/hangar-filmowy-gemini.html*

*GitHub Copilot - 20 grudnia 2025*
