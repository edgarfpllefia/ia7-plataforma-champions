import "dotenv/config";
import { PrismaClient, Role, MatchStatus, MatchPhase } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();

  const adminHash = await hash("Admin1234!", 10);
  const editorHash = await hash("Editor1234!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@champions.local" },
    update: {},
    create: { name: "Admin", email: "admin@champions.local", passwordHash: adminHash, role: Role.ADMIN, active: true },
  });
  await prisma.user.upsert({
    where: { email: "editor@champions.local" },
    update: {},
    create: { name: "Editor", email: "editor@champions.local", passwordHash: editorHash, role: Role.EDITOR, active: true },
  });

  // 36 equipos reales - Bombos reales UCL 2025/26
  const teamsData = [
    // Bombo 1
    { name: "PSG", country: "Francia", group: "1", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
    { name: "Real Madrid", country: "España", group: "1", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
    { name: "Manchester City", country: "Inglaterra", group: "1", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
    { name: "Bayern Munich", country: "Alemania", group: "1", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" },
    { name: "Liverpool", country: "Inglaterra", group: "1", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
    { name: "Inter Milan", country: "Italia", group: "1", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg" },
    { name: "Chelsea", country: "Inglaterra", group: "1", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
    { name: "Borussia Dortmund", country: "Alemania", group: "1", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg" },
    { name: "Barcelona", country: "España", group: "1", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
    // Bombo 2
    { name: "Arsenal", country: "Inglaterra", group: "2", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
    { name: "Bayer Leverkusen", country: "Alemania", group: "2", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg" },
    { name: "Atlético de Madrid", country: "España", group: "2", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg" },
    { name: "Atalanta", country: "Italia", group: "2", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/6/66/AtalantaBC.svg" },
    { name: "Villarreal", country: "España", group: "2", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/b/b8/Villarreal_CF_logo.svg" },
    { name: "Juventus", country: "Italia", group: "2", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_icon_%28black%29.svg" },
    { name: "Eintracht Frankfurt", country: "Alemania", group: "2", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg" },
    { name: "Club Brugge", country: "Bélgica", group: "2", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a8/Club_Brugge_KV_logo.svg" },
    { name: "Benfica", country: "Portugal", group: "2", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg" },
    // Bombo 3
    { name: "Tottenham", country: "Inglaterra", group: "3", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg" },
    { name: "PSV Eindhoven", country: "Países Bajos", group: "3", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/05/PSV_Eindhoven.svg" },
    { name: "Ajax", country: "Países Bajos", group: "3", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg" },
    { name: "Napoli", country: "Italia", group: "3", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli_logo.svg" },
    { name: "Sporting CP", country: "Portugal", group: "3", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f1/Sporting_CP_logo.svg" },
    { name: "Olympiacos", country: "Grecia", group: "3", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0b/Olympiacos_FC_logo.svg" },
    { name: "Slavia Praga", country: "Rep. Checa", group: "3", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/8/84/SK_Slavia_Prague_logo.svg" },
    { name: "Marsella", country: "Francia", group: "3", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg" },
    { name: "Bodo/Glimt", country: "Noruega", group: "3", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/b/b9/FK_Bod%C3%B8%2FGlimt_logo.svg" },
    // Bombo 4
    { name: "Monaco", country: "Francia", group: "4", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e1/AS_Monaco_FC.svg" },
    { name: "Galatasaray", country: "Turquía", group: "4", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/07/Galatasaray_4_stars.svg" },
    { name: "Union SG", country: "Bélgica", group: "4", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/8/8d/Royale_Union_Saint-Gilloise_logo.svg" },
    { name: "Athletic Club", country: "España", group: "4", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_de_Bilbao_logo.svg" },
    { name: "Newcastle", country: "Inglaterra", group: "4", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg" },
    { name: "Copenhagen", country: "Dinamarca", group: "4", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fc/FC_Copenhagen_crest.svg" },
    { name: "Kairat", country: "Kazajistán", group: "4", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fe/FC_Kairat_logo.svg" },
    { name: "Pafos FC", country: "Chipre", group: "4", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/6/65/Pafos_FC_Logo.svg" },
    { name: "FK Qarabag", country: "Azerbaiyán", group: "4", season: "2025/26", logoUrl: "https://upload.wikimedia.org/wikipedia/en/4/47/Qarabag_FK_logo.svg" },
  ];

  const teams = await Promise.all(teamsData.map(t => prisma.team.create({ data: t })));

  // Equipo ficticio para partidos pendientes de definir
  const tbd = await prisma.team.create({
    data: { name: "Por determinar", country: "-", group: "0", season: "2025/26", logoUrl: null },
  });
  teams.push(tbd);

  const tm = Object.fromEntries(teams.map(t => [t.name, t]));

  // Fuente: UEFA.com - Resultados reales Champions League 2025/26
  const matchesData = [
    // ===== JORNADA 1 - 16-18 septiembre 2025 (UEFA.com) =====
    // Martes 16 septiembre
    { home: "Athletic Club", away: "Arsenal", date: "2025-09-16T21:00:00Z", day: 1, hg: 0, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "PSV Eindhoven", away: "Union SG", date: "2025-09-16T21:00:00Z", day: 1, hg: 1, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Juventus", away: "Borussia Dortmund", date: "2025-09-16T21:00:00Z", day: 1, hg: 4, ag: 4, phase: MatchPhase.FASE_LIGA },
    { home: "Real Madrid", away: "Marsella", date: "2025-09-16T21:00:00Z", day: 1, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Benfica", away: "FK Qarabag", date: "2025-09-16T21:00:00Z", day: 1, hg: 2, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Tottenham", away: "Villarreal", date: "2025-09-16T21:00:00Z", day: 1, hg: 1, ag: 0, phase: MatchPhase.FASE_LIGA },
    // Miércoles 17 septiembre
    { home: "Olympiacos", away: "Pafos FC", date: "2025-09-17T21:00:00Z", day: 1, hg: 0, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Slavia Praga", away: "Bodo/Glimt", date: "2025-09-17T21:00:00Z", day: 1, hg: 2, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Ajax", away: "Inter Milan", date: "2025-09-17T21:00:00Z", day: 1, hg: 0, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Bayern Munich", away: "Chelsea", date: "2025-09-17T21:00:00Z", day: 1, hg: 3, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Liverpool", away: "Atlético de Madrid", date: "2025-09-17T21:00:00Z", day: 1, hg: 3, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "PSG", away: "Atalanta", date: "2025-09-17T21:00:00Z", day: 1, hg: 4, ag: 0, phase: MatchPhase.FASE_LIGA },
    // Jueves 18 septiembre
    { home: "Club Brugge", away: "Monaco", date: "2025-09-18T21:00:00Z", day: 1, hg: 4, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Copenhagen", away: "Bayer Leverkusen", date: "2025-09-18T21:00:00Z", day: 1, hg: 2, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Eintracht Frankfurt", away: "Galatasaray", date: "2025-09-18T21:00:00Z", day: 1, hg: 5, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Manchester City", away: "Napoli", date: "2025-09-18T21:00:00Z", day: 1, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Newcastle", away: "Barcelona", date: "2025-09-18T21:00:00Z", day: 1, hg: 1, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Sporting CP", away: "Kairat", date: "2025-09-18T21:00:00Z", day: 1, hg: 4, ag: 1, phase: MatchPhase.FASE_LIGA },

    // ===== JORNADA 2 - 30 sep / 1 oct 2025 (UEFA.com) =====
    // Martes 30 septiembre
    { home: "Atalanta", away: "Club Brugge", date: "2025-09-30T21:00:00Z", day: 2, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Kairat", away: "Real Madrid", date: "2025-09-30T21:00:00Z", day: 2, hg: 0, ag: 5, phase: MatchPhase.FASE_LIGA },
    { home: "Atlético de Madrid", away: "Eintracht Frankfurt", date: "2025-09-30T21:00:00Z", day: 2, hg: 5, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Chelsea", away: "Benfica", date: "2025-09-30T21:00:00Z", day: 2, hg: 1, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Inter Milan", away: "Slavia Praga", date: "2025-09-30T21:00:00Z", day: 2, hg: 3, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Bodo/Glimt", away: "Tottenham", date: "2025-09-30T21:00:00Z", day: 2, hg: 2, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Galatasaray", away: "Liverpool", date: "2025-09-30T21:00:00Z", day: 2, hg: 1, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Marsella", away: "Ajax", date: "2025-09-30T21:00:00Z", day: 2, hg: 4, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Pafos FC", away: "Bayern Munich", date: "2025-09-30T21:00:00Z", day: 2, hg: 1, ag: 5, phase: MatchPhase.FASE_LIGA },
    // Miércoles 1 octubre
    { home: "FK Qarabag", away: "Copenhagen", date: "2025-10-01T21:00:00Z", day: 2, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Union SG", away: "Newcastle", date: "2025-10-01T21:00:00Z", day: 2, hg: 0, ag: 4, phase: MatchPhase.FASE_LIGA },
    { home: "Arsenal", away: "Olympiacos", date: "2025-10-01T21:00:00Z", day: 2, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Monaco", away: "Manchester City", date: "2025-10-01T21:00:00Z", day: 2, hg: 2, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Bayer Leverkusen", away: "PSV Eindhoven", date: "2025-10-01T21:00:00Z", day: 2, hg: 1, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Borussia Dortmund", away: "Athletic Club", date: "2025-10-01T21:00:00Z", day: 2, hg: 4, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Barcelona", away: "PSG", date: "2025-10-01T21:00:00Z", day: 2, hg: 1, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Napoli", away: "Sporting CP", date: "2025-10-01T21:00:00Z", day: 2, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Villarreal", away: "Juventus", date: "2025-10-01T21:00:00Z", day: 2, hg: 2, ag: 2, phase: MatchPhase.FASE_LIGA },

    // ===== JORNADA 3 - 21/22 octubre 2025 (Wikipedia) =====
    { home: "Barcelona", away: "Olympiacos", date: "2025-10-21T21:00:00Z", day: 3, hg: 6, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Kairat", away: "Pafos FC", date: "2025-10-21T21:00:00Z", day: 3, hg: 0, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Arsenal", away: "Atlético de Madrid", date: "2025-10-21T21:00:00Z", day: 3, hg: 4, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Bayer Leverkusen", away: "PSG", date: "2025-10-21T21:00:00Z", day: 3, hg: 2, ag: 7, phase: MatchPhase.FASE_LIGA },
    { home: "Copenhagen", away: "Borussia Dortmund", date: "2025-10-21T21:00:00Z", day: 3, hg: 2, ag: 4, phase: MatchPhase.FASE_LIGA },
    { home: "Newcastle", away: "Benfica", date: "2025-10-21T21:00:00Z", day: 3, hg: 3, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "PSV Eindhoven", away: "Napoli", date: "2025-10-21T21:00:00Z", day: 3, hg: 6, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Union SG", away: "Inter Milan", date: "2025-10-21T21:00:00Z", day: 3, hg: 0, ag: 4, phase: MatchPhase.FASE_LIGA },
    { home: "Villarreal", away: "Manchester City", date: "2025-10-21T21:00:00Z", day: 3, hg: 0, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Athletic Club", away: "FK Qarabag", date: "2025-10-22T21:00:00Z", day: 3, hg: 3, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Galatasaray", away: "Bodo/Glimt", date: "2025-10-22T21:00:00Z", day: 3, hg: 3, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Monaco", away: "Tottenham", date: "2025-10-22T21:00:00Z", day: 3, hg: 0, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Atalanta", away: "Slavia Praga", date: "2025-10-22T21:00:00Z", day: 3, hg: 0, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Chelsea", away: "Ajax", date: "2025-10-22T21:00:00Z", day: 3, hg: 5, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Eintracht Frankfurt", away: "Liverpool", date: "2025-10-22T21:00:00Z", day: 3, hg: 1, ag: 5, phase: MatchPhase.FASE_LIGA },
    { home: "Bayern Munich", away: "Club Brugge", date: "2025-10-22T21:00:00Z", day: 3, hg: 4, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Real Madrid", away: "Juventus", date: "2025-10-22T21:00:00Z", day: 3, hg: 1, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Sporting CP", away: "Marsella", date: "2025-10-22T21:00:00Z", day: 3, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },

    // ===== JORNADA 4 - 4/5 noviembre 2025 (Wikipedia) =====
    { home: "Slavia Praga", away: "Arsenal", date: "2025-11-04T21:00:00Z", day: 4, hg: 0, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Napoli", away: "Eintracht Frankfurt", date: "2025-11-04T21:00:00Z", day: 4, hg: 0, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Atlético de Madrid", away: "Union SG", date: "2025-11-04T21:00:00Z", day: 4, hg: 3, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Bodo/Glimt", away: "Monaco", date: "2025-11-04T21:00:00Z", day: 4, hg: 0, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Juventus", away: "Sporting CP", date: "2025-11-04T21:00:00Z", day: 4, hg: 1, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Liverpool", away: "Real Madrid", date: "2025-11-04T21:00:00Z", day: 4, hg: 1, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Olympiacos", away: "PSV Eindhoven", date: "2025-11-04T21:00:00Z", day: 4, hg: 1, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "PSG", away: "Bayern Munich", date: "2025-11-04T21:00:00Z", day: 4, hg: 1, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Tottenham", away: "Copenhagen", date: "2025-11-04T21:00:00Z", day: 4, hg: 4, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Pafos FC", away: "Villarreal", date: "2025-11-05T21:00:00Z", day: 4, hg: 1, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "FK Qarabag", away: "Chelsea", date: "2025-11-05T21:00:00Z", day: 4, hg: 2, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Ajax", away: "Galatasaray", date: "2025-11-05T21:00:00Z", day: 4, hg: 0, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Club Brugge", away: "Barcelona", date: "2025-11-05T21:00:00Z", day: 4, hg: 3, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Inter Milan", away: "Kairat", date: "2025-11-05T21:00:00Z", day: 4, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Manchester City", away: "Borussia Dortmund", date: "2025-11-05T21:00:00Z", day: 4, hg: 4, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Newcastle", away: "Athletic Club", date: "2025-11-05T21:00:00Z", day: 4, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Marsella", away: "Atalanta", date: "2025-11-05T21:00:00Z", day: 4, hg: 0, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Benfica", away: "Bayer Leverkusen", date: "2025-11-05T21:00:00Z", day: 4, hg: 0, ag: 1, phase: MatchPhase.FASE_LIGA },

    // ===== JORNADA 5 - 25/26 noviembre 2025 (Wikipedia) =====
    { home: "Ajax", away: "Benfica", date: "2025-11-25T21:00:00Z", day: 5, hg: 0, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Galatasaray", away: "Union SG", date: "2025-11-25T21:00:00Z", day: 5, hg: 0, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Borussia Dortmund", away: "Villarreal", date: "2025-11-25T21:00:00Z", day: 5, hg: 4, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Chelsea", away: "Barcelona", date: "2025-11-25T21:00:00Z", day: 5, hg: 3, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Bodo/Glimt", away: "Juventus", date: "2025-11-25T21:00:00Z", day: 5, hg: 2, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Manchester City", away: "Bayer Leverkusen", date: "2025-11-25T21:00:00Z", day: 5, hg: 0, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Marsella", away: "Newcastle", date: "2025-11-25T21:00:00Z", day: 5, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Slavia Praga", away: "Athletic Club", date: "2025-11-25T21:00:00Z", day: 5, hg: 0, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Napoli", away: "FK Qarabag", date: "2025-11-25T21:00:00Z", day: 5, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Copenhagen", away: "Kairat", date: "2025-11-26T21:00:00Z", day: 5, hg: 3, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Pafos FC", away: "Monaco", date: "2025-11-26T21:00:00Z", day: 5, hg: 2, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Arsenal", away: "Bayern Munich", date: "2025-11-26T21:00:00Z", day: 5, hg: 3, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Atlético de Madrid", away: "Inter Milan", date: "2025-11-26T21:00:00Z", day: 5, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Eintracht Frankfurt", away: "Atalanta", date: "2025-11-26T21:00:00Z", day: 5, hg: 0, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Liverpool", away: "PSV Eindhoven", date: "2025-11-26T21:00:00Z", day: 5, hg: 1, ag: 4, phase: MatchPhase.FASE_LIGA },
    { home: "Olympiacos", away: "Real Madrid", date: "2025-11-26T21:00:00Z", day: 5, hg: 3, ag: 4, phase: MatchPhase.FASE_LIGA },
    { home: "PSG", away: "Tottenham", date: "2025-11-26T21:00:00Z", day: 5, hg: 5, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Sporting CP", away: "Club Brugge", date: "2025-11-26T21:00:00Z", day: 5, hg: 3, ag: 0, phase: MatchPhase.FASE_LIGA },

    // ===== JORNADA 6 - 9/10 diciembre 2025 =====
    { home: "Kairat", away: "Olympiacos", date: "2025-12-09T21:00:00Z", day: 6, hg: 0, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Bayern Munich", away: "Sporting CP", date: "2025-12-09T21:00:00Z", day: 6, hg: 3, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Monaco", away: "Galatasaray", date: "2025-12-09T21:00:00Z", day: 6, hg: 1, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Atalanta", away: "Chelsea", date: "2025-12-09T21:00:00Z", day: 6, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Barcelona", away: "Eintracht Frankfurt", date: "2025-12-09T21:00:00Z", day: 6, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Inter Milan", away: "Liverpool", date: "2025-12-09T21:00:00Z", day: 6, hg: 0, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "PSV Eindhoven", away: "Atlético de Madrid", date: "2025-12-09T21:00:00Z", day: 6, hg: 2, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Union SG", away: "Marsella", date: "2025-12-09T21:00:00Z", day: 6, hg: 2, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Tottenham", away: "Slavia Praga", date: "2025-12-09T21:00:00Z", day: 6, hg: 3, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "FK Qarabag", away: "Ajax", date: "2025-12-10T21:00:00Z", day: 6, hg: 2, ag: 4, phase: MatchPhase.FASE_LIGA },
    { home: "Villarreal", away: "Copenhagen", date: "2025-12-10T21:00:00Z", day: 6, hg: 2, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Athletic Club", away: "PSG", date: "2025-12-10T21:00:00Z", day: 6, hg: 0, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Bayer Leverkusen", away: "Newcastle", date: "2025-12-10T21:00:00Z", day: 6, hg: 2, ag: 2, phase: MatchPhase.FASE_LIGA },

    // ===== JORNADA 7 - 20/21 enero 2026 =====
    { home: "Kairat", away: "Club Brugge", date: "2026-01-20T21:00:00Z", day: 7, hg: 1, ag: 4, phase: MatchPhase.FASE_LIGA },
    { home: "Bodo/Glimt", away: "Manchester City", date: "2026-01-20T21:00:00Z", day: 7, hg: 3, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Copenhagen", away: "Napoli", date: "2026-01-20T21:00:00Z", day: 7, hg: 1, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Inter Milan", away: "Arsenal", date: "2026-01-20T21:00:00Z", day: 7, hg: 1, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Olympiacos", away: "Bayer Leverkusen", date: "2026-01-20T21:00:00Z", day: 7, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Real Madrid", away: "Monaco", date: "2026-01-20T21:00:00Z", day: 7, hg: 6, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Sporting CP", away: "PSG", date: "2026-01-20T21:00:00Z", day: 7, hg: 2, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Tottenham", away: "Borussia Dortmund", date: "2026-01-20T21:00:00Z", day: 7, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Villarreal", away: "Ajax", date: "2026-01-20T21:00:00Z", day: 7, hg: 1, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Galatasaray", away: "Atlético de Madrid", date: "2026-01-21T21:00:00Z", day: 7, hg: 1, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "FK Qarabag", away: "Eintracht Frankfurt", date: "2026-01-21T21:00:00Z", day: 7, hg: 3, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Atalanta", away: "Athletic Club", date: "2026-01-21T21:00:00Z", day: 7, hg: 2, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Chelsea", away: "Pafos FC", date: "2026-01-21T21:00:00Z", day: 7, hg: 1, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Bayern Munich", away: "Union SG", date: "2026-01-21T21:00:00Z", day: 7, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Juventus", away: "Benfica", date: "2026-01-21T21:00:00Z", day: 7, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Newcastle", away: "PSV Eindhoven", date: "2026-01-21T21:00:00Z", day: 7, hg: 3, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Marsella", away: "Liverpool", date: "2026-01-21T21:00:00Z", day: 7, hg: 0, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Slavia Praga", away: "Barcelona", date: "2026-01-21T21:00:00Z", day: 7, hg: 2, ag: 4, phase: MatchPhase.FASE_LIGA },

    // ===== JORNADA 8 - 28 enero 2026 =====
    { home: "Ajax", away: "Olympiacos", date: "2026-01-28T21:00:00Z", day: 8, hg: 1, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Arsenal", away: "Kairat", date: "2026-01-28T21:00:00Z", day: 8, hg: 3, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Monaco", away: "Juventus", date: "2026-01-28T21:00:00Z", day: 8, hg: 0, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Athletic Club", away: "Sporting CP", date: "2026-01-28T21:00:00Z", day: 8, hg: 2, ag: 3, phase: MatchPhase.FASE_LIGA },
    { home: "Atlético de Madrid", away: "Bodo/Glimt", date: "2026-01-28T21:00:00Z", day: 8, hg: 1, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Bayer Leverkusen", away: "Villarreal", date: "2026-01-28T21:00:00Z", day: 8, hg: 3, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Borussia Dortmund", away: "Inter Milan", date: "2026-01-28T21:00:00Z", day: 8, hg: 0, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Club Brugge", away: "Marsella", date: "2026-01-28T21:00:00Z", day: 8, hg: 3, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Eintracht Frankfurt", away: "Tottenham", date: "2026-01-28T21:00:00Z", day: 8, hg: 0, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Barcelona", away: "Copenhagen", date: "2026-01-28T21:00:00Z", day: 8, hg: 4, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "Liverpool", away: "FK Qarabag", date: "2026-01-28T21:00:00Z", day: 8, hg: 6, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Manchester City", away: "Galatasaray", date: "2026-01-28T21:00:00Z", day: 8, hg: 2, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Pafos FC", away: "Slavia Praga", date: "2026-01-28T21:00:00Z", day: 8, hg: 4, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "PSG", away: "Newcastle", date: "2026-01-28T21:00:00Z", day: 8, hg: 1, ag: 1, phase: MatchPhase.FASE_LIGA },
    { home: "PSV Eindhoven", away: "Bayern Munich", date: "2026-01-28T21:00:00Z", day: 8, hg: 1, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Union SG", away: "Atalanta", date: "2026-01-28T21:00:00Z", day: 8, hg: 1, ag: 0, phase: MatchPhase.FASE_LIGA },
    { home: "Benfica", away: "Real Madrid", date: "2026-01-28T21:00:00Z", day: 8, hg: 4, ag: 2, phase: MatchPhase.FASE_LIGA },
    { home: "Napoli", away: "Chelsea", date: "2026-01-28T21:00:00Z", day: 8, hg: 2, ag: 3, phase: MatchPhase.FASE_LIGA },

    // ===== PLAYOFFS - ida 17/18 febrero 2026 =====
    { home: "Galatasaray", away: "Juventus", date: "2026-02-17T21:00:00Z", day: 1, hg: 5, ag: 2, phase: MatchPhase.OCTAVOS },
    { home: "Monaco", away: "PSG", date: "2026-02-17T21:00:00Z", day: 1, hg: 2, ag: 3, phase: MatchPhase.OCTAVOS },
    { home: "Borussia Dortmund", away: "Atalanta", date: "2026-02-17T21:00:00Z", day: 1, hg: 2, ag: 0, phase: MatchPhase.OCTAVOS },
    { home: "Benfica", away: "Real Madrid", date: "2026-02-17T21:00:00Z", day: 1, hg: 0, ag: 1, phase: MatchPhase.OCTAVOS },
    { home: "FK Qarabag", away: "Newcastle", date: "2026-02-18T21:00:00Z", day: 1, hg: 1, ag: 6, phase: MatchPhase.OCTAVOS },
    { home: "Club Brugge", away: "Atlético de Madrid", date: "2026-02-18T21:00:00Z", day: 1, hg: 3, ag: 3, phase: MatchPhase.OCTAVOS },
    { home: "Bodo/Glimt", away: "Inter Milan", date: "2026-02-18T21:00:00Z", day: 1, hg: 3, ag: 1, phase: MatchPhase.OCTAVOS },
    { home: "Olympiacos", away: "Bayer Leverkusen", date: "2026-02-18T21:00:00Z", day: 1, hg: 0, ag: 2, phase: MatchPhase.OCTAVOS },

    // ===== PLAYOFFS - vuelta 24/25 febrero 2026 =====
    { home: "Atlético de Madrid", away: "Club Brugge", date: "2026-02-24T21:00:00Z", day: 2, hg: 4, ag: 1, phase: MatchPhase.OCTAVOS },
    { home: "Bayer Leverkusen", away: "Olympiacos", date: "2026-02-24T21:00:00Z", day: 2, hg: 0, ag: 0, phase: MatchPhase.OCTAVOS },
    { home: "Inter Milan", away: "Bodo/Glimt", date: "2026-02-24T21:00:00Z", day: 2, hg: 1, ag: 2, phase: MatchPhase.OCTAVOS },
    { home: "Newcastle", away: "FK Qarabag", date: "2026-02-24T21:00:00Z", day: 2, hg: 3, ag: 2, phase: MatchPhase.OCTAVOS },
    { home: "Atalanta", away: "Borussia Dortmund", date: "2026-02-25T21:00:00Z", day: 2, hg: 4, ag: 1, phase: MatchPhase.OCTAVOS },
    { home: "Juventus", away: "Galatasaray", date: "2026-02-25T21:00:00Z", day: 2, hg: 3, ag: 2, phase: MatchPhase.OCTAVOS }, // Gana Galatasaray en penaltis
    { home: "PSG", away: "Monaco", date: "2026-02-25T21:00:00Z", day: 2, hg: 2, ag: 2, phase: MatchPhase.OCTAVOS },
    { home: "Real Madrid", away: "Benfica", date: "2026-02-25T21:00:00Z", day: 2, hg: 2, ag: 1, phase: MatchPhase.OCTAVOS },

    // ===== OCTAVOS - ida 10/11 marzo 2026 =====
    { home: "Galatasaray", away: "Liverpool", date: "2026-03-10T21:00:00Z", day: 1, hg: 1, ag: 0, phase: MatchPhase.OCTAVOS },
    { home: "Atalanta", away: "Bayern Munich", date: "2026-03-10T21:00:00Z", day: 1, hg: 1, ag: 6, phase: MatchPhase.OCTAVOS },
    { home: "Atlético de Madrid", away: "Tottenham", date: "2026-03-10T21:00:00Z", day: 1, hg: 5, ag: 2, phase: MatchPhase.OCTAVOS },
    { home: "Newcastle", away: "Barcelona", date: "2026-03-10T21:00:00Z", day: 1, hg: 1, ag: 1, phase: MatchPhase.OCTAVOS },
    { home: "Bayer Leverkusen", away: "Arsenal", date: "2026-03-11T21:00:00Z", day: 1, hg: 1, ag: 1, phase: MatchPhase.OCTAVOS },
    { home: "Bodo/Glimt", away: "Sporting CP", date: "2026-03-11T21:00:00Z", day: 1, hg: 3, ag: 0, phase: MatchPhase.OCTAVOS },
    { home: "PSG", away: "Chelsea", date: "2026-03-11T21:00:00Z", day: 1, hg: 5, ag: 2, phase: MatchPhase.OCTAVOS },
    { home: "Real Madrid", away: "Manchester City", date: "2026-03-11T21:00:00Z", day: 1, hg: 3, ag: 0, phase: MatchPhase.OCTAVOS },

    // ===== OCTAVOS - vuelta 17/18 marzo 2026 =====
    { home: "Sporting CP", away: "Bodo/Glimt", date: "2026-03-17T21:00:00Z", day: 2, hg: 5, ag: 0, phase: MatchPhase.OCTAVOS },
    { home: "Arsenal", away: "Bayer Leverkusen", date: "2026-03-17T21:00:00Z", day: 2, hg: 2, ag: 0, phase: MatchPhase.OCTAVOS },
    { home: "Chelsea", away: "PSG", date: "2026-03-17T21:00:00Z", day: 2, hg: 0, ag: 3, phase: MatchPhase.OCTAVOS },
    { home: "Manchester City", away: "Real Madrid", date: "2026-03-17T21:00:00Z", day: 2, hg: 1, ag: 2, phase: MatchPhase.OCTAVOS },
    { home: "Barcelona", away: "Newcastle", date: "2026-03-18T18:45:00Z", day: 2, hg: 7, ag: 2, phase: MatchPhase.OCTAVOS },
    { home: "Bayern Munich", away: "Atalanta", date: "2026-03-18T21:00:00Z", day: 2, hg: 4, ag: 1, phase: MatchPhase.OCTAVOS },
    { home: "Liverpool", away: "Galatasaray", date: "2026-03-18T21:00:00Z", day: 2, hg: 4, ag: 0, phase: MatchPhase.OCTAVOS },
    { home: "Tottenham", away: "Atlético de Madrid", date: "2026-03-18T21:00:00Z", day: 2, hg: 3, ag: 2, phase: MatchPhase.OCTAVOS },

    // ===== CUARTOS - ida 7/8 abril 2026 (UEFA.com) =====
    { home: "Sporting CP", away: "Arsenal", date: "2026-04-07T21:00:00Z", day: 1, hg: 0, ag: 1, phase: MatchPhase.CUARTOS },
    { home: "Real Madrid", away: "Bayern Munich", date: "2026-04-07T21:00:00Z", day: 1, hg: 1, ag: 2, phase: MatchPhase.CUARTOS },
    { home: "Barcelona", away: "Atlético de Madrid", date: "2026-04-08T21:00:00Z", day: 1, hg: 0, ag: 2, phase: MatchPhase.CUARTOS },
    { home: "PSG", away: "Liverpool", date: "2026-04-08T21:00:00Z", day: 1, hg: 2, ag: 0, phase: MatchPhase.CUARTOS },

    // ===== CUARTOS - vuelta 14/15 abril 2026 (UEFA.com) =====
    { home: "Atlético de Madrid", away: "Barcelona", date: "2026-04-14T21:00:00Z", day: 2, hg: 1, ag: 2, phase: MatchPhase.CUARTOS }, // global Atléti 3-2
    { home: "Liverpool", away: "PSG", date: "2026-04-14T21:00:00Z", day: 2, hg: 0, ag: 2, phase: MatchPhase.CUARTOS }, // global PSG 4-0
    { home: "Arsenal", away: "Sporting CP", date: "2026-04-15T21:00:00Z", day: 2, hg: 0, ag: 0, phase: MatchPhase.CUARTOS }, // global Arsenal 1-0
    { home: "Bayern Munich", away: "Real Madrid", date: "2026-04-15T21:00:00Z", day: 2, hg: 4, ag: 3, phase: MatchPhase.CUARTOS }, // global Bayern 6-4

    // ===== SEMIFINALES - ida 28/29 abril 2026 (UEFA.com) =====
    { home: "Atlético de Madrid", away: "Arsenal", date: "2026-04-28T21:00:00Z", day: 1, hg: 1, ag: 1, phase: MatchPhase.SEMIFINALES },
    { home: "PSG", away: "Bayern Munich", date: "2026-04-29T21:00:00Z", day: 1, hg: 5, ag: 4, phase: MatchPhase.SEMIFINALES },

    // ===== SEMIFINALES - vuelta 5/6 mayo 2026 (UEFA.com) =====
    { home: "Arsenal", away: "Atlético de Madrid", date: "2026-05-05T21:00:00Z", day: 2, hg: 1, ag: 0, phase: MatchPhase.SEMIFINALES }, // global Arsenal 2-1
    { home: "Bayern Munich", away: "PSG", date: "2026-05-06T21:00:00Z", day: 2, hg: 1, ag: 1, phase: MatchPhase.SEMIFINALES }, // global PSG 6-5

    // ===== FINAL - 30 mayo 2026 Budapest (UEFA.com) =====
    // PSG 1-1 Arsenal aet, PSG gana 4-3 en penaltis
    { home: "PSG", away: "Arsenal", date: "2026-05-30T18:00:00Z", day: 1, hg: 1, ag: 1, phase: MatchPhase.FINAL },
  ];

  let created = 0;
  let skipped = 0;

  const matchPromises = matchesData.map(async m => {
    const homeTeam = tm[m.home];
    const awayTeam = tm[m.away];
    if (!homeTeam || !awayTeam) {
      console.warn(`⚠️  Equipo no encontrado: "${m.home}" o "${m.away}"`);
      skipped++;
      return null;
    }
    created++;
    return prisma.match.create({
      data: {
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        matchDate: new Date(m.date),
        matchday: m.day,
        phase: m.phase,
        status: (m as { status?: MatchStatus }).status ?? MatchStatus.PLAYED,
        homeGoals: m.hg ?? null,
        awayGoals: m.ag ?? null,
      },
    });
  });

  const results = await Promise.all(matchPromises);
  const validMatches = results.filter(Boolean) as NonNullable<(typeof results)[0]>[];

  // Comentarios
  const firstMatch = validMatches[0];
  if (firstMatch) {
    await prisma.comment.createMany({
      data: [
        { content: "¡Increíble el Barça ganando en Newcastle en la primera jornada!", matchId: firstMatch.id, authorId: admin.id },
        { content: "Qué inicio de temporada para los azulgranas.", matchId: firstMatch.id, authorId: admin.id },
      ],
    });
  }

  console.log(`✅ Seed completado:`);
  console.log(`   - ${teams.length} equipos reales (UCL 2025/26)`);
  console.log(`   - ${created} partidos creados (${skipped} omitidos)`);
  console.log(`   - Fuente: UEFA.com`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
