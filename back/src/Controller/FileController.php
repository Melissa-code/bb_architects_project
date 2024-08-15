<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\FileRepository;
use InvalidArgumentException;
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
        FileRepository $fileRepository,
        Request $request
    ): JsonResponse {
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non connecté.'], 401);
        }
        if (!$user instanceof User) {
            throw new InvalidArgumentException('L\'instance: App\Entity\User');
        }

        // Get the sort by the user
        $sortField = $request->query->get('sortField', 'createdAt');
        $sortOrder = $request->query->get('sortOrder', 'DESC');

        if ($sortField === 'createdAt') {
            $files = $fileRepository->findByUserSortedByDate($user, $sortOrder);
        } elseif ($sortField === 'weight') {
            $files = $fileRepository->findByUserSortedByWeight($user, $sortOrder);
        } else {
            $files = $fileRepository->findByUserSortedByDate($user, $sortOrder); // default value (date DESC)
        }

        $fileData = array_map(function($file) use ($user) {
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
                'category' =>  [
                    'categoryId' => $file->getCategory()->getId(),
                    'name' => $file->getCategory()->getName(),
                ],
            ];
        }, $files);

        return new JsonResponse([
            'message' => 'Fichiers récupérés avec succès.',
            'files' => $fileData,
        ], 200);
    }
}
