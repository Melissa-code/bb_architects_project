<?php

namespace App\Entity;

use App\Repository\FileRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FileRepository::class)]
class File
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message : "Veuillez renseigner un nom de fichier.")]
    #[Assert\Length(
        min: 2,
        max: 255,
        minMessage: 'Le nom du fichier doit comporter au minimum {{ limit }} caractères',
        maxMessage: 'Le nom du fichier doit comporter au maximum {{ limit }} caractères')
    ]
    #[Assert\Regex(
        pattern: "/^[\p{L}\d\s\-']+$/u",
        message: 'Le nom doit contenir uniquement des lettres, des chiffres, des espaces, des tirets et des apostrophes.'
    )]
    private ?string $name = null;

    #[ORM\Column]
    #[Assert\PositiveOrZero(message : "Veuillez renseigner un nombre positif.")]
    private ?int $weight = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message : "Veuillez renseigner un format de fichier.")]
    private ?string $format = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $path = null;

    // Attribute not mapped to the database
    private ?File $pathFile = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'files')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'files')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

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

    public function getWeight(): ?int
    {
        return $this->weight;
    }

    public function setWeight(int $weight): static
    {
        $this->weight = $weight;

        return $this;
    }

    public function getFormat(): ?string
    {
        return $this->format;
    }

    public function setFormat(string $format): static
    {
        $this->format = $format;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): static
    {
        $this->path = $path;

        return $this;
    }

    public function getPathFile(): ?File
    {
        return $this->pathFile;
    }

    public function setPathFile(?File $pathFile): static
    {
        $this->pathFile = $pathFile;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
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

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }
}
