<?php

namespace App\Entity;

use App\Repository\StorageSpaceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StorageSpaceRepository::class)]
class StorageSpace
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 0)]
    private ?string $price = null;

    #[ORM\Column]
    private ?int $storageCapacity = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'storageSpaces')]
    private Collection $user;

    /**
     * @var Collection<int, QuantityCartStorage>
     */
    #[ORM\OneToMany(targetEntity: QuantityCartStorage::class, mappedBy: 'storageSpace')]
    private Collection $quantityCartStorages;

    /**
     * @var Collection<int, UserStoragePurchase>
     */
    #[ORM\OneToMany(targetEntity: UserStoragePurchase::class, mappedBy: 'storageSpace')]
    private Collection $userStoragePurchases;

    /**
     * @var Collection<int, Order>
     */
    #[ORM\OneToMany(targetEntity: Order::class, mappedBy: 'storageSpace')]
    private Collection $orders;

    public function __construct()
    {
        $this->user = new ArrayCollection();
        $this->quantityCartStorages = new ArrayCollection();
        $this->userStoragePurchases = new ArrayCollection();
        $this->orders = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getStorageCapacity(): ?int
    {
        return $this->storageCapacity;
    }

    public function setStorageCapacity(int $storageCapacity): static
    {
        $this->storageCapacity = $storageCapacity;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUser(): Collection
    {
        return $this->user;
    }

    public function addUser(User $user): static
    {
        if (!$this->user->contains($user)) {
            $this->user->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        $this->user->removeElement($user);

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
            $quantityCartStorage->setStorageSpace($this);
        }

        return $this;
    }

    public function removeQuantityCartStorage(QuantityCartStorage $quantityCartStorage): static
    {
        if ($this->quantityCartStorages->removeElement($quantityCartStorage)) {
            // set the owning side to null (unless already changed)
            if ($quantityCartStorage->getStorageSpace() === $this) {
                $quantityCartStorage->setStorageSpace(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UserStoragePurchase>
     */
    public function getUserStoragePurchases(): Collection
    {
        return $this->userStoragePurchases;
    }

    public function addUserStoragePurchase(UserStoragePurchase $userStoragePurchase): static
    {
        if (!$this->userStoragePurchases->contains($userStoragePurchase)) {
            $this->userStoragePurchases->add($userStoragePurchase);
            $userStoragePurchase->setStorageSpace($this);
        }

        return $this;
    }

    public function removeUserStoragePurchase(UserStoragePurchase $userStoragePurchase): static
    {
        if ($this->userStoragePurchases->removeElement($userStoragePurchase)) {
            // set the owning side to null (unless already changed)
            if ($userStoragePurchase->getStorageSpace() === $this) {
                $userStoragePurchase->setStorageSpace(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Order>
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrder(Order $order): static
    {
        if (!$this->orders->contains($order)) {
            $this->orders->add($order);
            $order->setStorageSpace($this);
        }

        return $this;
    }

    public function removeOrder(Order $order): static
    {
        if ($this->orders->removeElement($order)) {
            // set the owning side to null (unless already changed)
            if ($order->getStorageSpace() === $this) {
                $order->setStorageSpace(null);
            }
        }

        return $this;
    }
}
