<?php

namespace App\Service;

use App\Repository\UserRepository;
use Exception;
use Psr\Log\LoggerInterface;

class ClientService
{
    private UserRepository $userRepository;
    private LoggerInterface $logger;

    public function __construct(UserRepository $userRepository, LoggerInterface $logger)
    {
        $this->userRepository = $userRepository;
        $this->logger = $logger;
    }

    /**
     * Get all clients
     */
    public function getAllClients(): array
    {
        try {
            $clients = $this->userRepository->findUsersByRoleAndOrderByLastname();

            $clientData = array_map(function ($client) {
                return [
                    'id' => $client->getId(),
                    'firstname' => $client->getLastname(),
                    'lastname' => $client->getFirstname(),
                    'email' => $client->getEmail(),
                    'phone' => $client->getPhone(),
                    'userCreatedAt' => $client->getCreatedAt()->format('d/m/Y H:i:s'),
                    'address' => [
                        'addressId' => $client->getAddress()->getId(),
                        'number_street' => $client->getAddress()->getNumberStreet(),
                        'street' => $client->getAddress()->getStreet(),
                        'zipcode' => $client->getAddress()->getZipcode(),
                        'city' => $client->getAddress()->getCity(),
                        'country' => $client->getAddress()->getCountry(),
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
}