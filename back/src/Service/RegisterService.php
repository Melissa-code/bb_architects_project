<?php

namespace App\Service;

use App\Entity\Address;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use RuntimeException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegisterService
{
    private EntityManagerInterface $entityManagerInterface;
    private UserPasswordHasherInterface $passwordHasher;
    public function __construct(EntityManagerInterface $entityManagerInterface, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManagerInterface = $entityManagerInterface;
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * Create a new address
     *
     * @param array $data
     * @return Address|null
     */
    public function createAddress(array $data): Address|null {
        $numberStreet = $data['number_street'] ?? null;

        $address = new Address();
        $address->setNumberStreet($numberStreet );
        $address->setStreet($data['street']);
        $address->setZipcode($data['zipcode']);
        $address->setCity($data['city']);
        $address->setCountry($data['country']);

        return $address;
    }

    /**
     * Create a new user
     *
     * @param array $data
     * @param Address $address
     * @return User|null
     */
    public function createUser(array $data, Address $address): User|null
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

        return $user;
    }

    /**
     * Save the entities in the database (address user)
     *
     * @param array $entities
     */
    public function saveEntities(array $entities): void
    {
        try {
            foreach ($entities as $entity) {
                $this->entityManagerInterface->persist($entity);
            }
            $this->entityManagerInterface->flush();
        } catch (ORMException $e) {
            throw new RuntimeException(
                '[Inscription] Erreur lors de la persistance des entités.',
                0, $e
            );
        }
    }
}