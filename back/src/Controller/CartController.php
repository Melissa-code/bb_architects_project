<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\CartService;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CartController extends AbstractController
{
    private CartService $cartService;
    private LoggerInterface $logger;

    public function __construct(CartService $cartService, LoggerInterface $logger)
    {
        $this->cartService = $cartService;
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
            // Check if the data (is_validated) of cart is a boolean
            $isValidated = $this->cartService->validateIsValidated($data['is_validated']);
            if (!$isValidated) {
                // Save the cart in the database
                $cart = $this->cartService->createCart($user, $data);
            } else {
                // Create the order in the database
                $cart = $this->cartService->createCart($user, $data);
                $order = $this->cartService->createOrder($cart, $user);
            }

            return new JsonResponse([
                'message' => 'Le panier a bien été sauvegardé.',
                'cart' => $cart
            ], 200);

        } catch (InvalidArgumentException $e) {
            // Error messages
            $errorMessage = json_decode($e->getMessage(), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return new JsonResponse(['errors' => $errorMessage], 400);
            } else {
                return new JsonResponse(['error' => $e->getMessage()], 400);
            }
        } catch (Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue lors de la création du panier.'], 500);
        }
    }
}
