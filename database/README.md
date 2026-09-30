# ResQ Disaster Management System - MySQL Database

This directory contains the database files and scripts for **MySQL** integration with the Base44 ResQ Network.

## Files Overview

| File | Description |
| :--- | :--- |
| `schema.sql` | Complete DDL definitions for all database tables, columns, indexes, and relations. |
| `seeds.sql` | Demo data for testing (Citizens, Responders, Disasters, Thermal Drones, Hospitals, Logistics). |
| `setup.sql` | All-in-one SQL script (Schema + Seeds) for 1-click execution in phpMyAdmin / Workbench / CLI. |
| `connection.js` | Connection pooling module using `mysql2/promise`. |
| `migrate.js` | Automated migration runner script. |

---

## Database Configuration

Configure your MySQL connection in the root `.env` file:

```ini
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=resq_disaster_db
```

---

## 3 Ways to Setup MySQL

### Method 1: Using npm script (Recommended)
Run the automated migration runner:
```bash
npm run db:setup
# OR
npm run db:migrate
```

### Method 2: Using MySQL Command Line
Run the all-in-one setup file:
```bash
mysql -u root -p < database/setup.sql
```

### Method 3: Using phpMyAdmin or MySQL Workbench
1. Open phpMyAdmin (`http://localhost/phpmyadmin`) or MySQL Workbench.
2. Click on the **SQL** tab or **Open SQL Script**.
3. Load and execute `database/setup.sql`.

---

## Tables Structure

1. **`users`**: Resident citizens and first responder tactical units with role-based attributes.
2. **`alerts`**: Active and monitored disaster alerts (Floods, Chemical Fires, Landslides, Earthquakes).
3. **`devices`**: Amphibious rescue trucks, medical vans, UAV recon drones, IoT SOS beacons.
4. **`hospitals`**: Trauma centers with live ICU beds, oxygen levels, and blood bank status.
5. **`resources`**: Relief logistics inventory across warehouses and staging depots.
6. **`sos_events`**: High-priority SOS distress signals with real-time GPS coordinates.
7. **`emergency_contacts`**: Citizen personal emergency contacts.
