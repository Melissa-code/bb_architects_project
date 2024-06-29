<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AddressRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AddressRepository::class)]
#[ApiResource]
class Address
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $numberStreet = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message:"Veuillez renseigner la rue.")]
    private ?string $street = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: "Le code postal doit comporter 5 chiffres.")]
    private ?int $zipcode = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message:"Veuillez renseigner la ville.")]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message:"Veuillez renseigner le pays.")]
    private ?string $country = null;

    #[ORM\OneToOne(mappedBy: 'address', cascade: ['persist', 'remove'])]
    private ?Company $company = null;

    #[ORM\OneToOne(mappedBy: 'address', cascade: ['persist', 'remove'])]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumberStreet(): ?int
    {
        return $this->numberStreet;
    }

    public function setNumberStreet(?int $numberStreet): static
    {
        $this->numberStreet = $numberStreet;

        return $this;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(string $street): static
    {
        $this->street = $street;

        return $this;
    }

    public function getZipcode(): ?int
    {
        return $this->zipcode;
    }

    public function setZipcode(int $zipcode): static
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function getCompany(): ?Company
    {
        return $this->company;
    }

    public function setCompany(Company $company): static
    {
        // set the owning side of the relation if necessary
        if ($company->getAddress() !== $this) {
            $company->setAddress($this);
        }

        $this->company = $company;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        // set the owning side of the relation if necessary
        if ($user->getAddress() !== $this) {
            $user->setAddress($this);
        }

        $this->user = $user;

        return $this;
    }
}
