<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\User;
use App\Repository\OrderRepository;
use App\Repository\QuantityCartStorageRepository;
use App\Service\CartService;
use App\Service\ConfirmationEmailService;
use App\Service\InvoiceService;
use App\Service\ValidateSaveEntityService;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class CartController extends AbstractController
{
    private CartService $cartService;
    private InvoiceService $invoiceService;
    //private CartRepository $cartRepository;
    private OrderRepository $orderRepository;
    private LoggerInterface $logger;


    public function __construct(
        CartService $cartService,
        InvoiceService $invoiceService,
        OrderRepository $orderRepository,
        LoggerInterface $logger,

    ) {
        $this->cartService = $cartService;
        $this->invoiceService = $invoiceService;
        $this->orderRepository = $orderRepository;
        $this->logger = $logger;
    }

    /**
     * Create a cart
     */
    #[Route('/api/cart/create', name: 'app_cart_create', methods: ['POST'])]
    public function createCart(
        #[CurrentUser] ?UserInterface $user,
        Request $request,
        ConfirmationEmailService $confirmationEmailService,
        ValidateSaveEntityService $validateSaveEntityService,
        QuantityCartStorageRepository $quantityCartStorageRepository,
    ): JsonResponse {
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'L\'instance doit être de type App\Entity\User'], 400);
        }

        try {
            $data = json_decode($request->getContent(), true);
            if (!is_array($data)) {
                return new JsonResponse(['error' => 'Les données sont invalides.'], 400);
            }

            $storageSpace = $this->cartService->checkStorageSpace($data['storage_space_id']);
            $orderData = $this->cartService->createOrder($user, $data);

            // Create a storage_space to the user
            $this->cartService->createStorageSpacePurchaseForUser($user, $storageSpace);
            $orderId = $orderData['order_id'];
            $order = $this->getOrderById($orderId);

            // Create an invoice
            $this->invoiceService->createInvoice($user, $order);

            // Send an email confirmation
            $object = "Confirmation achat d'espace de stockage supplémentaire";
            $message = "Cher client, nous vous confirmons l'achat d'un espace de stockage supplémentaire de 20 Go à 20 €.";
            $confirmationEmailService->sendConfirmationEmail($object, $message);

            return new JsonResponse([
                'message' => 'La commande a bien été effectuée.',
                'order' =>  $orderData,
            ], 201);

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

    /**
     * Get an order by id
     */
    private function getOrderById(int $orderId): Order
    {
        $order = $this->orderRepository->find($orderId);
        if ($order === null) {
            throw new RuntimeException('La commande n\'a pas été trouvée.');
        }

        return $order;
    }
}
