<?php

namespace App\Controller;

use App\Repository\FileRepository;
use App\Repository\InvoiceRepository;
use App\Repository\OrderRepository;
use App\Repository\StorageSpaceRepository;
use App\Repository\UserRepository;
use App\Repository\UserStoragePurchaseRepository;
use App\Service\ConfirmationEmailService;
use App\Service\FileService;
use App\Service\InvoiceService;
use App\Service\RegisterService;
use App\Service\ValidateSaveEntityService;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class RegisterController extends AbstractController
{
    /**
     * Registration of a new user
     */
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        RegisterService $registerService,
        InvoiceService $invoiceService,
        ConfirmationEmailService $confirmationEmailService,
        LoggerInterface $logger,
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            if (!is_array($data)) {
                return new JsonResponse(['error' => 'Les données sont invalides.'], 400);
            }
            if ($data['password'] !== $data['confirmPassword']) {
                return new JsonResponse(['error' => 'Les mots de passe ne correspondent pas.'], 400);
            }
            if (!isset($data['storage_space']) || !$data['storage_space']) {
                return new JsonResponse(['error' => 'Veuillez accepter de souscrire à l\'abonnement.'], 400);
            }

            $address = $registerService->createAddress($data);
            $user = $registerService->createUser($data, $address);

            // Link the storage space to the user
            $registerService->linkStorageSpaceToUser($user);

            // Create an invoice
            $invoiceService->createInvoice($user);

            // Send an email confirmation to the new client
            $object = "Confirmation Inscription";
            $message = "Cher client, nous vous confirmons votre inscription sur la plateforme de gestion de fichiers BB Architects.";
            $confirmationEmailService->sendConfirmationEmail($object, $message);

            return new JsonResponse(['message' => 'Nouveau compte utilisateur créé avec succès.'], 201);
        } catch (InvalidArgumentException $e) {
            return new JsonResponse(['error : ' => $e->getMessage()], 400);
        } catch (Exception $e) {
            $logger->error('Exception levée : ' . $e->getMessage());
            return new JsonResponse(['message' => 'Erreur interne du serveur.'], 500);
        }
    }

    /**
     * Delete a user by id and his files
     */
    #[Route('/api/delete_user/{id}', name: 'api_delete_user', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function deleteUser(
        int $id,
        UserRepository $userRepository,
        FileRepository $fileRepository,
        ConfirmationEmailService $confirmationEmailService,
        UserStoragePurchaseRepository $userStoragePurchaseRepository,
        StorageSpaceRepository $storageSpaceRepository,
        InvoiceRepository $invoiceRepository,
        OrderRepository $orderRepository,
        FileService $fileService,
        ValidateSaveEntityService $validateSaveEntityService,
        LoggerInterface $logger,
    ): JsonResponse
    {
        // Get the user
        $user = $userRepository->find($id);

        try {
            $numberOfFiles = 0;
            // Delete all the files of the user
            $allFilesOfUser = $fileRepository->findByUserSortedByDate($user);
            if (empty($allFilesOfUser)) {
                $logger->error('Aucun fichier trouvé pour l\'utilisateur: ' . $user->getId());
            }
            if ($allFilesOfUser) {
                $numberOfFiles = count($allFilesOfUser);
                $logger->info('Nombre de fichiers trouvés pour l\'utilisateur ' . $user->getId() . ' : ' . $numberOfFiles);

                foreach ($allFilesOfUser as $fileOfUser) {
                    $fileService->deleteFileById($fileOfUser->getId(), true);
                    $logger->error('Suppression de tous les fichiers pour l\'utilisateur : ' . $user->getId());
                }
            }

            // Delete user_storage_purchase
            $userStoragePurchases = $userStoragePurchaseRepository->findBy(['user' => $user]);
            if (count($userStoragePurchases) > 0) {
                foreach ($userStoragePurchases as $userStoragePurchase) {
                    $validateSaveEntityService->remove($userStoragePurchase);
                    $logger->error('Suppression de userStoragePurchase pour l\'utilisateur : ' . $user->getId());
                }
            }

            // Delete all the invoices for the user
            $invoices = $invoiceRepository->findBy(['user' => $user]);
            if (count($invoices) > 0) {
                foreach ($invoices as $invoice) {
                    $validateSaveEntityService->remove($invoice);
                    $logger->error('Suppression des factures pour l\'utilisateur : ' . $user->getId());
                }
            }

            // Delete all the orders for the user
            $orders = $orderRepository->findBy(['user' => $user]);
            if (count($orders) > 0) {
                foreach ($orders as $order) {
                    $validateSaveEntityService->remove($order);
                    $logger->error('Suppression des commandes pour l\'utilisateur : ' . $user->getId());
                }
            }

            // Send an email : confirmation to delete the user account
            $object = "Confirmation Suppression de compte et de vos fichiers";
            $message = "Cher client, nous vous confirmons la suppression de votre compte sur la plateforme de gestion de fichiers BB Architects.";
            $confirmationEmailService->sendConfirmationEmail($object, $message);

            // Send an email : notification to the admin to delete the user account
            $object = "Notification Suppression du compte de ". $user->getFirstname().' '. $user->getLastname() .
                ' (ID : '. $user->getId() . ")";
            $message = "Cher Administrateur, nous vous confirmons la suppression de compte de " . $user->getFirstname().
                ' '.$user->getLastname() . ' (ID : '. $user->getId() . ") et de ses ". $numberOfFiles. " fichiers.";
            $confirmationEmailService->sendConfirmationEmail($object, $message, true);

            // Delete the user
            $validateSaveEntityService->remove($user);
            $logger->error('Suppression de l\'utilisateur : '. $user->getId());

        } catch (InvalidArgumentException $e) {
            return new JsonResponse(['error : ' => $e->getMessage()], 400);
        } catch (Exception $e) {
            $logger->error('Exception levée : ' . $e->getMessage());
            return new JsonResponse(['message' => 'Erreur interne du serveur.'], 500);
        }

        return new JsonResponse(['message' => 'Utilisateur supprimé avec succès.'], 200);
    }
}