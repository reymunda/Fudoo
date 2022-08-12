-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 09, 2022 at 12:43 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_fudoo`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_transaksi`
--

CREATE TABLE `detail_transaksi` (
  `id_detail` int(11) NOT NULL,
  `id_transaksi` int(11) NOT NULL,
  `id_menu` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `sub_total` decimal(9,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `detail_transaksi`
--

INSERT INTO `detail_transaksi` (`id_detail`, `id_transaksi`, `id_menu`, `jumlah`, `sub_total`) VALUES
(4, 2, 2, 2, '10000.00'),
(5, 2, 3, 2, '6000.00'),
(6, 3, 3, 3, '9000.00'),
(7, 3, 4, 3, '36000.00'),
(9, 4, 2, 1, '5000.00'),
(10, 4, 3, 1, '3000.00'),
(11, 4, 4, 0, '0.00'),
(12, 4, 5, 1, '10000.00'),
(13, 5, 1, 1, '15000.00'),
(14, 5, 2, 1, '5000.00'),
(15, 5, 3, 1, '3000.00'),
(16, 5, 4, 0, '0.00'),
(17, 5, 5, 0, '0.00'),
(23, 9, 1, 0, '0.00'),
(24, 9, 2, 0, '0.00'),
(25, 9, 3, 0, '0.00'),
(26, 9, 4, 1, '12000.00'),
(27, 9, 5, 2, '20000.00'),
(28, 10, 1, 0, '0.00'),
(29, 10, 2, 1, '5000.00'),
(30, 10, 3, 1, '3000.00'),
(31, 10, 4, 1, '12000.00'),
(32, 10, 5, 1, '10000.00'),
(33, 11, 1, 1, '15000.00'),
(34, 11, 2, 0, '0.00'),
(35, 11, 3, 0, '0.00'),
(36, 11, 4, 1, '12000.00'),
(37, 11, 5, 0, '0.00'),
(38, 12, 1, 1, '15000.00'),
(39, 12, 2, 0, '0.00'),
(40, 12, 3, 0, '0.00'),
(41, 12, 4, 1, '12000.00'),
(42, 12, 5, 0, '0.00');

-- --------------------------------------------------------

--
-- Table structure for table `kasir`
--

CREATE TABLE `kasir` (
  `id_kasir` int(11) NOT NULL,
  `nama_kasir` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kasir`
--

INSERT INTO `kasir` (`id_kasir`, `nama_kasir`) VALUES
(1, 'Joni'),
(2, 'Ayu Putri'),
(3, 'Asepan Abdi');

-- --------------------------------------------------------

--
-- Table structure for table `login_user`
--

CREATE TABLE `login_user` (
  `id_user` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login_user`
--

INSERT INTO `login_user` (`id_user`, `username`, `password`) VALUES
(1, 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id_menu` int(11) NOT NULL,
  `jenis_menu` varchar(50) NOT NULL,
  `harga` decimal(9,2) NOT NULL,
  `stok` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id_menu`, `jenis_menu`, `harga`, `stok`) VALUES
(1, 'Ayam Geprek', '15000.00', 22),
(2, 'Nasi', '5000.00', 2),
(3, 'Es teh manis', '3000.00', 9),
(4, 'Nasi goreng', '12000.00', 14),
(5, 'Ayam goreng', '10000.00', 8);

-- --------------------------------------------------------

--
-- Table structure for table `pelanggan`
--

CREATE TABLE `pelanggan` (
  `id_pelanggan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pelanggan`
--

INSERT INTO `pelanggan` (`id_pelanggan`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12);

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `id_pelanggan` int(11) NOT NULL,
  `id_kasir` int(11) NOT NULL,
  `no_meja` int(11) NOT NULL,
  `tanggal_transaksi` date DEFAULT NULL,
  `total_bayar` decimal(12,2) DEFAULT NULL,
  `status` enum('Sedang diproses','Selesai','Sudah diantar') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id_transaksi`, `id_pelanggan`, `id_kasir`, `no_meja`, `tanggal_transaksi`, `total_bayar`, `status`) VALUES
(2, 2, 3, 26, '2022-05-22', '46000.00', 'Sedang diproses'),
(3, 3, 2, 3, '2022-05-22', '45000.00', 'Sudah diantar'),
(4, 4, 1, 12, '2022-08-02', '18000.00', 'Selesai'),
(5, 5, 1, 14, '2022-08-03', '23000.00', 'Sedang diproses'),
(7, 7, 3, 12, '2022-08-05', '24000.00', 'Sedang diproses'),
(8, 8, 1, 34, '2022-08-05', '32000.00', 'Sedang diproses'),
(9, 9, 1, 39, '2022-08-05', '32000.00', 'Sedang diproses'),
(10, 10, 3, 2, '2022-08-05', '30000.00', 'Sedang diproses'),
(11, 11, 2, 2, '2022-08-06', '27000.00', 'Sedang diproses'),
(12, 12, 2, 12, '2022-08-09', '27000.00', 'Sedang diproses');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_transaksi`
--
ALTER TABLE `detail_transaksi`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `fk_id_menu` (`id_menu`),
  ADD KEY `fk_id_transaksi` (`id_transaksi`);

--
-- Indexes for table `kasir`
--
ALTER TABLE `kasir`
  ADD PRIMARY KEY (`id_kasir`);

--
-- Indexes for table `login_user`
--
ALTER TABLE `login_user`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indexes for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`id_pelanggan`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `fk_id_kasir` (`id_kasir`),
  ADD KEY `fk_id_pelanggan` (`id_pelanggan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_transaksi`
--
ALTER TABLE `detail_transaksi`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `kasir`
--
ALTER TABLE `kasir`
  MODIFY `id_kasir` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `login_user`
--
ALTER TABLE `login_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pelanggan`
--
ALTER TABLE `pelanggan`
  MODIFY `id_pelanggan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_transaksi`
--
ALTER TABLE `detail_transaksi`
  ADD CONSTRAINT `fk_id_menu` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id_menu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_id_transaksi` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `fk_id_kasir` FOREIGN KEY (`id_kasir`) REFERENCES `kasir` (`id_kasir`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_id_pelanggan` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id_pelanggan`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
