<?php

namespace App\Service;

use App\Entity\Company;
use App\Entity\Invoice;
use App\Entity\Order;
use App\Entity\User;
use App\Repository\CompanyRepository;
use App\Repository\InvoiceRepository;
use DateTimeImmutable;
use Exception;
use Psr\Log\LoggerInterface;
use RuntimeException;

class InvoiceService
{
    private InvoiceRepository $invoiceRepository;
    private CompanyRepository $companyRepository;
    private ValidateSaveEntityService $validateSaveEntityService;
    private LoggerInterface $logger;
    const NAME_COMPANY = 'BB Architects';

    public function __construct(
        InvoiceRepository $invoiceRepository,
        CompanyRepository $companyRepository,
        ValidateSaveEntityService $validateSaveEntityService,
        LoggerInterface $logger,
    ) {
        $this->invoiceRepository = $invoiceRepository;
        $this->companyRepository = $companyRepository;
        $this->validateSaveEntityService = $validateSaveEntityService;
        $this->logger = $logger;
    }

    /**
     * Create an invoice in the database
     * @throws Exception
     */
    public function createInvoice(User $user, Order $order): void
    {
        $company = $this->getCompanyByName();

        $invoice = new Invoice();
        $invoice->setUser($user);
        $invoice->setCompany($company);
        $invoice->setCommandOrder($order);
        $invoice->setCreatedAt(new DateTimeImmutable());
        $invoice->setTVA(10);

        try {
            $this->validateSaveEntityService->saveEntity($invoice);
        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la création de la facture : ' . $e->getMessage(), [
                    'exception' => $e,
                ]
            );

            throw new RuntimeException('Une erreur est survenue lors de la création de la facture.', 0, $e);
        }
    }

    /**
     * Get the name of the company (BB Architects)
     * @throws Exception
     */
    private function getCompanyByName(): Company
    {
        $company = $this->companyRepository->findOneBy(['name' => self::NAME_COMPANY]);
        if ($company === null) {
            throw new Exception("La société " . self::NAME_COMPANY . " n'a pas été trouvée.");
        }
        return $company;
    }
}