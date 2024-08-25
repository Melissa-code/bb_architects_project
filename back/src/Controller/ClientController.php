<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\ClientService;
use App\Service\FileService;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
}
