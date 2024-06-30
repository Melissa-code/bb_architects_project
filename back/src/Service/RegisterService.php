<?php

namespace App\Service;

use App\Entity\Address;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use RuntimeException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegisterService
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
     * Create a new address
     *
     * @param array $data
     * @return Address
     */
    public function createAddress(array $data): Address
    {
        $this->validateNumberStreet($data['number_street'] ?? null);

        $address = new Address();
        $address->setNumberStreet($data['number_street'] ?? null);
        $address->setStreet($data['street']);
        $address->setZipcode($data['zipcode']);
        $address->setCity($data['city']);
        $address->setCountry($data['country']);

        try {
            $this->validateEntity($address);
            $this->saveEntity($address);
        } catch (\InvalidArgumentException $e) {
            throw new \InvalidArgumentException(
                'La validation de l\'adresse a echoué: ' . $e->getMessage()
            );
        }

        return $address;
    }

    /**
     * Create a new user
     *
     * @param array $data
     * @param Address $address
     * @return User
     */
    public function createUser(array $data, Address $address): User
    {
        $user = new User();
        $user->setFirstname($data['firstname']);
        $user->setLastname($data['lastname']);
        $user->setEmail($data['email']);
        // Hash the password in the database
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setPhone($data['phone']);
        $user->setCreatedAt(new DateTimeImmutable());
        $user->setAddress($address);

        try {
            $this->validateEntity($user);
            $this->saveEntity($user);
        } catch (\InvalidArgumentException $e) {
            throw new \InvalidArgumentException(
                'La validation de l\'utilisateur a echoué: ' . $e->getMessage()
            );
        }

        return $user;
    }

    /**
     * Check if the data number_street is valid
     *
     * @param string|null $numberStreet
     */
    private function validateNumberStreet(?string $numberStreet): void
    {
        if ($numberStreet !== null && !preg_match('/^[a-zA-Z0-9]+$/', $numberStreet)) {
            throw new \InvalidArgumentException('Le numéro de rue doit contenir uniquement des lettres et des chiffres.');
        }
    }

    /**
     * Validate or return error message
     *
     * @param object $entity
     * @throws \InvalidArgumentException if the error of validation exist
     */
    private function validateEntity(object $entity): void
    {
        $violations = $this->validator->validate($entity);

        if (count($violations) > 0) {
            $errorMessages = [];
            foreach ($violations as $violation) {
                $errorMessages[] = $violation->getMessage();
            }
            throw new \InvalidArgumentException(json_encode(['errors' => $errorMessages]));
        }
    }

    /**
     * Save the entity in the database (address / user)
     *
     * @param Object $entity
     */
    public function saveEntity(Object $entity): void
    {
        try {
            $this->entityManagerInterface->persist($entity);
            $this->entityManagerInterface->flush();
        } catch (ORMException $e) {
            throw new RuntimeException(
                '[Inscription]: Erreur lors de la persistance de l\'entité.' . $entity,
                0, $e
            );
        }
    }
}