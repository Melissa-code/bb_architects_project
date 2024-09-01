<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\CartRepository;
use App\Service\CartService;
use App\Service\InvoiceService;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class CartController extends AbstractController
{
    private CartService $cartService;
    private CartRepository $cartRepository;
    private InvoiceService $invoiceService;
    private LoggerInterface $logger;

    public function __construct(
        CartService $cartService,
        CartRepository $cartRepository,
        InvoiceService $invoiceService,
        LoggerInterface $logger
    )
    {
        $this->cartService = $cartService;
        $this->cartRepository = $cartRepository;
        $this->invoiceService = $invoiceService;
        $this->logger = $logger;
    }

    /**
     * Create a cart
     */
    #[Route('/api/cart/create', name: 'app_cart_create', methods: ['POST'])]
    public function createCart(#[CurrentUser] ?UserInterface $user, Request $request): JsonResponse
    {
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'L\'instance doit être de type App\Entity\User'], 400);
        }

        try {
            $data = json_decode($request->getContent(), true);
            if (!is_array($data)) {
                return new JsonResponse(['error' => 'Les données sont invalides.'], 400);
            }
            // Check if the data is_validated of cart is a boolean
            $isValidated = $this->cartService->validateIsValidated($data['is_validated']);
            $userId = $user->getId();
            $cart = $this->cartRepository->findOneBy(['user' => $userId]) ?: null;
            $storageSpace = $this->cartService->checkStorageSpace($data['storage_space_id']);

            // Save the cart in the database
            if (!$isValidated) {
                $this->logger->error('1re condition: seulement creation panier');
                $cart = $this->cartService->createCart($user, $data);

                return new JsonResponse([
                    'message' => 'Le panier a bien été sauvegardé.',
                    'cart' => $cart
                ], 201);
            }
            // Create the order in the database
            if ($isValidated && $cart !== null) {
                $this->logger->error('2e condition: seulement creation commande');
                $cart = $this->cartRepository->findOneBy(['user' => $userId]);
                $order = $this->cartService->createOrder($user, $cart);
                // Create a storage_space to the user
                $this->cartService->createStorageSpacePurchaseForUser($user, $storageSpace);
                // Create an invoice
                $this->invoiceService->createInvoice();

                return new JsonResponse([
                    'message' => 'Le panier a bien été validé et la commande effectuée.',
                    'order' =>  $order
                ], 201);
            }
            // Save the cart & create the order in the database
            if ($isValidated && $cart === null) {
                $this->logger->error('3e condition: creation panier et commande');
                $this->cartService->createCart($user, $data);
                $cart = $this->cartRepository->findOneBy(['user' => $userId]);
                $order = $this->cartService->createOrder($user, $cart);
                // Create a storage_space to the user
                $this->cartService->createStorageSpacePurchaseForUser($user, $storageSpace);

                // Create an invoice
                $this->invoiceService->createInvoice($user, $order);

                return new JsonResponse([
                    'message' => 'La commande a bien été effectuée.',
                    'order' =>  $order
                ], 201);
            }

            return new JsonResponse(['error' => 'Une condition inattendue a été rencontrée.'], 400);

        } catch (InvalidArgumentException $e) {
            // Error messages
            $errorMessage = json_decode($e->getMessage(), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return new JsonResponse(['errors' => $errorMessage], 400);
            } else {
                return new JsonResponse(['error' => $e->getMessage()], 400);
            }
        } catch (Exception $e) {
            return new JsonResponse(
                ['error' => 'Une erreur est survenue lors de la création ou la validation du panier.'], 500
            );
        }
    }
}
