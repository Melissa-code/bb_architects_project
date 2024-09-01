<?php

namespace App\Entity;

use App\Repository\UserStoragePurchaseRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserStoragePurchaseRepository::class)]
class UserStoragePurchase
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'userStoragePurchases')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'userStoragePurchases')]
    private ?StorageSpace $storageSpace = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $purchaseDate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

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

    public function getPurchaseDate(): ?\DateTimeInterface
    {
        return $this->purchaseDate;
    }

    public function setPurchaseDate(?\DateTimeInterface $purchaseDate): static
    {
        $this->purchaseDate = $purchaseDate;

        return $this;
    }
}
