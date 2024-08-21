<?php

namespace App\Service;

use App\Entity\Category;
use App\Entity\File;
use App\Entity\User;
use App\Repository\CategoryRepository;
use App\Repository\FileRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class FileService
{
    private FileRepository $fileRepository;
    private CategoryRepository $categoryRepository;
    private LoggerInterface $logger;
    private EntityManagerInterface $entityManager;
    private SluggerInterface $slugger;
    private ValidatorInterface $validator;

    public function __construct(
        FileRepository $fileRepository,
        CategoryRepository $categoryRepository,
        LoggerInterface $logger,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger,
        ValidatorInterface $validator,
    ){
        $this->fileRepository = $fileRepository;
        $this->categoryRepository = $categoryRepository;
        $this->logger = $logger;
        $this->entityManager = $entityManager;
        $this->slugger = $slugger;
        $this->validator = $validator;
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
     * Add a new file
     * or Update it (in the server and path in the database)
     */
    public function createOrUpdateFile(?File $file, array $data, User $user, $documentsDirectory): File
    {
        // If the file doesn't exist, create a new File
        if (!$file) {
            $file = new File();
            $file->setCreatedAt(new DateTimeImmutable());
            $file->setUser($user);
            $this->logger->info('Création d\'un nouveau fichier.');
        } else {
            $this->logger->info('Mise à jour d\'un fichier existant.');
        }

        $isUpdated = $file->getId() !== null;
        $oldFilePath = $documentsDirectory . '/' . $file->getPath();
        $file->setName($data['name']);
        $category = $this->getCategory($data['categoryId']);
        $file->setCategory($category);

        // UploadedFile object
        $uploadedFile = $data['pathFile'];
        if ($uploadedFile) {
            // Convert file size and validate
            $weight = $this->calculateFileWeight($uploadedFile);
            $this->validateFileSize($weight, $user);

            // Generate unique filename
            $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $this->slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

            // Validate file format
            $fileFormat = $this->validateFileFormat($uploadedFile);

            // Move uploaded file to destination directory
            try {
                $uploadedFile->move($documentsDirectory, $newFilename);
            } catch (FileException $e) {
                throw new RuntimeException('Échec du téléchargement du fichier : ' . $e->getMessage());
            }

            $file->setPath('documents/' . $newFilename);
            $file->setFormat($fileFormat);
            $file->setWeight($weight);

            // Delete the old file if this is updated
            if ($isUpdated && file_exists($oldFilePath)) {
                unlink($oldFilePath);
            }
        } else {
            throw new InvalidArgumentException('Aucun fichier n\'a été téléchargé.');
        }

        try {
            $this->validateEntity($file);
            $this->saveEntity($file);
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException(
                'L\'ajout ou la modification du fichier a échoué: ' . $e->getMessage()
            );
        }

        return $file;
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

            // Remove the file in the server
            $filePath = $file->getPath();
            if (file_exists($filePath)) {
                unlink($filePath);
            } else {
                $this->logger->error('Fichier non trouvé sur le serveur: ' . $filePath);
                return [
                    'message' => 'Fichier non trouvé sur le serveur.',
                    'error' => 'Fichier non trouvé sur le serveur.',
                ];
            }
            // Remove the file in the database
            $this->entityManager->remove($file);
            $this->entityManager->flush();

            return [
                'message' => 'Fichier supprimé avec succès.',
            ];

        } catch (Exception $e) {
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
        // Total weight of the files in Mo
        $totalWeightInMo = $this->fileRepository->sumWeightByUser($user);
        // Convert Mo to Go (1 Go = 1024 Mo)
        $totalWeightInGo = $totalWeightInMo / 1024;

        // Sum of the storage_space capacities bought by the user
        $storageSpaces = $user->getStorageSpaces();
        $totalStorageCapacity = 0;
        foreach ($storageSpaces as $storageSpace) {
            $totalStorageCapacity += $storageSpace->getStorageCapacity();
        }

        // Difference between total storageSpace and total weight of files
        $availableStorageSpace = $totalStorageCapacity - $totalWeightInGo;

        return [$totalWeightInGo, $totalStorageCapacity, $availableStorageSpace];
    }

    /**
     * Find category
     */
    private function getCategory(int $categoryId): Category
    {
        $category = $this->categoryRepository->find($categoryId);
        if (!$category) {
            throw new InvalidArgumentException('Catégorie non trouvée.');
        }
        return $category;
    }

    /**
     * Initialize a new file
     */
    private function initializeFile(array $data, User $user, Category $category): File
    {
        $file = new File();
        $file->setName($data['name']);
        $file->setCategory($category);
        $file->setCreatedAt(new DateTimeImmutable());
        $file->setUser($user);

        return $file;
    }

    /**
     * Calculate the weight of the file in Mo
     */
    private function calculateFileWeight($uploadedFile): int
    {
        $fileSizeInBytes = $uploadedFile->getSize(); // octets
        $fileSizeInMb = $fileSizeInBytes / (1024 * 1024);
        return ceil($fileSizeInMb); // round to the next int (Mo)
    }

    /**
     * Validate the weight of the file
     */
    private function validateFileSize(int $weight, User $user): void
    {
        // 2 Mo in php.ini de Wamp (upload_max_filesize = 2M line 856)
        $maxFileSizeInMb = 2;
        $availableStorageSpaceInMb = $this->calculateAvailableStorageSpace($user)[2] * 1024;

        if ($weight > $maxFileSizeInMb) {
            throw new InvalidArgumentException('Le fichier dépasse la taille maximale autorisée de '
                . $maxFileSizeInMb . ' Mo.');
        }
        if ($weight > $availableStorageSpaceInMb) {
            throw new InvalidArgumentException('Le fichier dépasse la taille restante disponible dans '
                . 'votre abonnement.');
        }
    }

    /**
     * Validate the format of the file
     */
    private function validateFileFormat($uploadedFile): mixed
    {
        $allowedFormats = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'mp4', 'avi', 'mkv', 'mov', 'zip', 'rar', 'tar.gz'];
        $fileFormat = $uploadedFile->guessExtension();

        if (!in_array($fileFormat, $allowedFormats)) {
            throw new InvalidArgumentException('Format de fichier non pris en charge.');
        }

        return $fileFormat;
    }

    /**
     * Validate or return error message
     *
     * @param object $entity
     * @throws InvalidArgumentException if the error of validation exist
     */
    private function validateEntity(object $entity): void
    {
        $violations = $this->validator->validate($entity);

        if (count($violations) > 0) {
            $errorMessages = [];
            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }
            throw new InvalidArgumentException(json_encode(['errors' => $errorMessages]));
        }
    }

    /**
     * Save the entity in the database (file)
     *
     * @param Object $entity
     */
    private function saveEntity(Object $entity): void
    {
        try {
            $this->entityManager->persist($entity);
            $this->entityManager->flush();
        } catch (ORMException $e) {
            throw new RuntimeException(
                '[Inscription]: Erreur lors de la persistance de l\'entité:' . $entity, 0, $e);
        }
    }
}