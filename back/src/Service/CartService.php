<?php

namespace App\Service;

use App\Entity\Cart;
use App\Entity\Order;
use App\Entity\UserStoragePurchase;
use App\Entity\QuantityCartStorage;
use App\Entity\StorageSpace;
use App\Entity\User;
use App\Repository\CartRepository;
use App\Repository\OrderStatusRepository;
use App\Repository\PaymentModeRepository;
use App\Repository\StorageSpaceRepository;
use DateTime;
use DateTimeImmutable;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use RuntimeException;

class CartService
{
    private CartRepository $cartRepository;
    private StorageSpaceRepository $storageSpaceRepository;
    private OrderStatusRepository $orderStatusRepository;
    private ValidateSaveEntityService $validateSaveEntityService;
    private PaymentModeRepository $paymentModeRepository;
    private LoggerInterface $logger;

    public function __construct(
        CartRepository $cartRepository,
        StorageSpaceRepository $storageSpaceRepository,
        OrderStatusRepository $orderStatusRepository,
        ValidateSaveEntityService $validateSaveEntityService,
        PaymentModeRepository $paymentModeRepository,
        LoggerInterface $logger,
    ) {
        $this->cartRepository = $cartRepository;
        $this->storageSpaceRepository = $storageSpaceRepository;
        $this->orderStatusRepository = $orderStatusRepository;
        $this->validateSaveEntityService = $validateSaveEntityService;
        $this->paymentModeRepository = $paymentModeRepository;
        $this->logger = $logger;
    }

    /**
     * Create a cart
     * one cart a user saved
     */
    public function createCart(User $user, array $data): array
    {
        // Check if the user already has got a cart
        $this->checkExistingCart($user);

        // Get the storage_space (Abonnement de 20Go à 20€)
        $storageSpace = $this->checkStorageSpace($data['storage_space_id']);

        // Create the cart
        $cart = new Cart();
        $cart->setUser($user);
        $isValidated = $this->validateIsValidated($data['is_validated']);
        $cart->setValidated($isValidated);
        $quantity = $this->validateQuantity($data['quantity']);
        $totalPrice = $this->calculateTotalPrice($quantity, $storageSpace);
        $cart->setTotalPrice((string)$totalPrice);

        try {
            $this->validateSaveEntityService->validateEntity($cart);
            $this->validateSaveEntityService->saveEntity($cart);

            // Create the quantity cart storage
            $quantityCartStorage = $this->createQuantityCartStorage($cart, $quantity, $storageSpace);
            $this->validateSaveEntityService->saveEntity($quantityCartStorage);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la création du panier : ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            throw new RuntimeException('Une erreur est survenue lors de la création du panier.', 0, $e);
        }

        return [
            'quantity' => $quantity,
            'total_price' => $cart->getTotalPrice(),
            'is_validated' => $cart->isValidated(),
            'storage_space' => [
                'id' => $storageSpace->getId(),
                'name' => $storageSpace->getName(),
                'price' => $storageSpace->getPrice(),
            ],
            'user' => [
                'id' => $user->getId(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
            ],
        ];
    }

    /**
     * Create the quantity cart storage
     * @throws Exception
     */
    private function createQuantityCartStorage(
        Cart $cart,
        int $quantity,
        StorageSpace $storageSpace
    ): QuantityCartStorage {
        try {
            $quantityCartStorage = new QuantityCartStorage();
            $quantityCartStorage->setCart($cart);
            $quantityCartStorage->setQuantity($quantity);
            $quantityCartStorage->setStorageSpace($storageSpace);

            return $quantityCartStorage;

        } catch (InvalidArgumentException $e) {
            throw new Exception("Erreur de création de QuantityCartStorage : " . $e->getMessage());
        } catch (Exception $e) {
            throw new Exception("Une erreur inattendue s'est produite : " . $e->getMessage());
        }
    }

    /**
     * Create an order
     * cart_id user_id payment_mode_id order_status_id created_at date_delivery
     */
    public function createOrder(User $user, Cart $cart): array
    {
        //Future feature: Choose a payment mode & edit the order status
        $creditCard = $this->paymentModeRepository->find(1);
        $paid = $this->orderStatusRepository->find(1);
        $totalPrice = $cart->getTotalPrice();
        $cart->setValidated(true);

        $order = new Order();
        $order->setCart($cart);
        $order->setUser($user);
        $order->setPaymentMode($creditCard);
        $order->setOrderStatus($paid);
        $order->setCreatedAt(new DateTimeImmutable());
        $order->setDateDelivery(new DateTime());

        try {
            $this->validateSaveEntityService->saveEntity($order);
        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la création de la commande : ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            throw new RuntimeException('Une erreur est survenue lors de la création de la commande.', 0, $e);
        }

        return [
            'order_id' => $order->getId(),
            'payment_mode' => $order->getPaymentMode()->getName(),
            'order_status' => $order->getOrderStatus()->getName(),
            'created_at' => $order->getCreatedAt()->format('d-m-Y H:i:s'),
            'date_delivery' => $order->getDateDelivery()->format('d-m-Y'),
            'total_price' => $totalPrice,
            'user' => [
                'id' => $user->getId(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
            ],
            'cart' => [
                'id' => $cart->getId(),
            ],
        ];
    }

    /**
     * Create a storage space to the user
     * table storage_space_user
     */
    //public function createStorageSpacePurchaseForUser(User $user, array $data): void
    public function createStorageSpacePurchaseForUser(User $user, StorageSpace $storageSpace): void
    {
        try {
            // Get the storage_space (Abonnement de 20Go à 20€)
            //$storageSpace = $this->checkStorageSpace($data['storage_space_id']);

            $purchase = new UserStoragePurchase();
            $purchase->setStorageSpace($storageSpace);
            $purchase->setUser($user);
            $purchase->setPurchaseDate(new DateTime());
            $this->validateSaveEntityService->saveEntity($purchase);

        } catch (InvalidArgumentException $e) {
            throw new Exception(
                "Erreur lors de l'ajout de l'utilisateur à l'espace de stockage : " . $e->getMessage()
            );
        } catch (Exception $e) {
            throw new Exception("Une erreur inattendue s'est produite : " . $e->getMessage());
        }
    }

    /**
     * Check if the value is a boolean
     */
    public function validateIsValidated($value): bool
    {
        if (!is_bool($value)) {
            throw new InvalidArgumentException('La valeur doit être un booléen.');
        }

        return $value;
    }

    /**
     * Check if the storage space exists in the database
     */
    public function checkStorageSpace($storageSpaceId): StorageSpace
    {
        $storageSpaceId = (int)$storageSpaceId;
        $storageSpace = $this->storageSpaceRepository->find($storageSpaceId);

        if (!$storageSpace) {
            throw new InvalidArgumentException('Espace de stockage non trouvé.');
        }

        return $storageSpace;
    }

    /**
     * Check if the user has a cart saved in the database
     * A user must have one cart saved only
     */
    private function checkExistingCart(User $user): void
    {
        $userId = $user->getId();
        $existingCart = $this->cartRepository->findCartByUserId($userId);

        if ($existingCart) {
            $this->logger->error('Tentative de création d\'un panier alors qu\'un panier existe déjà pour l\'utilisateur.', [
                'user_id' => $userId,
            ]);
            throw new InvalidArgumentException('Cet utilisateur a déjà un panier.');
        }
    }

    /**
     * Check if the quantity is >= 0
     */
    private function validateQuantity($quantityInput): int
    {
        $quantity = (int)$quantityInput;
        if ($quantity <= 0) {
            throw new InvalidArgumentException('La quantité doit être un entier positif.');
        }

        return $quantity;
    }

    /**
     * Calculate the total price
     * total = quantity * price of the storage space
     */
    private function calculateTotalPrice(int $quantity, $storageSpace): float
    {
        return $quantity * (float)$storageSpace->getPrice();
    }
}
