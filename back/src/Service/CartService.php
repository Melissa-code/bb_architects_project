<?php

namespace App\Service;


use App\Entity\Order;
use App\Entity\UserStoragePurchase;
use App\Entity\StorageSpace;
use App\Entity\User;
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
    private StorageSpaceRepository $storageSpaceRepository;
    private OrderStatusRepository $orderStatusRepository;
    private ValidateSaveEntityService $validateSaveEntityService;
    private PaymentModeRepository $paymentModeRepository;
    private LoggerInterface $logger;

    public function __construct(
        StorageSpaceRepository $storageSpaceRepository,
        OrderStatusRepository $orderStatusRepository,
        ValidateSaveEntityService $validateSaveEntityService,
        PaymentModeRepository $paymentModeRepository,
        LoggerInterface $logger,
    ) {
        $this->storageSpaceRepository = $storageSpaceRepository;
        $this->orderStatusRepository = $orderStatusRepository;
        $this->validateSaveEntityService = $validateSaveEntityService;
        $this->paymentModeRepository = $paymentModeRepository;
        $this->logger = $logger;
    }

    /**
     * Create an order
     * cart_id user_id payment_mode_id order_status_id created_at date_delivery
     */
    public function createOrder(User $user, array $data): array
    {
        $storageSpace = $this->checkStorageSpace($data['storage_space_id']);
        // Future features: Choose a payment mode & edit the order status
        $creditCard = $this->paymentModeRepository->find(1);
        $paid = $this->orderStatusRepository->find(1);
        $quantity = $this->validateQuantity($data['quantity']);
        $totalPrice = $this->calculateTotalPrice($quantity, $storageSpace);

        $order = new Order();
        $order->setCart(null);
        $order->setUser($user);
        $order->setPaymentMode($creditCard);
        $order->setOrderStatus($paid);
        $order->setCreatedAt(new DateTimeImmutable());
        $order->setDateDelivery(new DateTime());
        $order->setQuantity($quantity);
        $order->setTotalPrice((string)$totalPrice);
        $order->setStorageSpace($storageSpace);

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
            'quantity' => $quantity,
            'storage_space_id' => $storageSpace->getId(),
            'user' => [
                'id' => $user->getId(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
            ],
        ];
    }

    /**
     * Create a storage space to the user
     * table storage_space_user
     * @throws Exception
     */
    public function createStorageSpacePurchaseForUser(User $user, StorageSpace $storageSpace): void
    {
        try {
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
