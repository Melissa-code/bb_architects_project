<?php

namespace App\Service;
use App\Entity\User;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class ProfileService
{
    public function getProfileData(UserInterface $user, LoggerInterface $logger): array
    {
        if (!$user instanceof User) {
            throw new InvalidArgumentException('L\'instance: App\Entity\User');
        }

        try {
            $address = $user->getAddress();
            $files = $user->getFiles();
            $filesNumber = count($files);
            $storageSpaces = $user->getStorageSpaces();
            $totalStorageCapacity = 0;
            // Sum of the storage_space capacities for the user
            foreach ($storageSpaces as $storageSpace) {
                $totalStorageCapacity += $storageSpace->getStorageCapacity();
            }

            return [
                'message' => 'Bonjour ' . $user->getFirstname() . ', ravi de vous retrouver !',
                'user' => [
                    'id' => $user->getId(),
                    'firstname' => $user->getFirstname(),
                    'lastname' => $user->getLastname(),
                    'phone' => $user->getPhone(),
                    'email' => $user->getEmail(),
                    'address' => [
                        'number_street' => $address ? $address->getNumberStreet() : null,
                        'street' => $address ? $address->getStreet() : null,
                        'zipcode' => $address ? $address->getZipcode() : null,
                        'city' => $address ? $address->getCity() : null,
                        'country' => $address ? $address->getCountry() : null,
                    ],
                    'filesNumber' => $filesNumber,
                    'total_storage_capacity' => $totalStorageCapacity,
                ],
            ];

        } catch (Exception $e) {
            $logger->error('Erreur lors de la récupération des données du profil : ' . $e->getMessage());

            return [
                'message' => 'Une erreur est survenue lors de la récupération des données dans le profil.',
                'error' => $e->getMessage(),
            ];
        }
    }

}