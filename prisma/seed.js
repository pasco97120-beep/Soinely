const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { FICHES_CONTENU } = require("./fiches-contenu");

const prisma = new PrismaClient();
const DEMO_PASSWORD = "soinely2026";

async function main() {
  console.log("Seeding SOINELY...");
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  // 1. Services
  const services = await Promise.all(
    [
      { nom: "Cardiologie", code: "CARD-01", etage: 3, aile: "Nord" },
      { nom: "Médecine Interne", code: "MED-01", etage: 2, aile: "Est" },
      { nom: "Chirurgie", code: "CHIR-01", etage: 4, aile: "Ouest" },
      { nom: "Pédiatrie", code: "PED-01", etage: 1, aile: "Sud" },
      { nom: "Soins Intensifs", code: "SI-01", etage: 2, aile: "Centre" },
    ].map((s) => prisma.service.create({ data: s }))
  );

  // 2. Chambres (id 1-8)
  const chambresData = [
    { serviceId: services[0].id, numero: "301", nombreLits: 2, type: "double" },
    { serviceId: services[0].id, numero: "302", nombreLits: 1, type: "simple" },
    { serviceId: services[0].id, numero: "303", nombreLits: 1, type: "isolation" },
    { serviceId: services[1].id, numero: "201", nombreLits: 2, type: "double" },
    { serviceId: services[1].id, numero: "202", nombreLits: 2, type: "double" },
    { serviceId: services[2].id, numero: "401", nombreLits: 1, type: "simple" },
    { serviceId: services[4].id, numero: "SI-01", nombreLits: 1, type: "soins_intensifs" },
    { serviceId: services[4].id, numero: "SI-02", nombreLits: 1, type: "soins_intensifs" },
  ];
  const chambres = [];
  for (const c of chambresData) chambres.push(await prisma.chambre.create({ data: c }));

  // 3. Lits (id 1-11)
  const litsData = [
    { chambreId: chambres[0].id, numeroLit: "A", statut: "occupé" },
    { chambreId: chambres[0].id, numeroLit: "B", statut: "libre" },
    { chambreId: chambres[1].id, numeroLit: "A", statut: "occupé" },
    { chambreId: chambres[2].id, numeroLit: "A", statut: "occupé" },
    { chambreId: chambres[3].id, numeroLit: "A", statut: "occupé" },
    { chambreId: chambres[3].id, numeroLit: "B", statut: "occupé" },
    { chambreId: chambres[4].id, numeroLit: "A", statut: "libre" },
    { chambreId: chambres[4].id, numeroLit: "B", statut: "nettoyage" },
    { chambreId: chambres[5].id, numeroLit: "A", statut: "occupé" },
    { chambreId: chambres[6].id, numeroLit: "A", statut: "occupé" },
    { chambreId: chambres[7].id, numeroLit: "A", statut: "libre" },
  ];
  const lits = [];
  for (const l of litsData) lits.push(await prisma.lit.create({ data: l }));

  // 4. Infirmiers (id 1-6)
  const infirmiersData = [
    { matricule: "INF-001", nom: "Tremblay", prenom: "Sophie", sexe: "F", email: "sophie.tremblay@hgm.qc.ca", telephone: "514-111-0001", specialite: "Cardiologie", grade: "chef_equipe", serviceId: services[0].id, dateEmbauche: new Date("2015-06-01") },
    { matricule: "INF-002", nom: "Bouchard", prenom: "Marie", sexe: "F", email: "marie.bouchard@hgm.qc.ca", telephone: "514-111-0002", specialite: "Cardiologie", grade: "infirmier", serviceId: services[0].id, dateEmbauche: new Date("2018-09-10") },
    { matricule: "INF-003", nom: "Gagnon", prenom: "Pierre", sexe: "M", email: "pierre.gagnon@hgm.qc.ca", telephone: "514-111-0003", specialite: "Médecine Interne", grade: "infirmier_senior", serviceId: services[1].id, dateEmbauche: new Date("2012-03-20") },
    { matricule: "INF-004", nom: "Roy", prenom: "Julie", sexe: "F", email: "julie.roy@hgm.qc.ca", telephone: "514-111-0004", specialite: "Chirurgie", grade: "infirmier", serviceId: services[2].id, dateEmbauche: new Date("2020-01-15") },
    { matricule: "INF-005", nom: "Lavoie", prenom: "Chantal", sexe: "F", email: "chantal.lavoie@hgm.qc.ca", telephone: "514-111-0005", specialite: "Soins Intensifs", grade: "infirmier_senior", serviceId: services[4].id, dateEmbauche: new Date("2008-11-05") },
    { matricule: "INF-006", nom: "Côté", prenom: "Alexandre", sexe: "M", email: "alexandre.cote@hgm.qc.ca", telephone: "514-111-0006", specialite: "Médecine Interne", grade: "infirmier", serviceId: services[1].id, dateEmbauche: new Date("2019-04-12") },
  ];
  const infirmiers = [];
  for (const i of infirmiersData) infirmiers.push(await prisma.infirmier.create({ data: i }));

  // 5. Utilisateurs
  const usernames = ["stremblay", "mbouchard", "pgagnon", "jroy", "clavoie", "acote"];
  const roles = ["chef_equipe", "infirmier", "infirmier", "infirmier", "infirmier", "infirmier"];
  for (let i = 0; i < infirmiers.length; i++) {
    await prisma.utilisateur.create({
      data: { infirmierId: infirmiers[i].id, username: usernames[i], passwordHash, role: roles[i] },
    });
  }

  // 6. Patients (id 1-7)
  const patientsData = [
    { numeroDossier: "DOS-2026-001", nom: "Martin", prenom: "Jean", sexe: "M", dateNaissance: new Date("1955-04-10"), telephone: "514-222-0001", groupeSanguin: "A+", allergies: "Pénicilline", antecedents: "Hypertension, Diabète type 2", contactUrgenceNom: "Martin Sylvie", contactUrgenceTel: "514-222-0011", contactUrgenceLien: "épouse" },
    { numeroDossier: "DOS-2026-002", nom: "Simard", prenom: "Claire", sexe: "F", dateNaissance: new Date("1968-12-05"), telephone: "514-222-0002", groupeSanguin: "O-", antecedents: "Asthme", contactUrgenceNom: "Simard Paul", contactUrgenceTel: "514-222-0012", contactUrgenceLien: "époux" },
    { numeroDossier: "DOS-2026-003", nom: "Leblanc", prenom: "Robert", sexe: "M", dateNaissance: new Date("1942-08-18"), telephone: "514-222-0003", groupeSanguin: "B+", allergies: "Aspirine, Ibuprofène", antecedents: "Insuffisance cardiaque, BPCO", contactUrgenceNom: "Leblanc Monique", contactUrgenceTel: "514-222-0013", contactUrgenceLien: "épouse" },
    { numeroDossier: "DOS-2026-004", nom: "Fortin", prenom: "Amélie", sexe: "F", dateNaissance: new Date("1985-03-25"), telephone: "514-222-0004", groupeSanguin: "AB+", contactUrgenceNom: "Fortin Luc", contactUrgenceTel: "514-222-0014", contactUrgenceLien: "époux" },
    { numeroDossier: "DOS-2026-005", nom: "Girard", prenom: "Michel", sexe: "M", dateNaissance: new Date("1950-09-14"), telephone: "514-222-0005", groupeSanguin: "A-", allergies: "Sulfamides", antecedents: "HTA, Fibrillation auriculaire", contactUrgenceNom: "Girard Anne", contactUrgenceTel: "514-222-0015", contactUrgenceLien: "épouse" },
    { numeroDossier: "DOS-2026-006", nom: "Bergeron", prenom: "Isabelle", sexe: "F", dateNaissance: new Date("1978-01-30"), telephone: "514-222-0006", groupeSanguin: "O+", antecedents: "Lombalgie chronique", contactUrgenceNom: "Bergeron Marc", contactUrgenceTel: "514-222-0016", contactUrgenceLien: "époux" },
    { numeroDossier: "DOS-2026-007", nom: "Pelletier", prenom: "Guy", sexe: "M", dateNaissance: new Date("1938-06-22"), telephone: "514-222-0007", groupeSanguin: "inconnu", antecedents: "Insuffisance rénale chronique", contactUrgenceNom: "Pelletier Diane", contactUrgenceTel: "514-222-0017", contactUrgenceLien: "fille" },
  ];
  const patients = [];
  for (const p of patientsData) patients.push(await prisma.patient.create({ data: p }));

  // 7. Admissions (id 1-7)
  const admissionsData = [
    { patientId: patients[0].id, serviceId: services[0].id, litId: lits[0].id, medecinResponsable: "Dr. Beaulieu", dateAdmission: new Date("2026-07-01T09:00:00"), dateSortiePrevue: new Date("2026-07-10"), motifAdmission: "Douleurs thoraciques", diagnosticPrincipal: "Syndrome coronarien aigu", statut: "en_cours" },
    { patientId: patients[1].id, serviceId: services[1].id, litId: lits[4].id, medecinResponsable: "Dr. Lacroix", dateAdmission: new Date("2026-07-03T14:00:00"), dateSortiePrevue: new Date("2026-07-08"), motifAdmission: "Crise asthmatique sévère", diagnosticPrincipal: "Asthme exacerbé", statut: "en_cours" },
    { patientId: patients[2].id, serviceId: services[0].id, litId: lits[2].id, medecinResponsable: "Dr. Beaulieu", dateAdmission: new Date("2026-06-28T11:00:00"), dateSortiePrevue: new Date("2026-07-12"), motifAdmission: "Décompensation cardiaque", diagnosticPrincipal: "Insuffisance cardiaque congestive", statut: "en_cours" },
    { patientId: patients[3].id, serviceId: services[2].id, litId: lits[8].id, medecinResponsable: "Dr. Thibodeau", dateAdmission: new Date("2026-07-05T08:00:00"), dateSortiePrevue: new Date("2026-07-07"), motifAdmission: "Appendicite", diagnosticPrincipal: "Appendicite aiguë", statut: "en_cours" },
    { patientId: patients[4].id, serviceId: services[0].id, litId: lits[3].id, medecinResponsable: "Dr. Beaulieu", dateAdmission: new Date("2026-07-02T16:00:00"), dateSortiePrevue: new Date("2026-07-09"), motifAdmission: "Palpitations cardiaques", diagnosticPrincipal: "Fibrillation auriculaire", statut: "en_cours" },
    { patientId: patients[5].id, serviceId: services[1].id, litId: lits[5].id, medecinResponsable: "Dr. Lacroix", dateAdmission: new Date("2026-07-04T10:00:00"), dateSortiePrevue: new Date("2026-07-08"), motifAdmission: "Lombalgies aiguës post-traumatiques", diagnosticPrincipal: "Hernie discale L4-L5", statut: "en_cours" },
    { patientId: patients[6].id, serviceId: services[4].id, litId: lits[9].id, medecinResponsable: "Dr. Beauregard", dateAdmission: new Date("2026-07-06T07:00:00"), motifAdmission: "Insuffisance rénale aiguë sur IRC", diagnosticPrincipal: "IRA sur IRC stade 5", statut: "en_cours" },
  ];
  const admissions = [];
  for (const a of admissionsData) admissions.push(await prisma.admission.create({ data: a }));

  // 8. Prescriptions (id 1-4, for admissions 1,2,3,5)
  const prescriptionsData = [
    { admissionId: admissions[0].id, medecin: "Dr. Beaulieu", datePrescription: new Date("2026-07-01T10:00:00"), dateFin: new Date("2026-07-10T23:59:59"), statut: "active" },
    { admissionId: admissions[1].id, medecin: "Dr. Lacroix", datePrescription: new Date("2026-07-03T15:00:00"), dateFin: new Date("2026-07-08T23:59:59"), statut: "active" },
    { admissionId: admissions[2].id, medecin: "Dr. Beaulieu", datePrescription: new Date("2026-06-28T12:00:00"), dateFin: new Date("2026-07-12T23:59:59"), statut: "active" },
    { admissionId: admissions[4].id, medecin: "Dr. Beaulieu", datePrescription: new Date("2026-07-02T17:00:00"), dateFin: new Date("2026-07-09T23:59:59"), statut: "active" },
  ];
  const prescriptions = [];
  for (const p of prescriptionsData) prescriptions.push(await prisma.prescription.create({ data: p }));

  // 9. Médicaments prescrits
  const medicamentsData = [
    { prescriptionId: prescriptions[0].id, medicamentNom: "Aspirine", dosage: "100mg", forme: "comprimé", frequence: "1x/jour", voieAdministration: "orale", heurePrise: "08:00", dureeJours: 9 },
    { prescriptionId: prescriptions[0].id, medicamentNom: "Clopidogrel", dosage: "75mg", forme: "comprimé", frequence: "1x/jour", voieAdministration: "orale", heurePrise: "08:00", dureeJours: 9 },
    { prescriptionId: prescriptions[0].id, medicamentNom: "Héparine", dosage: "5000UI", forme: "injection SC", frequence: "toutes les 8h", voieAdministration: "SC", heurePrise: "08:00,16:00,00:00", dureeJours: 9 },
    { prescriptionId: prescriptions[1].id, medicamentNom: "Ventoline", dosage: "2.5mg", forme: "nébulisation", frequence: "4x/jour", voieAdministration: "autre", heurePrise: "08:00,12:00,18:00,22:00", dureeJours: 5 },
    { prescriptionId: prescriptions[1].id, medicamentNom: "Prednisolone", dosage: "40mg", forme: "comprimé", frequence: "1x/jour", voieAdministration: "orale", heurePrise: "08:00", dureeJours: 5 },
    { prescriptionId: prescriptions[2].id, medicamentNom: "Furosémide", dosage: "40mg", forme: "comprimé", frequence: "2x/jour", voieAdministration: "orale", heurePrise: "08:00,16:00", dureeJours: 14 },
    { prescriptionId: prescriptions[2].id, medicamentNom: "Ramipril", dosage: "5mg", forme: "comprimé", frequence: "1x/jour", voieAdministration: "orale", heurePrise: "08:00", dureeJours: 14 },
    { prescriptionId: prescriptions[2].id, medicamentNom: "Bisoprolol", dosage: "2.5mg", forme: "comprimé", frequence: "1x/jour", voieAdministration: "orale", heurePrise: "08:00", dureeJours: 14 },
    { prescriptionId: prescriptions[3].id, medicamentNom: "Bisoprolol", dosage: "5mg", forme: "comprimé", frequence: "1x/jour", voieAdministration: "orale", heurePrise: "08:00", dureeJours: 7 },
    { prescriptionId: prescriptions[3].id, medicamentNom: "Warfarine", dosage: "5mg", forme: "comprimé", frequence: "1x/jour", voieAdministration: "orale", heurePrise: "18:00", dureeJours: 7 },
  ];
  const medicaments = [];
  for (const m of medicamentsData) medicaments.push(await prisma.prescriptionMedicament.create({ data: m }));

  // 10. Constantes vitales
  const constantesData = [
    { admissionId: admissions[0].id, infirmierId: infirmiers[1].id, dateMesure: new Date("2026-07-07T07:30:00"), tensionSystolique: 135, tensionDiastolique: 85, frequenceCardiaque: 78, frequenceRespiratoire: 16, temperature: 36.8, saturationO2: 98.2, poids: 80.5 },
    { admissionId: admissions[1].id, infirmierId: infirmiers[2].id, dateMesure: new Date("2026-07-07T07:45:00"), tensionSystolique: 120, tensionDiastolique: 75, frequenceCardiaque: 95, frequenceRespiratoire: 22, temperature: 37.1, saturationO2: 94.5, poids: 65.0 },
    { admissionId: admissions[2].id, infirmierId: infirmiers[0].id, dateMesure: new Date("2026-07-07T08:00:00"), tensionSystolique: 140, tensionDiastolique: 90, frequenceCardiaque: 88, frequenceRespiratoire: 18, temperature: 36.9, saturationO2: 96.0, poids: 92.3 },
    { admissionId: admissions[3].id, infirmierId: infirmiers[3].id, dateMesure: new Date("2026-07-07T08:15:00"), tensionSystolique: 118, tensionDiastolique: 72, frequenceCardiaque: 82, frequenceRespiratoire: 17, temperature: 37.5, saturationO2: 99.0, poids: 58.0 },
    { admissionId: admissions[4].id, infirmierId: infirmiers[1].id, dateMesure: new Date("2026-07-07T08:30:00"), tensionSystolique: 130, tensionDiastolique: 88, frequenceCardiaque: 110, frequenceRespiratoire: 20, temperature: 36.7, saturationO2: 97.5, poids: 75.0 },
    { admissionId: admissions[5].id, infirmierId: infirmiers[2].id, dateMesure: new Date("2026-07-07T08:45:00"), tensionSystolique: 125, tensionDiastolique: 78, frequenceCardiaque: 72, frequenceRespiratoire: 15, temperature: 36.5, saturationO2: 99.1, poids: 70.2 },
    { admissionId: admissions[6].id, infirmierId: infirmiers[4].id, dateMesure: new Date("2026-07-07T09:00:00"), tensionSystolique: 155, tensionDiastolique: 95, frequenceCardiaque: 92, frequenceRespiratoire: 18, temperature: 37.3, saturationO2: 95.8, poids: 85.1 },
  ];
  for (const c of constantesData) await prisma.constanteVitale.create({ data: c });

  // 11. Tournées (id 1-5)
  const tourneesData = [
    { serviceId: services[0].id, infirmierId: infirmiers[1].id, dateTournee: new Date("2026-07-07"), heureDebut: "07:00", quart: "matin", statut: "en_cours" },
    { serviceId: services[1].id, infirmierId: infirmiers[2].id, dateTournee: new Date("2026-07-07"), heureDebut: "07:00", quart: "matin", statut: "en_cours" },
    { serviceId: services[2].id, infirmierId: infirmiers[3].id, dateTournee: new Date("2026-07-07"), heureDebut: "07:00", quart: "matin", statut: "en_cours" },
    { serviceId: services[4].id, infirmierId: infirmiers[4].id, dateTournee: new Date("2026-07-07"), heureDebut: "07:00", quart: "matin", statut: "en_cours" },
    { serviceId: services[0].id, infirmierId: infirmiers[0].id, dateTournee: new Date("2026-07-07"), heureDebut: "15:00", quart: "apres_midi", statut: "planifiee" },
  ];
  const tournees = [];
  for (const t of tourneesData) tournees.push(await prisma.tournee.create({ data: t }));

  // 12. Patients dans les tournées (id 1-7)
  const tourneePatientsData = [
    { tourneeId: tournees[0].id, admissionId: admissions[0].id, ordreVisite: 1, statutVisite: "visite" },
    { tourneeId: tournees[0].id, admissionId: admissions[2].id, ordreVisite: 2, statutVisite: "en_attente" },
    { tourneeId: tournees[0].id, admissionId: admissions[4].id, ordreVisite: 3, statutVisite: "en_attente" },
    { tourneeId: tournees[1].id, admissionId: admissions[1].id, ordreVisite: 1, statutVisite: "visite" },
    { tourneeId: tournees[1].id, admissionId: admissions[5].id, ordreVisite: 2, statutVisite: "en_attente" },
    { tourneeId: tournees[2].id, admissionId: admissions[3].id, ordreVisite: 1, statutVisite: "en_attente" },
    { tourneeId: tournees[3].id, admissionId: admissions[6].id, ordreVisite: 1, statutVisite: "en_attente" },
  ];
  const tourneePatients = [];
  for (const tp of tourneePatientsData) tourneePatients.push(await prisma.tourneePatient.create({ data: tp }));

  // 13. Soins réalisés
  const soinsData = [
    { tourneePatientId: tourneePatients[0].id, infirmierId: infirmiers[1].id, typeSoin: "Administration Aspirine 100mg", categorie: "medicament", heureRealisation: new Date("2026-07-07T08:10:00"), realise: true, observations: "Patient a pris le médicament sans difficulté", prescriptionMedicamentId: medicaments[0].id },
    { tourneePatientId: tourneePatients[0].id, infirmierId: infirmiers[1].id, typeSoin: "Administration Clopidogrel 75mg", categorie: "medicament", heureRealisation: new Date("2026-07-07T08:12:00"), realise: true, observations: "RAS", prescriptionMedicamentId: medicaments[1].id },
    { tourneePatientId: tourneePatients[0].id, infirmierId: infirmiers[1].id, typeSoin: "Injection Héparine 5000UI SC", categorie: "injection", heureRealisation: new Date("2026-07-07T08:15:00"), realise: true, observations: "Injection flanc gauche, site propre", prescriptionMedicamentId: medicaments[2].id },
    { tourneePatientId: tourneePatients[0].id, infirmierId: infirmiers[1].id, typeSoin: "Prise de constantes vitales", categorie: "mesure_vitale", heureRealisation: new Date("2026-07-07T07:30:00"), realise: true, observations: "TA stable, FC normale" },
    { tourneePatientId: tourneePatients[3].id, infirmierId: infirmiers[2].id, typeSoin: "Administration Ventoline", categorie: "medicament", heureRealisation: new Date("2026-07-07T08:20:00"), realise: true, observations: "Nébulisation administrée, tolérance correcte", prescriptionMedicamentId: medicaments[3].id },
    { tourneePatientId: tourneePatients[3].id, infirmierId: infirmiers[2].id, typeSoin: "Prise de constantes vitales", categorie: "mesure_vitale", heureRealisation: new Date("2026-07-07T07:45:00"), realise: true, observations: "SpO2 à 94.5%, légère désaturation surveillée" },
    { tourneePatientId: tourneePatients[1].id, infirmierId: infirmiers[1].id, typeSoin: "Prise de constantes vitales", categorie: "mesure_vitale", heureRealisation: new Date("2026-07-07T12:00:00"), realise: false },
    { tourneePatientId: tourneePatients[2].id, infirmierId: infirmiers[1].id, typeSoin: "Administration Bisoprolol", categorie: "medicament", heureRealisation: new Date("2026-07-07T08:00:00"), realise: false },
    { tourneePatientId: tourneePatients[5].id, infirmierId: infirmiers[4].id, typeSoin: "Prise de constantes vitales", categorie: "mesure_vitale", heureRealisation: new Date("2026-07-07T09:15:00"), realise: false },
  ];
  for (const s of soinsData) await prisma.soin.create({ data: s });

  // 14. Transmissions
  const transmissionsData = [
    { admissionId: admissions[0].id, infirmierId: infirmiers[1].id, quart: "matin", contenu: "Patient M. Martin stable ce matin. TA 135/85, FC 78. A bien pris ses médicaments. Se plaint de légères douleurs thoraciques (EVA 3/10). ECG à planifier cet après-midi.", priorite: "normale" },
    { admissionId: admissions[1].id, infirmierId: infirmiers[2].id, quart: "matin", contenu: "Mme Simard: épisode de toux productive ce matin. SpO2 descendue à 93%, remontée à 94.5% après nébulisation. Médecin prévenu. Surveillance rapprochée recommandée.", priorite: "importante" },
    { admissionId: admissions[6].id, infirmierId: infirmiers[4].id, quart: "matin", contenu: "M. Pelletier en soins intensifs: diurèse très faible (50ml/4h). Potassium à 5.8 mEq/L. Dr. Beauregard informé. Dialyse en attente de décision médicale. PATIENT À SURVEILLER.", priorite: "urgente" },
  ];
  for (const t of transmissionsData) await prisma.transmission.create({ data: t });

  // 15. Alertes
  const alertesData = [
    { admissionId: admissions[1].id, infirmierId: infirmiers[2].id, typeAlerte: "constante_anormale", message: "SpO2 de Mme Simard (CH.201-A) est à 93% — sous le seuil d'alerte de 95%. Surveillance recommandée.", priorite: "haute", statut: "lue" },
    { admissionId: admissions[6].id, infirmierId: infirmiers[4].id, typeAlerte: "urgence", message: "M. Pelletier (SI-01): Kaliémie critique 5.8 mEq/L — risque d'hyperkaliémie. Médecin notifié.", priorite: "critique", statut: "non_lue" },
    { admissionId: admissions[0].id, infirmierId: infirmiers[1].id, typeAlerte: "soin_en_retard", message: "Prise de constantes pour M. Martin (CH.301-A) prévue à 12h00 non encore effectuée.", priorite: "normale", statut: "non_lue" },
  ];
  for (const a of alertesData) await prisma.alerte.create({ data: a });

  await seedContent(passwordHash);

  console.log("Seed terminé.");
  console.log(`Connexion démo hôpital -> utilisateur: stremblay / mot de passe: ${DEMO_PASSWORD}`);
  console.log(`Connexion démo IDEL -> email: sophie.durand@idel.fr / mot de passe: ${DEMO_PASSWORD}`);
}

async function seedContent(passwordHash) {
  console.log("Seeding contenu SOINELY (hubs, fiches, missions, daily)...");

  const hubsData = [
    { slug: "diabete", nom: "Diabète", icone: "Droplet", description: "Glycémie, insuline, hypoglycémie et hyperglycémie au domicile." },
    { slug: "plaies-et-cicatrisation", nom: "Plaies et cicatrisation", icone: "Cross", description: "Évaluation, pansements et suivi de cicatrisation." },
    { slug: "perfusions", nom: "Perfusions", icone: "Droplets", description: "Pose, surveillance et complications des perfusions à domicile." },
    { slug: "picc-line-midline-pac", nom: "PICC Line / Midline / PAC", icone: "Cable", description: "Entretien et surveillance des dispositifs veineux de longue durée." },
    { slug: "sonde-urinaire", nom: "Sonde urinaire", icone: "TestTube", description: "Pose, entretien et gestion des incidents de sondage urinaire." },
    { slug: "gastrostomie-jejunostomie", nom: "Gastrostomie / Jéjunostomie", icone: "Utensils", description: "Nutrition entérale et soins de stomie digestive." },
    { slug: "stomies", nom: "Stomies", icone: "CircleDot", description: "Appareillage et surveillance des stomies digestives et urinaires." },
    { slug: "urgences", nom: "Urgences", icone: "Siren", description: "Conduites à tenir face aux situations d'urgence à domicile." },
    { slug: "soins-palliatifs", nom: "Soins palliatifs", icone: "HeartHandshake", description: "Confort, accompagnement et soutien en fin de vie." },
    { slug: "ngap", nom: "NGAP", icone: "FileText", description: "Nomenclature des actes infirmiers et cotation au quotidien." },
    { slug: "bsi", nom: "BSI", icone: "ShieldCheck", description: "Bilan de soins infirmiers et démarche de prise en charge." },
    { slug: "prelevements", nom: "Prélèvements", icone: "TestTubes", description: "Prélèvements sanguins et biologiques à domicile." },
    { slug: "medicaments-injectables", nom: "Médicaments injectables", icone: "Syringe", description: "Injections SC, IM et IV en toute sécurité." },
    { slug: "anticoagulants", nom: "Anticoagulants", icone: "Waves", description: "Surveillance des traitements anticoagulants et de leurs risques." },
    { slug: "retour-hospitalisation", nom: "Retour d'hospitalisation", icone: "Home", description: "Sécuriser la première visite après une sortie d'hôpital." },
    { slug: "hygiene-et-prevention", nom: "Hygiène et prévention", icone: "SprayCan", description: "Précautions standard et prévention des infections associées aux soins." },
    { slug: "education-therapeutique", nom: "Éducation thérapeutique", icone: "GraduationCap", description: "Accompagner le patient et son entourage dans l'autonomie." },
    { slug: "gestion-du-cabinet-idel", nom: "Gestion du cabinet IDEL", icone: "Briefcase", description: "Organisation, tournées et gestion administrative du cabinet." },
    { slug: "documents-professionnels", nom: "Documents professionnels", icone: "FileStack", description: "Modèles de documents et courriers types pour la pratique." },
    { slug: "calculateurs-et-echelles", nom: "Calculateurs et échelles", icone: "Calculator", description: "Échelles de score et calculs utiles au quotidien." },
  ];

  const hubs = {};
  for (let i = 0; i < hubsData.length; i++) {
    const h = await prisma.hub.create({ data: { ...hubsData[i], ordre: i + 1 } });
    hubs[h.slug] = h;
  }

  const fichesData = {
    diabete: [
      { titre: "Reconnaître et gérer une hypoglycémie", resume: "Repérer les signes d'alerte et la conduite à tenir en cas de glycémie basse.", tags: "hypoglycémie,glycémie,urgence" },
      { titre: "Technique d'injection d'insuline", resume: "Sites d'injection, rotation et bonnes pratiques pour limiter la lipodystrophie.", tags: "insuline,injection,technique" },
    ],
    "plaies-et-cicatrisation": [
      { titre: "Évaluer une plaie chronique", resume: "Grille d'observation : aspect, exsudat, contour et évolution de la plaie.", tags: "plaie,escarre,évaluation" },
      { titre: "Choisir un pansement selon le stade de la plaie", resume: "Repères pour orienter le choix du type de pansement au bon moment.", tags: "pansement,cicatrisation" },
    ],
    perfusions: [
      { titre: "Surveillance d'une perfusion à domicile", resume: "Points de contrôle réguliers pour sécuriser une perfusion en ambulatoire.", tags: "perfusion,surveillance" },
      { titre: "Repérer une complication au point de ponction", resume: "Signes d'alerte locaux à surveiller à chaque passage.", tags: "perfusion,complication" },
    ],
    "picc-line-midline-pac": [
      { titre: "Entretien d'un PICC Line entre deux passages", resume: "Gestes d'entretien et fréquence de rinçage recommandée.", tags: "picc,voie veineuse" },
      { titre: "Signes d'alerte autour d'un PAC", resume: "Ce qui doit faire suspecter une complication sur chambre implantable.", tags: "pac,chambre implantable" },
    ],
    "sonde-urinaire": [
      { titre: "Entretien quotidien d'une sonde urinaire", resume: "Gestes d'hygiène et de surveillance à réaliser à chaque visite.", tags: "sonde urinaire,hygiène" },
      { titre: "Conduite à tenir devant une sonde bouchée", resume: "Étapes à suivre face à un arrêt du drainage urinaire.", tags: "sonde urinaire,incident" },
    ],
    "gastrostomie-jejunostomie": [
      { titre: "Surveillance du site de gastrostomie", resume: "Points d'observation cutanée autour de l'orifice de stomie.", tags: "gastrostomie,nutrition entérale" },
      { titre: "Bonnes pratiques d'administration de la nutrition entérale", resume: "Repères de position, débit et rinçage de la sonde.", tags: "nutrition entérale,jéjunostomie" },
    ],
    stomies: [
      { titre: "Changer un appareillage de stomie", resume: "Étapes clés pour un changement de poche propre et confortable.", tags: "stomie,appareillage" },
      { titre: "Prévenir les irritations péristomiales", resume: "Facteurs de risque et gestes de prévention autour de la stomie.", tags: "stomie,peau" },
    ],
    urgences: [
      { titre: "Conduite à tenir face à une chute à domicile", resume: "Évaluation initiale et décision d'orientation après une chute.", tags: "chute,urgence" },
      { titre: "Repérer les signes d'une détresse respiratoire", resume: "Signes cliniques devant alerter et premiers réflexes à avoir.", tags: "urgence,respiration" },
    ],
    "soins-palliatifs": [
      { titre: "Évaluer la douleur en soins palliatifs", resume: "Utiliser une échelle simple pour objectiver la douleur du patient.", tags: "douleur,palliatif" },
      { titre: "Accompagner la famille en fin de vie", resume: "Repères de communication et de soutien pour l'entourage.", tags: "accompagnement,famille" },
    ],
    ngap: [
      { titre: "Comprendre la cotation d'une séance de soins", resume: "Principes de base pour coter une prise en charge courante.", tags: "ngap,cotation" },
      { titre: "Bien renseigner une démarche de soins infirmiers", resume: "Éléments attendus dans une DSI pour une prise en charge complexe.", tags: "ngap,dsi" },
    ],
    bsi: [
      { titre: "Structurer un bilan de soins infirmiers", resume: "Trame pour organiser un BSI clair et complet.", tags: "bsi,évaluation" },
      { titre: "Réévaluer un BSI dans le temps", resume: "Quand et comment ajuster un bilan de soins déjà posé.", tags: "bsi,suivi" },
    ],
    prelevements: [
      { titre: "Bonnes pratiques du prélèvement veineux", resume: "Repères d'installation et de sécurité pour un prélèvement sanguin.", tags: "prélèvement,prise de sang" },
      { titre: "Gérer un prélèvement à jeun ou sous traitement", resume: "Points de vigilance selon le contexte du patient.", tags: "prélèvement,préanalytique" },
    ],
    "medicaments-injectables": [
      { titre: "Réaliser une injection sous-cutanée", resume: "Sites, angle d'injection et rotation pour une injection SC.", tags: "injection,sous-cutané" },
      { titre: "Réaliser une injection intramusculaire", resume: "Repères anatomiques et précautions pour une injection IM.", tags: "injection,intramusculaire" },
    ],
    anticoagulants: [
      { titre: "Surveiller un patient sous anticoagulant", resume: "Signes évocateurs d'un surdosage ou d'un saignement à repérer.", tags: "anticoagulant,surveillance" },
      { titre: "Éducation du patient sous anticoagulant oral", resume: "Messages clés à transmettre pour sécuriser le traitement au quotidien.", tags: "anticoagulant,éducation" },
    ],
    "retour-hospitalisation": [
      { titre: "Préparer la première visite après une sortie d'hôpital", resume: "Check-list pour sécuriser la reprise en charge à domicile.", tags: "sortie hôpital,check-list" },
      { titre: "Repérer les traitements à risque après une hospitalisation", resume: "Points de vigilance sur l'ordonnance de sortie.", tags: "sortie hôpital,traitement" },
    ],
    "hygiene-et-prevention": [
      { titre: "Précautions standard à domicile", resume: "Gestes de base à appliquer à chaque intervention.", tags: "hygiène,précautions standard" },
      { titre: "Prévenir la transmission croisée entre patients", resume: "Bonnes pratiques de matériel et d'hygiène des mains en tournée.", tags: "hygiène,prévention" },
    ],
    "education-therapeutique": [
      { titre: "Structurer un temps d'éducation thérapeutique", resume: "Repères pour construire un échange pédagogique efficace.", tags: "éducation thérapeutique,autonomie" },
      { titre: "Évaluer l'autonomie d'un patient dans son traitement", resume: "Signaux à observer pour ajuster l'accompagnement.", tags: "autonomie,observance" },
    ],
    "gestion-du-cabinet-idel": [
      { titre: "Organiser sa tournée efficacement", resume: "Principes d'optimisation d'un parcours de tournée quotidien.", tags: "tournée,organisation" },
      { titre: "Gérer le matériel et les stocks du cabinet", resume: "Bonnes pratiques de suivi du matériel consommable.", tags: "cabinet,matériel" },
    ],
    "documents-professionnels": [
      { titre: "Rédiger une transmission ciblée", resume: "Structurer une transmission claire et utile pour l'équipe.", tags: "transmission,rédaction" },
      { titre: "Modèle de courrier de liaison", resume: "Trame de courrier pour informer le médecin traitant.", tags: "courrier,liaison" },
    ],
    "calculateurs-et-echelles": [
      { titre: "Utiliser l'échelle de Braden", resume: "Comprendre les items de l'échelle de risque d'escarre.", tags: "échelle,braden,escarre" },
      { titre: "Calculer un débit de perfusion", resume: "Méthode de calcul simple d'un débit en gouttes par minute.", tags: "calcul,perfusion,débit" },
    ],
  };

  // Miroir de lib/priorite.ts#inferPriorite — volontairement limité à titre/résumé/tags
  // (pas contenu, qui partage un texte de sécurité générique sur toutes les fiches).
  const inferPrioriteSeed = (titre, resume, tags) => {
    const t = `${titre} ${resume} ${tags}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
    if (/(urgence|urgent|detresse|arret|choc|hemorragie)/.test(t)) return "urgente";
    if (/(risque|attention|vigilance|surveiller|complication)/.test(t)) return "action";
    if (/(verifier|controler|prudence|contre-indication)/.test(t)) return "vigilance";
    return "information";
  };

  const contenuFallback = (titre) =>
    [
      `Objectif`,
      `Cette fiche pose les repères généraux autour de « ${titre.toLowerCase()} ».`,
      ``,
      `Points clés`,
      `- Observer et évaluer la situation avant tout geste.`,
      `- Respecter les règles d'hygiène et de sécurité habituelles.`,
      `- Tracer l'intervention et transmettre à l'équipe.`,
      ``,
      `Quand alerter`,
      `- En cas de doute ou de signe inhabituel, contacter le médecin traitant.`,
      `- En cas de signe de gravité, orienter vers une prise en charge urgente.`,
    ].join("\n");

  const ficheBySlug = {};
  for (const [hubSlug, list] of Object.entries(fichesData)) {
    const hub = hubs[hubSlug];
    for (const f of list) {
      const slug = slugify(f.titre);
      const fiche = await prisma.fiche.create({
        data: {
          hubId: hub.id,
          slug,
          titre: f.titre,
          resume: f.resume,
          contenu: FICHES_CONTENU[`${hubSlug}/${slug}`] || contenuFallback(f.titre),
          tags: f.tags,
          priorite: inferPrioriteSeed(f.titre, f.resume, f.tags),
          // Contenu d'exemple non relu par un professionnel de santé : jamais "valide" par défaut.
          statut: "en_revision",
          dureeLecture: 3,
        },
      });
      ficheBySlug[`${hubSlug}/${slug}`] = fiche;
    }
  }

  const missionsData = [
    { slug: "faire-des-pansements", titre: "Faire des pansements", icone: "Cross", description: "Tout pour réaliser des pansements sûrs et adaptés.", hub: "plaies-et-cicatrisation" },
    { slug: "faire-des-injections", titre: "Faire des injections", icone: "Syringe", description: "Les bons gestes pour les injections du quotidien.", hub: "medicaments-injectables" },
    { slug: "gerer-le-diabete", titre: "Gérer le diabète", icone: "Droplet", description: "Glycémie, insuline et situations à risque.", hub: "diabete" },
    { slug: "poser-des-perfusions", titre: "Poser des perfusions", icone: "Droplets", description: "Sécuriser la pose et la surveillance des perfusions.", hub: "perfusions" },
    { slug: "faire-des-retours-hospitalisation", titre: "Faire des retours d'hospitalisation", icone: "Home", description: "Bien préparer la reprise en charge après une sortie d'hôpital.", hub: "retour-hospitalisation" },
    { slug: "accompagner-soins-palliatifs", titre: "Accompagner des soins palliatifs", icone: "HeartHandshake", description: "Confort du patient et soutien de l'entourage.", hub: "soins-palliatifs" },
  ];

  for (let i = 0; i < missionsData.length; i++) {
    const m = missionsData[i];
    const mission = await prisma.mission.create({
      data: { slug: m.slug, titre: m.titre, description: m.description, icone: m.icone, ordre: i + 1 },
    });
    const relatedFiches = fichesData[m.hub].map((f) => ficheBySlug[`${m.hub}/${slugify(f.titre)}`]);
    for (let j = 0; j < relatedFiches.length; j++) {
      await prisma.missionFiche.create({
        data: { missionId: mission.id, ficheId: relatedFiches[j].id, ordre: j + 1 },
      });
    }
  }

  const dailyTipsData = [
    { type: "recommandation", titre: "Vérifiez toujours la date de péremption", contenu: "Avant toute injection, vérifiez systématiquement la date de péremption et l'intégrité de l'emballage.", ficheKey: "medicaments-injectables/realiser-une-injection-sous-cutanee" },
    { type: "le_saviez_vous", titre: "Le saviez-vous ?", contenu: "L'échelle de Braden évalue 6 dimensions pour estimer le risque d'escarre d'un patient alité." , ficheKey: "calculateurs-et-echelles/utiliser-l-echelle-de-braden"},
    { type: "recommandation", titre: "Rotation des sites d'injection", contenu: "Alterner les sites d'injection d'insuline limite le risque de lipodystrophie à long terme.", ficheKey: "diabete/technique-d-injection-d-insuline" },
    { type: "le_saviez_vous", titre: "Le saviez-vous ?", contenu: "Une plaie chronique doit être réévaluée à intervalles réguliers pour ajuster le pansement utilisé.", ficheKey: "plaies-et-cicatrisation/evaluer-une-plaie-chronique" },
    { type: "recommandation", titre: "Tracez chaque intervention", contenu: "Une transmission ciblée, claire et datée facilite la continuité des soins entre collègues.", ficheKey: "documents-professionnels/rediger-une-transmission-ciblee" },
    { type: "le_saviez_vous", titre: "Le saviez-vous ?", contenu: "La première visite après une sortie d'hôpital est le moment clé pour repérer les erreurs de traitement.", ficheKey: "retour-hospitalisation/preparer-la-premiere-visite-apres-une-sortie-d-hopital" },
    { type: "recommandation", titre: "Hygiène des mains entre deux patients", contenu: "La friction hydro-alcoolique avant et après chaque patient reste le geste le plus efficace contre la transmission croisée.", ficheKey: "hygiene-et-prevention/precautions-standard-a-domicile" },
    { type: "le_saviez_vous", titre: "Le saviez-vous ?", contenu: "Une kaliémie ou un débit de diurèse anormal doivent toujours être signalés rapidement au médecin traitant.", ficheKey: "urgences/reperer-les-signes-d-une-detresse-respiratoire" },
  ];

  for (let i = 0; i < dailyTipsData.length; i++) {
    const t = dailyTipsData[i];
    const fiche = ficheBySlug[t.ficheKey];
    await prisma.dailyTip.create({
      data: {
        type: t.type,
        titre: t.titre,
        contenu: t.contenu,
        ficheId: fiche ? fiche.id : null,
        ordre: i + 1,
      },
    });
  }

  const cabinet = await prisma.cabinet.create({
    data: { nom: "Cabinet Durand & Associés", codeInvitation: "IDEL-DEMO" },
  });

  await prisma.idelUser.create({
    data: {
      email: "sophie.durand@idel.fr",
      passwordHash,
      nom: "Durand",
      prenom: "Sophie",
      cabinetId: cabinet.id,
      cabinetRole: "proprietaire",
    },
  });

  const diabeteFiche = ficheBySlug["diabete/reconnaitre-et-gerer-une-hypoglycemie"];
  if (diabeteFiche) {
    await prisma.cabinetFiche.create({ data: { cabinetId: cabinet.id, ficheId: diabeteFiche.id } });
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
