-- =============================================================================
-- Base44 ResQ Disaster Management System - MySQL Database Schema
-- Database: resq_disaster_db
-- Compatibility: MySQL 5.7+, MySQL 8.x, MariaDB 10.3+, AWS RDS, XAMPP
-- =============================================================================

CREATE DATABASE IF NOT EXISTS resq_disaster_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE resq_disaster_db;

-- -----------------------------------------------------------------------------
-- 1. Table: users (Citizen Residents & First Responder Rescue Teams)
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
  INDEX idx_users_badge (badge_id),
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: alerts (Real-Time Disaster Incidents & Broadcast Alerts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(50) NOT NULL COMMENT 'flood, fire, earthquake, landslide, storm, etc.',
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  severity ENUM('Low', 'Medium', 'High', 'Critical', 'Extreme') NOT NULL DEFAULT 'Medium',
  timestamp DATETIME NOT NULL,
  description TEXT,
  action_required TEXT,
  impacted_people VARCHAR(50),
  status VARCHAR(50) DEFAULT 'ACTIVE' COMMENT 'ACTIVE, MONITORING, RESOLVED, CANCELLED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_alerts_status (status),
  INDEX idx_alerts_type (type),
  INDEX idx_alerts_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: devices (Tactical Units, Amphibious Trucks, Thermal Drones, IoT Beacons)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS devices (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL COMMENT 'Rescue Crew, UAV Aerial Recon, Medical Response, Water Rescue, Fixed IoT Node',
  status VARCHAR(50) NOT NULL COMMENT 'sos, assistance, safe, offline',
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
  INDEX idx_devices_status (status),
  INDEX idx_devices_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: hospitals (Disaster Trauma Centers & Field Emergency Units)
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_hospitals_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: resources (Relief Logistics & Emergency Supply Depots)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resources (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Sufficient' COMMENT 'Sufficient, High Demand, Deployed, Low Stock, Dispatching',
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_resources_category (category),
  INDEX idx_resources_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table: sos_events (Distress Signals, GPS Telemetry & Rescue Dispatch Logs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sos_events (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  type VARCHAR(100) NOT NULL,
  notes TEXT,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  address VARCHAR(255),
  status VARCHAR(50) DEFAULT 'DISPATCHING_RESCUE' COMMENT 'DISPATCHING_RESCUE, RESPONDER_EN_ROUTE, RESOLVED, CANCELLED',
  timestamp DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sos_status (status),
  INDEX idx_sos_user (user_id),
  INDEX idx_sos_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Table: emergency_contacts (Personal Emergency Contacts for Citizens)
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
