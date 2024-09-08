<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240908202554 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE storage_space_user DROP FOREIGN KEY FK_76B2AA4D809C6F07');
        $this->addSql('ALTER TABLE storage_space_user DROP FOREIGN KEY FK_76B2AA4DA76ED395');
        $this->addSql('DROP TABLE storage_space_user');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE storage_space_user (storage_space_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_76B2AA4D809C6F07 (storage_space_id), INDEX IDX_76B2AA4DA76ED395 (user_id), PRIMARY KEY(storage_space_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE storage_space_user ADD CONSTRAINT FK_76B2AA4D809C6F07 FOREIGN KEY (storage_space_id) REFERENCES storage_space (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE storage_space_user ADD CONSTRAINT FK_76B2AA4DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
    }
}
