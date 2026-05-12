import { createClient } from '@sanity/client'

// Opprett en Sanity-klient som brukes for å gjøre GROQ-spørringer og andre kall mot Sanity API
// Viktig: fyll inn projectId eller hent det fra miljøvariabler i stedet for å hardkode det i repoet.
const client = createClient({
  // **projectId**: ditt Sanity-prosjekt sitt ID. Hent dette fra Sanity Studio eller miljøvariabler.
  // Eksempel for sikker bruk i et React-prosjekt:
  // projectId: process.env.REACT_APP_SANITY_PROJECT_ID
  projectId: "nxo77pkr",

  // **dataset**: hvilket dataset i Sanity du vil bruke. "production" er vanlig for produksjon.
  dataset: "production",

  // **useCdn**: når true henter klienten fra Sanity CDN for raskere lesing og lavere kostnad.
  // Bruk true for offentlige leseoperasjoner. Sett false hvis du trenger ferske data eller gjør skriveoperasjoner.
  useCdn: true,

  // **apiVersion**: versjonen av Sanity API du ønsker å låse til. Bruk YYYY-MM-DD format.
  // Dette sikrer stabil oppførsel over tid. Oppdater ved behov når du vil bruke nye API-funksjoner.
  apiVersion: "2026-04-13"

  // Hvis du trenger å gjøre skriveoperasjoner fra server eller sikre miljøer,
  // legg til en token her, men aldri i klientkode som pushes til et offentlig repo.
  // token: process.env.SANITY_WRITE_TOKEN
})

export default client
