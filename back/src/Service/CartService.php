<?php

namespace App\Service;

use App\Entity\Cart;
use App\Entity\StorageSpace;
use App\Entity\User;
use App\Repository\CartRepository;
use App\Repository\StorageSpaceRepository;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;

class CartService
{
    private CartRepository $cartRepository;
    private StorageSpaceRepository $storageSpaceRepository;
    private ValidateSaveEntityService $validateSaveEntityService;
    private LoggerInterface $logger;

    public function __construct(
        CartRepository $cartRepository,
        StorageSpaceRepository $storageSpaceRepository,
        ValidateSaveEntityService $validateSaveEntityService,
        LoggerInterface $logger,
    ) {
        $this->cartRepository = $cartRepository;
        $this->storageSpaceRepository = $storageSpaceRepository;
        $this->validateSaveEntityService = $validateSaveEntityService;
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
        $cart = new Cart();
        $cart->setUser($user);
        $isValidated = $this->validateIsValidated($data['is_validated']);
        $cart->setValidated($isValidated);
        $quantity = $this->validateQuantity($data['quantity']);
        $totalPrice = $this->calculateTotalPrice($quantity, $storageSpace);
        $cart->setTotalPrice((string)$totalPrice);

        try {
            $this->validateSaveEntityService->validateEntity($cart);
            $cart->setValidated((bool)$data['is_validated']);
            $this->validateSaveEntityService->saveEntity($cart);
        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la création du panier : ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            throw new \RuntimeException('Une erreur est survenue lors de la création du panier.', 0, $e);
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
     * Check if the storage space exists in the database
     */
    private function checkStorageSpace($storageSpaceId): StorageSpace
    {
        $storageSpaceId = (int)$storageSpaceId;
        $storageSpace = $this->storageSpaceRepository->find($storageSpaceId);

        if (!$storageSpace) {
            throw new InvalidArgumentException('Espace de stockage non trouvé.');
        }

        return $storageSpace;
    }

    /**
     * Check if the value is a boolean
     */
    private function validateIsValidated($value): bool
    {
        if (!is_bool($value)) {
            throw new InvalidArgumentException('La valeur doit être un booléen.');
        }

        return $value;
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
