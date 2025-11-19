/**
 * Generate TypeORM migrations for multiple database types without requiring
 * actual database connections. This script uses TypeORM's schema synchronization
 * to generate CREATE TABLE statements from entity metadata.
 */

require('reflect-metadata');
const { DataSource } = require('typeorm');
const path = require('path');
const fs = require('fs');

// Register tsconfig paths
const tsconfigPaths = require('tsconfig-paths');
const baseUrl = path.join(__dirname, '.');
tsconfigPaths.register({
  baseUrl,
  paths: {
    '@common/*': ['dist/Common/*', 'src/Common/*'],
    '@users/*': ['dist/Users/*', 'src/Users/*'],
    '@llm/*': ['dist/Llms/*', 'src/Llms/*'],
    '@jobs/*': ['dist/Jobs/*', 'src/Jobs/*'],
  },
});

const optionsBase = {
  entities: [path.join(__dirname, 'dist/**/*.entity.js')],
  synchronize: false,
  logging: false,
};

/**
 * Generate migration file for a specific database type
 */
async function generateMigrationForDB(dbType) {
  console.log(`\nGenerating schema for ${dbType}...`);
  
  let dataSource;
  
  try {
    // Create DataSource configuration for the specific DB type
    if (dbType === 'sqlite') {
      dataSource = new DataSource({
        type: 'better-sqlite3',
        database: ':memory:',
        ...optionsBase,
        synchronize: false,
        dropSchema: false,
      });
    } else if (dbType === 'postgres') {
      dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'dummy',
        password: 'dummy',
        database: 'dummy',
        ...optionsBase,
        synchronize: false,
        dropSchema: false,
      });
    } else if (dbType === 'mysql') {
      dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'dummy',
        password: 'dummy',
        database: 'dummy',
        ...optionsBase,
        synchronize: false,
        dropSchema: false,
      });
    }

    // For SQLite, we can initialize and generate
    if (dbType === 'sqlite') {
      await dataSource.initialize();
      
      // Get the SQL queries for schema creation
      const sqlInMemory = await dataSource.driver.createSchemaBuilder().build();
      const upQueries = sqlInMemory.upQueries || [];
      const downQueries = sqlInMemory.downQueries || [];
      
      await dataSource.destroy();
      
      return {
        upQueries: upQueries.map(q => q.query),
        downQueries: downQueries.map(q => q.query),
      };
    } else {
      // For postgres and mysql, we need to generate SQL without connecting
      // Use the schema builder directly
      const metadata = dataSource.entityMetadatas;
      const upQueries = [];
      const downQueries = [];
      
      // Generate CREATE TABLE statements from entity metadata
      for (const entityMetadata of metadata) {
        const tableName = entityMetadata.tableName;
        const columns = entityMetadata.columns;
        
        // Build CREATE TABLE statement
        const columnDefs = columns.map(col => {
          let def = `"${col.databaseName}" `;
          
          // Map TypeORM types to database types
          if (dbType === 'postgres') {
            if (col.type === 'varchar') {
              def += `VARCHAR${col.length ? `(${col.length})` : ''}`;
            } else if (col.type === 'uuid') {
              def += 'UUID';
            } else if (col.type === 'text') {
              def += 'TEXT';
            } else if (col.type === 'int' || col.type === 'integer') {
              def += 'INTEGER';
            } else if (col.type === 'boolean') {
              def += 'BOOLEAN';
            } else if (col.type === 'timestamp' || col.type === 'datetime') {
              def += 'TIMESTAMP';
            } else if (col.type === 'json') {
              def += 'JSONB';
            } else {
              def += col.type.toString().toUpperCase();
            }
          } else if (dbType === 'mysql') {
            if (col.type === 'varchar') {
              def += `VARCHAR${col.length ? `(${col.length})` : '(255)'}`;
            } else if (col.type === 'uuid') {
              def += 'VARCHAR(36)';
            } else if (col.type === 'text') {
              def += 'TEXT';
            } else if (col.type === 'int' || col.type === 'integer') {
              def += 'INT';
            } else if (col.type === 'boolean') {
              def += 'TINYINT(1)';
            } else if (col.type === 'timestamp' || col.type === 'datetime') {
              def += 'DATETIME';
            } else if (col.type === 'json') {
              def += 'JSON';
            } else {
              def += col.type.toString().toUpperCase();
            }
          }
          
          // Add NOT NULL constraint
          if (!col.isNullable) {
            def += ' NOT NULL';
          }
          
          // Add DEFAULT value
          if (col.default !== undefined && col.default !== null) {
            if (col.isGenerated && col.generationStrategy === 'uuid') {
              // Skip - handled by database
            } else if (col.isCreateDate || col.isUpdateDate) {
              if (dbType === 'postgres') {
                def += ' DEFAULT now()';
              } else if (dbType === 'mysql') {
                def += ' DEFAULT CURRENT_TIMESTAMP';
              } else {
                def += " DEFAULT (datetime('now'))";
              }
            } else if (typeof col.default === 'string') {
              def += ` DEFAULT '${col.default}'`;
            } else if (typeof col.default === 'boolean') {
              if (dbType === 'postgres') {
                def += ` DEFAULT ${col.default}`;
              } else {
                def += ` DEFAULT ${col.default ? 1 : 0}`;
              }
            } else {
              def += ` DEFAULT ${col.default}`;
            }
          }
          
          // Add PRIMARY KEY for primary columns
          if (col.isPrimary && !col.isGenerated) {
            def += ' PRIMARY KEY';
          }
          
          return def;
        }).join(',\n            ');
        
        // Add primary key constraint if generated
        const pkCols = columns.filter(c => c.isPrimary);
        let pkConstraint = '';
        if (pkCols.length > 0 && pkCols[0].isGenerated) {
          if (dbType === 'postgres') {
            // PostgreSQL uses SERIAL or generated columns
            const pkCol = pkCols[0];
            if (pkCol.generationStrategy === 'uuid') {
              // Already handled in column definition
            }
          }
        }
        
        const createTable = `CREATE TABLE "${tableName}" (\n            ${columnDefs}${pkConstraint}\n        )`;
        upQueries.push(createTable);
        
        // Generate DROP TABLE for down migration
        downQueries.unshift(`DROP TABLE "${tableName}"`);
        
        // Generate indexes
        for (const index of entityMetadata.indices) {
          const indexColumns = index.columns.map(c => `"${c.databaseName}"`).join(', ');
          const indexName = index.name || `IDX_${tableName}_${index.columns.map(c => c.databaseName).join('_')}`;
          upQueries.push(`CREATE INDEX "${indexName}" ON "${tableName}" (${indexColumns})`);
          downQueries.unshift(`DROP INDEX "${indexName}"`);
        }
        
        // Generate unique constraints
        for (const unique of entityMetadata.uniques) {
          const uniqueColumns = unique.columns.map(c => `"${c.databaseName}"`).join(', ');
          const uniqueName = unique.name || `UQ_${tableName}_${unique.columns.map(c => c.databaseName).join('_')}`;
          upQueries.push(`CREATE UNIQUE INDEX "${uniqueName}" ON "${tableName}" (${uniqueColumns})`);
          downQueries.unshift(`DROP INDEX "${uniqueName}"`);
        }
      }
      
      return { upQueries, downQueries };
    }
  } catch (error) {
    console.error(`Error generating schema for ${dbType}:`, error.message);
    return { upQueries: [], downQueries: [] };
  }
}

/**
 * Create migration file with the generated queries
 */
function createMigrationFile(dbType, timestamp, queries) {
  const { upQueries, downQueries } = queries;
  
  const className = `Init${timestamp}`;
  const fileName = `migrations/${timestamp}-init_${dbType}.js`;
  
  // Format queries for the migration file
  const formattedUpQueries = upQueries
    .map(q => `        await queryRunner.query(\`${q}\`);`)
    .join('\n');
  
  const formattedDownQueries = downQueries
    .map(q => `        await queryRunner.query(\`${q}\`);`)
    .join('\n');
  
  const content = `const { MigrationInterface, QueryRunner } = require("typeorm");

class ${className} {
    async up(queryRunner) {
${formattedUpQueries || '        // No queries generated'}
    }

    async down(queryRunner) {
${formattedDownQueries || '        // No queries generated'}
    }
}

module.exports = ${className};
`;
  
  // Ensure migrations directory exists
  const migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  fs.writeFileSync(fileName, content);
  console.log(`✓ Created ${fileName}`);
  
  return fileName;
}

/**
 * Main execution
 */
async function main() {
  const dbTypes = ['sqlite', 'postgres', 'mysql'];
  const timestamp = Date.now();
  
  for (const dbType of dbTypes) {
    const queries = await generateMigrationForDB(dbType);
    const fileName = createMigrationFile(dbType, timestamp, queries);
    
    // Also create a named version
    const namedFile = `migrations/init_${dbType}.js`;
    fs.copyFileSync(fileName, namedFile);
    console.log(`✓ Copied to ${namedFile}`);
  }
  
  console.log('\n✓ All migrations generated successfully');
  process.exit(0);
}

main().catch(error => {
  console.error('Error generating migrations:', error);
  process.exit(1);
});
