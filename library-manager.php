<?php
/**
 * Plugin Name: Library Manager
 * Plugin URI: https://www.tarikul.top/library-manager/
 * Description: Library Manager with React
 * Version: 1.0.0
 * Author: Syed Tarikul Islam
 * Author URI: https://www.tarikul.top/
 * Text Domain: library-manager
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/includes/class-library-manager.php';

/**
 * Activation hook callback.
 *
 * @since 1.0.0
 */
function lima_activation_hook() {
    require_once __DIR__ . '/includes/class-database.php';
    Library_Manager_Database::create_table();
}

register_activation_hook( __FILE__, 'lima_activation_hook' );

/**
 * Initializing Plugin.
 *
 * @since 1.0.0
 * @return Object Plugin object.
 */
function lima_init() {
    return LIMA_Library_Manager::get_instance(__FILE__);
}

add_action('plugins_loaded', 'lima_init');