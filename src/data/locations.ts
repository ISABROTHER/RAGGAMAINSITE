// src/data/locations.ts

export interface LocationData {
  zone: string;
  assemblyman: string;
  phone: string;
  communities: string[];
  photoUrl: string;
}

// Reverted to Ghana Flag as requested
const GHANA_FLAG = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/640px-Flag_of_Ghana.svg.png";

export const LOCATIONS: LocationData[] = [
  {
    zone: "3rd Ridge / Nkanfoa",
    assemblyman: "Benjamin Benyah",
    phone: "0243043906",
    communities: [
      "1st Ridge",
      "2nd Ridge",
      "3rd Ridge",
      "4th Ridge",
      "Nkafoa",
      "Nkafoa Nkamadze",
      "Nkafoa Beseadze"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Pedu Nguabado",
    assemblyman: "Isaac Kobina Mensah",
    phone: "0549902118",
    communities: [
      "Pedu",
      "Pedu Junction",
      "Nguabado",
      "Adaaso",
      "Mintsiminim (Nurses Flats)",
      "Buwano"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Pedu Abakadze",
    assemblyman: "James Arthur",
    phone: "0248483321",
    communities: [
      "Abakaadze",
      "Roman Hill",
      "Abota Yie",
      "Adeebikrom",
      "The Boy",
      "Tankokrom",
      "Ba Awar",
      "Nkwantado",
      "Assim"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Abakam / Aheneboboi",
    assemblyman: "Wisdom Suka",
    phone: "0242532998",
    communities: [
      "Abakam",
      "Ahenboboe",
      "Kokwaado (nearby cluster)"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "University Old Site / Apewosika",
    assemblyman: "Jacob Kakra Ewusie",
    phone: "0243563349",
    communities: [
      "University Old Site",
      "Apewosika",
      "Akotokyir",
      "Duakor",
      "Ahenboboe boundary",
      "Amamoma (shared with New Site)"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "University New Site / Kwaprow",
    assemblyman: "John Kilson Mensah",
    phone: "0548214411",
    communities: [
      "University New Site",
      "Kwaprow",
      "Kwesipra",
      "Amamoma",
      "Kokwaado edges"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Nkwantado / Assim",
    assemblyman: "Moses Arthur",
    phone: "0246505955",
    communities: [
      "Nkwantado",
      "Assim",
      "Ba Awar",
      "Adeebikrom",
      "Roman Hill area",
      "Abota Yie"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Etsifi / Eyifua",
    assemblyman: "Abdul Malik",
    phone: "0244031098",
    communities: [
      "Eyifua",
      "Eyifua Estates",
      "Etsifi",
      "Abura Estate (shared boundary)",
      "Aba Anwonakrom"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Kakomdo",
    assemblyman: "Vitus Rosevare Kobina Danquah",
    phone: "0244082362",
    communities: [
      "Kakomdo",
      "Amisano",
      "Ebubonko",
      "C-Poly (CCTU area)",
      "Zongo (shared boundary)"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Ebubonko / Amissano",
    assemblyman: "Ibrahim Dawda Mohammed",
    phone: "0548047421",
    communities: [
      "Ebubonko",
      "Amissano",
      "Dehia",
      "Kramotawia"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Essuekyir",
    assemblyman: "Eric Kofi Boateng",
    phone: "0595528417",
    communities: [
      "Esuekyir",
      "Anto Esuekyir",
      "Esuekyir Estates",
      "Esuekyir Community 1",
      "Amoyaw",
      "Nyinasin edges"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Ankaful",
    assemblyman: "Robert Mensah",
    phone: "0243344026",
    communities: [
      "Ankaful",
      "Ankaful Camp",
      "Nanabakrom",
      "Taedo",
      "Fadur",
      "Dankwaakrom"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Mpeasem / Brimso",
    assemblyman: "David Owu",
    phone: "0593098860",
    communities: [
      "Mpeasem",
      "Brimso",
      "Kyirakomfo",
      "Wenyi Ato",
      "Yayaakwano",
      "Akwakrom",
      "Pomanye",
      "Kumease",
      "Nyame Bekyere",
      "Akaikrom",
      "Akweikrom",
      "Besakrom"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Koforidua / Nyinasin",
    assemblyman: "Paul Nat Amissah",
    phone: "0243930021",
    communities: [
      "Koforidua",
      "Nyinasin",
      "Amoyaw",
      "Esuekyir Community 1",
      "Esuekyir Estates"
    ],
    photoUrl: GHANA_FLAG
  },
  {
    zone: "Efutu / Mampong",
    assemblyman: "Alhaji Mustapha Abdullah",
    phone: "0244707883",
    communities: [
      "Efutu",
      "Efutu Ekutuadze",
      "Efutu Seguase",
      "Efutu Mampong",
      "Efutu Kokwaado",
      "Ewusikrom",
      "Ansapetu",
      "Nkokosa"
    ],
    photoUrl: GHANA_FLAG
  }
];