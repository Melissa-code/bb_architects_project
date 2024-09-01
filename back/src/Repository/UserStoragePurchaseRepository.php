<?php

namespace App\Repository;

use App\Entity\UserStoragePurchase;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserStoragePurchase>
 */
class UserStoragePurchaseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserStoragePurchase::class);
    }

    /**
     * Add the storage spaces of the user
     */
    public function getTotalStorageCapacityForUser(int $userId): int
    {
        $qb = $this->createQueryBuilder('usp')
            ->select('SUM(ss.storageCapacity)')
            ->join('usp.storageSpace', 'ss')
            ->where('usp.user = :userId')
            ->setParameter('userId', $userId);

        return (int)$qb->getQuery()->getSingleScalarResult();
    }

    //    /**
    //     * @return UserStoragePurchase[] Returns an array of UserStoragePurchase objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?UserStoragePurchase
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
