<?php

namespace App\Controller;

use App\Service\RegisterService;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegisterController extends AbstractController
{
    /**
     * Registration
     *
     * @param Request $request
     * @param RegisterService $registerService
     * @return JsonResponse
     */
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        RegisterService $registerService,
        ValidatorInterface $validator,
        LoggerInterface $logger
    ): JsonResponse {
        // Get data inputs from the register form and put them in an array
        $data = json_decode($request->getContent(), true);

        $address = $registerService->createAddress($data);
        $user = $registerService->createUser($data, $address);

        // Validate address
        $addressErrors = $validator->validate($address);
        if (count($addressErrors) > 0) {
            $errorMessages = [];
            foreach ($addressErrors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], 400);
        }

        // Validate user
        $userErrors = $validator->validate($user);
        if (count($userErrors) > 0) {
            $errorMessages = [];
            foreach ($userErrors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], 400);
        }

        try {
            $registerService->saveEntities([$address, $user]);
            return new JsonResponse(['message' => 'Nouveau compte utilisateur créé avec succès.'], 201);
        } catch (\Exception $e) {
            $logger->error('Exception encountered: ' . $e->getMessage());
            return new JsonResponse(['message' => 'Erreur interne du serveur.'], 500);
        }
    }
}
