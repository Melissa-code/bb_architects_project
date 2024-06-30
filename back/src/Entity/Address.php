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
    private ?string $numberStreet = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message:"Veuillez renseigner la rue.")]
    #[Assert\Length(
        min: 3,
        max: 255,
        minMessage: 'La rue doit comporter au minimum {{ limit }} caractères.',
        maxMessage: 'La rue doit comporter au maximum {{ limit }} caractères.')
    ]
    #[Assert\Regex(
        pattern: '/^[\p{L}0-9\s\'\-]+$/u',
        message: 'La rue doit contenir uniquement des lettres, des chiffres, des apostrophes, des tirets et des espaces.'
    )]
    private ?string $street = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: "Veuillez renseigner le code postal.")]
    #[Assert\Length(
        min: 3,
        max: 10,
        minMessage: 'Le code postal doit comporter au minimum {{ limit }} caractères.',
        maxMessage: 'Le code postal doit comporter au maximum {{ limit }} caractères.')
    ]
    #[Assert\Regex(
        pattern: '/^[\p{L}0-9\s\-]+$/u',
        message: 'Le code postal doit contenir uniquement des lettres, des chiffres, des espaces et des tirets.'
    )]
    private ?string $zipcode = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message:"Veuillez renseigner la ville.")]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'La ville doit comporter au minimum {{ limit }} caractères.',
        maxMessage: 'La ville doit comporter au maximum {{ limit }} caractères.')
    ]
    #[Assert\Regex(
        pattern: "/^[\p{L}\s\-']+$/u",
        message: 'La ville doit contenir uniquement des lettres, des espaces, des tirets et des apostrophes.'
    )]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message:"Veuillez renseigner le pays.")]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'Le pays doit comporter au minimum {{ limit }} caractères.',
        maxMessage: 'Le pays doit comporter au maximum {{ limit }} caractères.')
    ]
    #[Assert\Regex(
        pattern: "/^[\p{L}\s\-']+$/u",
        message: 'Le pays doit contenir uniquement des lettres, des espaces, des tirets et des apostrophes.'
    )]
    private ?string $country = null;

    #[ORM\OneToOne(mappedBy: 'address', cascade: ['persist', 'remove'])]
    private ?Company $company = null;

    #[ORM\OneToOne(mappedBy: 'address', cascade: ['persist', 'remove'])]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumberStreet(): ?string
    {
        return $this->numberStreet;
    }

    public function setNumberStreet(?string $numberStreet): static
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

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(string $zipcode): static
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
