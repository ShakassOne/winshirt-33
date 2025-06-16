<?php
/**
 * Plugin Name: WinShirt
 * Description: WinShirt plugin.
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Autoload all PHP files from includes and admin directories
foreach (['includes', 'admin'] as $dir) {
    foreach (glob(plugin_dir_path(__FILE__) . "$dir/*.php") as $file) {
        require_once $file;
    }
}

function winshirt_add_admin_menu() {
    add_menu_page(
        'WinShirt',
        'WinShirt',
        'manage_options',
        'winshirt',
        'winshirt_admin_page'
    );
}
add_action('admin_menu', 'winshirt_add_admin_menu');

function winshirt_admin_page() {
    include plugin_dir_path(__FILE__) . 'templates/admin-page.php';
}
