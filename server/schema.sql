-- =============================================================================
-- Base44 ResQ Disaster Management System - MySQL Database Schema
-- Database: resq_disaster_db
-- =============================================================================

CREATE DATABASE IF NOT EXISTS resq_disaster_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE resq_disaster_db;

-- -----------------------------------------------------------------------------
-- 1. Table: users (Citizens & First Responders)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('CITIZEN', 'RESCUE_TEAM') NOT NULL DEFAULT 'CITIZEN',
  phone VARCHAR(50),
  blood_type VARCHAR(20),
  badge_id VARCHAR(64),
  unit VARCHAR(255),
  sector VARCHAR(255),
  title VARCHAR(100),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_badge (badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: alerts (Real-Time Disasters & Civil Alerts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  severity ENUM('Low', 'Medium', 'High', 'Critical', 'Extreme') NOT NULL DEFAULT 'Medium',
  timestamp DATETIME NOT NULL,
  description TEXT,
  action_required TEXT,
  impacted_people VARCHAR(50),
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_alerts_status (status),
  INDEX idx_alerts_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: devices (Rescue Teams, Drones, IoT Beacons)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS devices (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  battery INT DEFAULT 100,
  personnel INT DEFAULT 0,
  vehicle VARCHAR(255),
  assigned_zone VARCHAR(255),
  contact VARCHAR(100),
  last_ping VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_devices_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: hospitals (Medical Centers & Field Emergency Units)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hospitals (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  distance VARCHAR(50),
  beds_available INT DEFAULT 0,
  icu_beds INT DEFAULT 0,
  oxygen_level VARCHAR(50),
  blood_bank VARCHAR(100),
  trauma_level VARCHAR(100),
  phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'OPERATIONAL',
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: resources (Relief Inventory & Logistics)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resources (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Sufficient',
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_resources_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table: sos_events (Emergency Distress Calls & GPS Dispatch)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sos_events (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  type VARCHAR(100) NOT NULL,
  notes TEXT,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  address VARCHAR(255),
  status VARCHAR(50) DEFAULT 'DISPATCHING_RESCUE',
  timestamp DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sos_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Table: emergency_contacts (Personal User Emergency Contacts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100),
  phone VARCHAR(50) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contacts_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- DEFAULT SEED DATA
-- -----------------------------------------------------------------------------

-- Seed Users
INSERT INTO users (id, name, email, password_hash, role, phone, blood_type, badge_id, unit, sector, title, status)
VALUES
  ('u-123', 'Alex Mercer', 'alex.mercer@resq.org', '$2a$10$w09..demoHashCitizen', 'CITIZEN', '+1 (555) 019-2834', 'O Positive', NULL, NULL, NULL, 'Verified Resident', 'SAFE'),
  ('u-sar-01', 'Alpha Search & Rescue Squad', 'alpha.commander@rescue.resq.org', '$2a$10$w09..demoHashRescue', 'RESCUE_TEAM', '+1 (800) 555-0199', 'AB Positive', 'SAR-ALPHA-01', 'Alpha Search & Rescue Squad', 'Sector 4 - Lowland Riverbank', 'Tactical Squad Commander', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Alerts
INSERT INTO alerts (id, type, title, location, severity, timestamp, description, action_required, impacted_people, status)
VALUES
  ('ALT-101', 'flood', 'Severe River Inundation Alert - Sector 4', 'Mula River Basin North', 'Critical', NOW() - INTERVAL 15 MINUTE, 'Water level risen 3.4 meters above safety threshold. High current flow towards Lowland Colony.', 'Evacuate to Sector 4 Community Shelter immediately. Avoid underpasses.', '~14,200', 'ACTIVE'),
  ('ALT-102', 'fire', 'Chemical Tanker Explosion & Smoke Cloud', 'Industrial Zone Phase 2', 'Extreme', NOW() - INTERVAL 42 MINUTE, 'Hazardous gas leak spreading Eastward at 18 km/h. Toxic air index 410.', 'Seal windows, turn off air ducts. Respirators required within 2km radius.', '~8,500', 'ACTIVE'),
  ('ALT-103', 'landslide', 'Ghat Road Hill Collapse Risk', 'Western Bypass Highway KM 14', 'Medium', NOW() - INTERVAL 120 MINUTE, 'Debris flow blocked 2 lanes. Structural instability detected on hillside.', 'Use alternative Express Bypass Route B. Rescue crews clearing debris.', '~3,100', 'MONITORING'),
  ('ALT-104', 'earthquake', 'Magnitude 4.8 Seismic Aftershock', 'Eastern Faultline Belt', 'High', NOW() - INTERVAL 210 MINUTE, 'Tremors felt across 12 residential blocks. Minor structural cracks reported.', 'Inspect gas pipelines. Stay clear of elevated bridges and glass facades.', '~32,000', 'ACTIVE')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed Devices / Rescue Teams
INSERT INTO devices (id, name, type, status, lat, lng, battery, personnel, vehicle, assigned_zone, contact, last_ping)
VALUES
  ('TEAM-ALPHA', 'Alpha Search & Rescue Unit', 'Rescue Crew', 'sos', 18.5280, 73.8520, 88, 8, 'Amphibious All-Terrain Truck', 'Sector 4 Riverbank', '+1 (800) 555-0199', '2 mins ago'),
  ('DRONE-01', 'SkyScout Thermal Drone #1', 'UAV Aerial Recon', 'assistance', 18.5140, 73.8620, 64, 0, 'Thermal Quadcopter', 'Industrial Zone Phase 2', 'Telemetry Mesh 915MHz', '30 sec ago'),
  ('TEAM-BRAVO', 'Bravo Paramedic Squad', 'Medical Response', 'safe', 18.5350, 73.8450, 95, 5, 'Mobile Intensive Care Van', 'North Emergency Camp', '+1 (800) 555-0144', '1 min ago'),
  ('BOAT-03', 'AquaSwift Power Boat #3', 'Water Rescue', 'sos', 18.5220, 73.8480, 72, 4, 'High-speed Rigid Inflatable', 'Mula Bridge Submerged Area', '+1 (800) 555-0182', 'Just now'),
  ('BEACON-88', 'Community SOS Beacon #88', 'Fixed IoT Node', 'offline', 18.5080, 73.8400, 12, 0, 'Solar Relay Post', 'Old Town Square', 'LoRa Gateway', '45 mins ago')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Hospitals
INSERT INTO hospitals (id, name, address, distance, beds_available, icu_beds, oxygen_level, blood_bank, trauma_level, phone, status, lat, lng)
VALUES
  ('HOSP-01', 'Apex Trauma & Disaster Medical Center', '102 Emergency Ave, Central District', '1.4 km', 34, 8, '98%', 'O+ A+ B+ AB- In Stock', 'Level 1 Emergency Care', '+1 (800) 911-APEX', 'OPERATIONAL', 18.5250, 73.8610),
  ('HOSP-02', 'Metro General Red Cross Hospital', '45 Relief Boulevard, East Division', '3.2 km', 12, 2, '85%', 'Critical Need O-', 'Level 2 Emergency Care', '+1 (800) 911-METRO', 'HIGH OCCUPANCY', 18.5120, 73.8710),
  ('HOSP-03', 'Field Medical Emergency Unit #4', 'Sector 4 High School Ground Base', '0.8 km', 50, 10, '100%', 'Emergency Plasma Stock', 'Mobile Field Surgery', '+1 (800) 911-FIELD4', 'DISASTER FIELD BASE', 18.5310, 73.8490)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Resources
INSERT INTO resources (id, category, quantity, unit, status, location)
VALUES
  ('RES-01', 'Medical Kits', 450, 'Boxes', 'Sufficient', 'Central Warehouse A'),
  ('RES-02', 'Clean Drinking Water', 12000, 'Liters', 'High Demand', 'Sector 4 Base'),
  ('RES-03', 'Inflatable Life Boats', 18, 'Vessels', 'Deployed', 'Riverfront Hub'),
  ('RES-04', 'Diesel Power Generators', 24, 'Units', 'Sufficient', 'Depot South'),
  ('RES-05', 'Rations & Ready Meals', 8500, 'Packs', 'Dispatching', 'Red Cross Center'),
  ('RES-06', 'Thermal Blankets', 3200, 'Units', 'Low Stock', 'Stadium Shelter')
ON DUPLICATE KEY UPDATE category=VALUES(category);
