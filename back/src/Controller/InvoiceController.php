<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\InvoiceService;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class InvoiceController extends AbstractController
{
    private InvoiceService $invoiceService;
    private LoggerInterface $logger;

    public function __construct(InvoiceService $invoiceService, LoggerInterface $logger)
    {
        $this->invoiceService = $invoiceService;
        $this->logger = $logger;
    }

    /**
     * Get all the invoices for the user
     */
    #[Route('/api/invoice', name: 'app_invoice', methods: ['GET'])]
    public function getAllInvoices(#[CurrentUser] ?UserInterface $user): JsonResponse
    {
        if (!$user instanceof User) {
            throw new InvalidArgumentException('L\'instance doit être de type App\Entity\User');
        }

        try {
            $invoiceData = $this->invoiceService->getAllInvoicesOfUser($user);

            return new JsonResponse($invoiceData , 200);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des factures de '. $user->getFirstname().' '
                .$user->getLastname() . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération des factures de: '. $user->getFirstname()
                    .' ' .$user->getLastname(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get an invoice by id (int)
     */
    #[Route('/api/invoice/{id}', name: 'app_invoice_details', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getFileById(#[CurrentUser] ?UserInterface $user, int $id): JsonResponse
    {
        if (!$user instanceof User) {
            throw new InvalidArgumentException('L\'instance doit être de type App\Entity\User');
        }

        try {
            $invoiceData = $this->invoiceService->getInvoiceById($id);

            if (!$invoiceData) {
                return new JsonResponse(['message' => 'Facture non trouvée.'], 404);
            }
            // Check if the invoice owns to the logged user
            if ($invoiceData['client_id'] !== $user->getId()) {
                return new JsonResponse(
                    ['message' => 'Accès interdit: cette facture ne vous appartient pas.'],
                    403
                );
            }

            return new JsonResponse($invoiceData, 200);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération de la facture n° '. $id . ': ' . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération de la facture n° ' . $id,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
