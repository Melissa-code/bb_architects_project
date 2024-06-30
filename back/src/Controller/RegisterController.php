<?php

namespace App\Controller;

use App\Service\RegisterService;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class RegisterController extends AbstractController
{
    /**
     * Registration of a new user
     *
     * @param Request $request
     * @param RegisterService $registerService
     * @param LoggerInterface $logger
     * @return JsonResponse
     */
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        RegisterService $registerService,
        LoggerInterface $logger
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            if (!is_array($data)) {
                return new JsonResponse(['error' => 'Les données sont invalides.'], 400);
            }
            if (!isset($data['storage_space']) || !$data['storage_space']) {
                return new JsonResponse(['error' => 'Veuillez accepter de souscrire à l\'abonnement.'], 400);
            }

            $address = $registerService->createAddress($data);
            $user = $registerService->createUser($data, $address);
            $registerService->createStorageSpace($user);

            return new JsonResponse(['message' => 'Nouveau compte utilisateur créé avec succès.'], 201);
        } catch (\InvalidArgumentException $e) {
            return new JsonResponse(['error : ' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            $logger->error('Exception levée : ' . $e->getMessage());
            return new JsonResponse(['message' => 'Erreur interne du serveur.'], 500);
        }
    }
}