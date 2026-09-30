-- =============================================================================
-- Base44 ResQ Disaster Management System - MySQL Seed Data
-- Database: resq_disaster_db
-- =============================================================================

USE resq_disaster_db;

-- -----------------------------------------------------------------------------
-- 1. Users Seeds (Citizen Resident + Rescue Team Commander)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, role, phone, blood_type, badge_id, unit, sector, title, status)
VALUES
  ('u-123', 'Alex Mercer', 'alex.mercer@resq.org', '$2a$10$w09..demoHashCitizen', 'CITIZEN', '+1 (555) 019-2834', 'O Positive', NULL, NULL, NULL, 'Verified Resident', 'SAFE'),
  ('u-sar-01', 'Alpha Search & Rescue Squad', 'alpha.commander@rescue.resq.org', '$2a$10$w09..demoHashRescue', 'RESCUE_TEAM', '+1 (800) 555-0199', 'AB Positive', 'SAR-ALPHA-01', 'Alpha Search & Rescue Squad', 'Sector 4 - Lowland Riverbank', 'Tactical Squad Commander', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

-- -----------------------------------------------------------------------------
-- 2. Emergency Alerts Seeds
-- -----------------------------------------------------------------------------
INSERT INTO alerts (id, type, title, location, severity, timestamp, description, action_required, impacted_people, status)
VALUES
  ('ALT-101', 'flood', 'Severe River Inundation Alert - Sector 4', 'Mula River Basin North', 'Critical', NOW() - INTERVAL 15 MINUTE, 'Water level risen 3.4 meters above safety threshold. High current flow towards Lowland Colony.', 'Evacuate to Sector 4 Community Shelter immediately. Avoid underpasses.', '~14,200', 'ACTIVE'),
  ('ALT-102', 'fire', 'Chemical Tanker Explosion & Smoke Cloud', 'Industrial Zone Phase 2', 'Extreme', NOW() - INTERVAL 42 MINUTE, 'Hazardous gas leak spreading Eastward at 18 km/h. Toxic air index 410.', 'Seal windows, turn off air ducts. Respirators required within 2km radius.', '~8,500', 'ACTIVE'),
  ('ALT-103', 'landslide', 'Ghat Road Hill Collapse Risk', 'Western Bypass Highway KM 14', 'Medium', NOW() - INTERVAL 120 MINUTE, 'Debris flow blocked 2 lanes. Structural instability detected on hillside.', 'Use alternative Express Bypass Route B. Rescue crews clearing debris.', '~3,100', 'MONITORING'),
  ('ALT-104', 'earthquake', 'Magnitude 4.8 Seismic Aftershock', 'Eastern Faultline Belt', 'High', NOW() - INTERVAL 210 MINUTE, 'Tremors felt across 12 residential blocks. Minor structural cracks reported.', 'Inspect gas pipelines. Stay clear of elevated bridges and glass facades.', '~32,000', 'ACTIVE')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- -----------------------------------------------------------------------------
-- 3. Live Devices & Rescue Teams Seeds
-- -----------------------------------------------------------------------------
INSERT INTO devices (id, name, type, status, lat, lng, battery, personnel, vehicle, assigned_zone, contact, last_ping)
VALUES
  ('TEAM-ALPHA', 'Alpha Search & Rescue Unit', 'Rescue Crew', 'sos', 18.5280, 73.8520, 88, 8, 'Amphibious All-Terrain Truck', 'Sector 4 Riverbank', '+1 (800) 555-0199', '2 mins ago'),
  ('DRONE-01', 'SkyScout Thermal Drone #1', 'UAV Aerial Recon', 'assistance', 18.5140, 73.8620, 64, 0, 'Thermal Quadcopter', 'Industrial Zone Phase 2', 'Telemetry Mesh 915MHz', '30 sec ago'),
  ('TEAM-BRAVO', 'Bravo Paramedic Squad', 'Medical Response', 'safe', 18.5350, 73.8450, 95, 5, 'Mobile Intensive Care Van', 'North Emergency Camp', '+1 (800) 555-0144', '1 min ago'),
  ('BOAT-03', 'AquaSwift Power Boat #3', 'Water Rescue', 'sos', 18.5220, 73.8480, 72, 4, 'High-speed Rigid Inflatable', 'Mula Bridge Submerged Area', '+1 (800) 555-0182', 'Just now'),
  ('BEACON-88', 'Community SOS Beacon #88', 'Fixed IoT Node', 'offline', 18.5080, 73.8400, 12, 0, 'Solar Relay Post', 'Old Town Square', 'LoRa Gateway', '45 mins ago')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status), lat=VALUES(lat), lng=VALUES(lng);

-- -----------------------------------------------------------------------------
-- 4. Hospitals & Trauma Centers Seeds
-- -----------------------------------------------------------------------------
INSERT INTO hospitals (id, name, address, distance, beds_available, icu_beds, oxygen_level, blood_bank, trauma_level, phone, status, lat, lng)
VALUES
  ('HOSP-01', 'Apex Trauma & Disaster Medical Center', '102 Emergency Ave, Central District', '1.4 km', 34, 8, '98%', 'O+ A+ B+ AB- In Stock', 'Level 1 Emergency Care', '+1 (800) 911-APEX', 'OPERATIONAL', 18.5250, 73.8610),
  ('HOSP-02', 'Metro General Red Cross Hospital', '45 Relief Boulevard, East Division', '3.2 km', 12, 2, '85%', 'Critical Need O-', 'Level 2 Emergency Care', '+1 (800) 911-METRO', 'HIGH OCCUPANCY', 18.5120, 73.8710),
  ('HOSP-03', 'Field Medical Emergency Unit #4', 'Sector 4 High School Ground Base', '0.8 km', 50, 10, '100%', 'Emergency Plasma Stock', 'Mobile Field Surgery', '+1 (800) 911-FIELD4', 'DISASTER FIELD BASE', 18.5310, 73.8490)
ON DUPLICATE KEY UPDATE name=VALUES(name), beds_available=VALUES(beds_available);

-- -----------------------------------------------------------------------------
-- 5. Emergency Resources & Logistics Seeds
-- -----------------------------------------------------------------------------
INSERT INTO resources (id, category, quantity, unit, status, location)
VALUES
  ('RES-01', 'Medical Kits', 450, 'Boxes', 'Sufficient', 'Central Warehouse A'),
  ('RES-02', 'Clean Drinking Water', 12000, 'Liters', 'High Demand', 'Sector 4 Base'),
  ('RES-03', 'Inflatable Life Boats', 18, 'Vessels', 'Deployed', 'Riverfront Hub'),
  ('RES-04', 'Diesel Power Generators', 24, 'Units', 'Sufficient', 'Depot South'),
  ('RES-05', 'Rations & Ready Meals', 8500, 'Packs', 'Dispatching', 'Red Cross Center'),
  ('RES-06', 'Thermal Blankets', 3200, 'Units', 'Low Stock', 'Stadium Shelter')
ON DUPLICATE KEY UPDATE category=VALUES(category), quantity=VALUES(quantity);

-- -----------------------------------------------------------------------------
-- 6. Emergency Contacts Seeds
-- -----------------------------------------------------------------------------
INSERT INTO emergency_contacts (user_id, name, relationship, phone, is_primary)
VALUES
  ('u-123', 'Elena Mercer', 'Spouse', '+1 (555) 019-9988', TRUE),
  ('u-123', 'Dr. Marcus Vance', 'Family Physician', '+1 (555) 018-4422', FALSE)
ON DUPLICATE KEY UPDATE name=VALUES(name);
