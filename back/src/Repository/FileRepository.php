<?php

namespace App\Repository;

use App\Entity\File;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<File>
 */
class FileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, File::class);
    }

    /**
     * Find all the files of the user sorted by createdAt
     */
    public function findByUserSortedByDate(User $user, string $sortOrder = 'DESC'): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.user = :user')
            ->setParameter('user', $user)
            ->orderBy('f.createdAt', $sortOrder)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find all the files of the user sorted by weight
     */
    public function findByUserSortedByWeight(User $user, string $sortOrder = 'DESC'): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.user = :user')
            ->setParameter('user', $user)
            ->orderBy('f.weight', $sortOrder)
            ->getQuery()
            ->getResult();
    }

    /**
     * Sum of the weight of the files of the user
     */
    public function sumWeightByUser(User $user): int
    {
        return (int) $this->createQueryBuilder('f')
            ->select('SUM(f.weight)')
            ->where('f.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Sum of the number of the total files in the table
     */
    public function countTotalFiles(): int
    {
        return (int) $this->createQueryBuilder('f')
            ->select('COUNT(f.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    //    /**
    //     * @return File[] Returns an array of File objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?File
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
