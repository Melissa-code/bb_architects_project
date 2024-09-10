# BB Architects

An architecture firm needs to store their clients' files. 
The platform must be fully secured, with the home page serving as the login page.

### Features

#### For the firm’s clients:
- Ability to register and log in
- Access their personal storage space to:
    - View uploaded files
    - Upload new files
    - Delete files
- Delete their account

#### For the firm (Super admin):
- Access a list of clients along with their used and available storage volume
- Have visibility over all client files
- Access a dashboard with statistics


## Prerequisites 

- WAMP / XAMPP 

- MySQL 8.0.31

- PHP 8.2

- Composer 2.6.5

- Symfony 7.1.1

- The Symfony CLI version 5.4.13 

  [cf. the usual Symfony application requirements](https://symfony.com/download).

- Node.js 

- npm 

- Vite 


## Installation

1. Download the zip or clone the project :
`https://github.com/Melissa-code/bb_architects_project.git`


2. Move into the directory :
`cd /path/to/the/file/bb_architects_project/back`


3. Open the project with a code editor, for instance Visual Studio Code or PHPStorm 


4. Run `composer install`


5. Start WAMP or XAMPP


6. Create the database bb_architects :

- Create a new file at the root of the project `.env.local`

- Copy/paste the content of the `.env` file into the `.env.local`

- Complete the credentials in the .env.local file line 27 :
`DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=8.0.37"`
(Replace db_user, db_password & db_name)

- And run :
`php bin/console doctrine:database:create`


- To create the tables, make a migration :
`php bin/console make:migration`

- and then run the migration : 
`php bin/console doctrine:migrations:migrate`


- To create fixtures :
`composer req orm-fixtures --dev`

- To load fixtures : 
`php bin/console doctrine:fixtures:load --append`


- To use API Plateform :
`composer req api` and add in the entity `#[ApiResource]` (URL /api)


## Run

- Start WAMP / XAMPP if it's not already started
- Start the local web server : `symfony server:start` 
- To stop it : `symfony server:stop`


- The back web server is listening `http://127.0.0.1:8000/api` or `http://127.0.0.1:8001/api`


- The front web server is listening `http://localhost:5173/connect/login`: Open your browser and navigate directly to this URL


## Add an Administrator 

- Create a new user with the Create a new account form of the application

- Use in the terminal : `php bin/console doctrine:query:sql "UPDATE user SET user.roles = '[\"ROLE_ADMIN\"]' WHERE user.id = 1;"`


- Or use in the terminal a SQL command :

`mysql -u root -p`

`USE bb_architects;`

`UPDATE user SET roles = '["ROLE_ADMIN"]' WHERE id = 1;`

`exit`


## Create a JWT token 

- Install openSSL for Windows
- Add environment Variables in var système : `C:windows->programs->OpenSSL-Win64->bin->copie path`
- Check the installation with the command `openssl version`

- Install the bundle [lexik/jwt-authentication-bundle](https://symfony.com/bundles/LexikJWTAuthenticationBundle/current/index.html)
- Run the command : `php composer.phar require "lexik/jwt-authentication-bundle"`
- Generate the public & private keys: `php bin/console lexik:jwt:generate-keypair`
- Configure the SSL keys path and passphrase in your .env.local
- Edit the config/packages/security.yaml file 
- Configure the application routing
- Comment the line 1952 dans php.ini (path: `wamp/bin/php/php8.20/php.ini [openssl]`) 


## Send an email 

- Create a free account in [Mailjet](https://app.mailjet.com/signup?lang=en_US)
- In Préférences compte Mailjet -> Gestion des clés API -> clé API -> générer une clé secrète
- Documentation : [Official Mailjet PHP Wrapper](https://github.com/mailjet/mailjet-apiv3-php)
- Install the bundle : `composer require mailjet/mailjet-apiv3-php`
- In .env.local, copy/paste the keys : 
`MJ_APIKEY_PUBLIC='public_key'`
`MJ_APIKEY_PRIVATE='private_key'`


- Download the file [cacert.pem](https://curl.se/docs/caextract.html)
- Save it in `Wamp/bin/php/php8.2.0`
- Edit the file `Wamp/bin/php/php8.2.0 php.ini`
- line 1940 : [curl] edit `curl.cainfo = "C:/wamp64/bin/php/php8.2.0/cacert.pem"`


## Debug 

- To see the logs in Symfony (dev mode), open Powershell, go to the project and run:
`Get-Content -Path "var/log/dev.log" -Wait`

- Or check the logs in the folder in the back : `var/log/dev.log`


## Build with 

### Languages and Frameworks 

[Symfony](https://symfony.com/doc/current/index.html)

[PHP](https://www.php.net/manual/fr/index.php)

[Doctrine](https://www.doctrine-project.org/projects/doctrine-orm/en/2.14/index.html)

[SQL](https://sql.sh/)

[Vite](https://vitejs.dev/)

[JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)

[HTML/CSS](https://developer.mozilla.org/fr/) 

[Material UI](https://mui.com/material-ui/)

[Git](https://git-scm.com/docs/git/fr)


### Tools 

[GitHub](https://github.com/)


### IDE

[Visual Studio Code](https://code.visualstudio.com/) & [PHPStorm]()


## Authors 

Steven & Melissa 


## Licence

MIT 



