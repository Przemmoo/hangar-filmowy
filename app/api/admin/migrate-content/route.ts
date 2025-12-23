import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const defaultContent = {
      hero: {
        title: "Prawdziwe Kino",
        titleGradient: "Pod Gwiazdami",
        subtitle: "Wynajem profesjonalnego ekranu LED i organizacja kin plenerowych na terenie całej Polski.",
        lead: "Ekrany LED o jasności 5000+ nits, widoczne nawet w pełnym słońcu. Bez pneumatycznych konstrukcji, które zdmuchuje wiatr. Kompleksowa obsługa: sprzęt, licencje, catering.",
        ctaPrimary: "ZAPYTAJ O TERMIN",
        ctaSecondary: "ZOBACZ OFERTĘ"
      },
      about: {
        title: "Wychodzimy z cienia.",
        titleGradient: "Wnosimy kino plenerowe na nowy poziom.",
        paragraph1: "Przez lata kino plenerowe kojarzyło się z jednym: czekaniem na zmrok, walką z wiatrem falującym ekranem i kompromisami w jakości obrazu. Hangar Filmowy zmienia te zasady gry.",
        paragraph2: "Jesteśmy zespołem pasjonatów kina i ekspertów od eventów. Nasza obietnica jest prosta: dostarczamy wrażenia kinowe (dosłownie!) w dowolnym miejscu w Polsce. Nie uznajemy półśrodków. Nasze ekrany świecą jasno, dźwięk wbija w fotel, a obsługa licencyjna zdejmuje Ci z głowy wszystkie formalności. Tworzymy wydarzenia, o których mieszkańcy rozmawiają miesiącami.",
        imageUrl: "/plan_filmowy.png"
      },
      "why-us": {
        title: "Dlaczego Ekran LED",
        subtitle: "Przesuń suwak, aby zobaczyć różnicę między tradycyjnym projektorem a naszą technologią LED.",
        comparisonImageUrl: "/dlaczego-ekran-led.png",
        boxes: [
          {
            title: "Obraz Żyleta",
            description: "Tradycyjna projekcja wymaga całkowitej ciemności. Nasze ekrany LED o ultrawysokiej jasności pozwalają rozpocząć seans wcześniej, nawet przy zachodzącym słońcu. Czerń jest czarna, kolory nasycone, a rozdzielczość zachwyca każdego widza."
          },
          {
            title: "Odporność na Warunki",
            description: "Wiatr? Lekki deszcz? Dla naszych modułowych ścian LED to nie problem. Konstrukcja jest stabilna i bezpieczna, w przeciwieństwie do tradycyjnych ekranów pneumatycznych (\"dmuchańców\"), które poddają się przy mocniejszych podmuchach."
          },
          {
            title: "Dźwięk, Który Czujesz",
            description: "Kino to w 50% dźwięk. Instalujemy profesjonalne systemy nagłośnieniowe, które zapewniają czystość dialogów i głębię efektów specjalnych, precyzyjnie pokrywając dźwiękiem strefę widowni."
          }
        ]
      },
      offer: {
        titlePrefix: "Od licencji po",
        title: "ostatnie ziarno kukurydzy.",
        subtitle: "Kompleksowa obsługa Twojego eventu.",
        cards: [
          {
            title: "Technika Kinowa",
            description: "Mobilne ekrany LED (nits), profesjonalne nagłośnienie i oświetlenie ambientowe.",
            imageUrl: "/technologia-kinowa.png"
          },
          {
            title: "Licencje",
            description: "Pośrednictwo w zakupie praw do publicznego odtwarzania. Ty wybierasz film, my papiery.",
            imageUrl: "/Licence.png"
          },
          {
            title: "Strefa Widza",
            description: "Wygodne leżaki i nastrojowe oświetlenie, tworzące magię kina letniego.",
            imageUrl: "/strefa-widza.png"
          },
          {
            title: "Popcorn Bar",
            description: "Maszyny do popcornu, dystrybutory napojów i stoiska z przekąskami.",
            imageUrl: "/Popcorn-Bar.png"
          }
        ]
      },
      "for-who": {
        title: "Tworzymy kino tam, gdzie go potrzebujesz",
        cards: [
          {
            title: "Samorządy i Miasta",
            description: "Kino w parku, festiwal miejski, piknik rodzinny – zbuduj kapitał społeczny i pokaż, że Twoje miasto żyje kulturą."
          },
          {
            title: "Hotele i Resorty",
            description: "Zaproponuj gościom wieczór filmowy w ogrodzie. Unikalne doświadczenie, które wyróżni Twoją ofertę i wygeneruje pozytywne recenzje."
          },
          {
            title: "Firmy i Korporacje",
            description: "Integracja? Urodziny firmy? Prezentacja produktu? Zorganizuj kino na zamkniętym evencie – niezapomniane team-buildingowe doświadczenie."
          },
          {
            title: "Festiwale i Eventy",
            description: "Festiwal muzyczny, food truck event, targi – dodaj kinową strefę, która przyciągnie tłumy i stworzy wiralowe momenty w social mediach."
          }
        ]
      },
      process: {
        title: "Jak zorganizować kino?",
        subtitle: "Od zapytania do seansu – wszystko maksymalnie proste.",
        steps: [
          {
            title: "Ustalamy Termin & Wizję",
            description: "Dzwonisz/piszesz. Rozmawiamy o dacie, miejscu, rodzaju eventu i Twoich oczekiwaniach."
          },
          {
            title: "Wybieramy Repertuar",
            description: "Podpowiadamy filmy dopasowane do grupy docelowej. Ty wybierasz – my załatwiamy licencje."
          },
          {
            title: "Przygotowanie Przestrzeni",
            description: "Przyjeżdżamy z wyprzedzeniem, montujemy ekran, nagłośnienie, strefę widowni."
          },
          {
            title: "Showtime!",
            description: "Twoi goście wchodzą, siadają, zapachy popcornu unoszą się w powietrzu – KINO się zaczyna!"
          }
        ]
      },
      contact: {
        title: "Zaplanuj",
        titleGradient: "Swoje Wydarzenie",
        subtitle: "Odpowiedz na kilka pytań, a my przygotujemy dla Ciebie ofertę szytą na miarę.",
        email: "pokaz@hangarfilmowy.pl"
      },
      footer: {
        slogan: "Hangar Filmowy - Kino pod gwiazdami",
        email: "pokaz@hangarfilmowy.pl",
        phone: "+48 XXX XXX XXX",
        address: "Polska (zasięg ogólnopolski)"
      }
    };

    // Insert all sections using Supabase REST API
    const results = [];
    for (const [section, data] of Object.entries(defaultContent)) {
      // Generate unique id
      const id = crypto.randomUUID();
      
      const response = await fetch(`${supabaseUrl}/rest/v1/content`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({
          id,
          section,
          data,
          updatedAt: new Date().toISOString(),
          updatedBy: session.user?.email || "admin"
        })
      });

      if (response.ok) {
        results.push(section);
      } else {
        console.error(`Failed to migrate section ${section}:`, await response.text());
      }
    }

    return NextResponse.json({
      success: true,
      message: "Zmigrowano wszystkie sekcje",
      count: results.length
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed" },
      { status: 500 }
    );
  }
}
