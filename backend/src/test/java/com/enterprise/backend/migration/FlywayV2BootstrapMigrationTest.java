package com.enterprise.backend.migration;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FlywayV2BootstrapMigrationTest {

    private static final String DB_URL = requiredEnvironment("DB_URL");
    private static final String DB_USERNAME = requiredEnvironment("DB_USERNAME");
    private static final String DB_PASSWORD = requiredEnvironment("DB_PASSWORD");

    @Test
    void migratesAnEmptyDatabaseAndAnExistingV2Schema() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "");
        String emptySchema = "ems_flyway_v2_empty_" + suffix;
        String existingSchema = "ems_flyway_v2_existing_" + suffix;
        String serverUrl = DB_URL.substring(0, DB_URL.lastIndexOf('/'));

        createDatabase(serverUrl, emptySchema);
        createDatabase(serverUrl, existingSchema);

        try {
            // (a) A clean database gets the whole migration chain successfully.
            String emptySchemaUrl = serverUrl + "/" + emptySchema;
            Flyway.configure().dataSource(emptySchemaUrl, DB_USERNAME, DB_PASSWORD).load().migrate();
            assertExpectedIndexes(emptySchemaUrl);

            // (b) Simulate a pre-Flyway database that already has V2's schema
            // and indexes, but no Flyway history. Re-running the chain must not
            // fail while attempting to create those existing indexes.
            String existingSchemaUrl = serverUrl + "/" + existingSchema;
            Flyway.configure().dataSource(existingSchemaUrl, DB_USERNAME, DB_PASSWORD).target("2").load().migrate();
            try (Connection connection = DriverManager.getConnection(existingSchemaUrl, DB_USERNAME, DB_PASSWORD);
                 Statement statement = connection.createStatement()) {
                statement.execute("DROP TABLE flyway_schema_history");
            }
            Flyway.configure()
                    .dataSource(existingSchemaUrl, DB_USERNAME, DB_PASSWORD)
                    .baselineOnMigrate(true)
                    .baselineVersion("1")
                    .load()
                    .migrate();
            assertExpectedIndexes(existingSchemaUrl);
        } finally {
            dropDatabase(serverUrl, emptySchema);
            dropDatabase(serverUrl, existingSchema);
        }
    }

    private void createDatabase(String serverUrl, String schema) throws Exception {
        try (Connection connection = DriverManager.getConnection(serverUrl, DB_USERNAME, DB_PASSWORD);
             Statement statement = connection.createStatement()) {
            statement.execute("CREATE DATABASE `" + schema + "`");
        }
    }

    private void dropDatabase(String serverUrl, String schema) throws Exception {
        try (Connection connection = DriverManager.getConnection(serverUrl, DB_USERNAME, DB_PASSWORD);
             Statement statement = connection.createStatement()) {
            statement.execute("DROP DATABASE IF EXISTS `" + schema + "`");
        }
    }

    private void assertExpectedIndexes(String schemaUrl) throws Exception {
        try (Connection connection = DriverManager.getConnection(schemaUrl, DB_USERNAME, DB_PASSWORD);
             Statement statement = connection.createStatement()) {
            assertEquals(1, indexCount(statement, "attendance", "idx_attendance_employee_date"));
            assertEquals(1, indexCount(statement, "leave_requests", "idx_leave_requests_employee_status"));
            assertEquals(1, indexCount(statement, "leave_requests", "idx_leave_requests_backup_employee"));
            assertEquals(1, indexCount(statement, "employee_leave_balance", "idx_employee_leave_balance_employee"));
        }
    }

    private int indexCount(Statement statement, String table, String index) throws Exception {
        String query = "SELECT COUNT(DISTINCT index_name) "
                + "FROM information_schema.statistics "
                + "WHERE table_schema = DATABASE() "
                + "AND table_name = '" + table + "' "
                + "AND index_name = '" + index + "'";
        try (ResultSet result = statement.executeQuery(query)) {
            assertTrue(result.next());
            return result.getInt(1);
        }
    }

    private static String requiredEnvironment(String name) {
        String value = System.getenv(name);
        assertTrue(value != null && !value.isBlank(), name + " must be set to run migration integration tests");
        return value;
    }
}
