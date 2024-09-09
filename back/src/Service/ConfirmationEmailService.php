<?php

namespace App\Service;

use \Mailjet\Resources;
use Psr\Log\LoggerInterface;

class ConfirmationEmailService
{
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }

    /**
     * Send an email confirmation
     * cf. https://github.com/mailjet/mailjet-apiv3-php
     */
    public function sendConfirmationEmail(string $registration, string $message): void
    {
        // Get my public & private key (.env.local)
        $mj = new \Mailjet\Client($_ENV['MJ_APIKEY_PUBLIC'], $_ENV['MJ_APIKEY_PRIVATE'], true, ['version' => 'v3.1']);

        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => $_ENV['MJ_FROM_EMAIL'],
                        'Name' => $_ENV['MJ_FROM_NAME'],
                    ],
                    'To' => [
                        [
                            'Email' => $_ENV['MJ_TO_EMAIL'],
                            'Name' => $_ENV['MJ_TO_NAME'],
                        ]
                    ],
                    'Subject' => $registration,
                    'TextPart' => "Greetings from Mailjet!",
                    'HTMLPart' => "<h3>".$message."<a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3>
            <br />Cordialement, l'équipe de BB Architects"
                ]
            ]
        ];

        // All resources are located in the Resources class
        $response = $mj->post(Resources::$Email, ['body' => $body]);

        if ($response->success()) {
            $this->logger->info('Email envoyé avec succès', ['response' => $response->getData()]);
        } else {
            $this->logger->error('Échec de l\'envoi de l\'email', [
                'status' => $response->getStatus(),
                'data' => $response->getData(),
                'error' => $response->getReasonPhrase()
            ]);
        }

        $this->logger->info('Réponse de l\'API Mailjet OK' );
    }
}