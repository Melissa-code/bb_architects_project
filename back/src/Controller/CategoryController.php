<?php

namespace App\Controller;

use App\Service\CategoryService;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class CategoryController extends AbstractController
{
    private CategoryService $categoryService;
    private LoggerInterface $logger;

    public function __construct(CategoryService $categoryService, LoggerInterface $logger)
    {
        $this->categoryService = $categoryService;
        $this->logger = $logger;
    }

    /**
     * Get all the categories (ex: create file form)
     */
    #[Route('/api/category', name: 'app_category', methods: ['GET'])]
    public function getAllCategories(): JsonResponse
    {
        try {
            $categoryData = $this->categoryService->getAll();

            return new JsonResponse([
                'message' => 'Catégories récupérées avec succès.',
                'categories' => $categoryData,
            ],200);

        } catch (Exception $e) {
            $this->logger->error('Erreur lors de la récupération des catégories: ' . $e->getMessage());

            return new JsonResponse([
                'message' => 'Une erreur est survenue lors de la récupération des catégories.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}