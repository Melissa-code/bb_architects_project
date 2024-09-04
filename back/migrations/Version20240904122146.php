<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240904122146 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `order` ADD storage_space_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F5299398809C6F07 FOREIGN KEY (storage_space_id) REFERENCES storage_space (id)');
        $this->addSql('CREATE INDEX IDX_F5299398809C6F07 ON `order` (storage_space_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `order` DROP FOREIGN KEY FK_F5299398809C6F07');
        $this->addSql('DROP INDEX IDX_F5299398809C6F07 ON `order`');
        $this->addSql('ALTER TABLE `order` DROP storage_space_id');
    }
}
