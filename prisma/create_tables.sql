-- ============================================================
-- MyArchiveList — MySQL Table Setup Script
-- Jalankan di Railway MySQL Console jika prisma db push gagal
-- ============================================================

-- Buat tabel User
CREATE TABLE IF NOT EXISTS `User` (
  `id`        VARCHAR(255) NOT NULL,
  `name`      VARCHAR(255) NOT NULL,
  `email`     VARCHAR(255) NOT NULL,
  `image`     TEXT         NULL,
  `wishlist`  JSON         NULL,
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
