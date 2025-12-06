<?php
defined( 'ABSPATH' ) || exit;
/**
 * Database handler for Library Manager
 *
 * @since 1.0.0
 */
class Library_Manager_Database {

    /**
     * Get table name
     */
    public static function get_table_name() {
        global $wpdb;
        return $wpdb->prefix . 'lima_library_books';
    }

    /**
     * Create database table
     */
    public static function create_table() {
        global $wpdb;

        $table_name = self::get_table_name();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            description LONGTEXT,
            author VARCHAR(255),
            publication_year INT,
            status ENUM('available','borrowed','unavailable') DEFAULT 'available',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

        update_option('library_manager_db_version', LIMA_VERSION);
    }

    /**
     * Get all books with optional filters
     */
    public static function get_books($args = array()) {
        global $wpdb;

        $table_name = self::get_table_name();

        // Default arguments
        $defaults = array(
            'status' => '',
            'author' => '',
            'year' => '',
            'page' => 1,
            'per_page' => 10
        );

        $args = wp_parse_args($args, $defaults);

        // Build query
        $where = array('1=1');
        $prepare_args = array();

        if (!empty($args['status'])) {
            $where[] = 'status = %s';
            $prepare_args[] = $args['status'];
        }

        if (!empty($args['author'])) {
            $where[] = 'author LIKE %s';
            $prepare_args[] = '%' . $wpdb->esc_like($args['author']) . '%';
        }

        if (!empty($args['year'])) {
            $where[] = 'publication_year = %d';
            $prepare_args[] = intval($args['year']);
        }

        $where_clause = implode(' AND ', $where);

        // Pagination
        $limit = intval($args['per_page']);
        $offset = (intval($args['page']) - 1) * $limit;

        // Get total count
        $count_query = "SELECT COUNT(*) FROM $table_name WHERE $where_clause";
        if (!empty($prepare_args)) {
            $count_query = $wpdb->prepare($count_query, $prepare_args);
        }
        $total = $wpdb->get_var($count_query);

        // Get books
        $query = "SELECT * FROM $table_name WHERE $where_clause ORDER BY created_at DESC LIMIT %d OFFSET %d";
        $prepare_args[] = $limit;
        $prepare_args[] = $offset;

        $books = $wpdb->get_results($wpdb->prepare($query, $prepare_args), ARRAY_A);

        return array(
            'books' => $books,
            'total' => intval($total),
            'page' => intval($args['page']),
            'per_page' => $limit
        );
    }

    /**
     * Get single book by ID
     */
    public static function get_book($id) {
        global $wpdb;

        $table_name = self::get_table_name();

        $query = $wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id);

        return $wpdb->get_row($query, ARRAY_A);
    }

    /**
     * Create new book
     */
    public static function create_book($data) {
        global $wpdb;

        $table_name = self::get_table_name();

        $insert_data = array(
            'title' => sanitize_text_field($data['title']),
            'description' => wp_kses_post($data['description'] ?? ''),
            'author' => sanitize_text_field($data['author'] ?? ''),
            'publication_year' => !empty($data['publication_year']) ? intval($data['publication_year']) : null,
            'status' => sanitize_text_field($data['status'] ?? 'available')
        );

        $format = array('%s', '%s', '%s', '%d', '%s');

        $result = $wpdb->insert($table_name, $insert_data, $format);

        if ($result === false) {
            return false;
        }

        return $wpdb->insert_id;
    }

    /**
     * Update book
     */
    public static function update_book($id, $data) {
        global $wpdb;

        $table_name = self::get_table_name();

        $update_data = array();
        $format = array();

        if (isset($data['title'])) {
            $update_data['title'] = sanitize_text_field($data['title']);
            $format[] = '%s';
        }

        if (isset($data['description'])) {
            $update_data['description'] = wp_kses_post($data['description']);
            $format[] = '%s';
        }

        if (isset($data['author'])) {
            $update_data['author'] = sanitize_text_field($data['author']);
            $format[] = '%s';
        }

        if (isset($data['publication_year'])) {
            $update_data['publication_year'] = intval($data['publication_year']);
            $format[] = '%d';
        }

        if (isset($data['status'])) {
            $update_data['status'] = sanitize_text_field($data['status']);
            $format[] = '%s';
        }

        if (empty($update_data)) {
            return false;
        }

        $result = $wpdb->update(
            $table_name,
            $update_data,
            array('id' => $id),
            $format,
            array('%d')
        );

        return $result !== false;
    }

    /**
     * Delete book
     */
    public static function delete_book($id) {
        global $wpdb;

        $table_name = self::get_table_name();

        $result = $wpdb->delete(
            $table_name,
            array('id' => $id),
            array('%d')
        );

        return $result !== false;
    }
}