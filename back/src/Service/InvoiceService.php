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
use phpDocumentor\Reflection\Types\This;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class InvoiceService
{
    private InvoiceRepository $invoiceRepository;
    private CompanyRepository $companyRepository;
    private ValidateSaveEntityService $validateSaveEntityService;
    private LoggerInterface $logger;
    const NAME_COMPANY = 'BB Architects';
    const UNIT_PRICE = 18.18;
    const TVA_PERCENT = 10;

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
     * Get all the invoices for the user
     * return invoiceData[]
     */
    public function getAllInvoicesOfUser($user): array
    {
        try {
            // Invoices by createdAt DESC order
            $invoices = $this->invoiceRepository->findInvoicesByUser($user);

            $invoiceData = array_map(function ($invoice) use ($user) {

                $invoice = $this->findInvoiceById($invoice->getId());

                // Get the order
                $order = $invoice->getCommandOrder();
                $quantity = ($order && $order->getQuantity() !== null) ? $order->getQuantity() : 1;

                // Get the total price
                $totalPrice = $this->getTotalPrice($invoice);
                // Get total HT - TVA - total TTC
                $total = $this->calculateHtAndTva($totalPrice);

                return [
                    'invoice_id' => $invoice->getId(),
                    'objet' => RegisterService::NAME_STORAGE_SPACE,
                    'date' => $invoice->getCreatedAt()->format('d-m-Y'),
                    'client' => $invoice->getUser()->getFirstname() . " " . $invoice->getUser()->getLastname(),
                    'client_address' => (string)$invoice->getUser()->getAddress(),
                    'company_name' => $invoice->getCompany()->getName(),
                    'company_address' => (string)$invoice->getCompany()->getAddress(),
                    'siret' =>  $invoice->getCompany()->getSiret(),
                    'unit_price' => (string)self::UNIT_PRICE . " €",
                    'quantity' => $quantity,
                    'total_price_HT' => $total['totalPriceHT'] . ' € HT',
                    'TVA' => $total['tva'] . ' €',
                    'total_price_TTC' => $total['totalTTC'] . ' € TTC',
                ];
            }, $invoices);

            return [
                'message' => 'Factures de l\'utilisateur récupérées avec succès.',
                'invoices' => $invoiceData,
            ];

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des fichiers de '. $user->getFirstname().' '
                .$user->getLastname() . $e->getMessage());

            return [
                'message' => 'Une erreur est survenue lors de la récupération des fichiers de '. $user->getFirstname().
                    ' '.$user->getLastname(),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get an invoice by id
     * @throws Exception
     */
    public function getInvoiceById(int $id): ?array
    {
        try {
            $invoice = $this->findInvoiceById($id);
            if (!$invoice) {
                throw new Exception('Aucune facture trouvée pour cet ID.');
            }

            $order = $invoice->getCommandOrder();
            $quantity = ($order && $order->getQuantity() !== null) ? $order->getQuantity() : 1;

            // Get the total price
            $totalPrice = $this->getTotalPrice($invoice);
            // Get total HT - TVA - total TTC
            $total = $this->calculateHtAndTva($totalPrice);

            return [
                'invoice_id' => $invoice->getId(),
                'objet' => RegisterService::NAME_STORAGE_SPACE,
                'date' => $invoice->getCreatedAt()->format('d-m-Y'),
                'client_id' => $invoice->getUser()->getId(),
                'client_name' => $invoice->getUser()->getFirstname() . " " . $invoice->getUser()->getLastname(),
                'client_address' => (string)$invoice->getUser()->getAddress(),
                'company_name' => $invoice->getCompany()->getName(),
                'company_address' => (string)$invoice->getCompany()->getAddress(),
                'siret' =>  $invoice->getCompany()->getSiret(),
                'unit_price'=> (string)self::UNIT_PRICE . ' € HT',
                'quantity' => $quantity,
                'total_price_HT' => $total['totalPriceHT'] . ' € HT',
                'TVA' => $total['tva'] . ' €',
                'total_price_TTC' => $total['totalTTC'] . ' € TTC',
            ];

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération de la facture n° '. $id . ': ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create an invoice in the database
     * @throws Exception
     */
    public function createInvoice(User $user, Order $order = null): void
    {
        $company = $this->getCompanyByName();

        $invoice = new Invoice();
        $invoice->setUser($user);
        $invoice->setCompany($company);
        $invoice->setCommandOrder($order);
        $invoice->setCreatedAt(new DateTimeImmutable());
        $invoice->setTVA(10);

        try {
            // Check & save the invoice in the database
            $this->validateSaveEntityService->validateEntity($invoice);
            $this->validateSaveEntityService->saveEntity($invoice);
            // Generate an invoice
            $this->generateInvoiceTxt($invoice, $order);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la création de la facture : ' . $e->getMessage(), [
                    'exception' => $e,
                ]
            );

            throw new RuntimeException('Une erreur est survenue lors de la création de la facture.', 0, $e);
        }
    }

    /**
     * Generate an invoice (format txt)
     */
    public function generateInvoiceTxt(Invoice $invoice, Order $order = null): string
    {
        $quantity = ($order) ? $order->getQuantity() : 1;
        // Get the total price
        $totalPrice = $this->getTotalPrice($invoice);
        // Get total HT - TVA - total TTC
        $total = $this->calculateHtAndTva($totalPrice);

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
        $content .= "Prix unitaire : " . (string)self::UNIT_PRICE . " € \n\n";
        $content .= "quantité : " . $quantity . "\n\n";
        $content .= "Prix total HT : " . $total['totalPriceHT'] . ' € HT' . "\n\n";
        $content .= "TVA : " . $total['tva'] . ' €' . "\n\n";
        $content .= "Montant TTC à régler  : " . $total['totalTTC'] . ' € TTC' . "\n\n";

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

    /**
     * Find an invoice by ID
     * @throws Exception
     */
    public function findInvoiceById(int $id): Invoice
    {
        $invoice = $this->invoiceRepository->find($id);
        if (!$invoice) {
            throw new Exception('Aucune facture trouvée pour cet ID : ' . $id);
        }

        return $invoice;
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
     * Get the total price
     */
    private function getTotalPrice($invoice)
    {
        $totalPrice = 20;
        $order = $invoice->getCommandOrder();

        if ($order !== null) {
            $totalPrice = $order->getTotalPrice();
        }

        return $totalPrice;
    }

    /**
     * Calculate prices (Total HT, TVA, Total TTC)
     */
    private function calculateHtAndTva($totalTTC): array
    {
        $totalPriceHT = $totalTTC / (1 + (self::TVA_PERCENT / 100));
        // Calculate TVA
        $tva = $totalTTC - $totalPriceHT;

        return [
            'totalPriceHT' => round($totalPriceHT, 2),
            'tva' => round($tva, 2),
            'totalTTC' => round($totalTTC, 2),
        ];
    }
}