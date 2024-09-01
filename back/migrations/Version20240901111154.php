<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240901111154 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_storage_purchase (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, storage_space_id INT DEFAULT NULL, purchase_date DATETIME DEFAULT NULL, INDEX IDX_BFC9AFA1A76ED395 (user_id), INDEX IDX_BFC9AFA1809C6F07 (storage_space_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_storage_purchase ADD CONSTRAINT FK_BFC9AFA1A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_storage_purchase ADD CONSTRAINT FK_BFC9AFA1809C6F07 FOREIGN KEY (storage_space_id) REFERENCES storage_space (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_storage_purchase DROP FOREIGN KEY FK_BFC9AFA1A76ED395');
        $this->addSql('ALTER TABLE user_storage_purchase DROP FOREIGN KEY FK_BFC9AFA1809C6F07');
        $this->addSql('DROP TABLE user_storage_purchase');
    }
}
