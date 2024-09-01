<?php

namespace App\DataFixtures;

use App\Entity\Address;
use App\Entity\Category;
use App\Entity\Company;
use App\Entity\File;
use App\Entity\OrderStatus;
use App\Entity\PaymentMode;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Exception;

class AppFixtures extends Fixture
{
    private ObjectManager $manager;
    private array $categoryEntities = [];
    private ?Address $addressCompany = null;

    /**
     * @throws Exception
     */
    public function load(ObjectManager $manager): void
    {
        $this->manager = $manager;

        //$this->loadCategory();
        //$this->loadFile();
        $this->loadPaymentModes();
        $this->loadOrderStatus();
        $this->loadAddress();
        $this->loadCompany();

        $manager->flush();
    }

    /**
     * Load the categories
     */
    public function loadCategory(): void
    {
        $categories = ['Plan', 'Dessin technique', 'Document légal', 'Etude technique', 'Document financier'];
        foreach ($categories as $categoryName) {
            $category = new Category();
            $category->setName($categoryName);
            $this->manager->persist($category);
            $this->categoryEntities[] = $category;
        }
    }

    /**
     * Load files
     * @throws Exception
     */
    public function loadFile(): void
    {
        $now = new DateTimeImmutable();
        $users = $this->manager->getRepository(User::class)->findAll();

        if (empty($users)) {
            throw new Exception('Aucun utilisateur trouvé en base de données.');
        }
        if (empty($this->categoryEntities)) {
            throw new Exception('Aucune catégorie trouvée en base de données.');
        }

        foreach ($users as $user) {
            for ($i = 1; $i < 4; $i++) {
                $file = new File();
                $file->setUser($user);

                $randomCategory = $this->categoryEntities[array_rand($this->categoryEntities)];
                $file->setCategory($randomCategory);

                $file->setName('Document_' . $i . '_User_' . $user->getId());
                $file->setWeight(rand(1, 10)); // Go
                $file->setFormat('pdf');
                $file->setPath('documents/document_' . $i . '_user_' . $user->getId() . '.pdf');
                $file->setCreatedAt($now);

                $this->manager->persist($file);
            }
        }
    }

    /**
     * Load the payment modes
     */
    public function loadPaymentModes(): void
    {
        $paymentModes = ['Carte bancaire', 'Paypal', 'Carte prépayée'];
        foreach ($paymentModes as $paymentModeName) {
            $paymentMode = new PaymentMode();
            $paymentMode->setName($paymentModeName);
            $this->manager->persist($paymentMode);
        }
    }

    /**
     * Load the order status
     */
    public function loadOrderStatus(): void
    {
        $orderStatus = ['Payée', 'En cours', 'Annulée', 'Remboursée'];
        foreach ($orderStatus  as $orderStatusName) {
            $orderStatus = new OrderStatus();
            $orderStatus ->setName($orderStatusName);
            $this->manager->persist($orderStatus);
        }
    }

    /**
     * Load the address of BB Architects
     */
    public function loadAddress(): void
    {
        $address = new Address();
        $address->setNumberStreet('3');
        $address->setStreet('boulevard Bonne Nouvelle');
        $address->setZipcode('75002');
        $address->setCity('Paris');
        $address->setCountry('France');

        $this->manager->persist($address);
        $this->addressCompany = $address;
    }

    /**
     * Load the company
     */
    public function loadCompany(): void
    {
        $company = new Company();
        $company->setAddress($this->addressCompany);
        $company->setName('BB Architects');
        $company->setSiret('362 521 879 00033');
        $company->setPhone('0122334455');
        $company->setEmail('bbarchitects@bbarchitects.com');

        $this->manager->persist($company);
    }
}
