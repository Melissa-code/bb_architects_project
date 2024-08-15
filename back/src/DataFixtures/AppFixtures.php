<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\File;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Exception;

class AppFixtures extends Fixture
{
    private ObjectManager $manager;
    private array $categoryEntities = [];

    /**
     * @throws Exception
     */
    public function load(ObjectManager $manager): void
    {
        $this->manager = $manager;

        //$this->loadCategory();
        //$this->loadFile();

        $manager->flush();
    }

    /**
     * Load the categories
     */
    public function loadCategory(): void
    {
        $categories = ['Plan', 'Dessin technique', 'Document légal', 'Etude technique', 'Document financier'];
        foreach ($categories as $categoryName) {
            $category = new Category();
            $category->setName($categoryName);
            $this->manager->persist($category);
            $this->categoryEntities[] = $category;
        }
    }

    /**
     * Load files
     * @throws Exception
     */
    public function loadFile(): void
    {
        $now = new DateTimeImmutable();
        $users = $this->manager->getRepository(User::class)->findAll();

        if (empty($users)) {
            throw new Exception('Aucun utilisateur trouvé en base de données.');
        }
        if (empty($this->categoryEntities)) {
            throw new Exception('Aucune catégorie trouvée en base de données.');
        }

        foreach ($users as $user) {
            for ($i = 1; $i < 4; $i++) {
                $file = new File();
                $file->setUser($user);

                $randomCategory = $this->categoryEntities[array_rand($this->categoryEntities)];
                $file->setCategory($randomCategory);

                $file->setName('Document_' . $i . '_User_' . $user->getId());
                $file->setWeight(rand(1, 20)); // Go
                $file->setFormat('pdf');
                $file->setPath('/documents/document_' . $i . '_user_' . $user->getId() . '.pdf');
                $file->setCreatedAt($now);

                $this->manager->persist($file);
            }
        }
    }
}
