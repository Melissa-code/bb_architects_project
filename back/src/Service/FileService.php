<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\FileRepository;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

class FileService
{
    private FileRepository $fileRepository;

    public function __construct(FileRepository $fileRepository)
    {
        $this->fileRepository = $fileRepository;
    }

    /**
     * Get all the files of the user
     * return fileData[]
     */
    public function getAllFilesOfUser(UserInterface $user, LoggerInterface $logger, $request): array
    {
        if (!$user instanceof User) {
            throw new InvalidArgumentException('L\'instance doit être de type App\Entity\User');
        }

        try {
            // Sort files by weight or createdAt
            $files = $this->getSortedFiles($user, $request);
            // Calcule the available storage space
            $storageSpace = $this->calculateAvailableStorageSpace($user);

            $fileData = array_map(function ($file) use ($user) {
                return [
                    'id' => $file->getId(),
                    'fileName' => $file->getName(),
                    'fileWeight' => $file->getWeight(),
                    'fileFormat' => $file->getFormat(),
                    'filePath' => $file->getPath(),
                    'fileCreatedAt' => $file->getCreatedAt(),
                    'user' => [
                        'userId' => $user->getId(),
                        'firstname' => $user->getFirstname(),
                        'lastname' => $user->getLastname(),
                    ],
                    'category' => [
                        'categoryId' => $file->getCategory()->getId(),
                        'name' => $file->getCategory()->getName(),
                    ],
                ];
            }, $files);

            return [
                'message' => 'Fichiers récupérés avec succès.',
                'totalWeightOfFiles' => $storageSpace[0], // sum weight of the files
                'total_storage_capacity' => $storageSpace[1], // sum storage_space bought by the user
                'available_storage_space' => $storageSpace[2], // difference between storage_space & weight
                'files' => $fileData,
            ];

        } catch (Exception $e) {
            $logger->error('Erreur lors de la récupération des fichiers de '. $user->getFirstname().' '
                .$user->getLastname() . $e->getMessage());

            return [
                'message' => 'Une erreur est survenue lors de la récupération des fichiers de '. $user->getFirstname().
                    ' '.$user->getLastname(),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Sort files by weight or createdAt
     * return array of objects Files
     */
    private function getSortedFiles(User $user, Request $request): array
    {
        $sortField = $request->query->get('sortField', 'createdAt');
        $sortOrder = strtoupper($request->query->get('sortOrder', 'DESC'));

        switch ($sortField) {
            case 'weight':
                return $this->fileRepository->findByUserSortedByWeight($user, $sortOrder);
            case 'createdAt':
            default:
                return $this->fileRepository->findByUserSortedByDate($user, $sortOrder);
        }
    }

    /**
     * Calcule available storage space of the user
     * return array of int
     */
    private function calculateAvailableStorageSpace(User $user): array
    {
        // Total weight of the files
        $totalWeight = $this->fileRepository->sumWeightByUser($user);

        // Sum of the storage_space capacities bought by the user
        $storageSpaces = $user->getStorageSpaces();
        $totalStorageCapacity = 0;
        foreach ($storageSpaces as $storageSpace) {
            $totalStorageCapacity += $storageSpace->getStorageCapacity();
        }

        // Difference between total storageSpace and total weight of files
        $availableStorageSpace = $totalStorageCapacity - $totalWeight;

        return [$totalWeight, $totalStorageCapacity, $availableStorageSpace];
    }
}