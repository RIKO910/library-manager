<?php
defined( 'ABSPATH' ) || exit;
/**
 * Rest api Handler
 *
 * @since 1.0.0
 */
class Library_Manager_REST_API {

    private $namespace = 'library/v1';

    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    /**
     * Register REST API routes
     *
     * @since 1.0.0
     * @return void
     */
    public function register_routes() {
        // GET /books
        register_rest_route($this->namespace, '/books', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_books'),
            'permission_callback' => '__return_true'
        ));

        // GET /books/{id}
        register_rest_route($this->namespace, '/books/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_book'),
            'permission_callback' => '__return_true',
            'args' => array(
                'id' => array(
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                )
            )
        ));

        // POST /books
        register_rest_route($this->namespace, '/books', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_book'),
            'permission_callback' => array($this, 'check_permission'),
            'args' => $this->get_book_args()
        ));

        // PUT /books/{id}
        register_rest_route($this->namespace, '/books/(?P<id>\d+)', array(
            'methods' => array('PUT', 'PATCH'),
            'callback' => array($this, 'update_book'),
            'permission_callback' => array($this, 'check_permission'),
            'args' => array_merge(
                array(
                    'id' => array(
                        'validate_callback' => function($param) {
                            return is_numeric($param);
                        }
                    )
                ),
                $this->get_book_args(false)
            )
        ));

        // DELETE /books/{id}
        register_rest_route($this->namespace, '/books/(?P<id>\d+)', array(
            'methods' => 'DELETE',
            'callback' => array($this, 'delete_book'),
            'permission_callback' => array($this, 'check_permission'),
            'args' => array(
                'id' => array(
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                )
            )
        ));
    }

    /**
     * Permission callback
     */
    public function check_permission() {
        return current_user_can('edit_posts');
    }

    /**
     * Get validation arguments for book
     */
    private function get_book_args($required = true) {
        return array(
            'title' => array(
                'required' => $required,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => function($param) {
                    return !empty($param);
                }
            ),
            'description' => array(
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'wp_kses_post'
            ),
            'author' => array(
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field'
            ),
            'publication_year' => array(
                'required' => false,
                'type' => 'integer',
                'validate_callback' => function($param) {
                    return empty($param) || (is_numeric($param) && $param > 0 && $param <= gmdate('Y') + 1);
                }
            ),
            'status' => array(
                'required' => false,
                'type' => 'string',
                'default' => 'available',
                'enum' => array('available', 'borrowed', 'unavailable'),
                'validate_callback' => function($param) {
                    return in_array($param, array('available', 'borrowed', 'unavailable'));
                }
            )
        );
    }

    /**
     * GET /books
     */
    public function get_books($request) {
        $params = array(
            'search' => $request->get_param('search'),
            'status' => $request->get_param('status'),
            'author' => $request->get_param('author'),
            'year' => $request->get_param('year'),
            'page' => $request->get_param('page') ?: 1,
            'per_page' => $request->get_param('per_page') ?: 10
        );

        $result = Library_Manager_Database::get_books($params);

        return new WP_REST_Response($result, 200);
    }

    /**
     * GET /books/{id}
     */
    public function get_book($request) {
        $id = $request->get_param('id');
        $book = Library_Manager_Database::get_book($id);

        if (!$book) {
            return new WP_REST_Response(
                array('message' => 'Book not found'),
                404
            );
        }

        return new WP_REST_Response($book, 200);
    }

    /**
     * POST /books
     */
    public function create_book($request) {
        $data = array(
            'title' => $request->get_param('title'),
            'description' => $request->get_param('description'),
            'author' => $request->get_param('author'),
            'publication_year' => $request->get_param('publication_year'),
            'status' => $request->get_param('status') ?: 'available'
        );

        $book_id = Library_Manager_Database::create_book($data);

        if (!$book_id) {
            return new WP_REST_Response(
                array('message' => 'Failed to create book'),
                500
            );
        }

        $book = Library_Manager_Database::get_book($book_id);

        return new WP_REST_Response($book, 201);
    }

    /**
     * PUT /books/{id}
     */
    public function update_book($request) {
        $id = $request->get_param('id');

        // Check if book exists
        $existing = Library_Manager_Database::get_book($id);
        if (!$existing) {
            return new WP_REST_Response(
                array('message' => 'Book not found'),
                404
            );
        }

        $data = array();

        if ($request->has_param('title')) {
            $data['title'] = $request->get_param('title');
        }
        if ($request->has_param('description')) {
            $data['description'] = $request->get_param('description');
        }
        if ($request->has_param('author')) {
            $data['author'] = $request->get_param('author');
        }
        if ($request->has_param('publication_year')) {
            $data['publication_year'] = $request->get_param('publication_year');
        }
        if ($request->has_param('status')) {
            $data['status'] = $request->get_param('status');
        }

        $result = Library_Manager_Database::update_book($id, $data);

        if (!$result) {
            return new WP_REST_Response(
                array('message' => 'Failed to update book'),
                500
            );
        }

        $book = Library_Manager_Database::get_book($id);

        return new WP_REST_Response($book, 200);
    }

    /**
     * DELETE /books/{id}
     */
    public function delete_book($request) {
        $id = $request->get_param('id');

        // Check if book exists
        $existing = Library_Manager_Database::get_book($id);
        if (!$existing) {
            return new WP_REST_Response(
                array('message' => 'Book not found'),
                404
            );
        }

        $result = Library_Manager_Database::delete_book($id);

        if (!$result) {
            return new WP_REST_Response(
                array('message' => 'Failed to delete book'),
                500
            );
        }

        return new WP_REST_Response(
            array('message' => 'Book deleted successfully'),
            200
        );
    }
}