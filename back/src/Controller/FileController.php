<?php

namespace App\Controller;

use App\Service\FileService;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class FileController extends AbstractController
{
    /**
     * Get all the files of the user
     */
    #[Route('/files', name: 'app_file', methods: ['GET'])]
    public function getAllFiles(
        #[CurrentUser] ?UserInterface $user,
        Request $request,
        FileService $fileService,
        LoggerInterface $logger,
    ): JsonResponse {
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non connecté.'], 401);
        }

        try {
            $fileData = $fileService->getAllFilesOfUser($user, $logger, $request);

            return new JsonResponse($fileData , 200);

        } catch (Exception $e) {
            $logger->error('Erreur lors de la récupération des fichiers de '. $user . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération des des fichiers de: '. $user,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
