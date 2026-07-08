-- ============================================================
--  SOINELY — Base de données pour l'assistant infirmier
--  Gestion des patients dans les tournées des infirmier(e)s
--  Version : 1.0.0
--  Date    : 2026-07-07
-- ============================================================

CREATE DATABASE IF NOT EXISTS soinely
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE soinely;

-- ============================================================
-- 1. ÉTABLISSEMENT
-- ============================================================
CREATE TABLE etablissement (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom             VARCHAR(200) NOT NULL,
    adresse         TEXT,
    telephone       VARCHAR(20),
    email           VARCHAR(150),
    site_web        VARCHAR(200),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. SERVICES HOSPITALIERS
-- ============================================================
CREATE TABLE service (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    etablissement_id INT UNSIGNED NOT NULL,
    nom             VARCHAR(150) NOT NULL,
    code            VARCHAR(20) UNIQUE NOT NULL,
    etage           TINYINT,
    aile            VARCHAR(50),
    chef_service    VARCHAR(150),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (etablissement_id) REFERENCES etablissement(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. CHAMBRES / LITS
-- ============================================================
CREATE TABLE chambre (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_id      INT UNSIGNED NOT NULL,
    numero          VARCHAR(20) NOT NULL,
    nombre_lits     TINYINT UNSIGNED DEFAULT 1,
    type            ENUM('simple', 'double', 'soins_intensifs', 'isolation') DEFAULT 'simple',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE,
    UNIQUE KEY uq_chambre (service_id, numero)
);

CREATE TABLE lit (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chambre_id      INT UNSIGNED NOT NULL,
    numero_lit      VARCHAR(10) NOT NULL,
    statut          ENUM('libre', 'occupé', 'nettoyage', 'hors_service') DEFAULT 'libre',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chambre_id) REFERENCES chambre(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. PERSONNEL INFIRMIER
-- ============================================================
CREATE TABLE infirmier (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    matricule       VARCHAR(30) UNIQUE NOT NULL,
    nom             VARCHAR(100) NOT NULL,
    prenom          VARCHAR(100) NOT NULL,
    sexe            ENUM('F', 'M', 'autre') DEFAULT 'F',
    date_naissance  DATE,
    email           VARCHAR(150) UNIQUE,
    telephone       VARCHAR(20),
    specialite      VARCHAR(100),
    grade           ENUM('infirmier', 'infirmier_senior', 'chef_equipe', 'cadre_sante') DEFAULT 'infirmier',
    service_id      INT UNSIGNED,
    actif           BOOLEAN DEFAULT TRUE,
    date_embauche   DATE,
    photo_url       VARCHAR(300),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE SET NULL
);

-- ============================================================
-- 5. COMPTES UTILISATEURS
-- ============================================================
CREATE TABLE utilisateur (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    infirmier_id    INT UNSIGNED UNIQUE,
    username        VARCHAR(80) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('infirmier', 'chef_equipe', 'cadre_sante', 'admin') DEFAULT 'infirmier',
    derniere_connexion DATETIME,
    token_reset     VARCHAR(255),
    token_expiry    DATETIME,
    actif           BOOLEAN DEFAULT TRUE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (infirmier_id) REFERENCES infirmier(id) ON DELETE SET NULL
);

-- ============================================================
-- 6. PATIENTS
-- ============================================================
CREATE TABLE patient (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero_dossier      VARCHAR(50) UNIQUE NOT NULL,
    nom                 VARCHAR(100) NOT NULL,
    prenom              VARCHAR(100) NOT NULL,
    sexe                ENUM('F', 'M', 'autre') NOT NULL,
    date_naissance      DATE NOT NULL,
    numero_secu         VARCHAR(30),
    telephone           VARCHAR(20),
    email               VARCHAR(150),
    adresse             TEXT,
    contact_urgence_nom VARCHAR(200),
    contact_urgence_tel VARCHAR(20),
    contact_urgence_lien VARCHAR(50),
    groupe_sanguin      ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-','inconnu') DEFAULT 'inconnu',
    allergies           TEXT,
    antecedents         TEXT,
    notes               TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. ADMISSIONS / HOSPITALISATIONS
-- ============================================================
CREATE TABLE admission (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id          INT UNSIGNED NOT NULL,
    service_id          INT UNSIGNED NOT NULL,
    lit_id              INT UNSIGNED,
    medecin_responsable VARCHAR(150),
    date_admission      DATETIME NOT NULL,
    date_sortie_prevue  DATE,
    date_sortie_reelle  DATETIME,
    motif_admission     TEXT NOT NULL,
    diagnostic_principal TEXT,
    statut              ENUM('en_cours', 'sorti', 'transfere', 'décédé') DEFAULT 'en_cours',
    type_sortie         ENUM('domicile', 'transfert', 'décès', 'fugue'),
    notes               TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE RESTRICT,
    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE RESTRICT,
    FOREIGN KEY (lit_id) REFERENCES lit(id) ON DELETE SET NULL
);

-- ============================================================
-- 8. PRESCRIPTIONS MÉDICALES
-- ============================================================
CREATE TABLE prescription (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admission_id        INT UNSIGNED NOT NULL,
    medecin             VARCHAR(150) NOT NULL,
    date_prescription   DATETIME NOT NULL,
    date_fin            DATETIME,
    statut              ENUM('active', 'terminée', 'annulée', 'suspendue') DEFAULT 'active',
    notes               TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admission_id) REFERENCES admission(id) ON DELETE CASCADE
);

CREATE TABLE prescription_medicament (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    prescription_id     INT UNSIGNED NOT NULL,
    medicament_nom      VARCHAR(200) NOT NULL,
    dosage              VARCHAR(100) NOT NULL,
    forme               VARCHAR(100),
    frequence           VARCHAR(150) NOT NULL,
    voie_administration ENUM('orale', 'IV', 'IM', 'SC', 'topique', 'autre') DEFAULT 'orale',
    heure_prise         VARCHAR(200),
    duree_jours         SMALLINT UNSIGNED,
    instructions        TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescription(id) ON DELETE CASCADE
);

-- ============================================================
-- 9. CONSTANTES VITALES
-- ============================================================
CREATE TABLE constante_vitale (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admission_id            INT UNSIGNED NOT NULL,
    infirmier_id            INT UNSIGNED NOT NULL,
    date_mesure             DATETIME NOT NULL,
    tension_systolique      SMALLINT UNSIGNED,
    tension_diastolique     SMALLINT UNSIGNED,
    frequence_cardiaque     SMALLINT UNSIGNED,
    frequence_respiratoire  SMALLINT UNSIGNED,
    temperature             DECIMAL(4,1),
    saturation_o2           DECIMAL(5,2),
    glycemie                DECIMAL(6,2),
    poids                   DECIMAL(6,2),
    notes                   TEXT,
    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admission_id) REFERENCES admission(id) ON DELETE CASCADE,
    FOREIGN KEY (infirmier_id) REFERENCES infirmier(id) ON DELETE RESTRICT
);

-- ============================================================
-- 10. TOURNÉES INFIRMIÈRES
-- ============================================================
CREATE TABLE tournee (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_id      INT UNSIGNED NOT NULL,
    infirmier_id    INT UNSIGNED NOT NULL,
    date_tournee    DATE NOT NULL,
    heure_debut     TIME,
    heure_fin       TIME,
    quart           ENUM('matin', 'apres_midi', 'nuit') NOT NULL,
    statut          ENUM('planifiee', 'en_cours', 'terminee', 'annulee') DEFAULT 'planifiee',
    notes           TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE RESTRICT,
    FOREIGN KEY (infirmier_id) REFERENCES infirmier(id) ON DELETE RESTRICT,
    UNIQUE KEY uq_tournee (service_id, infirmier_id, date_tournee, quart)
);

-- ============================================================
-- 11. PATIENTS PAR TOURNÉE
-- ============================================================
CREATE TABLE tournee_patient (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tournee_id      INT UNSIGNED NOT NULL,
    admission_id    INT UNSIGNED NOT NULL,
    ordre_visite    TINYINT UNSIGNED,
    statut_visite   ENUM('en_attente', 'visite', 'reporte', 'absent') DEFAULT 'en_attente',
    heure_visite    TIME,
    notes_visite    TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tournee_id) REFERENCES tournee(id) ON DELETE CASCADE,
    FOREIGN KEY (admission_id) REFERENCES admission(id) ON DELETE CASCADE,
    UNIQUE KEY uq_tournee_patient (tournee_id, admission_id)
);

-- ============================================================
-- 12. SOINS RÉALISÉS
-- ============================================================
CREATE TABLE soin (
    id                          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tournee_patient_id          INT UNSIGNED NOT NULL,
    infirmier_id                INT UNSIGNED NOT NULL,
    type_soin                   VARCHAR(150) NOT NULL,
    categorie                   ENUM(
                                    'medicament',
                                    'pansement',
                                    'hygiene',
                                    'mesure_vitale',
                                    'perfusion',
                                    'injection',
                                    'prelevement',
                                    'alimentation',
                                    'mobilisation',
                                    'education',
                                    'autre'
                                ) DEFAULT 'autre',
    heure_realisation           DATETIME NOT NULL,
    realise                     BOOLEAN DEFAULT FALSE,
    motif_non_realise           TEXT,
    observations                TEXT,
    prescription_medicament_id  INT UNSIGNED,
    created_at                  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at                  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tournee_patient_id) REFERENCES tournee_patient(id) ON DELETE CASCADE,
    FOREIGN KEY (infirmier_id) REFERENCES infirmier(id) ON DELETE RESTRICT,
    FOREIGN KEY (prescription_medicament_id) REFERENCES prescription_medicament(id) ON DELETE SET NULL
);

-- ============================================================
-- 13. TRANSMISSIONS INFIRMIÈRES
-- ============================================================
CREATE TABLE transmission (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admission_id        INT UNSIGNED NOT NULL,
    infirmier_id        INT UNSIGNED NOT NULL,
    date_transmission   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    quart               ENUM('matin', 'apres_midi', 'nuit') NOT NULL,
    contenu             TEXT NOT NULL,
    priorite            ENUM('normale', 'importante', 'urgente') DEFAULT 'normale',
    lue                 BOOLEAN DEFAULT FALSE,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admission_id) REFERENCES admission(id) ON DELETE CASCADE,
    FOREIGN KEY (infirmier_id) REFERENCES infirmier(id) ON DELETE RESTRICT
);

-- ============================================================
-- 14. ALERTES & NOTIFICATIONS
-- ============================================================
CREATE TABLE alerte (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admission_id    INT UNSIGNED,
    infirmier_id    INT UNSIGNED,
    type_alerte     ENUM(
                        'soin_en_retard',
                        'medicament_oublie',
                        'constante_anormale',
                        'chute_patient',
                        'allergie',
                        'urgence',
                        'rappel_tournee',
                        'autre'
                    ) NOT NULL,
    message         TEXT NOT NULL,
    priorite        ENUM('basse', 'normale', 'haute', 'critique') DEFAULT 'normale',
    statut          ENUM('non_lue', 'lue', 'traitee', 'ignoree') DEFAULT 'non_lue',
    date_alerte     DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_traitement DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admission_id) REFERENCES admission(id) ON DELETE CASCADE,
    FOREIGN KEY (infirmier_id) REFERENCES infirmier(id) ON DELETE SET NULL
);

-- ============================================================
-- 15. PLANNINGS INFIRMIERS
-- ============================================================
CREATE TABLE planning (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    infirmier_id    INT UNSIGNED NOT NULL,
    service_id      INT UNSIGNED NOT NULL,
    date_debut      DATETIME NOT NULL,
    date_fin        DATETIME NOT NULL,
    type_quart      ENUM('matin', 'apres_midi', 'nuit', 'repos', 'conge') NOT NULL,
    statut          ENUM('planifie', 'confirme', 'annule', 'modifie') DEFAULT 'planifie',
    notes           TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (infirmier_id) REFERENCES infirmier(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE RESTRICT
);

-- ============================================================
-- 16. JOURNAL D'ACTIVITÉ (Audit)
-- ============================================================
CREATE TABLE journal_activite (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id      INT UNSIGNED,
    action              VARCHAR(100) NOT NULL,
    table_concernee     VARCHAR(80),
    enregistrement_id   INT UNSIGNED,
    details             JSON,
    adresse_ip          VARCHAR(45),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE SET NULL
);

-- ============================================================
-- INDEX POUR PERFORMANCE
-- ============================================================
CREATE INDEX idx_patient_dossier        ON patient(numero_dossier);
CREATE INDEX idx_patient_nom            ON patient(nom, prenom);
CREATE INDEX idx_admission_patient      ON admission(patient_id, statut);
CREATE INDEX idx_admission_service      ON admission(service_id, statut);
CREATE INDEX idx_tournee_date           ON tournee(date_tournee, service_id);
CREATE INDEX idx_tournee_infirmier      ON tournee(infirmier_id, date_tournee);
CREATE INDEX idx_soin_tournee           ON soin(tournee_patient_id);
CREATE INDEX idx_constante_date         ON constante_vitale(admission_id, date_mesure);
CREATE INDEX idx_alerte_statut          ON alerte(statut, priorite);
CREATE INDEX idx_transmission_admission ON transmission(admission_id, date_transmission);
CREATE INDEX idx_planning_infirmier     ON planning(infirmier_id, date_debut);

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
