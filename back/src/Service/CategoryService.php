<?php

namespace App\Service;

use App\Repository\CategoryRepository;
use Exception;
use Psr\Log\LoggerInterface;
use RuntimeException;

class CategoryService
{
    private CategoryRepository $categoryRepository;
    private LoggerInterface $logger;

    public function __construct(CategoryRepository $categoryRepository, LoggerInterface $logger)
    {
        $this->categoryRepository = $categoryRepository;
        $this->logger = $logger;
    }

    /**
     * Get all the categories in the database
     */
    public function getAll(): array
    {
        try {
            $categories = $this->categoryRepository->findAll();

            return array_map(function ($category) {
                return [
                    'categoryId' => $category->getId(),
                    'name' => $category->getName(),
                ];
            }, $categories);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des catégories: '. $e->getMessage());
            throw new RuntimeException('Une erreur est survenue lors de la récupération des catégories.');
        }
    }
}