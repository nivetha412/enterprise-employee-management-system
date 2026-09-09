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

class FlywayAttendanceForeignKeyMigrationTest {

    private static final String DB_URL = requiredEnvironment("DB_URL");
    private static final String DB_USERNAME = requiredEnvironment("DB_USERNAME");
    private static final String DB_PASSWORD = requiredEnvironment("DB_PASSWORD");

    @Test
    void removesOrphanAttendanceBeforeAddingTheForeignKey() throws Exception {
        String schema = "ems_flyway_attendance_fk_" + UUID.randomUUID().toString().replace("-", "");
        String serverUrl = DB_URL.substring(0, DB_URL.lastIndexOf('/'));
        String schemaUrl = serverUrl + "/" + schema;
        createDatabase(serverUrl, schema);

        try {
            // Establish the schema immediately before the new cleanup migration.
            Flyway.configure().dataSource(schemaUrl, DB_USERNAME, DB_PASSWORD).target("4").load().migrate();
            try (Connection connection = DriverManager.getConnection(schemaUrl, DB_USERNAME, DB_PASSWORD);
                 Statement statement = connection.createStatement()) {
                statement.executeUpdate("INSERT INTO attendance (employee_id, attendance_date, status) VALUES (999999, CURRENT_DATE, 'PRESENT')");
            }

            // This applies V4.1 cleanup, then V5's FK successfully.
            Flyway.configure().dataSource(schemaUrl, DB_USERNAME, DB_PASSWORD).load().migrate();

            try (Connection connection = DriverManager.getConnection(schemaUrl, DB_USERNAME, DB_PASSWORD);
                 Statement statement = connection.createStatement()) {
                try (ResultSet orphanCount = statement.executeQuery(
                        "SELECT COUNT(*) FROM attendance a LEFT JOIN employees e ON e.id = a.employee_id WHERE e.id IS NULL")) {
                    assertTrue(orphanCount.next());
                    assertEquals(0, orphanCount.getInt(1));
                }
                try (ResultSet foreignKeyCount = statement.executeQuery(
                        "SELECT COUNT(*) FROM information_schema.table_constraints "
                                + "WHERE constraint_schema = DATABASE() "
                                + "AND table_name = 'attendance' "
                                + "AND constraint_name = 'fk_attendance_employee' "
                                + "AND constraint_type = 'FOREIGN KEY'")) {
                    assertTrue(foreignKeyCount.next());
                    assertEquals(1, foreignKeyCount.getInt(1));
                }
            }
        } finally {
            dropDatabase(serverUrl, schema);
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

    private static String requiredEnvironment(String name) {
        String value = System.getenv(name);
        assertTrue(value != null && !value.isBlank(), name + " must be set to run migration integration tests");
        return value;
    }
}
