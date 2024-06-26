# BB Architects

This is a website to upload files. 


## Table of content 

## 1-Prerequisites 

## 2-Technologies

A list of technologies used within the project :

- PHP 8.2
- Symfony 7
- API Plateform 
- WAMP Server (Windows, Apache, MySQL, PHP)
- React 

To see the logs in Symfony (dev mode), open Powershell, go to the project and run:
`Get-Content -Path "var/log/dev.log" -Wait`

## 3-Installation

1. Download the zip or clone the project in local :
`https://github.com/Melissa-code/bb_architects_project.git`

2. Move into the directory :
`cd /path/to/the/file/bb_architects_project/back`

3. Open the project with a code editor, for instance Visual Studio Code or PHPStorm 

4. Run `composer install`

5. Start WAMP Server.

6. Create the database :

- Create a new file at the root of the project `.env.local`

- Copy/paste the content of the `.env` file into the `.env.local`

- Complete the credentials in the .env.local file line 27 : 
`DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=8.0.37"`
(Replace db_user, db_password & db_name)

- And run : 
`php bin/console doctrine:database:create`

- To create the tables run the migration :
`php bin/console doctrine:migrations:migrate`


## 4-Run

- Start WAMP Server if it's not already started.

- The back web server is listening `http://127.0.0.1:8000/api`

- The front web server is listening `http://localhost:3000` : Open your browser and navigate directly to this URL. 


## 5-Build with 

### 5-1-Languages and Frameworks 

[Symfony](https://symfony.com/doc/current/index.html) 

[React](https://fr.react.dev/).

[HTML/CSS](https://developer.mozilla.org/fr/) & (https://www.w3schools.com/).

[Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/).

[Git](https://git-scm.com/docs/git/fr).


### 5-2-Tools 

[GitHub](https://github.com/).

[FontAwesome](https://fontawesome.com/).


### 5-3-IDE

[Visual Studio Code](https://code.visualstudio.com/).


## 6-Authors 

Steven & Melissa 


## 7-Licence

MIT 



