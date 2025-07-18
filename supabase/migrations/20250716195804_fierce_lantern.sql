-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Note: The 'master_table' table should already exist with your data
-- If it doesn't exist, here's a sample structure:
/*
CREATE TABLE IF NOT EXISTS master_table (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    job_title VARCHAR(255),
    industry VARCHAR(255),
    region VARCHAR(255),
    metro VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better filter performance
CREATE INDEX IF NOT EXISTS idx_master_table_company_name ON master_table(company_name);
CREATE INDEX IF NOT EXISTS idx_master_table_job_title ON master_table(job_title);
CREATE INDEX IF NOT EXISTS idx_master_table_industry ON master_table(industry);
CREATE INDEX IF NOT EXISTS idx_master_table_region ON master_table(region);
CREATE INDEX IF NOT EXISTS idx_master_table_metro ON master_table(metro);
CREATE INDEX IF NOT EXISTS idx_master_table_location ON master_table(location);
*/