import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

export default pool;

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// User authentication queries
export async function createUser(email: string, hashedPassword: string, name: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO users (email, password, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, name',
      [email, hashedPassword, name]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getUserByEmail(email: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, email, password, name FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Leads data queries
export async function getLeadsData(filters: any = {}, page: number = 1, limit: number = 10) {
  const client = await pool.connect();
  try {
    let whereClause = '';
    const queryParams: any[] = [];
    let paramCount = 0;

    // Build WHERE clause based on filters
    const conditions: string[] = [];
    
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].length > 0) {
        paramCount++;
        const placeholders = filters[key].map((_: any, index: number) => `$${paramCount + index}`).join(',');
        conditions.push(`${key} IN (${placeholders})`);
        queryParams.push(...filters[key]);
        paramCount += filters[key].length - 1;
      }
    });

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Get total count
    // const countQuery = `SELECT COUNT(*) FROM master_table ${whereClause}`;
    // const countResult = await client.query(countQuery, queryParams);
    // const totalCount = parseInt(countResult.rows[0].count);
    const totalCount = 0; // TEMP: Remove count for testing

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataQuery = `
      SELECT * FROM master_table 
      ${whereClause} 
      ORDER BY "created_at" DESC 
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    const dataResult = await client.query(dataQuery, [...queryParams, limit, offset]);

    return {
      data: dataResult.rows,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    };
  } finally {
    client.release();
  }
}

export async function getUniqueValues(column: string) {
  const client = await pool.connect();
  try {
    const quotedColumn = `"${column}"`;
    const result = await client.query(
      `SELECT DISTINCT ${quotedColumn} FROM master_table WHERE ${quotedColumn} IS NOT NULL AND ${quotedColumn} != '' ORDER BY ${quotedColumn} LIMIT 100`
    );
    return result.rows.map(row => row[column]);
  } finally {
    client.release();
  }
}

export async function searchColumnValues(column: string, searchTerm: string) {
  const client = await pool.connect();
  try {
    const quotedColumn = `"${column}"`;
    const result = await client.query(
      `SELECT DISTINCT ${quotedColumn} FROM master_table 
       WHERE ${quotedColumn} ILIKE $1 AND ${quotedColumn} IS NOT NULL AND ${quotedColumn} != '' 
       ORDER BY ${quotedColumn} 
       LIMIT 20`,
      [`%${searchTerm}%`]
    );
    return result.rows.map(row => row[column]);
  } finally {
    client.release();
  }
}

export async function getMasterTableDataKeyset(filters: any = {}, lastSeen: string | null, limit: number = 10) {
  const client = await pool.connect();
  try {
    let whereClause = '';
    const queryParams: any[] = [];
    let paramCount = 0;

    // Build WHERE clause based on filters
    const conditions: string[] = [];
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].length > 0) {
        paramCount++;
        const placeholders = filters[key].map((_: any, index: number) => `$${paramCount + index}`).join(',');
        conditions.push(`${key} IN (${placeholders})`);
        queryParams.push(...filters[key]);
        paramCount += filters[key].length - 1;
      }
    });

    if (lastSeen) {
      paramCount++;
      conditions.push(`"created_at" < $${paramCount}`);
      queryParams.push(lastSeen);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const dataQuery = `
      SELECT * FROM master_table
      ${whereClause}
      ORDER BY "created_at" DESC
      LIMIT $${paramCount + 1}
    `;
    const dataResult = await client.query(dataQuery, [...queryParams, limit]);

    return {
      data: dataResult.rows,
      lastSeen: dataResult.rows.length > 0 ? dataResult.rows[dataResult.rows.length - 1]["created_at"] : null,
      currentPageSize: dataResult.rows.length
    };
  } finally {
    client.release();
  }
}

export async function getMasterTableDataOffset(filters: any = {}, page: number = 1, limit: number = 10) {
  const client = await pool.connect();
  try {
    let whereClause = '';
    const queryParams: any[] = [];
    let paramCount = 0;

    // Build WHERE clause based on filters
    const conditions: string[] = [];
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].length > 0) {
        paramCount++;
        const placeholders = filters[key].map((_: any, index: number) => `$${paramCount + index}`).join(',');
        conditions.push(`${key} IN (${placeholders})`);
        queryParams.push(...filters[key]);
        paramCount += filters[key].length - 1;
      }
    });

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM master_table ${whereClause}`;
    const countResult = await client.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataQuery = `
      SELECT * FROM master_table
      ${whereClause}
      ORDER BY "created_at" DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    const dataResult = await client.query(dataQuery, [...queryParams, limit, offset]);

    return {
      data: dataResult.rows,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    };
  } finally {
    client.release();
  }
}