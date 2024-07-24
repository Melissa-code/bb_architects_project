<?php

namespace App\DataFixtures;

use App\Entity\File;
use App\Repository\FileRepository;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private ObjectManager $manager;
    private UserPasswordHasherInterface $passwordHasher;

    private FileRepository $fileRepository;

    public function __construct(UserPasswordHasherInterface $passwordHasher, FileRepository $fileRepository)
    {
        $this->passwordHasher = $passwordHasher;
        $this->fileRepository = $fileRepository;
    }

    public function load(ObjectManager $manager): void
    {
        $this->manager = $manager;
        $this->loadFile();

        // $product = new Product();
        // $manager->persist($product);
        $manager->flush();
    }

    /**
     * Create files
     */
    public function loadFile(): void
    {
        $files = [];
        $counter = 1;
        $numberOfFiles = 4;

        for ($i = 0; $i < $numberOfFiles; $i++) {
            $files[] = [
                'name' => 'Fichier ' . $counter,
                'weight' => 123,
                'format' => 'pdf',
                'path' => '/assets/fichiers/fichier' . $counter . '.pdf',
                'createdAt' => new DateTimeImmutable()
            ];
            $counter++;
        }

        foreach ($files as $fileData) {
            // Check if the file already exists in the database
            $existingFile = $this->fileRepository->findOneBy([
                'name' => $fileData['name'],
                'path' => $fileData['path']
            ]);

            if (!$existingFile) {
                $file = new File();
                $file->setName($fileData['name']);
                $file->setWeight($fileData['weight']);
                $file->setFormat($fileData['format']);
                $file->setPath($fileData['path']);
                $file->setCreatedAt($fileData['createdAt']);
                $this->manager->persist($file);
            }
        }
    }
}
