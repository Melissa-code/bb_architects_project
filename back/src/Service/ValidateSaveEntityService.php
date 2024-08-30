<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use RuntimeException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ValidateSaveEntityService
{
    private EntityManagerInterface $entityManagerInterface;
    private UserPasswordHasherInterface $passwordHasher;
    private ValidatorInterface $validator;

    public function __construct(
        EntityManagerInterface $entityManagerInterface,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ) {
        $this->entityManagerInterface = $entityManagerInterface;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
    }

    /**
     * Save the entity in the database
     */
    public function saveEntity(Object $entity): void
    {
        try {
            $this->entityManagerInterface->persist($entity);
            $this->entityManagerInterface->flush();
        } catch (ORMException $e) {
            throw new RuntimeException(
                '[Inscription]: Erreur lors de la persistance de l\'entité:' . $entity,
                0, $e
            );
        }
    }
}