package com.enterprise.backend.migration;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FlywayLeaveBalanceUniqueMigrationTest {
    private static final String DB_URL = requiredEnvironment("DB_URL");
    private static final String DB_USERNAME = requiredEnvironment("DB_USERNAME");
    private static final String DB_PASSWORD = requiredEnvironment("DB_PASSWORD");

    @Test
    void addsUniqueConstraintWithoutDeletingDuplicateRows() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "");
        String cleanSchema = "ems_leave_balance_clean_" + suffix;
        String duplicateSchema = "ems_leave_balance_dupe_" + suffix;
        String serverUrl = DB_URL.substring(0, DB_URL.lastIndexOf('/'));
        createDatabase(serverUrl, cleanSchema);
        createDatabase(serverUrl, duplicateSchema);

        try {
            String cleanUrl = serverUrl + "/" + cleanSchema;
            Flyway.configure().dataSource(cleanUrl, DB_USERNAME, DB_PASSWORD).load().migrate();
            assertEquals(1, uniqueIndexCount(cleanUrl));

            String duplicateUrl = serverUrl + "/" + duplicateSchema;
            Flyway.configure().dataSource(duplicateUrl, DB_USERNAME, DB_PASSWORD).target("11").load().migrate();
            try (Connection connection = DriverManager.getConnection(duplicateUrl, DB_USERNAME, DB_PASSWORD);
                 Statement statement = connection.createStatement()) {
                statement.executeUpdate("INSERT INTO employees (id, employee_code) VALUES (1, 'EMP001')");
                statement.executeUpdate("INSERT INTO employee_leave_balance (employee_id, casual_leave_balance) VALUES (1, 5), (1, 3)");
            }

            assertThrows(FlywayException.class,
                    () -> Flyway.configure().dataSource(duplicateUrl, DB_USERNAME, DB_PASSWORD).load().migrate());
            assertEquals(2, balanceRowCount(duplicateUrl));
            assertEquals(0, uniqueIndexCount(duplicateUrl));
        } finally {
            dropDatabase(serverUrl, cleanSchema);
            dropDatabase(serverUrl, duplicateSchema);
        }
    }

    private int balanceRowCount(String schemaUrl) throws Exception {
        try (Connection connection = DriverManager.getConnection(schemaUrl, DB_USERNAME, DB_PASSWORD);
             Statement statement = connection.createStatement();
             ResultSet result = statement.executeQuery("SELECT COUNT(*) FROM employee_leave_balance WHERE employee_id = 1")) {
            assertTrue(result.next());
            return result.getInt(1);
        }
    }

    private int uniqueIndexCount(String schemaUrl) throws Exception {
        try (Connection connection = DriverManager.getConnection(schemaUrl, DB_USERNAME, DB_PASSWORD);
             Statement statement = connection.createStatement();
             ResultSet result = statement.executeQuery("SELECT COUNT(*) FROM information_schema.statistics "
                     + "WHERE table_schema = DATABASE() AND table_name = 'employee_leave_balance' "
                     + "AND index_name = 'uk_employee_leave_balance_employee' AND non_unique = 0")) {
            assertTrue(result.next());
            return result.getInt(1);
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
        assertTrue(value != null && !value.isBlank(), name + " must be set for migration tests");
        return value;
    }
}