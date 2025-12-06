<?php
defined( 'ABSPATH' ) || exit;
/**
 * Admin Handler Class
 *
 * @since 1.0.0
 */
class Library_Manager_Admin {

    /**
     * Constructor
     *
     * @since 1.0.0
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_menu_page'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
    }

    /**
     * Add admin menu page
     *
     * @since 1.0.0
     * @return void
     */
    public function add_menu_page() {
        add_menu_page(
            'Library Manager',
            'Library Manager',
            'edit_posts',
            'library-manager',
            array($this, 'render_admin_page'),
            'dashicons-book',
            30
        );
    }

    /**
     * Render admin page
     *
     * @return void
     * @since 1.0.0
     */
    public function render_admin_page() {
        ?>
        <div class="library-manager">
            <div id="library-manager-root"></div>
        </div>
        <?php
    }

    /**
     * Enqueue scripts and styles
     *
     * @return void
     * @since 1.0.0
     */
    public function enqueue_scripts($hook) {

        if ($hook !== 'toplevel_page_library-manager') {
            return;
        }

        wp_enqueue_script(
            'library-manager-app',
            LIMA_PLUGIN_URL . 'admin/dist/bundle.js',
            array(),
            LIMA_VERSION,
            true
        );

        wp_localize_script('library-manager-app', 'libraryManager', array(
            'restUrl' => rest_url('library/v1'),
            'nonce' => wp_create_nonce('wp_rest')
        ));

        wp_enqueue_style(
            'library-manager-tailwind',
            LIMA_PLUGIN_URL . 'admin/dist/tailwind.css',
            array(),
            LIMA_VERSION
        );
    }
}