<?php

namespace App\Service;
use App\Entity\User;
use App\Repository\UserStoragePurchaseRepository;
use Exception;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class ProfileService
{
    private UserStoragePurchaseRepository $userStoragePurchaseRepository;
    private FileService $fileService;

    public function __construct(UserStoragePurchaseRepository $userStoragePurchaseRepository, FileService $fileService)
    {
        $this->userStoragePurchaseRepository = $userStoragePurchaseRepository;
        $this->fileService = $fileService;
    }

    public function getProfileData(UserInterface $user, LoggerInterface $logger): array
    {
        if (!$user instanceof User) {
            throw new InvalidArgumentException('L\'instance doit être de type App\Entity\User');
        }

        try {
            $address = $user->getAddress();
            $files = $user->getFiles();
            $filesNumber = count($files);

            // Calculate the available storage space
            $storageSpace = $this->fileService->calculateAvailableStorageSpace($user);

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
                    'total_weight_files' => $storageSpace[0], // sum of weight of the files
                    'total_storage_capacity' => $storageSpace[1], // sum of storage_space bought by the user
                    'available_storage_space' => $storageSpace[2], // available storage space
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