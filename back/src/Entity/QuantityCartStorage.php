<?php

namespace App\Entity;

use App\Repository\QuantityCartStorageRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuantityCartStorageRepository::class)]
class QuantityCartStorage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\ManyToOne(inversedBy: 'quantityCartStorages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Cart $cart = null;

    #[ORM\ManyToOne(inversedBy: 'quantityCartStorages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?StorageSpace $storageSpace = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(?Cart $cart): static
    {
        $this->cart = $cart;

        return $this;
    }

    public function getStorageSpace(): ?StorageSpace
    {
        return $this->storageSpace;
    }

    public function setStorageSpace(?StorageSpace $storageSpace): static
    {
        $this->storageSpace = $storageSpace;

        return $this;
    }
}
