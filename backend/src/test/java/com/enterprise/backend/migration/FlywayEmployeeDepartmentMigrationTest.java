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

class FlywayEmployeeDepartmentMigrationTest {

    private static final String DB_URL = requiredEnvironment("DB_URL");
    private static final String DB_USERNAME = requiredEnvironment("DB_USERNAME");
    private static final String DB_PASSWORD = requiredEnvironment("DB_PASSWORD");

    @Test
    void backfillsMatchingLegacyDepartmentTextAndCreatesForeignKey() throws Exception {
        String schema = "ems_employee_department_" + UUID.randomUUID().toString().replace("-", "");
        String serverUrl = DB_URL.substring(0, DB_URL.lastIndexOf('/'));
        String schemaUrl = serverUrl + "/" + schema;
        createDatabase(serverUrl, schema);

        try {
            Flyway.configure().dataSource(schemaUrl, DB_USERNAME, DB_PASSWORD).target("7").load().migrate();
            try (Connection connection = DriverManager.getConnection(schemaUrl, DB_USERNAME, DB_PASSWORD);
                 Statement statement = connection.createStatement()) {
                statement.executeUpdate("INSERT INTO departments (department_name) VALUES ('Engineering')");
                statement.executeUpdate("INSERT INTO employees (first_name, last_name, email, department) VALUES "
                        + "('Matched', 'Employee', 'matched@example.test', ' engineering '), "
                        + "('Unmatched', 'Employee', 'unmatched@example.test', 'Legacy Only')");
            }

            Flyway.configure().dataSource(schemaUrl, DB_USERNAME, DB_PASSWORD).load().migrate();

            try (Connection connection = DriverManager.getConnection(schemaUrl, DB_USERNAME, DB_PASSWORD);
                 Statement statement = connection.createStatement()) {
                assertEquals(1, scalar(statement,
                        "SELECT COUNT(*) FROM employees e JOIN departments d ON d.id = e.department_id "
                                + "WHERE e.email = 'matched@example.test' AND d.department_name = 'Engineering'"));
                assertEquals(1, scalar(statement,
                        "SELECT COUNT(*) FROM employees WHERE email = 'unmatched@example.test' AND department_id IS NULL"));
                assertEquals(1, scalar(statement,
                        "SELECT COUNT(*) FROM information_schema.table_constraints "
                                + "WHERE constraint_schema = DATABASE() AND table_name = 'employees' "
                                + "AND constraint_name = 'fk_employee_department' AND constraint_type = 'FOREIGN KEY'"));
            }
        } finally {
            dropDatabase(serverUrl, schema);
        }
    }

    private int scalar(Statement statement, String sql) throws Exception {
        try (ResultSet result = statement.executeQuery(sql)) {
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
        assertTrue(value != null && !value.isBlank(), name + " must be set to run migration integration tests");
        return value;
    }
}
