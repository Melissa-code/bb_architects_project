<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\ClientService;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class ClientController extends AbstractController
{
    private ClientService $clientService;
    private LoggerInterface $logger;

    public function __construct(ClientService $clientService, LoggerInterface $logger)
    {
        $this->clientService = $clientService;
        $this->logger = $logger;
    }

    /**
     * Get all clients (role_user)
     */
    #[Route('/api/client', name: 'app_client', methods: ['GET'])]
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
}
