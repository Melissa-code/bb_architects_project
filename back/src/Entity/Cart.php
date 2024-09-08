<?php

namespace App\Entity;

use App\Repository\CartRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CartRepository::class)]
class Cart
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Assert\Type(
        type: 'bool',
        message: 'La valeur n\'est pas un type boolean.'
    )]
    private ?bool $isValidated = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 0)]
    #[Assert\NotBlank(message: 'Le prix total ne doit pas être vide.')]
    #[Assert\Regex(
        pattern: '/^\d+(\.\d{1,2})?$/',
        message: 'Le prix total doit être un nombre décimal avec jusqu\'à 2 chiffres après la virgule.'
    )]
    private ?string $totalPrice = null;

    #[ORM\OneToOne(inversedBy: 'cart', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\OneToOne(mappedBy: 'cart', cascade: ['persist', 'remove'])]
    private ?Order $purchaseOrder = null;

    /**
     * @var Collection<int, QuantityCartStorage>
     */
    #[ORM\OneToMany(targetEntity: QuantityCartStorage::class, mappedBy: 'cart')]
    private Collection $quantityCartStorages;

    public function __construct()
    {
        $this->quantityCartStorages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isValidated(): ?bool
    {
        return $this->isValidated;
    }

    public function setValidated(bool $isValidated): static
    {
        $this->isValidated = $isValidated;

        return $this;
    }

    public function getTotalPrice(): ?string
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(string $totalPrice): static
    {
        $this->totalPrice = $totalPrice;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getPurchaseOrder(): ?Order
    {
        return $this->purchaseOrder;
    }

    public function setPurchaseOrder(Order $purchaseOrder): static
    {
        // set the owning side of the relation if necessary
        if ($purchaseOrder->getCart() !== $this) {
            $purchaseOrder->setCart($this);
        }

        $this->purchaseOrder = $purchaseOrder;

        return $this;
    }

    /**
     * @return Collection<int, QuantityCartStorage>
     */
    public function getQuantityCartStorages(): Collection
    {
        return $this->quantityCartStorages;
    }

    public function addQuantityCartStorage(QuantityCartStorage $quantityCartStorage): static
    {
        if (!$this->quantityCartStorages->contains($quantityCartStorage)) {
            $this->quantityCartStorages->add($quantityCartStorage);
            $quantityCartStorage->setCart($this);
        }

        return $this;
    }

    public function removeQuantityCartStorage(QuantityCartStorage $quantityCartStorage): static
    {
        if ($this->quantityCartStorages->removeElement($quantityCartStorage)) {
            // set the owning side to null (unless already changed)
            if ($quantityCartStorage->getCart() === $this) {
                $quantityCartStorage->setCart(null);
            }
        }

        return $this;
    }
}