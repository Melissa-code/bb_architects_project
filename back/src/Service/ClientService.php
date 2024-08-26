<?php

namespace App\Service;

use App\Repository\FileRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Exception;
use Psr\Log\LoggerInterface;

class ClientService
{
    private UserRepository $userRepository;
    private FileRepository $fileRepository;
    private FileService $fileService;
    private LoggerInterface $logger;

    public function __construct(
        UserRepository $userRepository,
        FileRepository $fileRepository,
        FileService $fileService,
        LoggerInterface $logger
    )
    {
        $this->userRepository = $userRepository;
        $this->fileRepository = $fileRepository;
        $this->fileService = $fileService;
        $this->logger = $logger;
    }

    /**
     * Get all clients
     * return array[] of clients (users : role_user)
     */
    public function getAllClients(): array
    {
        try {
            $clients = $this->userRepository->findUsersByRoleAndOrderByLastname();

            $clientData = array_map(function ($client) {
                $storageSpaceOfUser = $this->fileService->calculateAvailableStorageSpace($client);
                return [
                    'id' => $client->getId(),
                    'firstname' => $client->getLastname(),
                    'lastname' => $client->getFirstname(),
                    'email' => $client->getEmail(),
                    'phone' => $client->getPhone(),
                    'userCreatedAt' => $client->getCreatedAt()->format('d-m-Y H:i:s'),
                    'address' => [
                        'addressId' => $client->getAddress()->getId(),
                        'number_street' => $client->getAddress()->getNumberStreet(),
                        'street' => $client->getAddress()->getStreet(),
                        'zipcode' => $client->getAddress()->getZipcode(),
                        'city' => $client->getAddress()->getCity(),
                        'country' => $client->getAddress()->getCountry(),
                    ],
                    'storageSpaceOfUser' => [
                        'totalWeightInGo' => $storageSpaceOfUser[0],
                        'totalStorageCapacity' => $storageSpaceOfUser[1],
                        'availableStorageSpace' => $storageSpaceOfUser[2],
                    ],
                ];
            }, $clients);

            return [
                'message' => 'Clients récupérés avec succès.',
                'clients' => $clientData,
            ];

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des clients.');

            return [
                'message' => 'Une erreur est survenue lors de la récupération des clients.',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get the numbers (total) for statistics
     * return array[] of int
     */
    public function getNumbersForStatistics(): int
    {
        // Get the total number of the files
        $countTotalFiles = $this->fileRepository->countTotalFiles();

        // Get the total number of the files uploaded today
        $today = new DateTimeImmutable();
        $countTotalFilesUploadedToday = $this->fileRepository->countTotalFilesUploadedToday($today);

        // Get the total number of the files per client


        //return $countTotalFiles;
        return $countTotalFilesUploadedToday;
    }
}