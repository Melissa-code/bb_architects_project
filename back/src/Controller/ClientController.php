<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\FileRepository;
use App\Repository\UserRepository;
use App\Service\ClientService;
use App\Service\FileService;
use Exception;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ClientController extends AbstractController
{
    private ClientService $clientService;
    private FileService $fileService;
    private LoggerInterface $logger;

    public function __construct(ClientService $clientService, LoggerInterface $logger, FileService $fileService)
    {
        $this->clientService = $clientService;
        $this->logger = $logger;
        $this->fileService = $fileService;
    }

    /**
     * Admin
     * Get all clients (role_user)
     */
    #[Route('/api/client', name: 'app_client', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getAllClients(#[CurrentUser] ?UserInterface $user): JsonResponse
    {
        if (!$user instanceof User) {
            throw new InvalidArgumentException('L\'instance doit être de type App\Entity\User');
        }

        try {
            $clientData = $this->clientService->getAllClients();

            return new JsonResponse($clientData, 200);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des utilisateurs.');

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération des utilisateurs.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin
     * Get all the files of a client (id_user in URL)
     */
    #[Route('/api/client/files/{id}', name: 'app_client_file', requirements: ['id' => '\d+'], methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getFilesOfClient(int $id, UserRepository $userRepository, Request $request): JsonResponse
    {
        $user = $userRepository->find($id);
        if (!$user) {
            return new JsonResponse(['message' => 'Client non trouvé.'], 404);
        }

        try {
            $fileData = $this->fileService->getAllFilesOfUser($user, $request);

            return new JsonResponse($fileData, 200);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des fichiers de ' . $user->getFirstname() . ' '
                . $user->getLastname() . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération des fichiers de: ' . $user->getFirstname()
                    . ' ' . $user->getLastname(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin
     * Get a file of a client by id (int)
     */
    #[Route('/api/client/file/{id}', name: 'app_client_file_details', requirements: ['id' => '\d+'], methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getFileOfClientById(int $id): JsonResponse
    {
        try {
            $fileData = $this->fileService->getFileById($id);

            if (!$fileData) {
                return new JsonResponse(['message' => 'Fichier non trouvé.'], 404);
            }

            return new JsonResponse($fileData, 200);

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la récupération du fichier n°' . $id . ': ' . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération du fichier n°' . $id,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin
     * Download the file of the client (ex: http://127.0.0.1:8000/api/client/file/download/54)
     * Postman : click on Send & Download
     */
    #[Route('/api/client/file/download/{id}', name: 'app_client_file_download', requirements: ['id' => '\d+'], methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function downloadFile(int $id, FileRepository $fileRepository): Response
    {
        $file = $fileRepository->find($id);

        if (!$file) {
            return new JsonResponse(['message' => 'Fichier non trouvé.'], 404);
        }

        $filePath = $file->getPath();
        $fullPath = $this->getParameter('kernel.project_dir') . '/public/' . $filePath;

        if (!file_exists($fullPath)) {
            return new JsonResponse(['message' => 'Fichier non trouvé sur le serveur.'], 404);
        }

        $response = new BinaryFileResponse($fullPath);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, basename($fullPath));

        return $response;
    }

    /**
     * Admin
     * Get the total files number for statistics
     */
    #[Route('/api/client/statistics', name: 'app_client_statistics', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getStatistics(): JsonResponse
    {
        try {
            $statisticsData = $this->clientService->getNumbersForStatistics();

            return new JsonResponse($statisticsData, 200);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des totaux pour les statistiques : '
                . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération des totaux pour les statistiques : ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Search a file
     * by name
     */
    #[Route('/api/client/search_file', name: 'api_file_search', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function searchFile(Request $request, FileService $fileService): JsonResponse
    {
        $name = $request->query->get('name');
        $files = $fileService->searchFile($name);

        return new JsonResponse($files);
    }
}
