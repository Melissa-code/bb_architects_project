<?php

namespace App\Repository;

use App\Entity\File;
use App\Entity\User;
use DateTimeImmutable;
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

    /**
     * Sum of the number of the total files uploaded today
     * During all the day (be careful to the hour)
     */
    public function countTotalFilesUploadedToday(): int
    {
        $today = new DateTimeImmutable();
        $startOfDay = $today->setTime(0, 0, 0);
        $endOfDay = $today->setTime(23, 59, 59);

        return (int) $this->createQueryBuilder('f')
            ->select('COUNT(f.id)')
            ->where('f.createdAt BETWEEN :start AND :end')
            ->setParameter('start', $startOfDay)
            ->setParameter('end', $endOfDay)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Sum of the number of the total files per client
     */
    public function countTotalFilesPerUsers(): array
    {
        return $this->createQueryBuilder('f')
            ->join('f.user', 'u')
            ->select('u.id as user_id, COUNT(f.id) as file_count')
            ->groupBy('u.id')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find a file by name
     */
    public function findByName(?string $name)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.name LIKE :name')
            ->setParameter('name', '%' . $name . '%')
            ->getQuery()
            ->getResult();
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
