<?php

namespace App\Controller;

use App\Entity\File;
use App\Entity\User;
use App\Service\FileService;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class FileController extends AbstractController
{
    private FileService $fileService;
    private LoggerInterface $logger;

    public function __construct(FileService $fileService, LoggerInterface $logger)
    {
        $this->fileService = $fileService;
        $this->logger = $logger;
    }

    /**
     * Get all the files of the user
     */
    #[Route('/api/files', name: 'app_file', methods: ['GET'])]
    public function getAllFiles(#[CurrentUser] ?UserInterface $user, Request $request): JsonResponse
    {
        if (!$user instanceof User) {
            throw new InvalidArgumentException('L\'instance doit être de type App\Entity\User');
        }

        try {
            $fileData = $this->fileService->getAllFilesOfUser($user, $request);

            return new JsonResponse($fileData , 200);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des fichiers de '. $user->getFirstname().' '
                .$user->getLastname() . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération des fichiers de: '. $user->getFirstname()
                    .' ' .$user->getLastname(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a file by id (int)
     */
    #[Route('/api/file/{id}', name: 'app_file_details', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getFileById(#[CurrentUser] ?UserInterface $user, int $id): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non connecté.'], 401);
        }

        try {
            $fileData = $this->fileService->getFileById($id);

            if (!$fileData) {
                return new JsonResponse(['message' => 'Fichier non trouvé.'], 404);
            }
            // Check if the file owns to the logged user
            if ($fileData['user']['userId'] !== $user->getId()) {
                return new JsonResponse(['message' => 'Accès interdit: ce fichier ne vous appartient pas.'], 403);
            }

            return new JsonResponse($fileData, 200);

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la récupération du fichier n°'. $id . ': ' . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération du fichier n°' . $id,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create & upload a new file
     */
    #[Route('/api/file/create_file', name: 'app_file_create', methods: ['POST'])]
    #[Route('/api/file/update_file/{id}', name: 'app_file_update', methods: ['POST'])]
    public function createOrUpdate(#[CurrentUser] ?UserInterface $user, Request $request, ?File $file = null): JsonResponse {
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'L\'instance doit être de type App\Entity\User'], 400);
        }
        try {
            $name = $request->request->get('name');
            $categoryId = $request->request->get('categoryId');
            $uploadedFile = $request->files->get('pathFile');
            if (!$name) {
                return new JsonResponse(['error' => 'Le champ "name" est requis.'], 400);
            }
            if (!$categoryId) {
                return new JsonResponse(['error' => 'Le champ "categoryId" est requis.'], 400);
            }
            if (!$uploadedFile instanceof UploadedFile) {
                return new JsonResponse(['error' => 'Aucun fichier valide n\'a été téléchargé.'], 400);
            }

            $documentsDirectory = $this->getParameter('directory_documents_files');
            $isUpdating = $file !== null;
            $this->fileService->createOrUpdateFile($file, [
                'name' => $name,
                'categoryId' => $categoryId,
                'pathFile' => $uploadedFile
            ], $user, $documentsDirectory);

            return new JsonResponse([
                'message' => $isUpdating ? 'Document mis à jour avec succès.' : 'Nouveau document téléchargé avec succès.'
            ], $isUpdating ? 200 : 201);

        } catch (InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], 400);
        } catch (Exception $e) {
            $this->logger->error('Exception levée : ' . $e->getMessage());
            return new JsonResponse(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    /**
     * Delete a file by id (int)
     */
    #[Route('/api/file/delete/{id}', name: 'app_file_delete', methods: ['DELETE'])]
    public function deleteFile(int $id, Request $request, #[CurrentUser] ?UserInterface $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non connecté.'], 401);
        }

        $fileData = $this->fileService->getFileById($id);

        // Check if the file owns to the logged user
        if ($fileData['user']['userId'] !== $user->getId()) {
            return new JsonResponse(['message' => 'Accès interdit: ce fichier ne vous appartient pas.'], 403);
        }

        $result = $this->fileService->deleteFileById($id);

        if (isset($result['error'])) {
            return new JsonResponse($result, 400);
        }

        return new JsonResponse($result, 200);
    }

    /**
     * Search a file by name
     */
    #[Route('/api/files/search_file', name: 'api_search_file', methods: ['GET'])]
    public function searchFile(Request $request): JsonResponse
    {
        $name = $request->query->get('name');
        $format = $request->query->get('format');
        $format = trim($format);

        $files = $this->fileService->searchFile($name, $format);

        return new JsonResponse($files);
    }
}
