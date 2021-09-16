# Nullboard
Nullboard is a minimalist take on a kanban board / a task list manager, designed to be compact, readable and quick in use.

This is a fork of https://github.com/apankrat/nullboard.

## Example
![Here is a pic](example.png)

## Changes
The major change is that the boards are now stored on the server, rather than the client.

The backend now uses PHP and SQLite3 to store the boards.

There are also fewer features (including history, undo-redo) that I elected to remove in the process of refactoring.

I also removed the options for changing font size and changing the theme.

This was purely a personal decision since I revamped most of the styling anyway, opting for a dark theme with larger text.

## Installation with Docker-Compose
To install with Docker-Compose:
 * Clone the Repository
 * Edit the docker-compose.yml file to change the published port and set volume mount location
 * Create and run the container <br /> `docker-compose up -d`
 * Set volume permissions <br /> `chown www-data:www-data <path-to-volume>`
 * Access Nullboard at `http://<IP-ADDRESS:PORT>`

## Installation without Docker
To install on Debian:
 * Clone the Repository
 * Install Apache, PHP, and SQLite3 <br /> `sudo apt-get install apache2 php libapache2-mod-php sqlite3 php-sqlite3`
 * Copy the app folder into Apache's root directory <br /> `sudo cp -r nullboard/app/* /var/www/html`
 * Change permissions on Apache's root directory so PHP can write <br /> `sudo chown -R www-data:www-data /var/www/html`
 * Access Nullboard at `http://<IP-ADDRESS>`
