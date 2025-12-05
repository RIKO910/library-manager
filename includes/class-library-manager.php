<?php
defined( 'ABSPATH' ) || exit;

/**
 * Main Plugin Class
 *
 * @since 1.0.0
 */
class LIMA_Library_Manager {

    /**
     * Single instance of the class
     * @var LIMA_Library_Manager
     *
     * @since 1.0.0
     */
    private static $instance = null;

    /**
     * Rest api for library manager
     * @var Library_Manager_REST_API
     *
     * @since 1.0.0
     */
    public $rest_api;

    /**
     * Admin handler
     * @var Library_Manager_Admin
     *
     * @since 1.0.0
     */
    public $admin;

    /**
     * File.
     *
     * @var string $file File
     *
     * @since 1.0.0
     */
    public string $file;

    /**
     * Version.
     *
     * @var mixed|string $version Version
     *
     * @since 1.0.0
     */
    public string $version = '1.0.0';

    /**
     * Get instance
     *
     * @since 1.0.0
     */
    public static function get_instance($file = '') {
        if (null === self::$instance) {
            self::$instance = new self($file);
        }
        return self::$instance;
    }

    /**
     * Constructor
     *
     * @since 1.0.0
     */
    private function __construct($file = '') {
        $this->file = $file;
        $this->define_constant();
        $this->includes();
        $this->activation();
        $this->deactivation();
        $this->init_hooks();
    }

    /**
     * Define Constant.
     *
     * @return void
     * @since 1.0.0
     */
    public function define_constant() {
        define('LIMA_VERSION', $this->version);
        define('LIMA_PLUGIN_DIR', plugin_dir_path($this->file));
        define('LIMA_PLUGIN_URL', plugin_dir_url($this->file));
        define('LIMA_PLUGIN_BASENAME', plugin_basename($this->file));
    }

    /**
     * Include required files
     *
     * @since 1.0.0
     */
    private function includes() {
        require_once LIMA_PLUGIN_DIR . 'includes/class-database.php';
        require_once LIMA_PLUGIN_DIR . 'includes/class-rest-api.php';
        require_once LIMA_PLUGIN_DIR . 'includes/class-admin.php';
    }

    /**
     * Activation.
     *
     * @return void
     * @since 1.0.0
     */
    public function activation() {
        register_activation_hook( $this->file, array( $this, 'activation_hook' ) );
    }

    /**
     * Activation hook.
     *
     * @return void
     * @since 1.0.0
     */
    public function activation_hook() {
    }

    /**
     * Deactivation.
     *
     * @return void
     * @since 1.0.0
     */
    public function deactivation() {
        register_deactivation_hook( $this->file, array( $this, 'deactivation_hook' ) );
    }

    /**
     * Deactivation hook
     *
     * @return void
     * @since 1.0.0
     */
    public function deactivation_hook() {
    }

    /**
     * Initialize hooks
     *
     * @since 1.0.0
     * @return void
     */
    private function init_hooks() {
        add_action('init', array($this, 'init'));
    }

    /**
     * Initialize plugin components
     *
     * @since 1.0.0
     * @return void
     */
    public function init() {
        $this->rest_api = new Library_Manager_REST_API();
        if ( is_admin() ) {
            $this->admin    = new Library_Manager_Admin();
        }
    }
}