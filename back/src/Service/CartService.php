<?php

namespace App\Service;

use App\Entity\Cart;
use App\Entity\User;
use App\Repository\StorageSpaceRepository;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;

class CartService
{
    private StorageSpaceRepository $storageSpaceRepository;
    private ValidateSaveEntityService $validateSaveEntityService;
    private LoggerInterface $logger;

    public function __construct(
        StorageSpaceRepository $storageSpaceRepository,
        ValidateSaveEntityService $validateSaveEntityService,
        LoggerInterface $logger,
    )
    {
        $this->storageSpaceRepository = $storageSpaceRepository ;
        $this->validateSaveEntityService = $validateSaveEntityService;
        $this->logger = $logger;
    }

    /**
     * Create a new cart
     */
    public function createCart(User $user, array $data): Cart
    {
        $storageSpaceId = $data['storage_space_id'];
        $storageSpace = $this->storageSpaceRepository->find($storageSpaceId);

        $cart = new Cart();
        $cart->setUser($user);
        $cart->setValidated($data['is_validated']);
        // Calculate the total price
        $quantity = $data['quantity'];
        $totalPrice = (int)$quantity * (int)$storageSpace->getPrice();
        $cart->setTotalPrice($totalPrice);

        try {
            //$this->validateEntity($cart);
            $this->validateSaveEntityService->saveEntity($cart);
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException(
                'La validation du panier a échoué: ' . $e->getMessage()
            );
        }

        return $cart;
    }
}