<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use InvalidArgumentException;
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
     * Validate or return error message
     */
    public function validateEntity(object $entity): void
    {
        $violations = $this->validator->validate($entity);

        if (count($violations) > 0) {
            $errorMessages = [];
            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }

            throw new InvalidArgumentException(json_encode($errorMessages));
        }
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
                'Erreur lors de la persistance de l\'entité:' . $entity,
                0, $e
            );
        }
    }

    /**
     * Remove an entity in the database
     */
    public function remove(Object $entity): void
    {
        try {
            $this->entityManagerInterface->remove($entity);
            $this->entityManagerInterface->flush();

        } catch (ORMException $e) {
            throw new RuntimeException(
                'Erreur lors de la suppression de l\'entité:' . $entity,
                0, $e
            );
        }
    }
}