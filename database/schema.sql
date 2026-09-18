CREATE TABLE activities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    creator_id BIGINT NOT NULL,
    creator_role ENUM('EMPLOYER','EDUCATOR') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(30) NOT NULL,
    estimated_time_value DECIMAL(10,2) NOT NULL,
    estimated_time_unit VARCHAR(20) NOT NULL,
    skill_level VARCHAR(30) NOT NULL,
    effort VARCHAR(30) NOT NULL,
    complexity VARCHAR(30) NOT NULL,
    student_impact VARCHAR(30) NOT NULL,
    verification_method VARCHAR(40) NOT NULL,
    repeatability VARCHAR(20) NOT NULL,
    completion_type VARCHAR(40) NOT NULL,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    final_xp INT NOT NULL,
    xp_rule_version INT NOT NULL DEFAULT 1,
    version INT NOT NULL DEFAULT 1,
    status ENUM('Draft','Active','Inactive') NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE activity_versions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    activity_id BIGINT NOT NULL,
    version INT NOT NULL,
    final_xp INT NOT NULL,
    snapshot JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(activity_id, version)
);

CREATE TABLE challenges (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    creator_id BIGINT NOT NULL,
    creator_role ENUM('EMPLOYER','EDUCATOR') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    completion_rule VARCHAR(100) NOT NULL,
    final_xp INT NOT NULL,
    bonus_xp INT NOT NULL DEFAULT 0,
    xp_rule_version INT NOT NULL DEFAULT 1,
    version INT NOT NULL DEFAULT 1,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    status ENUM('Draft','Active','Inactive') NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE challenge_activities (
    challenge_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    sequence_no INT NULL,
    PRIMARY KEY(challenge_id, activity_id)
);

CREATE TABLE achievements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    creator_id BIGINT NOT NULL,
    creator_role ENUM('EMPLOYER','EDUCATOR','ADMIN') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    trigger_type VARCHAR(50) NOT NULL,
    trigger_value VARCHAR(255) NOT NULL,
    related_activity_id BIGINT NULL,
    related_challenge_id BIGINT NULL,
    required_category VARCHAR(50) NULL,
    bonus_xp INT NOT NULL DEFAULT 0,
    version INT NOT NULL DEFAULT 1,
    status ENUM('Draft','Active','Inactive') NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_progress (
    student_id BIGINT PRIMARY KEY,
    total_xp INT NOT NULL DEFAULT 0,
    current_level INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE activity_completions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    activity_version INT NOT NULL,
    xp_value_at_completion INT NOT NULL,
    completion_event_id VARCHAR(255) NOT NULL UNIQUE,
    verification_status VARCHAR(30) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE challenge_completions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    challenge_id BIGINT NOT NULL,
    challenge_version INT NOT NULL,
    xp_value_at_completion INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, challenge_id, challenge_version)
);

CREATE TABLE student_achievements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    achievement_id BIGINT NOT NULL,
    achievement_version INT NOT NULL,
    bonus_xp_at_award INT NOT NULL DEFAULT 0,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, achievement_id)
);

CREATE TABLE xp_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    amount INT NOT NULL,
    transaction_type ENUM('AWARD','ADJUSTMENT') NOT NULL,
    source_type ENUM('ACTIVITY','CHALLENGE','ACHIEVEMENT','ACTIVITY_ADJUSTMENT','CHALLENGE_ADJUSTMENT','ACHIEVEMENT_ADJUSTMENT') NOT NULL,
    source_id BIGINT NOT NULL,
    source_completion_id BIGINT NULL,
    idempotency_key VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_xp_student(student_id)
);

CREATE TABLE level_rules (
    level_no INT PRIMARY KEY,
    level_name VARCHAR(100) NOT NULL,
    required_xp INT NOT NULL UNIQUE,
    unlock_name VARCHAR(255) NULL
);

INSERT INTO level_rules VALUES
(1,'Starter',0,'Student Profile'),
(2,'Contributor',100,'Basic Job Applications'),
(3,'Achiever',350,'Premium Challenges'),
(4,'Professional',750,'Employer Recommendations'),
(5,'Advanced',1350,'Advanced Opportunities'),
(6,'Verified Contributor',2250,'Verified Contributor'),
(7,'Mentor',3550,'Mentor Eligibility'),
(8,'Elite',5350,'Elite Opportunities'),
(9,'Industry Recognised',7850,'Industry Recognition'),
(10,'Platform Ambassador',11350,'Platform Ambassador');


-- ============================================================
-- AVATAR / COSMETIC PROOF-OF-CONCEPT EXTENSION
-- ============================================================

CREATE TABLE IF NOT EXISTS cosmetic_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    slot ENUM('outfit','hat','glasses','badge','accessory') NOT NULL,
    asset_key VARCHAR(255) NOT NULL,
    rarity VARCHAR(40) DEFAULT 'Common',
    status ENUM('Active','Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cosmetic_reward_rules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_id BIGINT NOT NULL,
    source_type ENUM('ACTIVITY','CHALLENGE','ACHIEVEMENT','LEVEL') NOT NULL,
    source_id BIGINT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (item_id) REFERENCES cosmetic_items(id)
);

CREATE TABLE IF NOT EXISTS student_inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    granted_by_rule_id BIGINT NULL,
    reward_event_id VARCHAR(255) NOT NULL UNIQUE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_student_item (student_id, item_id),
    FOREIGN KEY (item_id) REFERENCES cosmetic_items(id),
    FOREIGN KEY (granted_by_rule_id) REFERENCES cosmetic_reward_rules(id)
);

CREATE TABLE IF NOT EXISTS student_avatar_equipment (
    student_id BIGINT NOT NULL,
    slot ENUM('outfit','hat','glasses','badge','accessory') NOT NULL,
    item_id BIGINT NOT NULL,
    equipped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, slot),
    FOREIGN KEY (item_id) REFERENCES cosmetic_items(id)
);

CREATE TABLE IF NOT EXISTS virtual_rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    max_users INT DEFAULT 50,
    status ENUM('Active','Inactive') DEFAULT 'Active'
);

-- Live position is ideally ephemeral/realtime (Redis/WebSocket state),
-- not written to MySQL for every movement. MySQL can store last-known
-- room or presence history if Alumable later requires it.

-- Prototype skill system tables. These are not fully fleshed out yet, but will be used to prototype the skill system.

CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  external_id VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  category VARCHAR(100) NULL,
  parent_skill_id INT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL,
  FOREIGN KEY (parent_skill_id) REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS activity_skill_allocations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_id INT NOT NULL,
  skill_id INT NOT NULL,
  percentage FLOAT NOT NULL,
  UNIQUE KEY uq_activity_skill (activity_id, skill_id),
  FOREIGN KEY (activity_id) REFERENCES activities(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS skill_xp_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  external_user_id VARCHAR(255) NOT NULL,
  skill_id INT NOT NULL,
  amount INT NOT NULL,
  transaction_type VARCHAR(30) NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  source_id INT NOT NULL,
  source_completion_id INT NULL,
  idempotency_key VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS completion_skill_awards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  completion_id INT NOT NULL,
  skill_id INT NOT NULL,
  percentage_at_completion FLOAT NOT NULL,
  xp_value_at_completion INT NOT NULL,
  UNIQUE KEY uq_completion_skill (completion_id, skill_id),
  FOREIGN KEY (completion_id) REFERENCES activity_completions(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS student_skill_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  external_user_id VARCHAR(255) NOT NULL,
  skill_id INT NOT NULL,
  total_xp INT NOT NULL DEFAULT 0,
  current_level INT NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY uq_student_skill_progress (external_user_id, skill_id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS skill_level_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  skill_id INT NULL,
  level INT NOT NULL,
  required_xp INT NOT NULL,
  UNIQUE KEY uq_skill_level_rule (skill_id, level),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);
