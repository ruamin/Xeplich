-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: xeplichmta
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `giangvien`
--

DROP TABLE IF EXISTS `giangvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giangvien` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giangvien`
--

LOCK TABLES `giangvien` WRITE;
/*!40000 ALTER TABLE `giangvien` DISABLE KEYS */;
INSERT INTO `giangvien` VALUES (1,'Vi Bảo Ngọc','','2019-08-01 09:59:37'),(2,'Nguyễn Thị Hiền','','2019-08-01 09:59:37'),(3,'Nguyễn Văn Quân','','2019-08-01 10:04:03'),(4,'Trần Doanh Tuấn','','2019-08-01 10:04:17'),(5,'Nguyễn Trung Thành','','2019-08-01 10:05:17'),(6,'Nguyễn Trung Tín','','2019-08-01 10:05:37'),(7,'Hoa Tất Thắng','','2019-08-01 10:05:50'),(8,'Trần Cao Trường','','2019-08-01 10:06:05'),(9,'Nguyễn Mậu Uyên','','2019-08-01 10:06:26'),(11,'Tống Minh Đức','','2019-08-01 10:07:25'),(15,'Phan Văn Việt','','2019-08-01 10:45:27'),(16,'Hà Trí Trung','','2019-08-01 07:22:05'),(17,'Nguyễn Mạnh Hùng','','2019-08-01 07:22:17'),(19,'Nguyễn Hoài Anh','','2019-08-01 07:22:31'),(20,'Đỗ Thị Mai Hường','','2019-08-01 07:22:31'),(21,'Nguyễn Văn Giang','','2019-08-01 07:22:31'),(22,'Nguyễn Quốc Khánh','','2019-08-01 07:22:31'),(23,'Vũ Văn Trường','','2019-08-01 07:22:31'),(24,'Nguyễn Việt Hùng','','2019-08-01 07:22:31'),(25,'Phan Việt Anh','','2019-08-01 07:22:31'),(26,'Trần Hồng Quang','','2019-09-25 07:22:31'),(27,'Hồ Nhật Quang','','2019-10-23 14:18:31'),(28,'Nguyễn Văn Giang','','2019-10-23 14:19:50'),(29,'Trần Cao Trưởng','','2019-10-23 14:21:02'),(30,'Lê Anh','','2019-10-23 14:24:35'),(31,'Trần Văn An','','2019-10-23 14:54:27');
/*!40000 ALTER TABLE `giangvien` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-23 22:57:03
