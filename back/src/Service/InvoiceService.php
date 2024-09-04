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
    public function createInvoice(User $user, Order $order = null): void
    {
        $totalPrice  = 20;
        $company = $this->getCompanyByName();
        if ($order !== null) {
            $totalPrice = $order->getTotalPrice();
        }

        $invoice = new Invoice();
        $invoice->setUser($user);
        $invoice->setCompany($company);
        $invoice->setCommandOrder($order);
        $invoice->setCreatedAt(new DateTimeImmutable());
        $invoice->setTVA(10);

        try {
            $this->validateSaveEntityService->saveEntity($invoice);
            // Generate an invoice
            $this->generateInvoiceTxt($invoice, $totalPrice);

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

    /**
     * Generate an invoice (format txt)
     */
    public function generateInvoiceTxt(Invoice $invoice, $totalPrice): string
    {
        $filename = 'invoice_' . $invoice->getId() . '.txt';
        $filepath = __DIR__ . '/../../var/invoices/' . $filename;

        $content = "Facture N° : " . $invoice->getId() . "\n";
        $content .= "Date : " . $invoice->getCreatedAt()->format('d-m-Y') . "\n";
        $content .= "Objet : " . RegisterService::NAME_STORAGE_SPACE . "\n\n";
        $content .= "Client : " . $invoice->getUser()->getFirstname() . " " . $invoice->getUser()->getLastname() . "\n";
        $content .= "Adresse : " . $invoice->getUser()->getAddress() . "\n\n";
        $content .= "Société : " . $invoice->getCompany()->getName() . "\n";
        $content .= "Adresse : " . $invoice->getCompany()->getAddress() . "\n";
        $content .= "SIRET : " . $invoice->getCompany()->getSiret() . "\n\n";
        $content .= "TVA : " . $invoice->getTVA() . " %\n";
        $content .= "Montant TTC à régler : " . $totalPrice . " €\n";

        file_put_contents($filepath, $content);

        return $filepath;
    }

    /**
     * Download the invoice in txt format
     */
    public function downloadInvoiceTxt(Invoice $invoice): void
    {
        $filepath = $this->generateInvoiceTxt($invoice);

        header('Content-Type: text/plain');
        header('Content-Disposition: attachment; filename="' . basename($filepath) . '"');
        readfile($filepath);

        exit();
    }
}