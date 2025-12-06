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
    }

    /**
     * Get all books with optional filters
     */
    public static function get_books($params = array()) {
        global $wpdb;
        $table_name = self::get_table_name();

        // Default parameters
        $defaults = array(
            'search' => '',
            'status' => '',
            'author' => '',
            'year' => '',
            'page' => 1,
            'per_page' => 10,
            'orderby' => 'created_at',
            'order' => 'DESC'
        );

        $params = wp_parse_args($params, $defaults);

        // Build WHERE clause
        $where_conditions = array('1=1');
        $where_values = array();

        // General search across multiple fields
        if (!empty($params['search'])) {
            $search_term = '%' . $wpdb->esc_like($params['search']) . '%';
            $where_conditions[] = $wpdb->prepare(
                "(title LIKE %s OR author LIKE %s OR description LIKE %s)",
                $search_term,
                $search_term,
                $search_term
            );
        }

        // Author filter
        if (!empty($params['author'])) {
            $author_term = '%' . $wpdb->esc_like($params['author']) . '%';
            $where_conditions[] = $wpdb->prepare("author LIKE %s", $author_term);
        }

        // Status filter
        if (!empty($params['status'])) {
            $where_conditions[] = $wpdb->prepare("status = %s", $params['status']);
        }

        // Year filter
        if (!empty($params['year'])) {
            $where_conditions[] = $wpdb->prepare("publication_year = %d", intval($params['year']));
        }

        $where_clause = implode(' AND ', $where_conditions);

        // Count total books
        $count_query = "SELECT COUNT(*) FROM {$table_name} WHERE {$where_clause}";
        $total_books = $wpdb->get_var($count_query);

        // Calculate pagination
        $offset = (intval($params['page']) - 1) * intval($params['per_page']);

        // Validate and sanitize ORDER BY
        $allowed_orderby = array('id', 'title', 'author', 'publication_year', 'status', 'created_at');
        $orderby = in_array($params['orderby'], $allowed_orderby) ? $params['orderby'] : 'created_at';
        $order = strtoupper($params['order']) === 'ASC' ? 'ASC' : 'DESC';

        // Main query with pagination
        $query = $wpdb->prepare(
            "SELECT * FROM {$table_name} 
         WHERE {$where_clause} 
         ORDER BY {$orderby} {$order} 
         LIMIT %d OFFSET %d",
            intval($params['per_page']),
            $offset
        );

        $books = $wpdb->get_results($query, ARRAY_A);

        return array(
            'books' => $books ? $books : array(),
            'total' => intval($total_books),
            'page' => intval($params['page']),
            'per_page' => intval($params['per_page']),
            'pages' => ceil($total_books / $params['per_page'])
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