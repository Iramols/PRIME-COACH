# Specificaties Leefstijlcoach App

Dit document wordt stap voor stap aangevuld op basis van input van de coach.

## Datamodel — belangrijk uitgangspunt

Alles wat in de app wordt ingevoerd (profiel, notities, etc.) wordt bijgehouden **per persoon/klant**. De app is dus multi-klant: de coach beheert meerdere klantdossiers, elk met eigen profiel, notities, voortgang, etc.

**Logging over tijd:** in alle tabs (Notities, Resultaten, Test resultaten) wordt elke invoer gelogd als een rij met een **datum** in de meest linkse kolom. Zo ontstaat per klant een geschiedenis over tijd (bijv. gewicht per datum), i.p.v. één losse actuele waarde. Dit beantwoordt de eerdere open vraag over historiek: ja, alles wordt bijgehouden als logboek/geschiedenis.

## Navigatie (topbalk)

Tabs zichtbaar in de app-header:
- Dashboard
- Training
- Voeding
- Coach
- Voortgang
- Foto's
- Profiel-icoon (rechtsboven) — opent profielmodal
- Notities (nieuw)
- Resultaten (nieuw)
- Test resultaten (nieuw)

## Component: Profielmodal ("Jouw profiel")

Modal die opent via het profiel-icoon rechtsboven.

**Header:** "Jouw profiel" + sluitknop (x)
**Metadata:** "Laatste update: [datum] · [tijd]"

**Velden:**
| Veld | Type | Voorbeeldwaarde |
|---|---|---|
| Naam | tekstinvoer | Jouw naam |
| Leeftijd | tekstinvoer (numeriek) | 35 |
| Gewicht (kg) | tekstinvoer (numeriek, decimaal) | 85,3 |
| Lengte (cm) | tekstinvoer (numeriek) | 170 |
| Geslacht | dropdown | Vrouw |
| Doel | dropdown | Meer spiermassa opbouwen |
| Activiteitsniveau | dropdown | Actief (5+x/week) |

**Actie:** "Opslaan ✓" knop (groen)

**Beslist:** vooralsnog kan alleen de coach inloggen en gegevens invoeren/beheren (geen aparte klant-login). De coach vult dit profiel dus in namens de klant.

---

## Tab: Notities

Nieuwe tab in de navigatie, per klant. Bevat 3 kolommen:

| Datum | Voeding | Training | Bijzonderheden |
|---|---|---|---|
| (datum van logmoment) | Notities over voeding | Notities over training | Overige/bijzondere notities |

Elke rij = één logmoment (datum) met notities in de 3 kolommen.

**Beslist:** oude notities kunnen door de coach bewerkt en verwijderd worden.

---

## Tab: Resultaten

Nieuwe tab in de navigatie, per klant. Kolommen:

| Datum | Gewicht (kg) | Vet % | Omtrek navel (cm) | BMI | Visceraal vet | Spiermassa (kg) | Spiermassa % |
|---|---|---|---|---|---|---|---|
| (datum van meting) | | | | | | | |

Elke rij = één meetmoment (datum). Zo is per klant het verloop van bijv. gewicht over tijd te zien.

**Beslist:** BMI wordt automatisch berekend uit gewicht + lengte (uit het profiel). Vooralsnog geen grafieken/trendweergave — puur een tabel.

**Bevestigd:** "Resultaten" en "Voortgang" zijn twee aparte onderdelen (niet hetzelfde).

---

## Tab: Test resultaten

Nieuwe tab in de navigatie, per klant. Voorlopig 3 lege kolommen (in te vullen later), plus datum-kolom:

| Datum | Kolom 1 | Kolom 2 | Kolom 3 |
|---|---|---|---|
| (datum van logmoment) | (nader te bepalen) | (nader te bepalen) | (nader te bepalen) |

---

## Technische keuzes

| Keuze | Beslissing |
|---|---|
| Platform | Web-app |
| Opslag | Cloud (database) |
| Gebruikersrollen | Alleen coach kan inloggen/loggen (geen klant-login) |

## Nog te specificeren (bewust nog leeg gelaten)
- Dashboard
- Training
- Voeding
- Coach
- Voortgang
- Foto's
- Dropdown-opties (alle mogelijke waarden voor Geslacht, Doel, Activiteitsniveau)

## Status
Eerste versie gebouwd (zie `README.md`) op basis van de hierboven
uitgewerkte onderdelen: profiel, Notities, Resultaten, Test resultaten,
navigatie en cloud-opslag. De nog lege tabs (Dashboard, Training, Voeding,
Coach, Voortgang, Foto's) en de dropdown-opties staan als open punt in de
sectie hierboven en zijn in de app als placeholder opgenomen.
