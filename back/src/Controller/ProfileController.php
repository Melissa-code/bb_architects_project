<?php

namespace App\Controller;

use App\Service\ProfileService;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class ProfileController extends AbstractController
{
    #[Route('/api/profile', name: 'app_profile', methods: ['GET'])]
    public function profile(
        #[CurrentUser] ?UserInterface $user,
        ProfileService $profileService,
        LoggerInterface $logger
    ): JsonResponse {
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non connecté.'], 401);
        }
        try {
            $profileData = $profileService->getProfileData($user, $logger);

            return new JsonResponse($profileData, 200);

        } catch (Exception $e) {
            // logs in var/log/dev.log
            $logger->error('Erreur lors de la récupération des données du profil : ' . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération des données.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
