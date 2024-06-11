<?php

namespace App\Entity;

use App\Repository\PaymentModeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PaymentModeRepository::class)]
class PaymentMode
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, Order>
     */
    #[ORM\OneToMany(targetEntity: Order::class, mappedBy: 'paymentMode')]
    private Collection $orders;

    public function __construct()
    {
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

    /**
     * @return Collection<int, Order>
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrders(Order $orders): static
    {
        if (!$this->orders->contains($orders)) {
            $this->orders->add($orders);
            $orders->setPaymentMode($this);
        }

        return $this;
    }

    public function removeOrders(Order $orders): static
    {
        if ($this->orders->removeElement($orders)) {
            // set the owning side to null (unless already changed)
            if ($orders->getPaymentMode() === $this) {
                $orders->setPaymentMode(null);
            }
        }

        return $this;
    }
}
