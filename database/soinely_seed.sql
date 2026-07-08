-- ============================================================
--  SOINELY — Données de test (Seed)
--  À utiliser après l'exécution de soinely_schema.sql
-- ============================================================

USE soinely;

-- 1. Établissement
INSERT INTO etablissement (nom, adresse, telephone, email) VALUES
('Hôpital Général de Montréal', '1001 Rue Saint-Denis, Montréal, QC H2X 3H9', '514-890-8000', 'contact@hgm.qc.ca');

-- 2. Services
INSERT INTO service (etablissement_id, nom, code, etage, aile) VALUES
(1, 'Cardiologie',          'CARD-01', 3, 'Nord'),
(1, 'Médecine Interne',     'MED-01',  2, 'Est'),
(1, 'Chirurgie',            'CHIR-01', 4, 'Ouest'),
(1, 'Pédiatrie',            'PED-01',  1, 'Sud'),
(1, 'Soins Intensifs',      'SI-01',   2, 'Centre');

-- 3. Chambres
INSERT INTO chambre (service_id, numero, nombre_lits, type) VALUES
(1, '301', 2, 'double'),
(1, '302', 1, 'simple'),
(1, '303', 1, 'isolation'),
(2, '201', 2, 'double'),
(2, '202', 2, 'double'),
(3, '401', 1, 'simple'),
(5, 'SI-01', 1, 'soins_intensifs'),
(5, 'SI-02', 1, 'soins_intensifs');

-- 4. Lits
INSERT INTO lit (chambre_id, numero_lit, statut) VALUES
(1, 'A', 'occupé'),
(1, 'B', 'libre'),
(2, 'A', 'occupé'),
(3, 'A', 'occupé'),
(4, 'A', 'occupé'),
(4, 'B', 'occupé'),
(5, 'A', 'libre'),
(5, 'B', 'nettoyage'),
(6, 'A', 'occupé'),
(7, 'A', 'occupé'),
(8, 'A', 'libre');

-- 5. Infirmiers
INSERT INTO infirmier (matricule, nom, prenom, sexe, date_naissance, email, telephone, specialite, grade, service_id, date_embauche) VALUES
('INF-001', 'Tremblay',  'Sophie',   'F', '1990-03-15', 'sophie.tremblay@hgm.qc.ca',  '514-111-0001', 'Cardiologie',     'chef_equipe',    1, '2015-06-01'),
('INF-002', 'Bouchard',  'Marie',    'F', '1988-07-22', 'marie.bouchard@hgm.qc.ca',   '514-111-0002', 'Cardiologie',     'infirmier',      1, '2018-09-10'),
('INF-003', 'Gagnon',    'Pierre',   'M', '1985-11-08', 'pierre.gagnon@hgm.qc.ca',    '514-111-0003', 'Médecine Interne','infirmier_senior',2, '2012-03-20'),
('INF-004', 'Roy',       'Julie',    'F', '1995-02-14', 'julie.roy@hgm.qc.ca',        '514-111-0004', 'Chirurgie',       'infirmier',      3, '2020-01-15'),
('INF-005', 'Lavoie',    'Chantal',  'F', '1982-09-30', 'chantal.lavoie@hgm.qc.ca',   '514-111-0005', 'Soins Intensifs', 'infirmier_senior',5, '2008-11-05'),
('INF-006', 'Côté',      'Alexandre','M', '1992-06-18', 'alexandre.cote@hgm.qc.ca',   '514-111-0006', 'Médecine Interne','infirmier',      2, '2019-04-12');

-- 6. Utilisateurs
INSERT INTO utilisateur (infirmier_id, username, password_hash, role) VALUES
(1, 'stremblay', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oW3eLQ7q2', 'chef_equipe'),
(2, 'mbouchard', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oW3eLQ7q2', 'infirmier'),
(3, 'pgagnon',   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oW3eLQ7q2', 'infirmier'),
(4, 'jroy',      '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oW3eLQ7q2', 'infirmier'),
(5, 'clavoie',   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oW3eLQ7q2', 'infirmier'),
(6, 'acote',     '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oW3eLQ7q2', 'infirmier');

-- 7. Patients
INSERT INTO patient (numero_dossier, nom, prenom, sexe, date_naissance, telephone, groupe_sanguin, allergies, antecedents, contact_urgence_nom, contact_urgence_tel, contact_urgence_lien) VALUES
('DOS-2026-001', 'Martin',    'Jean',     'M', '1955-04-10', '514-222-0001', 'A+',      'Pénicilline',          'Hypertension, Diabète type 2',     'Martin Sylvie',    '514-222-0011', 'épouse'),
('DOS-2026-002', 'Simard',    'Claire',   'F', '1968-12-05', '514-222-0002', 'O-',      NULL,                   'Asthme',                           'Simard Paul',      '514-222-0012', 'époux'),
('DOS-2026-003', 'Leblanc',   'Robert',   'M', '1942-08-18', '514-222-0003', 'B+',      'Aspirine, Ibuprofène', 'Insuffisance cardiaque, BPCO',     'Leblanc Monique',  '514-222-0013', 'épouse'),
('DOS-2026-004', 'Fortin',    'Amélie',   'F', '1985-03-25', '514-222-0004', 'AB+',     NULL,                   NULL,                               'Fortin Luc',       '514-222-0014', 'époux'),
('DOS-2026-005', 'Girard',    'Michel',   'M', '1950-09-14', '514-222-0005', 'A-',      'Sulfamides',           'HTA, Fibrillation auriculaire',    'Girard Anne',      '514-222-0015', 'épouse'),
('DOS-2026-006', 'Bergeron',  'Isabelle', 'F', '1978-01-30', '514-222-0006', 'O+',      NULL,                   'Lombalgie chronique',              'Bergeron Marc',    '514-222-0016', 'époux'),
('DOS-2026-007', 'Pelletier', 'Guy',      'M', '1938-06-22', '514-222-0007', 'inconnu', NULL,                   'Insuffisance rénale chronique',    'Pelletier Diane',  '514-222-0017', 'fille');

-- 8. Admissions
INSERT INTO admission (patient_id, service_id, lit_id, medecin_responsable, date_admission, date_sortie_prevue, motif_admission, diagnostic_principal, statut) VALUES
(1, 1, 1,  'Dr. Beaulieu',   '2026-07-01 09:00:00', '2026-07-10', 'Douleurs thoraciques',             'Syndrome coronarien aigu',             'en_cours'),
(2, 2, 5,  'Dr. Lacroix',    '2026-07-03 14:00:00', '2026-07-08', 'Crise asthmatique sévère',         'Asthme exacerbé',                      'en_cours'),
(3, 1, 3,  'Dr. Beaulieu',   '2026-06-28 11:00:00', '2026-07-12', 'Décompensation cardiaque',         'Insuffisance cardiaque congestive',     'en_cours'),
(4, 3, 9,  'Dr. Thibodeau',  '2026-07-05 08:00:00', '2026-07-07', 'Appendicite',                      'Appendicite aiguë',                    'en_cours'),
(5, 1, 4,  'Dr. Beaulieu',   '2026-07-02 16:00:00', '2026-07-09', 'Palpitations cardiaques',          'Fibrillation auriculaire',             'en_cours'),
(6, 2, 6,  'Dr. Lacroix',    '2026-07-04 10:00:00', '2026-07-08', 'Lombalgies aiguës post-traumatiques', 'Hernie discale L4-L5',              'en_cours'),
(7, 5, 10, 'Dr. Beauregard', '2026-07-06 07:00:00', NULL,         'Insuffisance rénale aiguë sur IRC', 'IRA sur IRC stade 5',                 'en_cours');

-- 9. Prescriptions
INSERT INTO prescription (admission_id, medecin, date_prescription, date_fin, statut) VALUES
(1, 'Dr. Beaulieu', '2026-07-01 10:00:00', '2026-07-10 23:59:59', 'active'),
(2, 'Dr. Lacroix',  '2026-07-03 15:00:00', '2026-07-08 23:59:59', 'active'),
(3, 'Dr. Beaulieu', '2026-06-28 12:00:00', '2026-07-12 23:59:59', 'active'),
(5, 'Dr. Beaulieu', '2026-07-02 17:00:00', '2026-07-09 23:59:59', 'active');

-- 10. Médicaments prescrits
INSERT INTO prescription_medicament (prescription_id, medicament_nom, dosage, forme, frequence, voie_administration, heure_prise, duree_jours) VALUES
(1, 'Aspirine',      '100mg',  'comprimé',    '1x/jour',   'orale', '08:00',              9),
(1, 'Clopidogrel',   '75mg',   'comprimé',    '1x/jour',   'orale', '08:00',              9),
(1, 'Héparine',      '5000UI', 'injection SC', 'toutes les 8h', 'SC', '08:00,16:00,00:00', 9),
(2, 'Ventoline',     '2.5mg',  'nébulisation','4x/jour',   'autre', '08:00,12:00,18:00,22:00', 5),
(2, 'Prednisolone',  '40mg',   'comprimé',    '1x/jour',   'orale', '08:00',              5),
(3, 'Furosémide',    '40mg',   'comprimé',    '2x/jour',   'orale', '08:00,16:00',       14),
(3, 'Ramipril',      '5mg',    'comprimé',    '1x/jour',   'orale', '08:00',             14),
(3, 'Bisoprolol',    '2.5mg',  'comprimé',    '1x/jour',   'orale', '08:00',             14),
(4, 'Bisoprolol',    '5mg',    'comprimé',    '1x/jour',   'orale', '08:00',              7),
(4, 'Warfarine',     '5mg',    'comprimé',    '1x/jour',   'orale', '18:00',              7);

-- 11. Constantes vitales
INSERT INTO constante_vitale (admission_id, infirmier_id, date_mesure, tension_systolique, tension_diastolique, frequence_cardiaque, frequence_respiratoire, temperature, saturation_o2, poids) VALUES
(1, 2, '2026-07-07 07:30:00', 135, 85,  78, 16, 36.8, 98.2, 80.5),
(2, 3, '2026-07-07 07:45:00', 120, 75,  95, 22, 37.1, 94.5, 65.0),
(3, 1, '2026-07-07 08:00:00', 140, 90,  88, 18, 36.9, 96.0, 92.3),
(4, 4, '2026-07-07 08:15:00', 118, 72,  82, 17, 37.5, 99.0, 58.0),
(5, 2, '2026-07-07 08:30:00', 130, 88, 110, 20, 36.7, 97.5, 75.0),
(6, 3, '2026-07-07 08:45:00', 125, 78,  72, 15, 36.5, 99.1, 70.2),
(7, 5, '2026-07-07 09:00:00', 155, 95,  92, 18, 37.3, 95.8, 85.1);

-- 12. Tournées
INSERT INTO tournee (service_id, infirmier_id, date_tournee, heure_debut, quart, statut) VALUES
(1, 2, '2026-07-07', '07:00:00', 'matin',      'en_cours'),
(2, 3, '2026-07-07', '07:00:00', 'matin',      'en_cours'),
(3, 4, '2026-07-07', '07:00:00', 'matin',      'en_cours'),
(5, 5, '2026-07-07', '07:00:00', 'matin',      'en_cours'),
(1, 1, '2026-07-07', '15:00:00', 'apres_midi', 'planifiee');

-- 13. Patients dans les tournées
INSERT INTO tournee_patient (tournee_id, admission_id, ordre_visite, statut_visite) VALUES
(1, 1, 1, 'visite'),
(1, 3, 2, 'en_attente'),
(1, 5, 3, 'en_attente'),
(2, 2, 1, 'visite'),
(2, 6, 2, 'en_attente'),
(3, 4, 1, 'en_attente'),
(4, 7, 1, 'en_attente');

-- 14. Soins réalisés
INSERT INTO soin (tournee_patient_id, infirmier_id, type_soin, categorie, heure_realisation, realise, observations, prescription_medicament_id) VALUES
(1, 2, 'Administration Aspirine 100mg',    'medicament',    '2026-07-07 08:10:00', TRUE,  'Patient a pris le médicament sans difficulté', 1),
(1, 2, 'Administration Clopidogrel 75mg',  'medicament',    '2026-07-07 08:12:00', TRUE,  'RAS',                                          2),
(1, 2, 'Injection Héparine 5000UI SC',     'injection',     '2026-07-07 08:15:00', TRUE,  'Injection flanc gauche, site propre',          3),
(1, 2, 'Prise de constantes vitales',      'mesure_vitale', '2026-07-07 07:30:00', TRUE,  'TA stable, FC normale',                        NULL),
(4, 3, 'Administration Ventoline',         'medicament',    '2026-07-07 08:20:00', TRUE,  'Nébulisation administrée, tolérance correcte', 4),
(4, 3, 'Prise de constantes vitales',      'mesure_vitale', '2026-07-07 07:45:00', TRUE,  'SpO2 à 94.5%, légère désaturation surveillée', NULL);

-- 15. Transmissions
INSERT INTO transmission (admission_id, infirmier_id, quart, contenu, priorite) VALUES
(1, 2, 'matin', 'Patient M. Martin stable ce matin. TA 135/85, FC 78. A bien pris ses médicaments. Se plaint de légères douleurs thoraciques (EVA 3/10). ECG à planifier cet après-midi.', 'normale'),
(2, 3, 'matin', 'Mme Simard: épisode de toux productive ce matin. SpO2 descendue à 93%, remontée à 94.5% après nébulisation. Médecin prévenu. Surveillance rapprochée recommandée.', 'importante'),
(7, 5, 'matin', 'M. Pelletier en soins intensifs: diurèse très faible (50ml/4h). Potassium à 5.8 mEq/L. Dr. Beauregard informé. Dialyse en attente de décision médicale. PATIENT À SURVEILLER.', 'urgente');

-- 16. Alertes
INSERT INTO alerte (admission_id, infirmier_id, type_alerte, message, priorite, statut) VALUES
(2, 3, 'constante_anormale', 'SpO2 de Mme Simard (CH.201-A) est à 93% — sous le seuil d alerte de 95%. Surveillance recommandée.', 'haute',     'lue'),
(7, 5, 'urgence',            'M. Pelletier (SI-01): Kaliémie critique 5.8 mEq/L — risque d hyperkaliémie. Médecin notifié.', 'critique',  'non_lue'),
(1, 2, 'soin_en_retard',     'Prise de constantes pour M. Martin (CH.301-A) prévue à 12h00 non encore effectuée.', 'normale',   'non_lue');

-- 17. Planning
INSERT INTO planning (infirmier_id, service_id, date_debut, date_fin, type_quart, statut) VALUES
(1, 1, '2026-07-07 15:00:00', '2026-07-07 23:00:00', 'apres_midi', 'confirme'),
(2, 1, '2026-07-07 07:00:00', '2026-07-07 15:00:00', 'matin',      'confirme'),
(3, 2, '2026-07-07 07:00:00', '2026-07-07 15:00:00', 'matin',      'confirme'),
(4, 3, '2026-07-07 07:00:00', '2026-07-07 15:00:00', 'matin',      'confirme'),
(5, 5, '2026-07-07 07:00:00', '2026-07-07 15:00:00', 'matin',      'confirme'),
(6, 2, '2026-07-07 23:00:00', '2026-07-08 07:00:00', 'nuit',       'confirme');

-- ============================================================
-- VÉRIFICATION
-- ============================================================
SELECT 'Établissements' AS table_name, COUNT(*) AS count FROM etablissement
UNION ALL SELECT 'Services',    COUNT(*) FROM service
UNION ALL SELECT 'Chambres',    COUNT(*) FROM chambre
UNION ALL SELECT 'Lits',        COUNT(*) FROM lit
UNION ALL SELECT 'Infirmiers',  COUNT(*) FROM infirmier
UNION ALL SELECT 'Patients',    COUNT(*) FROM patient
UNION ALL SELECT 'Admissions',  COUNT(*) FROM admission
UNION ALL SELECT 'Prescriptions', COUNT(*) FROM prescription
UNION ALL SELECT 'Médicaments', COUNT(*) FROM prescription_medicament
UNION ALL SELECT 'Constantes',  COUNT(*) FROM constante_vitale
UNION ALL SELECT 'Tournées',    COUNT(*) FROM tournee
UNION ALL SELECT 'Soins',       COUNT(*) FROM soin
UNION ALL SELECT 'Transmissions', COUNT(*) FROM transmission
UNION ALL SELECT 'Alertes',     COUNT(*) FROM alerte;
