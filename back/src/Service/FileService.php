<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\FileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

class FileService
{
    private FileRepository $fileRepository;
    private LoggerInterface $logger;
    private EntityManagerInterface $entityManager;

    public function __construct(
        FileRepository $fileRepository,
        LoggerInterface $logger,
        EntityManagerInterface $entityManager,
    ){
        $this->fileRepository = $fileRepository;
        $this->logger = $logger;
        $this->entityManager = $entityManager;
    }

    /**
     * Get all the files of the user
     * return fileData[]
     */
    public function getAllFilesOfUser(UserInterface $user, $request): array
    {
        if (!$user instanceof User) {
            throw new InvalidArgumentException('L\'instance doit être de type App\Entity\User');
        }

        try {
            // Sort files by weight or createdAt
            $files = $this->getSortedFiles($user, $request);
            // Calculate the available storage space
            $storageSpace = $this->calculateAvailableStorageSpace($user);

            $fileData = array_map(function ($file) use ($user) {
                return [
                    'id' => $file->getId(),
                    'fileName' => $file->getName(),
                    'fileWeight' => $file->getWeight(),
                    'fileFormat' => $file->getFormat(),
                    'filePath' => $file->getPath(),
                    'fileCreatedAt' => $file->getCreatedAt()->format('d-m-Y H:i:s'),
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
                'total_weight_files' => $storageSpace[0], // sum weight of the files
                'total_storage_capacity' => $storageSpace[1], // sum storage_space bought by the user
                'available_storage_space' => $storageSpace[2], // difference between storage_space & weight
                'files' => $fileData,
            ];

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des fichiers de '. $user->getFirstname().' '
                .$user->getLastname() . $e->getMessage());

            return [
                'message' => 'Une erreur est survenue lors de la récupération des fichiers de '. $user->getFirstname().
                    ' '.$user->getLastname(),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get a file by id
     * return fileData[]
     */
    public function getFileById(int $id): array|JsonResponse
    {
        try {
            $file = $this->fileRepository->find($id);

            if (!$file) {
                return new JsonResponse(['message' => 'Fichier non trouvé.'], 404);
            }

            return [
                'id' => $file->getId(),
                'fileName' => $file->getName(),
                'fileWeight' => $file->getWeight(),
                'fileFormat' => $file->getFormat(),
                'filePath' => $file->getPath(),
                'fileCreatedAt' => $file->getCreatedAt()->format('d-m-Y H:i:s'),
                'category' => [
                    'categoryId' => $file->getCategory()->getId(),
                    'name' => $file->getCategory()->getName(),
                ],
                'user' => [
                    'userId' => $file->getUser()->getId(),
                ],
            ];
        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération du fichier '. $id . ': ' . $e->getMessage());

            return [
                'message' => 'Une erreur est survenue lors de la récupération du fichier '. $id,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Delete a file
     */
    public function deleteFileById(int $id): array
    {
        try {
            $file = $this->fileRepository->find($id);
            if (!$file) {
                return [
                    'message' => 'Fichier non trouvé.',
                    'error' => 'Fichier non trouvé.',
                ];
            }

            // Remove the file in the database
            $this->entityManager->remove($file);
            $this->entityManager->flush();

            return [
                'message' => 'Fichier supprimé avec succès.',
            ];

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la suppression du fichier ' . $id . ': ' . $e->getMessage());
            return [
                'message' => 'Une erreur est survenue lors de la suppression du fichier ' . $id,
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
     * Calculate available storage space of the user
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