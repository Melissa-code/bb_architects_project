<?php

namespace App\Service;

use App\Entity\Invoice;
use App\Entity\Order;
use App\Entity\User;
use App\Repository\CompanyRepository;
use App\Repository\InvoiceRepository;
use DateTimeImmutable;

class InvoiceService
{
    private CompanyRepository $companyRepository;
    private InvoiceRepository $invoiceRepository;
    const NAME_COMPANY = 'BB Architects';

    public function __construct(InvoiceRepository $invoiceRepository, CompanyRepository $companyRepository)
    {
        $this->invoiceRepository = $invoiceRepository;
        $this->companyRepository = $companyRepository;
    }

    /**
     * Create an invoice
     * user_id company_id command_order_id createdAt tva
     */
    public function createInvoice(User $user, Order $order)
    {
        //$company = $this->companyRepository->findOneBy(['name' = NAME_COMPANY]);
        $invoice = new Invoice();
        $invoice->setUser($user);
        //$invoice->setCompany($company);
        $invoice->setCreatedAt(new DateTimeImmutable());
        $invoice->setTVA(10);
    }
}